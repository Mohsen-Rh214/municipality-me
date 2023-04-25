import React, { useState } from "react"
import moment from "moment-jalaali"
import { useLocation } from "react-router-dom"
import { mayadinAx } from "../../services/AxiosRequest"
import { useNavigate } from "react-router-dom"

// Mui
// import MenuItem from "@mui/material/MenuItem"

// style
import style from "./contracts.module.css"
import titleIcon from "../../assets/svg/contracts-add-icon.svg"
import contractsChip from "../../assets/svg/contracts-chip-info.svg"
import defaultQR from "../../assets/img/default-qr.png"

// custom components
import ActionBar from "../../components/layout/ActionBar"
import MainCol from "../../components/containers/MainCol"
import SideCol from "../../components/containers/SideCol"
import FormChip from "../../components/form/FormChip"
import FormDivider from "../../components/form/FormDivider"
import FormDropDown from "../../components/form/FormDropDown"
import DateField from "../../components/form/DateField"
import FormField from "../../components/form/FormField"
import { p2e } from "../../utils/convertNumerics"
import Charges from "../../components/contracts/Charges"
import SearchAutoComplete from "../../components/form/SearchAutoComplete"
import PField from "../../components/form/PField"

const AddContract = () => {
  // navigations
  const navigate = useNavigate()

  // time states
  const timeNow = moment().format("jYYYY/jM/jD")
  const [submitDate, setSubmitDate] = useState(p2e(timeNow))
  const [startDate, setStartDate] = useState(null)
  const [endDate, setEndDate] = useState(null)
  const [paidDate, setPaidDate] = useState(null)

  const timetoShow = (date, api) => {
    if (date === undefined) return " "
    if (date === null) return " "

    const convertAndShow = moment(date, "jYYYY-jM-jD").format("jYYYY/jMM/jDD")
    const convert4Api = moment(date, "jYYYY-jM-jD").format("jYYYY-jMM-jDD")

    const fullDate = `${date?.year}/${date?.month}/${date?.day}`

    const showDate = moment(fullDate, "jYYYY/jM/jD").format("jYYYY/jMM/jDD")
    const myDate = moment(fullDate, "jYYYY/jM/jD").format("jYYYY-jMM-jDD")

    if (api === "api") return p2e(myDate) || null
    if (api === "api2") return p2e(convert4Api) || null
    if (api === "convert") return convertAndShow || null

    return showDate
  }

  // --- >>> --- >>> Validations
  const [validChargeCost, setValidChargeCost] = useState(null)
  const [validTitle, setValidTitle] = useState(null)
  const [validUnit, setValidUnit] = useState(null)

  // - this function triggers after lost focus
  const blurCheck = (e) => {
    const value = e.target.value
    switch (e.target.name) {
      case "charge_cost":
        !value
          ? setValidChargeCost("empty")
          : value.length < 5
            ? setValidChargeCost("short")
            : setValidChargeCost(false)
        return
      case "tittle":
        !value
          ? setValidTitle("empty")
          : value.length < 5
            ? setValidTitle("short")
            : setValidTitle(false)
        return
      case "unit":
        !value ? setValidUnit("empty") : setValidUnit(false)
        return
    }
  }

  // other states
  const conStatusItems = [
    { label: "فعال", value: "E" },
    { label: "قرارداد جاری", value: "C" },
    { label: "غیر فعال", value: "B" },
    { label: "قرارداد به پایان رسیده", value: "F" },
  ]

  const conTypeItems = [
    { label: "اجاره", value: "R" },
    { label: "خرید/فروش", value: "T" },
  ]

  const [contractStatus, setContractStatus] = useState(conStatusItems[0].value)
  const [contractType, setContractType] = useState(conTypeItems[0].value)

  const [newContract, setNewContract] = useState([])
  const handleChange = (event) => {
    setNewContract({
      ...newContract,
      [event.target.name]: event.target.value,
    })
  }

  const [tenant, setTenant] = useState()
  const [unit, setUnit] = useState(null)

  const handleTenantChange = (event, newValue) => {
    setNewContract({
      ...newContract,
      tenant: newValue.id,
    })
    setTenant(newValue)
  }

  const handleUnitChange = (event, newValue) => {
    setNewContract({
      ...newContract,
      unit: newValue.id,
    })
    setUnit(newValue)
  }

  const handleConStatus = (e) => {
    setContractStatus(e.target.value)
  }

  const handleConType = (e) => {
    setContractType(e.target.value)
  }

  // --- --- --- >>> >>> >>> sort search component
  const [isLoading, setIsLoading] = useState(false)
  const userListEndPoint = `auth/api/Citizen/`
  const [usersList, setUsersList] = useState([])
  const myNewList =
    usersList !== []
      ? usersList.map((item, index) => ({
        id: item.id,
        label: `${item.first_name} ${item.last_name} | ${item.national_code}`,
      }))
      : {
        id: 0,
        label: `اطلاعاتی یافت نشد`,
      }

  const [unitList, setUnitList] = useState([])
  const unitListEndPoint = `unit/api/Unit/`
  const myNewUnit =
    unitList !== []
      ? unitList.map((item, index) => ({
        id: item.id,
        label: `${item.unit} | ${item.tittle}`,
      }))
      : {
        id: 0,
        label: `اطلاعاتی یافت نشد`,
      }

  // api call to get above values
  const dataForSearchFields = (endpoint, setList, search) => {
    console.log("callid with: ", endpoint)
    if (!endpoint) return
    if (!setList) return

    console.log('passed call,', isLoading)
    if (isLoading === false) {
      console.log('inside call')
      setIsLoading(true)
      mayadinAx
        .get(endpoint, { params: { search } })
        .then((respond) => {
          console.log("res with: ", respond)
          setList(respond.data.results)
          setIsLoading(false)
        })
        .catch((e) => {
          console.log("error: ", e)

          setIsLoading(false)
        })
    }
  }

  // -- step 3: check if any field is empty before submit
  const [isEmpty, setIsEmpty] = useState(false)
  // const [errorMsg, setErrorMsg] = useState(null)

  const checkValidForm = () => {
    if (newContract.tenant === (null || undefined)) {
      console.log("field empty")
      setIsEmpty(true)
      return false
    }
    if ((endDate || startDate) === (null || undefined)) {
      console.log("field empty")
      setIsEmpty(true)
      return false
    }
    if (validChargeCost === (null || undefined)) {
      console.log("field empty")
      setIsEmpty(true)
      return false
    }
    if (validTitle === (null || undefined)) {
      console.log("field empty")
      setIsEmpty(true)
      return false
    }
    if (validUnit === (null || undefined)) {
      console.log("field empty")
      setIsEmpty(true)
      return false
    }
    setIsEmpty(false)
    return true
  }

  // Add new person Api
  const [loading, setLoading] = useState(false)
  const registerEndpoint = "contract/api/Contract/"

  const handleSubmit = () => {
    // setIsEmpty(false)
    checkValidForm()
    if (checkValidForm() === true) {
      setLoading(true)
      mayadinAx
        .post(registerEndpoint, {
          ...newContract,
          tenant: tenant.id,
          unit: unit.id,
          status: contractStatus,
          contract_type: contractType,
          start_date: timetoShow(startDate, "api"),
          finish_date: timetoShow(endDate, "api"),
          submit_date: timetoShow(submitDate, "api2"),
          paid_up_to: timetoShow(paidDate, "api"),
        })
        .then((res) => {
          // console.log("res: ", res)
          setIsEmpty(false)
          navigate(-1, { replace: true })
          // toast.success("کاربر جدید با موفقیت ثبت شد", {})
        })
        .catch((e) => {
          console.log(`${registerEndpoint} error: `, e)
          // toast.error("عملیات با خطا مواجه شد", {})
          setIsEmpty('error')

          if (e.response?.data) {
            const data = e.response?.data
            const myMsg = Object.values(data)
            // console.log('errrrror: ', myMsg[0][0])
            // setErrorMsg(myMsg[0][0])
          }
        })
        .finally(() => setLoading(false))

    } else {
      checkValidForm()
    }
  }

  return (
    <div className='page'>
      <ActionBar title='افزودن قرارداد' icon={titleIcon} />
      <div className={style.page_body_row}>
        {/* -- > -- > F O R M < -- < -- */}
        <MainCol
          confirmText='تائید و ثبت'
          onConfirm={handleSubmit}
          deleteText='انصراف'
          onDelete={() => navigate(-1, { replace: true })}
          isLoading={loading}

          error={isEmpty}
        // errorMsg={errorMsg}
        >
          <div className={style.form}>
            {/* --- >>> form part 1 <<< --- */}
            <FormChip text='اطلاعات قرارداد' icon={contractsChip} upload />
            <div className={style.form_part1}>
              <PField label='مالک' text='اداره میادین' />

              <SearchAutoComplete
                label='* مستاجر'
                placeholder='جستجو با شماره ملی'
                onChange={handleTenantChange}
                ltr='true'
                options={myNewList}
                onFocus={() =>
                  dataForSearchFields(userListEndPoint, setUsersList)
                }

                // seach on type
                handleType={(e) => dataForSearchFields(userListEndPoint, setUsersList, e.target.value)}
              />

              <FormField
                label='* عنوان قرارداد'
                placeholder='مثال: غرفه شماره یک بازارچه'
                onChange={handleChange}
                name='tittle'
                onBlur={blurCheck}
                error={validTitle}
                helperText={
                  validTitle === "empty"
                    ? "این مورد نمیتواند خالی باشد"
                    : validTitle === "short"
                      ? "لطفا مقدار معتبر وارد کنید"
                      : ""
                }
              />

              <SearchAutoComplete
                label='واحد'
                placeholder='جستجو با شماره واحد'
                onChange={handleUnitChange}
                ltr='true'
                options={myNewUnit}
                onFocus={() =>
                  dataForSearchFields(unitListEndPoint, setUnitList)
                }

                // seach on type
                handleType={(e) => dataForSearchFields(unitListEndPoint, setUnitList, e.target.value)}

              />
              <FormDropDown
                label='نوع قرارداد'
                value={contractType}
                onChange={handleConType}
                name='type'
                options={conTypeItems}
              />

              <div></div>

              <DateField
                label='* تاریخ شروع قرارداد'
                setdate={setStartDate}
                timeshow={timetoShow(startDate)}
              />

              <DateField
                label='تاریخ ثبت'
                timeshow={timetoShow(submitDate, "convert")}
                permission={false}
              />

              <DateField
                label='* تاریخ پایان قرارداد'
                setdate={setEndDate}
                timeshow={timetoShow(endDate)}
              />
              <div></div>
              <DateField
                label='پرداخت شده تا'
                setdate={setPaidDate}
                timeshow={timetoShow(paidDate)}
              // permission={false}
              />
              <FormField
                label='* اجاره ماهانه'
                placeholder='(ریال)'
                ltr2='true'
                type='number'
                ltr='true'
                onChange={handleChange}
                name='charge_cost'
                onBlur={blurCheck}
                error={validChargeCost}
                helperText={
                  validChargeCost === "empty"
                    ? "این مورد نمیتواند خالی باشد"
                    : validChargeCost === "short"
                      ? "لطفا مقدار معتبر وارد کنید"
                      : ""
                }
              />
              <FormDropDown
                label='وضعیت قرارداد'
                value={contractStatus}
                onChange={handleConStatus}
                name='status'
                options={conStatusItems}
              ></FormDropDown>
            </div>
          </div>
        </MainCol>
        <div className={style.page_body_side}>
          <SideCol qr={defaultQR} add />
          {/* <SideCol>
            <Charges contract={contractDetail} />
          </SideCol> */}
          {/* <SideCol>
            {openCharge === true ? (
            ) : (
              <div className={style.charges_col}>
                <div className={style.charges_right}>
                  <p>شارژ ماهانه</p>
                </div>
                <div className={style.charges_left}></div>
              </div>
            )}
            <div className={style.balance_col}></div>
          </SideCol>
          <SideCol>
            <div className={style.message_col}></div>
          </SideCol> */}
        </div>
      </div>
    </div>
  )
}

export default AddContract
