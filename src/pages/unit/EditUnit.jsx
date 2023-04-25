import React, { useState, useEffect } from "react"
import { useParams, useNavigate } from "react-router-dom"
import { getToken } from "../../utils/SessionStorage"
import { mayadinAx } from "../../services/AxiosRequest"

// Mui
// import MenuItem from "@mui/material/MenuItem"

// style
import style from "./unit.module.css"
import titleIcon from "../../assets/svg/unit-title-icon.svg"
import infoChip from "../../assets/svg/unit-chip-info.svg"
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
import SearchAutoComplete from "../../components/form/SearchAutoComplete"
import PField from "../../components/form/PField"
import EditField from "../../components/form/EditField"

const EditUnit = () => {
  // navigations
  const navigate = useNavigate()

  // Permissions
  const permissions = JSON.parse(getToken("permissions"))

  // contract id from url
  const { unitId } = useParams()

  // getting information from api
  const [isLoading, setIsLoading] = useState(false)
  const [loadingPage, setIsLoadingPage] = useState(true)
  const [unitDetails, setUnitDetails] = useState([])

  const getUnitDetails = (page, data) => {
    const endpoint = `unit/api/Unit/${unitId}`
    setIsLoadingPage(true)
    mayadinAx
      .get(endpoint)
      .then((respond) => {
        if (respond.status === 200) {
          setUnitDetails(respond.data)
          setIsLoadingPage(false)
        }
      })
      .catch((e) => {
        console.log("error: ", e)
        setIsLoadingPage(false)
        setUnitDetails('empty')
      })
  }

  useEffect(() => {
    getUnitDetails()
  }, [])

  //   init states
  const initTitle = unitDetails !== [] && unitDetails.tittle
  const initBuilding = unitDetails !== [] && unitDetails.building // building: {title: , id: }
  const initOwner = unitDetails !== [] && unitDetails.owner // owner id
  const initFloor = unitDetails !== [] && unitDetails.floor_number
  const initUnit = unitDetails !== [] && unitDetails.unit
  const initDocNum = unitDetails !== [] && unitDetails.doc_number
  const initPostCode = unitDetails !== [] && unitDetails.postal_code
  const initSpace = unitDetails !== [] && unitDetails.space
  const initUsage = unitDetails !== [] && unitDetails.usage_type
  const initStage = unitDetails !== [] && unitDetails.construction_stage

  //   states
  const [title, setTitle] = useState()
  const [building, setBuilding] = useState()
  const [owner, setOwner] = useState()
  const [floor, setFloor] = useState()
  const [unit, setUnit] = useState()
  const [doncNum, setDocNum] = useState()
  const [postCode, setPostCode] = useState()
  const [space, setSpace] = useState()
  const [usage, setUsage] = useState()
  const [stage, setStage] = useState()
  const [address, setAddress] = useState()

  // edit states
  const [editBuilding, setEditBuilding] = useState(false)
  const [editOwner, setEditOwner] = useState(false)

  // --- >>> Initial in useEffect
  useEffect(() => {
    if (unitDetails !== []) {
      // text field
      setTitle(initTitle)
      setFloor(initFloor)
      setUnit(initUnit)
      setDocNum(initDocNum)
      setPostCode(initPostCode)
      setSpace(initSpace)
      setStage(initStage)

      // sort fields
      setUsage(initUsage)

      // autocomplete fields
      setBuilding(initBuilding)
      setOwner(initOwner)
    }
  }, [unitDetails])

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

  const handleBuildingChange = (event, newValue) => {
    setBuilding(newValue)
  }

  const handleOwnerChange = (event, newValue) => {
    setOwner(newValue)
  }
  const usageItems = [
    { label: "تجاری", value: "تجاری" },
    { label: "اداری", value: "اداری" },
    { label: "مسکونی", value: "مسکونی" },
  ]

  // needs defaul value for api
  const [unitUsage, setUnitUsage] = useState(usageItems[0].value)

  const handleUnitUsage = (e, newValue) => {
    setUnitUsage(e.target.value)
  }

  const [filesToUpload, setFiles] = useState([])
  const handleFile = (file) => {
    filesToUpload.push(file)
    // handleChange()
  }

  // --- >>> -- >> validations
  const [validTitle, setValidTitle] = useState()
  const [validUnit, setValidUnit] = useState()
  const [validFloor, setValidFloor] = useState()
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
        !value ? setValidFloor("empty") : setValidFloor(false)
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
        value.length > 0 && value.length < 10
          ? setValidPostalCode("short")
          : setValidPostalCode(false)
        return
      case "construction_stage":
        value.length > 0 && value.length < 2
          ? setValidStage("short")
          : setValidStage(false)
        return
      default:
        return false
    }
  }

  //   // -- step 3: check if any field is empty before submit
  const [isEmpty, setIsEmpty] = useState(false)
  const [errorMsg, setErrorMsg] = useState(null)

  // --- >>> >> >  final step
  const handleSubmit = () => {
    const endpoint = `unit/api/Unit/${unitId}/`
    setIsLoading(true)
    mayadinAx
      .put(endpoint, {
        tittle: title,
        building: building.id,
        owner: owner.id,
        count_floor: floor,
        unit,
        doc_number: doncNum,
        postal_code: postCode,
        space,
        usage_type: usage,
        construction_stage: stage,
      })
      .then((res) => {
        console.log("res: ", res)
        setIsEmpty(false)
        navigate(-1, { replace: true })
      })
      .catch((e) => {
        console.log(`${endpoint} error: `, e)

        setIsEmpty('error')

        if (e.response?.data) {
          const data = e.response?.data
          const myMsg = Object.values(data)
          // console.log('errrrror: ', myMsg[0][0])
          setErrorMsg(myMsg[0][0])
        }
      })
      .finally(() => setIsLoading(false))
  }



  // *** ---- >>> U P L O A D <<< ---- *** //
  const ContentTypeId = 14 // -- > backend id for unit: unit

  const uploadContainersList = [

    { id: 1, desc: 'تصویر سند', attach: false },
    { id: 2, desc: 'افزودن پرونده دیگر', attach: true },

  ]


  return (
    <div className='page'>
      <ActionBar title='ویرایش واحد' icon={titleIcon} />
      <div className={style.page_body_row}>
        <MainCol
          confirmText='تائید اطلاعات'
          onConfirm={handleSubmit}
          deleteText='انصراف'
          onDelete={() => navigate(-1, { replace: true })}
          isLoading={isLoading}

          error={isEmpty}
        >
          {loadingPage === true ? (
            <div className={style.loadingPage}>
              <p>در حال بارگزاری</p>
              <p>لطفا شکیبا باشید</p>
              <img src={loadingSvg} alt='' />
            </div>
          ) : unitDetails === 'empty' ?
            <div className='loadingPage'>
              <h2 style={{ color: 'white' }}>اطلاعاتی یافت نشد!</h2>
            </div> : (
              <div className={style.form}>
                <FormChip text='اطلاعات واحد' icon={infoChip} />
                <div className={style.form_part1}>
                  {!editOwner ? (
                    <EditField
                      label='مالک'
                      text={initOwner?.get_fullname}
                      setEdit={setEditOwner}
                    />
                  ) : (
                    <SearchAutoComplete
                      label='مالک'
                      placeholder='جستجو با شماره ملی'
                      onChange={handleOwnerChange}
                      // ltr='true'
                      options={myUsersList}
                      onFocus={() => handleFocus("user")}

                      // seach on type
                      handleType={(e) => handleSearch(e, 'user')}
                    />
                  )}

                  <FormField
                    label='عنوان سند'
                    name='tittle'
                    onChange={(e) => {
                      setTitle(e.target.value)
                    }}
                    value={title}
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

                  {!editBuilding ? (
                    <EditField
                      label='ساختمان'
                      // --- >>> needs to change
                      text={(!!initBuilding && initBuilding.tittle) || "_"}
                      setEdit={setEditBuilding}
                    />
                  ) : (
                    <SearchAutoComplete
                      label='ساختمان'
                      placeholder='مثال: ساختمان پرند طبقه 1'
                      onChange={handleBuildingChange}
                      options={myBuildingsList}
                      onFocus={() => handleFocus("building")}

                      handleType={(e) => handleSearch(e, 'building')}
                    />
                  )}

                  <div />

                  <FormField
                    label='طبقه'
                    ltr='true'
                    // center='true'
                    name='count_floor'
                    onChange={(e) => {
                      setFloor(e.target.value)
                    }}
                    onBlur={blurCheck}
                    error={validFloor}
                    value={floor}
                    type='Number'
                    helperText={
                      validFloor === "empty" ? "ورود شماره طبقه الزامی است" : ""
                    }
                  />

                  <FormField
                    label='واحد'
                    // center='true'
                    ltr='true'
                    name='unit'
                    value={unit}
                    onChange={(e) => {
                      setUnit(e.target.value)
                    }}
                    maxLength={4}
                    onBlur={blurCheck}
                    error={validUnit}
                    type='Number'
                    helperText={
                      validUnit === "empty" ? "ورود شماره واحد الزامی است" : ""
                    }
                  />

                  <FormField
                    label='شماره سند'
                    // center='true'
                    ltr='true'
                    value={doncNum}
                    name='doc_number'
                    onChange={(e) => setDocNum(e.target.value)}
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
                    label='کد پستی'
                    ltr='true'
                    name='postal_code'
                    // center='true'
                    value={postCode}
                    onChange={(e) => setPostCode(e.target.value)}
                    maxLength={10}
                    onBlur={blurCheck}
                    error={validPostalCode}
                    type='Number'
                    helperText={
                      validPostalCode === "short"
                        ? "لطفا کد پستی را کامل وارد کنید"
                        : ""
                    }
                  />

                  <FormField
                    label='مساحت واحد'
                    ltr='true'
                    // center='true'
                    name='space'
                    value={space}
                    onChange={(e) => setSpace(e.target.value)}
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

                  <FormDropDown
                    label='نوع کاربری'
                    value={unitUsage}
                    onChange={handleUnitUsage}
                    name='usage_type'
                    options={usageItems}
                  />

                  <FormField
                    label='وضعیت بهره برداری'
                    name='construction_stage'
                    onChange={(e) => setStage(e.target.value)}
                    value={stage}
                    onBlur={blurCheck}
                    error={validStage}
                    helperText={
                      validStage === "short" ? "مقدار وارد شده نامعتبر است" : ""
                    }
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
                      objId={unitId}
                    />
                  })}

                </div>


              </div>
            )}
        </MainCol>
        <SideCol qr={defaultQR} />
      </div>
    </div>
  )
}

export default EditUnit
