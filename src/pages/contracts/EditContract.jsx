import React, { useState, useEffect } from "react"
import moment from "moment-jalaali"
import { useParams, useNavigate } from "react-router-dom"
import { getToken } from "../../utils/SessionStorage"
import { mayadinAx } from "../../services/AxiosRequest"

// Mui
// import MenuItem from "@mui/material/MenuItem"

// style
import style from "./contracts.module.css"
import titleIcon from "../../assets/svg/contracts-add-icon.svg"
import contractsChip from "../../assets/svg/contracts-chip-info.svg"
import cloudIcon from "../../assets/svg/personal-chip-cloud.svg"
import defaultQR from "../../assets/img/default-qr.png"
import numberWithCommas from "../../utils/numbersWithComma"
import loadingSvg from "../../assets/svg/loading.svg"

// custom components
import ActionBar from "../../components/layout/ActionBar"
import MainCol from "../../components/containers/MainCol"
import SideCol from "../../components/containers/SideCol"
import FormChip from "../../components/form/FormChip"
import FormDivider from "../../components/form/FormDivider"
import FormDropDown from "../../components/form/FormDropDown"
import DateField from "../../components/form/DateField"
import FormField from "../../components/form/FormField"
import UploadContainer from "../../components/form/UploadContainer"
import { p2e } from "../../utils/convertNumerics"
import Charges from "../../components/contracts/Charges"
import SearchAutoComplete from "../../components/form/SearchAutoComplete"
import PField from "../../components/form/PField"
import EditField from "../../components/form/EditField"

