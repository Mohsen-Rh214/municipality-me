import React, { useState } from "react"
import { useNavigate } from "react-router-dom"
import { mayadinAx } from "../../services/AxiosRequest"

// style
import style from "./unit.module.css"
import titleIcon from "../../assets/svg/unit-title-icon.svg"
import infoChip from "../../assets/svg/unit-chip-info.svg"
import cloudIcon from "../../assets/svg/personal-chip-cloud.svg"
import defaultQR from "../../assets/img/default-qr.png"

// custom components
import ActionBar from "../../components/layout/ActionBar"
import MainCol from "../../components/containers/MainCol"
import SideCol from "../../components/containers/SideCol"
import FormChip from "../../components/form/FormChip"
import FormField from "../../components/form/FormField"
import FormDivider from "../../components/form/FormDivider"
import UploadContainer from "../../components/form/UploadContainer"
import SearchAutoComplete from "../../components/form/SearchAutoComplete"
import PField from "../../components/form/PField"
import FormDropDown from "../../components/form/FormDropDown"

const AddUnit = () => {
  // navigations
  const navigate = useNavigate()

  // form values and validations
  // all data
  const [unitData, setUnitData] = useState()

  // validation
  // -- step 1: set value to state using handlers
  const [building, setBuilding] = useState(null)
  const [owner, setOwner] = useState(null)
  const [address, setAddress] = useState(null)

  const [isLoading, setIsLoading] = useState(false)

  const [usersList, setUsersList] = useState([])
  const userListEndPoint = `auth/api/Citizen/`
  const myUsersList =
    usersList !== []
      ? usersList.map((item, index) => ({
        id: item.id,
        label: `${item.first_name} ${item.last_name} | ${item.national_code}`,
      }))
      : {
        id: 0,
        label: `اطلاعاتی یافت نشد`,
      }

  const [buildingsList, setBuildingsList] = useState([])
  const buildingListEndpoint = `building/api/Building/`
  const myBuildingsList =
    buildingsList !== []
      ? buildingsList.map((item, index) => ({
        id: item.id,
        label: `${item.doc_number} | ${item.tittle} | ${item.usage_type}`,
      }))
      : {
        id: 0,
        label: `اطلاعاتی یافت نشد`,
      }

  // api call to get above values
  const dataForSearchFields = (endpoint, setList, search) => {
    if (!endpoint) return
    if (!setList) return

    if (isLoading === false) {
      setIsLoading(true)
      mayadinAx
        .get(endpoint, { params: { search } })
        .then((respond) => {
          // console.log("res with: ", respond)
          setTimeout(() => {
            setList(respond.data.results)
          }, 500)
        })
        .catch((e) => console.log("error: ", e))
        .finally(() => setIsLoading(false))
    }
  }

  const handleFocus = (button) => {
    switch (button) {
      case "user":
        dataForSearchFields(userListEndPoint, setUsersList)
        break

      case "building":
        dataForSearchFields(buildingListEndpoint, setBuildingsList)
        break
    }
  }

  // Search -- >> for search autocomplete components
  const handleSearch = (e, button) => {
    const mySearch = e.target.value
    switch (button) {
      case "user":
        dataForSearchFields(userListEndPoint, setUsersList, mySearch)
        break

      case "building":
        dataForSearchFields(buildingListEndpoint, setBuildingsList, mySearch)
        break
    }
  }

  const handleChange = (event) => {
    setUnitData({
      ...unitData,
      [event.target.name]: event.target.value,
    })
  }

  const handleBuildingChange = (event, newValue) => {
    setUnitData({
      ...unitData,
      building: newValue.id,
    })
    setBuilding(newValue)
  }

  const handleOwnerChange = (event, newValue) => {
    setUnitData({
      ...unitData,
      owner: newValue.id,
    })
    setOwner(newValue)
  }

  const handleAddressChange = (event, newValue) => {
    setUnitData({
      ...unitData,
      address: newValue.id,
    })
    setAddress(newValue)
  }

  const usageItems = [
    { label: "تجاری", value: "تجاری" },
    { label: "اداری", value: "اداری" },
    { label: "مسکونی", value: "مسکونی" },
  ]

  // needs defaul value for api
  const [unitUsage, setUnitUsage] = useState(usageItems[0].value)

  const handleUnitUsage = (e, newValue) => {
    setUnitData({
      ...unitData,
      usage_type: e.target.value,
    })
    setUnitUsage(e.target.value)
  }

  const [filesToUpload, setFiles] = useState([])
  const handleFile = (file) => {
    filesToUpload.push(file)
    // handleChange()
  }
  // -- step 2: validate every field on onBlur event

  const [validTitle, setValidTitle] = useState()
  const [validUnit, setValidUnit] = useState()
  const [validLevel, setValidLevel] = useState()
  const [validDocNum, setValidDocNum] = useState()
  const [validPostalCode, setValidPostalCode] = useState()
  const [validSpace, setValidSpace] = useState()
  const [validStage, setValidStage] = useState()

  // - this function triggers after lost focus
  const blurCheck = (e) => {
    const value = e.target.value
    switch (e.target.name) {
      case "tittle":
        !value
          ? setValidTitle("empty")
          : value.length < 3
            ? setValidTitle("short")
            : setValidTitle(false)
        return
      case "unit":
        !value ? setValidUnit("empty") : setValidUnit(false)
        return
      case "count_floor":
        !value ? setValidLevel("empty") : setValidLevel(false)
        return
      case "doc_number":
        !value
          ? setValidDocNum("empty")
          : value.length < 4
            ? setValidDocNum("short")
            : value.length > 16
              ? setValidDocNum("long")
              : setValidDocNum(false)
        return
      case "space":
        !value
          ? setValidSpace("empty")
          : value.length < 2
            ? setValidSpace("short")
            : value.length > 6
              ? setValidSpace("long")
              : setValidSpace(false)
        return
      case "postal_code":
        !value
          ? setValidPostalCode("empty")
          : value.length < 10
            ? setValidPostalCode("short")
            : setValidPostalCode(false)
        return
      case "construction_stage":
        !value
          ? setValidStage("empty")
          : value.length < 3
            ? setValidStage("short")
            : setValidStage(false)
        return
      default:
        return false
    }
  }

  // -- step 3: check if any field is empty before submit
  const [isEmpty, setIsEmpty] = useState(false)
  // const [errorMsg, setErrorMsg] = useState(null)

  const checkValidForm = () => {
    if (
      validTitle ||
      validLevel ||
      validUnit ||
      validDocNum ||
      validSpace ||
      validStage ||
      validPostalCode === undefined
    ) {
      console.log(
        "field empty",
        validTitle,
        validLevel,
        validUnit,
        validDocNum,
        validSpace,
        validStage,
        validPostalCode
      )
      if (address || unitUsage || owner || building === null) {
        console.log("second: ", address, unitUsage, owner, building)
        setIsEmpty(true)
        return false
      }
      setIsEmpty(true)
      return false
    } else {
      setIsEmpty(false)
      return true
    }
  }

  // Add new person Api
  const [loading, setLoading] = useState(false)
  const registerEndpoint = "unit/api/Unit/"

  // -- step 4: after running a check, submit new user
  const handleSubmit = () => {
    if (checkValidForm() === true) {
      setLoading(true)
      mayadinAx
        .post(registerEndpoint, { ...unitData, usage_type: unitUsage })
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
      <ActionBar title='افزودن واحد جدید' icon={titleIcon} />
      <div className={style.page_body_row}>
        <MainCol
          confirmText='تائید اطلاعات'
          onConfirm={handleSubmit}
          deleteText='انصراف'
          onDelete={() => navigate(-1, { replace: true })}
          isLoading={loading}

          error={isEmpty}
        // errorMsg={errorMsg}
        >
          <div className={style.form}>
            <FormChip text='اطلاعات واحد' icon={infoChip} />
            <div className={style.form_part1}>
              <FormField
                label='* عنوان سند'
                name='tittle'
                onChange={handleChange}
                onBlur={blurCheck}
                error={validTitle}
                helperText={
                  validTitle === "empty"
                    ? "عنوان سند نمیتواند خالی باشد"
                    : validTitle === "short"
                      ? "لطفا عنوان سند را کامل وارد کنید"
                      : ""
                }
              />

              <SearchAutoComplete
                label='* ساختمان'
                placeholder='مثال: ساختمان پرند طبقه 1'
                onChange={handleBuildingChange}
                options={myBuildingsList}
                onFocus={() => handleFocus("building")}

                handleType={(e) => handleSearch(e, 'building')}
              />

              <PField label='ارگان مدیر' text='شهرداری بندرعباس' />

              <SearchAutoComplete
                label='* مالک'
                placeholder='جستجو با نام و نام خانوادگی'
                onChange={handleOwnerChange}
                ltr='true'
                options={myUsersList}
                onFocus={() => handleFocus("user")}

                // seach on type
                handleType={(e) => handleSearch(e, 'user')}
              />

              <FormField
                label='* طبقه'
                ltr='true'
                name='count_floor'
                onChange={handleChange}
                // maxLength={2}
                onBlur={blurCheck}
                error={validLevel}
                type='Number'
                helperText={
                  validLevel === "empty" ? "ورود شماره طبقه الزامی است" : ""
                }
              />

              <FormField
                label='* واحد'
                ltr='true'
                name='unit'
                onChange={handleChange}
                maxLength={4}
                onBlur={blurCheck}
                error={validUnit}
                type='Number'
                helperText={
                  validUnit === "empty" ? "ورود شماره واحد الزامی است" : ""
                }
              />

              <FormField
                label='* شماره سند'
                ltr='true'
                name='doc_number'
                onChange={handleChange}
                onBlur={blurCheck}
                error={validDocNum}
                type='Number'
                helperText={
                  validDocNum === "empty"
                    ? "ورود شماره سند الزامی است"
                    : validDocNum === "short"
                      ? "لطفا شماره سند را کامل وارد کنید"
                      : validDocNum === "long"
                        ? "لطفا مطئن شوید شماره سند صحیح است"
                        : ""
                }
              />

              <FormField
                label='* کد پستی'
                ltr='true'
                name='postal_code'
                onChange={handleChange}
                maxLength={10}
                onBlur={blurCheck}
                error={validPostalCode}
                type='Number'
                helperText={
                  validPostalCode === "empty"
                    ? "ورود کد پستی الزامی است"
                    : validPostalCode === "short"
                      ? "لطفا کد پستی را کامل وارد کنید"
                      : ""
                }
              />

              <FormField
                label='* مساحت واحد'
                ltr='true'
                name='space'
                onChange={handleChange}
                maxLength={6}
                onBlur={blurCheck}
                error={validSpace}
                type='Number'
                helperText={
                  validSpace === "empty"
                    ? "ورود مساحت الزامی است"
                    : validSpace === "short"
                      ? "لطفا مساحت را کامل وارد کنید"
                      : validSpace === "long"
                        ? "لطفا مطئن شوید مساحت وارد شده صحیح است"
                        : ""
                }
              />

              {/* <div /> */}
              <FormDropDown
                label='نوع کاربری'
                value={unitUsage}
                onChange={handleUnitUsage}
                name='usage_type'
                options={usageItems}
              />

              <FormField
                label='* وضعیت بهره برداری'
                name='construction_stage'
                onChange={handleChange}
                onBlur={blurCheck}
                error={validStage}
                helperText={
                  validStage === "empty"
                    ? "وضعیت بهره برداری نمیتواند خالی باشد"
                    : validStage === "short"
                      ? "لطفا وضعیت بهره برداری را کامل وارد کنید"
                      : ""
                }
              />

            </div>
            {/* --- >>> form part 3 <<< --- */}
            <FormDivider />
            <FormChip text='آپلود تصاویر' icon={cloudIcon} upload />

            <div className={style.form_part_upload}>
              <UploadContainer desc='تصویر سند' handleFile={handleFile} />
              <UploadContainer
                desc='افزودن تصویر پرونده دیگر'
                attach
                handleFile={handleFile}
              />
            </div>
          </div>
        </MainCol>
        <SideCol qr={defaultQR} add />
      </div>
    </div>
  )
}

export default AddUnit
