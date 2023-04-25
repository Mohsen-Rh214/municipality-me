import React, { useState, useEffect } from "react"
import moment from "moment-jalaali"
import { p2e } from "../../utils/convertNumerics"
import months from "../../utils/months_model"
import numberWithCommas from "../../utils/numbersWithComma"
import { mayadinAx } from "../../services/AxiosRequest"
import DueDateModal from "./DueDateModal"

// style
import style from "./contracts.module.css"
import payPoseSvg from "../../assets/svg/pay-btn-pose.svg"
import payWebSvg from "../../assets/svg/pay-btn-web.svg"

// mui
import Divider from "@mui/material/Divider"
import Button from "@mui/material/Button"
import PayModal from "./PayModal"
import PoseModal from "./PoseModal"

const Charges = ({ contract }) => {
  //  --- >>> --- >>> --- >>> Calculations --- >>>
  const startYear = moment(contract?.start_date, "jYYYY-jMM-jDD").format(
    "jYYYY"
  )
  const finishYear = moment(contract?.finish_date, "jYYYY-jMM-jDD").format(
    "jYYYY"
  )
  const currentYear = moment().format("jYYYY")

  // years and months
  const [monthsList1, setMonthsList1] = useState(months)
  const [monthsList2, setMonthsList2] = useState(months)

  let year1 = JSON.parse(JSON.stringify(months))
  let year2 = JSON.parse(JSON.stringify(months))

  const giveStateToMonths = () => {
    // 1- get contract
    // 2- find finish and start date
    // 3- if not finished ->>
    // -- every month from start
    // -- to paid-up-to
    // -- gets 'Paid' status
    // 4- if paid-up-to is more than 30 days ago ->>
    // -- every month until now gets 'Debt' status
    // 5- 'Debt' should always be selected
    // 6- every month from now to finish date gets 'Avalible'
    // 7- every month before start date gets 'disabled'
    // 8- current month gets 'Current' status

    // basic states for calculations
    const start_date = contract?.start_date
    const finish_date = contract?.finish_date
    const paid_up_to = contract?.paid_up_to
    const currentDate = p2e(moment().format("jYYYY-jMM-jDD"))

    const start_year = moment(start_date, "jYYYY-jMM-jDD").format("jYYYY")

    // --- gpt method
    // Set status for year1
    for (let i = 0; i < year1.length; i++) {
      let month = year1[i]

      let monthStart = p2e(
        moment(`${p2e(start_year)}-${month.id}-1`, "jYYYY-jMM-jDD").format(
          "jYYYY-jMM-jDD"
        )
      )

      let monthEnd = p2e(
        moment(`${p2e(start_year)}-${month.id}-1`, "jYYYY-jMM-jDD")
          .endOf("jmonth")
          .format("jYYYY-jMM-jDD")
      )

      if (start_date <= monthEnd && finish_date >= monthStart) {
        if (
          monthStart <= currentDate &&
          currentDate <= monthEnd &&
          currentDate >= paid_up_to
        ) {
          month.status = "current"
        } else if (paid_up_to >= monthEnd) {
          month.status = "paid"
          month.isSelected = true
        } else if (paid_up_to < monthEnd && currentDate <= monthEnd) {
          month.status = "avalible"
        } else if (paid_up_to < monthEnd) {
          month.status = "debt"
          month.isSelected = true
        }
      } else {
        month.status = "disabled"
      }
    }

    // Set status for year2
    for (let i = 0; i < year2.length; i++) {
      let month = year2[i]

      let monthStart = p2e(
        moment(`${p2e(finishYear)}-${month.id}-1`, "jYYYY-jMM-jDD").format(
          "jYYYY-jMM-jDD"
        )
      )

      let monthEnd = p2e(
        moment(`${p2e(finishYear)}-${month.id}-1`, "jYYYY-jMM-jDD")
          .endOf("jmonth")
          .format("jYYYY-jMM-jDD")
      )

      if (start_date <= monthEnd && finish_date >= monthStart) {
        if (
          monthStart <= currentDate &&
          currentDate <= monthEnd &&
          currentDate >= paid_up_to
        ) {
          month.status = "current"
        } else if (paid_up_to >= monthEnd) {
          month.status = "paid"
          month.isSelected = true
        } else if (paid_up_to < monthEnd && currentDate <= monthEnd) {
          month.status = "avalible"
        } else if (paid_up_to < monthEnd) {
          month.status = "debt"
          month.isSelected = true
        }
      } else {
        month.status = "disabled"
      }
    }

    // -- >> calculate status
    setMonthsList1(year1)
    setMonthsList2(year2)
  }

  let [counter, setCounter] = useState(0)

  useEffect(() => {
    giveStateToMonths()
  }, [contract])

  const [dueDateOpen, setDueDateOpen] = useState(false)
  const [selectOption, setSelectOption] = useState("")
  const clickOption = (option) => {
    setSelectOption(option)
  }
  const close = () => setDueDateOpen(false)

  const handleConfirmDuePayments = (value) => {
    getPaymentInfo(value, "months")
  }

  const [payData, setPayData] = useState()

  // state for api
  const getPaymentInfo = (value, type) => {
    if (!contract) return
    if (type === "debt") {
      let monthValues = {
        contract: contract.id,
        current_month: false,
        months: 0,
        do: false,
      }
      setPayData(monthValues)
      paymentRequest(portalEndpoint, monthValues, false)
    }
    if (type === "current") {
      let monthValues = {
        contract: contract.id,
        current_month: true,
        months: 0,
        do: false,
      }
      setPayData(monthValues)
      paymentRequest(portalEndpoint, monthValues, false)
    }
    if (type === "months") {
      if (!value) return
      if (value > 0) {
        let monthValues = {
          contract: contract.id,
          current_month: true,
          months: value - 1,
          do: false,
        }
        setPayData(monthValues)
        paymentRequest(portalEndpoint, monthValues, false)
      }
    }
  }
  // open in new tab
  const openInNewTab = (url) => {
    window.open(url, "_blank", "noopener,noreferrer")
  }

  // states
  const [cost_until_date, set_cost_until_date] = useState(0)
  const [payRes, setPayRes] = useState()
  // --- >>> --- >>> --- >>> Api
  const portalEndpoint = "contract/api/Contract/PayCharge"
  const poseEndpoint = "contract/api/Contract/PoseChargePay"
  const [poseResponse, setPoseResponse] = useState("empty")
  const [openSuccess, setopenSuccess] = useState(false)

  const paymentRequest = (endpoint, data, d) => {
    if (endpoint === poseEndpoint) setPoseResponse("empty")
    mayadinAx
      .post(
        endpoint,
        {
          ...data,
          do: d,
        },
        {
          timeout: endpoint === poseEndpoint && 135000,
        }
      )
      .then((respond) => {
        console.log("res: ", respond)
        if (respond.status === 200) {
          if (d === true) {
            if (endpoint === portalEndpoint) openInNewTab(respond.data.link)
            else setPoseResponse("success")
          } else {
            setPayRes(respond.data)
          }
          set_cost_until_date(respond.data.cost_until_date)
        }
      })
      .catch((e) => {
        console.log("error: ", e)
        if (e.response?.status === 400) {
          set_cost_until_date(e.response.data.cost_until_date)
        }
        if (endpoint === poseEndpoint) setPoseResponse("failed")
      })

    if (endpoint === poseEndpoint) setopenSuccess(true)
  }

  const myFunc = () => {
    console.log("this triggered")
  }

  const handleClickPay = (type) => {
    if (type === "pose") paymentRequest(poseEndpoint, payData, true)
    if (type !== "pose") paymentRequest(portalEndpoint, payData, true)
  }

  const [open, setOpen] = useState()
  const onClose = () => setOpen(false)

  const [myValue, setMyValue] = useState()

  const openModal = (type) => {
    setOpen(true)
    setMyValue(type)
  }

  const myCallback = () => {
    handleClickPay(myValue)
  }

  const charge_cost = contract?.charge_cost

  return (
    <div className={style.charges_col}>
      <div className={style.charge_header}>
        <p>شارژ ماهانه</p>
      </div>

      {/* Modal -- no reason to put here */}
      <PoseModal
        open={openSuccess}
        onClose={() => {
          setPoseResponse("empty")
          setopenSuccess(false)
        }}
        poseResponse={poseResponse}
      />

      <Divider />
      <div className={style.charge_section}>
        <div className={style.info_item}>
          <p>عنوان</p>
          <p>{contract.tittle}</p>
        </div>
        <div className={style.info_item}>
          <p>واحد</p>
          <p>{contract.unit}</p>
        </div>
        <div className={style.info_item}>
          <p>شارژ ماهانه</p>
          <p>{numberWithCommas(charge_cost?.toFixed(0) || 0)} ریال </p>
        </div>
      </div>
      <Divider />
      <div className={style.charge_section}>
        <div
          className={
            dueDateOpen === false ? style.charge_sortBtn : style.charge_sortOpen
          }
          onClick={() => {
            setDueDateOpen(!dueDateOpen)
            setSelectOption("months")
          }}
        >
          <p>انتخاب موعد پرداخت</p>
          <p>&#8250;</p>
        </div>

        {/* --- --- >>> Modal <<< --- --- */}
        {dueDateOpen === true && (
          <DueDateModal
            startYear={p2e(startYear)}
            endYear={finishYear}
            year1={monthsList1}
            year2={monthsList2}
            handleConfirmDuePayments={handleConfirmDuePayments}
            open={dueDateOpen}
            close={close}
            counter={counter}
            setCounter={setCounter}
          />
        )}
        <div className={style.info_item}>
          <p>مبلغ پرداختی</p>
          {cost_until_date > 0 ? (
            <p>{numberWithCommas(cost_until_date.toFixed(0)) || "..."} ریال</p>
          ) : (
            <p> ... </p>
          )}
        </div>
      </div>
      <Divider />
      <div className={style.charge_section}>
        <div className={style.info_item}>
          <p>پرداخت بدهی</p>
          <p></p>
          <div
            className={
              selectOption === "debt" ? style.active_payOption : style.payOption
            }
          >
            <div
              className={style.payOption_child}
              onClick={() => {
                getPaymentInfo(null, "debt")
                clickOption("debt")
              }}
            />
          </div>
        </div>
        <div className={style.info_item}>
          <p>پرداخت بدهی و ماه جاری</p>
          <p></p>
          <div
            className={
              selectOption === "current"
                ? style.active_payOption
                : style.payOption
            }
          >
            <div
              className={style.payOption_child}
              onClick={() => {
                getPaymentInfo(null, "current")
                clickOption("current")
              }}
            />
          </div>
        </div>
      </div>
      <Divider />
      <div className={style.pay_section}>
        <PayButton
          text='پرداخت با کارتخوان'
          icon={payPoseSvg}
          onClick={() => openModal("pose")}
        />
        <PayButton
          text='پرداخت با درگاه'
          icon={payWebSvg}
          onClick={() => openModal("")}
        />
      </div>

      {/* Modal */}
      <PayModal
        open={open}
        onClose={onClose}
        payCallback={myCallback}
        charge_cost={charge_cost}
        payData={payRes}
      />
    </div>
  )
}

const PayButton = ({ text, onClick, icon }) => {
  return (
    <Button
      style={{
        borderRadius: 10,
      }}
      className={style.payBtn}
      variant='contained'
      onClick={onClick}
    >
      <img src={icon} alt='' />
      <p>{text}</p>
    </Button>
  )
}

export default Charges