const EditContract = () => {
  // navigations
  const navigate = useNavigate()

  // Permissions
  const permissions = JSON.parse(getToken("permissions"))
  const p_canChangeStartDate = permissions["contract.can_change_start_date"]

  // contract id from url
  const { contractId } = useParams()

  // getting information from api
  const [loadingPage, setLoadingPage] = useState(true)
  const [contractDetail, setContractDetail] = useState([])

  const getContractDetail = () => {
    const getDetailsEndpoint = `contract/api/Contract/${contractId}`
    setLoadingPage(true)
    mayadinAx
      .get(getDetailsEndpoint)
      .then((respond) => {
        console.log("res 1: ", respond)
        if (respond.status === 200) {
          setContractDetail(respond.data)
          setLoadingPage(false)
        }
      })
      .catch((e) => {
        console.log("error: ", e)
        setLoadingPage(false)
        setContractDetail('empty')
      })
  }

  useEffect(() => {
    getContractDetail()
  }, [])

  // >>> --- >>> states

  // init states
  const initStartDate = contractDetail !== [] && contractDetail.start_date
  const initEndDate = contractDetail !== [] && contractDetail.finish_date
  const initCancellDate = contractDetail !== [] && contractDetail.cancel_date
  const initChargeCost = contractDetail !== [] && contractDetail.charge_cost
  const submitDate = contractDetail !== [] && contractDetail.submit_date
  const initPaidDate = contractDetail !== [] && contractDetail.paid_up_to
  const initContractType = contractDetail !== [] && contractDetail.contract_type
  const initContractStatus = contractDetail !== [] && contractDetail.status
  const initTenant = contractDetail !== [] && contractDetail.tenant
  const initTitle = contractDetail !== [] && contractDetail.tittle
  const initUnit = contractDetail !== [] && contractDetail.unit

  const [cancellDate, setCancellDate] = useState(initCancellDate)
  const [chargeCost, setChargeCost] = useState()
  const [startDate, setStartDate] = useState(initStartDate)
  const [endDate, setEndDate] = useState(initEndDate)
  const [paidDate, setPaidDate] = useState(initPaidDate)

  const [newContract, setNewContract] = useState([])
  const [loading, setLoading] = useState(false)
  const [isEmpty, setIsEmpty] = useState(false)
  // const [errorMsg, setErrorMsg] = useState(null)

  // states for drop downs
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

  const [contractStatus, setContractStatus] = useState()

  const [contractType, setContractType] = useState()

  // states for search autocompletes
  const [tenant, setTenant] = useState()
  const [unit, setUnit] = useState()

  // --- --- ---  component lists
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
    if (!endpoint) return
    if (!setList) return

    mayadinAx
      .get(endpoint, { params: { search } })
      .then((respond) => {
        // console.log("res with: ", respond)
        setList(respond.data.results)
      })
      .catch((e) => {
        console.log("error: ", e)
      })
  }

  // set my init states to values from api
  useEffect(() => {
    if (contractDetail !== []) {
      // sort fields
      const initStatusObj = conStatusItems.filter(
        (item) => item.label === initContractStatus
      )
      setContractStatus(
        initContractStatus !== undefined && initStatusObj[0].value
      )
      setContractType(initContractType !== undefined && initContractType)

      // autocomplete fields
      setTenant(initTenant)
      setUnit(initUnit)

      setChargeCost(initChargeCost)
    }
  }, [contractDetail])

  // handlers
  const handleChange = (event) => {
    setNewContract({
      ...newContract,
      [event.target.name]: event.target.value,
    })
  }

  const handleTenantChange = (event, newValue) => {
    setTenant(newValue)
  }

  const handleUnitChange = (event, newValue) => {
    setUnit(newValue)
  }

  const handleConStatus = (e) => {
    setContractStatus(e.target.value)
    console.log("e.targe: ", e.target.value)
  }

  const handleConType = (e) => {
    setContractType(e.target.value)
  }

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

  //     // --- >>> --- >>> Validations
  const [validChargeCost, setValidChargeCost] = useState()

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
    }
  }

  // submit edited form
  const registerEndpoint = `contract/api/Contract/${contractDetail.id}/`

  const handleSubmit = () => {
    // setIsEmpty(false)
    setLoading(true)
    mayadinAx
      .patch(registerEndpoint, {
        ...newContract,
        tenant: tenant.id,
        unit: unit || unit.id,
        status: contractStatus,
        contract_type: contractType,
        start_date:
          startDate === undefined
            ? initStartDate
            : timetoShow(startDate, "api"),
        finish_date:
          endDate === undefined ? initEndDate : timetoShow(endDate, "api"),
        paid_up_to:
          paidDate === undefined ? initPaidDate : timetoShow(paidDate, "api"),
        submit_date: timetoShow(submitDate, "api2"),
        tittle: initTitle,
      })
      .then((res) => {
        console.log("res: ", res)
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
  }

  // edit field handlers
  const [editTenant, setEditTenant] = useState(false)
  const [editUnit, setEditUnit] = useState(false)
  const [editCharge, setEditCharge] = useState(false)





  // *** ---- >>> U P L O A D <<< ---- *** //
  const ContentTypeId = 18 // -- > backend id for contract: contract

  const uploadContainersList = [

    { id: 1, desc: 'تصویر سند', attach: false },
    { id: 2, desc: 'افزودن پرونده دیگر', attach: true },

  ]


  return (
    <div className='page'>
      <ActionBar title='نمایش قرارداد' icon={titleIcon}></ActionBar>
      <div className={style.page_body_row}>
        {/* -- > -- > F O R M < -- < -- */}
        <MainCol
          confirmText='تائید و ثبت'
          onConfirm={handleSubmit}
          deleteText='انصراف'
          onDelete={() => navigate(-1, { replace: true })}
          isLoading={loading}
          loadingPage={loadingPage}

          error={isEmpty}
        // errorMsg={errorMsg}
        >
          {loadingPage === true ? (
            <div className={style.loadingPage}>
              <p>در حال بارگزاری</p>
              <p>لطفا شکیبا باشید</p>
              <img src={loadingSvg} alt='' />
            </div>
          ) : contractDetail === 'empty' ?
            <div className='loadingPage'>
              <h2 style={{ color: 'white' }}>اطلاعاتی یافت نشد!</h2>
            </div> : (
              <div className={style.form}>
                {/* --- >>> form part 1 <<< --- */}
                <FormChip text='اطلاعات قرارداد' icon={contractsChip} upload />
                <div className={style.form_part1}>
                  <PField label='مالک' text='اداره میادین' />
                  {editTenant === false ? (
                    <EditField
                      label='مستاجر'
                      text={tenant !== undefined && tenant.get_fullname}
                      setEdit={setEditTenant}
                    />
                  ) : (
                    <SearchAutoComplete
                      label='مستاجر'
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
                  )}
                  <FormDropDown
                    label='نوع قرارداد'
                    value={contractType}
                    onChange={handleConType}
                    name='type'
                    options={conTypeItems}
                  />

                  {editUnit === false ? (
                    <EditField
                      label='واحد'
                      text={unit !== undefined && unit}
                      setEdit={setEditUnit}
                    />
                  ) : (
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
                  )}

                  <DateField
                    label='تاریخ شروع قرارداد'
                    setdate={setStartDate}
                    timeshow={
                      startDate === undefined
                        ? timetoShow(initStartDate, "convert")
                        : timetoShow(startDate)
                    }
                    permission={p_canChangeStartDate}
                  />
                  <DateField
                    label='تاریخ ثبت'
                    timeshow={timetoShow(submitDate, "convert")}
                    permission={false}
                  />
                  <DateField
                    label='تاریخ پایان قرارداد'
                    setdate={setEndDate}
                    timeshow={
                      endDate === undefined
                        ? timetoShow(initEndDate, "convert")
                        : timetoShow(endDate)
                    }
                    permission={p_canChangeStartDate}
                  />
                  <DateField
                    label='تاریخ لغو قرارداد'
                    // setdate={setCancellDate}
                    timeshow={timetoShow(cancellDate, "convert")}
                    permission={false}
                  />
                  <DateField
                    label='پرداخت شده تا'
                    setdate={setPaidDate}
                    timeshow={
                      paidDate === undefined
                        ? timetoShow(initPaidDate, "convert")
                        : timetoShow(paidDate)
                    }
                  // permission={false}
                  />

                  {editCharge === false ? (
                    <EditField
                      label='اجاره ماهانه'
                      text={
                        chargeCost !== undefined
                          ? `${numberWithCommas(chargeCost)} ریال`
                          : 0
                      }
                      setEdit={setEditCharge}
                    />
                  ) : (
                    <FormField
                      type='number'
                      label='اجاره ماهانه'
                      value={chargeCost}
                      onChange={(e) => {
                        setChargeCost(e.target.value)
                        handleChange(e)
                      }}
                      // onChange={handleChange}
                      placeholder='(ریال)'
                      ltr='true'
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
                  )}
                  <FormDropDown
                    label='وضعیت قرارداد'
                    value={contractStatus}
                    onChange={handleConStatus}
                    name='status'
                    options={conStatusItems}
                  />
                </div>


                {/* --- >>> form part 3 <<< --- */}
                <FormDivider />
                <FormChip text='آپلود تصاویر' icon={cloudIcon} upload />

                <div className='form_part_upload'>

                  {uploadContainersList.map((item) => {
                    return <UploadContainer
                      desc={item.desc}
                      attach={item.attach}

                      contentTypeId={ContentTypeId}
                      objId={contractId}
                    />
                  })}

                </div>


              </div>
            )}
        </MainCol>
        <div className={style.page_body_side}>
          <SideCol qr={defaultQR} />
          <SideCol>
            <Charges contract={contractDetail} />
          </SideCol>
        </div>
      </div>
    </div>
  )
}

export default EditContract
