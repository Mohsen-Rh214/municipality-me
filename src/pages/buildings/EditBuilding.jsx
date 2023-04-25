import React, { useState, useEffect } from "react"
import { useNavigate, useParams } from "react-router-dom"
import { mayadinAx } from "../../services/AxiosRequest"
import moment from "moment-jalaali"

// style
import style from "./building.module.css"
import titleIcon from "../../assets/svg/building-title-icon.svg"
import infoChip from "../../assets/svg/building-chip-info.svg"
import cloudIcon from "../../assets/svg/personal-chip-cloud.svg"
import defaultQR from "../../assets/img/default-qr.png"
import loadingSvg from "../../assets/svg/loading.svg"

// custom components
import ActionBar from "../../components/layout/ActionBar"
import MainCol from "../../components/containers/MainCol"
import SideCol from "../../components/containers/SideCol"
import FormChip from "../../components/form/FormChip"
import FormField from "../../components/form/FormField"
import FormDivider from "../../components/form/FormDivider"
import UploadContainer from "../../components/form/UploadContainer"
import SearchAutoComplete from "../../components/form/SearchAutoComplete"
// import PField from "../../components/form/PField"
import FormDropDown from "../../components/form/FormDropDown"
import { p2e } from "../../utils/convertNumerics"
import WideField from "../../components/form/WideField"
import EditField from "../../components/form/EditField"


const EditBuilding = () => {
    // navigations
    const navigate = useNavigate()

    // id from url
    const { buildingId } = useParams()

    // form values and validations
    const [isLoading, setIsLoading] = useState(false)
    const [buildingData, setBuildingData] = useState()
    const [loadingPage, setIsLoadingPage] = useState(true)

    const endpoint = `building/api/Building/${buildingId}/`

    const getDetails = () => {
        mayadinAx.get(endpoint)
            .then(res => {
                setBuildingData(res.data)
                console.log('res: ', res.data)
            })
            .catch((e) => {
                console.log('error :', e)
                setBuildingData('empty')
            })
            .finally(() => setIsLoadingPage(false))
    }

    useEffect(() => {
        getDetails()
    }, [])











    //   init States
    const initTitle = buildingData !== undefined && buildingData.tittle
    const initLand = buildingData !== undefined && buildingData.ground
    const initOwner = buildingData !== undefined && buildingData.manager
    const initDocNum = buildingData !== undefined && buildingData.doc_number
    const initSpace = buildingData !== undefined && buildingData.space
    const initUnitCount = buildingData !== undefined && buildingData.count_unit
    const initBuildYear = buildingData !== undefined && buildingData.year_of_construction
    const initFloorCount = buildingData !== undefined && buildingData.count_floor
    const initBuildingType = buildingData !== undefined && buildingData.building_type
    const initUseType = buildingData !== undefined && buildingData.usage_type
    const initPose = buildingData !== undefined && buildingData.terminal
    const initUseStage = buildingData !== undefined && buildingData.construction_stage
    const initStatus = buildingData !== undefined && buildingData.status
    const initSheba = buildingData !== undefined && buildingData.sheba_number
    const initDesc = buildingData !== undefined && buildingData.descriptions
    const initAddress = buildingData !== undefined && buildingData.address

    //   states
    const [landList, setLandList] = useState([])
    const [ownerList, setOwnerList] = useState([])
    const [poseList, setPoseList] = useState([])
    const [addressList, setAddressList] = useState([])

    const [land, setLand] = useState(null)
    const [owner, setOwner] = useState(null)
    const [pose, setPose] = useState(null)
    const [address, setAddress] = useState(null)

    // - Fields
    const [title, setTitle] = useState(null)
    const [space, setSpace] = useState(null)
    const [docNum, setDocNum] = useState(null)
    const [buildYear, setBuildYear] = useState(null)
    const [unitCount, setUnitCount] = useState(null)
    const [floorCount, setFloorCount] = useState(null)
    const [buildType, setBuildType] = useState(null)
    const [useStage, setUseStage] = useState(null)
    const [sheba, setSheba] = useState(null)
    const [description, setDescription] = useState(null)

    // dropdown
    const [useType, setUseType] = useState()
    const [buildingStatus, setBuildingStatus] = useState()

    // edit button flags
    const [editLand, setEditLand] = useState()
    const [editOwner, setEditOwner] = useState()
    const [editPose, setEditPose] = useState()
    const [editAddress, setEditAddress] = useState()

    // -- initialize init states
    useEffect(() => {
        if (buildingData !== []) {
            // text field
            setTitle(initTitle || null)
            setSpace(initSpace || null)
            setDocNum(initDocNum || null)
            setBuildYear(initBuildYear || null)
            setUnitCount(initUnitCount || null)
            setFloorCount(initFloorCount || null)
            setBuildType(initBuildingType || null)
            setUseStage(initUseStage || null)
            setSheba(initSheba || null)
            setDescription(initDesc || null)

            // sort fields
            setUseType(initUseType || null)
            setBuildingStatus(initStatus || null)

            // autocomplete fields
            setLand(initLand || null)
            setOwner(initOwner?.id || null)
            setPose(initPose || null)
            setAddress(initAddress || null)


            console.log('init owner: ', initAddress)
        }
    }, [buildingData])








    // ---- >> **** AutoComplete Fields **** << ----
    const landApi = { endpoint: `ground/api/Ground/`, fields: 'id,doc_number,tittle,usage_type' }
    const ownerApi = { endpoint: `auth/api/Citizen/`, fields: 'id,first_name,last_name,national_code' }
    const addressApi = { endpoint: `location/api/UserAddress/`, fields: null }
    const poseApi = { endpoint: 'payment/api/Pose/', fields: 'name,id' }

    // api call for autoComplete lists
    const dataForSearchFields = (objApi, setList, search) => {
        const { endpoint, fields } = objApi

        if (!endpoint) return
        if (!setList) return

        if (isLoading === false) {
            if (search) {

                setIsLoading(true)
                mayadinAx
                    .get(endpoint, { params: { search, fields } })
                    .then((respond) => {
                        // console.log("res with: ", respond)
                        setTimeout(() => {
                            setList(respond.data.results)

                            if (respond.data.results.features) {
                                setList(respond.data.results.features)
                            }
                        }, 200)
                    })
                    .catch((e) => console.log("error: ", e))
                    .finally(() => setIsLoading(false))
            } else {

                setIsLoading(true)
                mayadinAx
                    .get(endpoint, { params: { fields } })
                    .then((respond) => {
                        console.log("res with: ", respond)
                        setTimeout(() => {
                            setList(respond.data.results)

                            if (respond.data.results.features) {
                                setList(respond.data.results.features)
                            }
                        }, 500)
                    })
                    .catch((e) => console.log("error: ", e))
                    .finally(() => setIsLoading(false))
            }
        }
    }

    // triggers api for lists on click
    const handleFocus = (button) => {
        switch (button) {

            case "land":
                dataForSearchFields(landApi, setLandList)
                break

            case "owner":
                dataForSearchFields(ownerApi, setOwnerList)
                break

            case "pose":
                dataForSearchFields(poseApi, setPoseList)
                break

            case "address":
                dataForSearchFields(addressApi, setAddressList)
                break

        }
    }

    // Search -- >> for search autocomplete components
    const handleSearch = (e, button) => {
        const mySearch = e.target.value

        switch (button) {
            case "land":
                dataForSearchFields(landApi, setLandList, mySearch)
                break

            case "owner":
                dataForSearchFields(ownerApi, setOwnerList, mySearch)
                break

            case "pose":
                dataForSearchFields(poseApi, setPoseList, mySearch)
                break

            case "address":
                dataForSearchFields(addressApi, setAddressList, mySearch)
                break
        }
    }

    // AutoComplete lists
    const myLandList =
        landList !== []
            ? landList.map((item, index) => ({
                id: item.id,
                label: `${item.doc_number} | ${item.tittle} | ${item.usage_type}`,
            }))
            : {
                id: 0,
                label: `اطلاعاتی یافت نشد`,
            }

    const myOwnerList =
        ownerList !== []
            ? ownerList.map((item, index) => ({
                id: item.id,
                label: `${item.first_name} ${item.last_name} | ${item.national_code}`,
            }))
            : {
                id: 0,
                label: `اطلاعاتی یافت نشد`,
            }

    const myPoseList =
        poseList !== []
            ? poseList.map((item, index) => ({
                id: item.id,
                label: `${item.id} | ${item.name}`,
            }))
            : {
                id: 0,
                label: `اطلاعاتی یافت نشد`,
            }

    const myAddressList =
        addressList !== []
            ? addressList.map((item, index) => ({
                id: item.id,
                label: `${item.properties.short_name} / ${item.properties.address}`,
            }))
            : {
                id: 0,
                label: `اطلاعاتی یافت نشد`,
            }








    // --- *** >>> Handlers <<< *** ---

    // AutoComplete Handlers
    const handleLandChange = (event, newValue) => {
        setBuildingData({
            ...buildingData,
            ground: newValue.id,
        })
        setLand(newValue)
    }

    const handleOwnerChange = (event, newValue) => {
        setBuildingData({
            ...buildingData,
            manager: newValue.id,
        })
        setOwner(newValue.id)
    }

    const handlePoseChange = (event, newValue) => {
        setBuildingData({
            ...buildingData,
            terminal: newValue.id,
        })
        setPose(newValue)
    }

    const handleAddressChange = (event, newValue) => {
        setBuildingData({
            ...buildingData,
            address: newValue.id,
        })
        setAddress(newValue.id)

        console.log('nwq value: ', newValue)
    }

    //   value for simple text fields with name
    const handleChange = (event) => {
        setBuildingData({
            ...buildingData,
            [event.target.name]: event.target.value,
        })
    }

    // values for dropdown components
    const useTypeItems = [
        { label: "تجاری", value: "تجاری" },
        { label: "اداری", value: "اداری" },
        { label: "مسکونی", value: "مسکونی" },
    ]


    const buildingStatusItems = [
        { label: 'فعال', value: 'E' },
        { label: 'غیر فعال', value: 'B' }
    ]

    // -- >> Dropdown values 
    const handleDropdownChange = (e, setValue) => {
        setBuildingData({
            ...buildingData,
            [e.target.name]: e.target.value,
        })
        setValue(e.target.value)
    }











    // --- *** >>> VALIDATIONS <<< *** ---

    // -- -- Validate every field on onBlur event

    // just simple textfields
    const [validTitle, setValidTitle] = useState(false)
    const [validDocNum, setValidDocNum] = useState(false)
    const [validSpace, setValidSpace] = useState(false)
    const [validUnitCount, setValidUnitCount] = useState(false)
    const [validBuildYear, setValidBuildYear] = useState(false)
    const [validFloorCount, setValidFloorCount] = useState()
    const [validBuildingType, setValidBuildingType] = useState(false)
    const [validUseStage, setValidUseStage] = useState(false)
    const [validSheba, setValidSheba] = useState(false)
    const [validDescriptions, setValidDescriptions] = useState(false)

    // for build year to be maximum current year
    const currentYear = moment().format("jYYYY")

    // - this function triggers after lost focus
    const blurCheck = (e) => {
        const value = e.target.value
        const name = e.target.name

        switch (name) {
            case 'tittle':
                !value
                    ? setValidTitle("empty")
                    : value.length < 3
                        ? setValidTitle("short")
                        : setValidTitle(false)
                break;

            case "doc_number":
                !value
                    ? setValidDocNum("empty")
                    : value.length < 4
                        ? setValidDocNum("short")
                        : value.length > 16
                            ? setValidDocNum("long")
                            : value < 1
                                ? setValidDocNum("invalid")
                                : setValidDocNum(false)
                break;

            case "space":
                !value
                    ? setValidSpace("empty")
                    : value.length < 2
                        ? setValidSpace("short")
                        : value.length > 6
                            ? setValidSpace("long")
                            : value < 1
                                ? setValidSpace("invalid")
                                : setValidSpace(false)
                break;

            case "count_unit":
                !value ? setValidUnitCount("empty")
                    : value < 1
                        ? setValidUnitCount('min')
                        : value > 360
                            ? setValidUnitCount('max')
                            : setValidUnitCount(false)
                break;

            case "year_of_construction":
                !value ? setValidBuildYear("empty")
                    : value < 1320
                        ? setValidBuildYear('min')
                        : value > p2e(currentYear)
                            ? setValidBuildYear('max')
                            : setValidBuildYear(false)
                break;

            case "count_floor":
                !value ? setValidFloorCount("empty")
                    : value > 150
                        ? setValidFloorCount('max')
                        : value < 1
                            ? setValidFloorCount("invalid")
                            : setValidFloorCount(false)
                break;

            case 'building_type':
                value && value.length < 3
                    ? setValidBuildingType("short")
                    : value.length > 32
                        ? setValidBuildingType('long')
                        : setValidBuildingType(false)
                break;

            case "construction_stage":
                value
                    && value.length < 3
                    ? setValidUseStage("short")
                    : setValidUseStage(false)
                break;

            case "sheba_number":
                !value
                    ? setValidSheba("empty")
                    : value.length < 22
                        ? setValidSheba("short")
                        : value.length > 22
                            ? setValidSheba("long")
                            : value < 1
                                ? setValidSheba("invalid")
                                : setValidSheba(false)
                break;

            case "descriptions":
                value
                    && value.length < 3
                    ? setValidDescriptions("short")
                    : setValidDescriptions(false)
                break;

            default:
                break;
        }
    }

    /// -- >>> Check before submit, if Form is valid
    const [isEmpty, setIsEmpty] = useState(false)
    // const [errorMsg, setErrorMsg] = useState(null)

    const checkValidForm = () => {
        if (validTitle ||
            validDocNum ||
            validSpace ||
            validUnitCount ||
            validBuildYear ||
            validFloorCount ||
            validBuildingType ||
            validSheba === undefined
        ) {
            console.log(
                'empty fields: ',
                validTitle,
                validDocNum,
                validSpace,
                validUnitCount,
                validBuildYear,
                validFloorCount,
                validSheba
            )

            if (land.id || owner || pose || address ||
                title || space || docNum || buildYear ||
                unitCount || floorCount || useStage || sheba ||
                description || buildType === null) {
                setIsEmpty(true)
                return false
            }
        } else {
            setIsEmpty(false)
            return true
        }
    }









    // --- *** >>> Api Call <<< *** ---

    const [loading, setLoading] = useState(false)
    // const endpoint = 'building/api/Building/'

    const handleSubmit = () => {

        if (checkValidForm() === true) {
            setLoading(true)

            mayadinAx.patch(endpoint, {
                ground: !editLand ? land?.id : land,
                tittle: title,
                manager: !editOwner ? owner : owner,
                doc_number: docNum,
                space,
                count_unit: unitCount,
                year_of_construction: buildYear,
                count_floor: floorCount,
                building_type: buildType,
                usage_type: useType,
                construction_stage: useStage,
                sheba_number: sheba,
                address: !editAddress ? address : address,
                descriptions: description,
                terminal: !editPose ? pose?.id : pose,
            })
                .then((res) => {
                    console.log('res: ', res)
                    setIsEmpty(false)
                    setTimeout(() => {
                        navigate(-1, { replace: true })
                    }, 500);
                })
                .catch((e) => {
                    console.log('error: ', e)

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



    // *** ---- >>> U P L O A D <<< ---- *** //
    const ContentTypeId = 11 // -- > backend id for building: building

    const uploadContainersList = [

        { id: 1, desc: 'تصویر سند', attach: false },
        { id: 2, desc: 'افزودن پرونده دیگر', attach: true },

    ]
    return (
        <div className='page'>
            <ActionBar title='ویرایش ساختمان' icon={titleIcon} />

            <div className="page_body_row">


                <MainCol
                    confirmText='تائید اطلاعات'
                    onConfirm={handleSubmit}
                    isLoading={loading}
                    deleteText='انصراف'
                    onDelete={() => navigate(-1, { replace: true })}

                    error={isEmpty}
                // errorMsg={errorMsg}
                >

                    {loadingPage === true ? (
                        <div className={style.loadingPage}>
                            <p>در حال بارگزاری</p>
                            <p>لطفا شکیبا باشید</p>
                            <img src={loadingSvg} alt='' />
                        </div>
                    ) : buildingData === 'empty' ?
                        <div className='loadingPage'>
                            <h2 style={{ color: 'white' }}>اطلاعاتی یافت نشد!</h2>
                        </div> : (
                            <div className="form">
                                <FormChip text='اطلاعات ساختمان' icon={infoChip} />

                                <div className='form_part1'>

                                    {!editLand

                                        ? <EditField
                                            label='زمین مورد نظر'
                                            text={!!land && land.tittle || '-'}
                                            setEdit={setEditLand}
                                        />
                                        :
                                        <SearchAutoComplete
                                            label='زمین مورد نظر'
                                            name='ground'

                                            onFocus={() => handleFocus("land")}
                                            handleType={(e) => handleSearch(e, 'land')}

                                            options={myLandList}
                                            onChange={handleLandChange}
                                        />
                                    }


                                    <FormField
                                        label='عنوان'
                                        name='tittle'

                                        value={title}

                                        onChange={handleChange}

                                        onBlur={blurCheck}
                                        error={validTitle}
                                        helperText={
                                            validTitle === 'empty'
                                                ? 'عنوان نمیتواند خالی باشد'
                                                : validTitle === 'short'
                                                    ? 'عنوان وارد شده نامعتبر است'
                                                    : ''
                                        }
                                    />

                                    {/* <EditField /> */}

                                    {!editOwner
                                        ? <EditField
                                            label='مدیر'
                                            text={`${owner?.first_name} ${owner?.last_name}` || '-'}

                                            setEdit={setEditOwner}
                                        />

                                        : <SearchAutoComplete
                                            label='مدیر'
                                            name='manager'
                                            placeholder='جستجو با نام و نام خانوادگی'

                                            onFocus={() => handleFocus("owner")}
                                            handleType={(e) => handleSearch(e, 'owner')}

                                            options={myOwnerList}
                                            onChange={handleOwnerChange}
                                        />
                                    }

                                    <FormField
                                        label='شماره سند'
                                        name='doc_number'
                                        type='Number'
                                        ltr='true'

                                        value={docNum}

                                        onChange={handleChange}

                                        onBlur={blurCheck}
                                        error={validDocNum}
                                        helperText={
                                            validDocNum === 'empty'
                                                ? 'شماره سند نمیتواند خالی باشد'
                                                : validDocNum === 'short'
                                                    ? 'لطفا شماره سند را کامل وارد کنید'
                                                    : validDocNum === 'long'
                                                        ? 'از صحت شماره سند اطمینان حاصل کنید'
                                                        : validDocNum === 'invalid'
                                                            ? 'مقدار نامعتبر'
                                                            : ''
                                        }
                                    />

                                    <FormField label='مساحت'
                                        name='space'
                                        type='Number'
                                        ltr='true'

                                        value={space}

                                        onChange={handleChange}

                                        onBlur={blurCheck}
                                        error={validSpace}
                                        helperText={
                                            validSpace === "empty"
                                                ? "ورود مساحت الزامی است"
                                                : validSpace === 'invalid'
                                                    ? 'مقدار نامعتبر'
                                                    : validSpace === "short"
                                                        ? "لطفا مساحت را کامل وارد کنید"
                                                        : validSpace === "long"
                                                            ? "لطفا مطئن شوید مساحت وارد شده صحیح است"
                                                            : ""
                                        }
                                    />

                                    <FormField label='تعداد واحد'
                                        name='count_unit'
                                        type='Number'
                                        ltr='true'

                                        value={unitCount}

                                        onChange={handleChange}

                                        onBlur={blurCheck}
                                        error={validUnitCount}
                                        helperText={
                                            validUnitCount === "empty" ? "ورود تعداد واحد الزامی است"
                                                : validUnitCount === 'min'
                                                    ? 'حداقل این مقدار یک می‌باشد'
                                                    : validUnitCount === 'max'
                                                        ? 'لطفا از صحت مقدار وارد شده اطمینان کنید'
                                                        : ""
                                        }
                                    />

                                    <FormField label='سال ساخت'
                                        name='year_of_construction'
                                        type='Number'
                                        ltr='true'

                                        value={buildYear}

                                        onChange={handleChange}

                                        onBlur={blurCheck}
                                        error={validBuildYear}
                                        helperText={
                                            validBuildYear === 'empty'
                                                ? 'سال ساخت نمیتواند خالی باشد'
                                                : validBuildYear === 'min'
                                                    ? 'حداقل این مقدار 1320 می‌باشد'
                                                    : validBuildYear === 'max'
                                                        ? `حداکثر این مقدار ${currentYear} می‌باشد`
                                                        : ''
                                        }
                                    />

                                    <FormField label='تعداد طبقات'
                                        name='count_floor'
                                        type='Number'
                                        ltr='true'

                                        value={floorCount}

                                        onChange={handleChange}

                                        onBlur={blurCheck}
                                        error={validFloorCount}
                                        helperText={
                                            validFloorCount === 'empty'
                                                ? 'این مقدار نمیتواند خالی باشد'
                                                : validFloorCount === 'invalid'
                                                    ? 'مقدار نامعتبر'
                                                    : validFloorCount === 'max'
                                                        ? 'لطفا از صحت اطلاعات وارد شده اطمینان کنید'
                                                        : ''
                                        }
                                    />

                                    <FormField label='نوع سازه'
                                        name='building_type'

                                        value={buildType}

                                        onChange={handleChange}

                                        onBlur={blurCheck}
                                        error={validBuildingType}
                                        helperText={
                                            validBuildingType === 'empty'
                                                ? 'این مقدار نباید خالی باشد'
                                                : validBuildingType === 'short'
                                                    ? 'مقدار نامعتبر'
                                                    : validBuildingType === 'long'
                                                        ? 'حداکثر کاراکتر مجاز 32 می‌باشد'
                                                        : ''
                                        }
                                    />

                                    <FormDropDown
                                        label='نوع کاربری'
                                        name='usage_type'

                                        value={useType}
                                        options={useTypeItems}
                                        onChange={(e) => handleDropdownChange(e, setUseType)}
                                    />


                                    {!editPose
                                        ? <EditField
                                            label='دستگاه کارتخوان'

                                            text={pose?.name || '-'}
                                            setEdit={setEditPose}
                                        />

                                        : <SearchAutoComplete
                                            label='دستگاه کارتخوان'
                                            name='terminal'

                                            onFocus={() => handleFocus("pose")}
                                            handleType={(e) => handleSearch(e, 'pose')}

                                            options={myPoseList}
                                            onChange={handlePoseChange}
                                        />
                                    }
                                    {/* <div></div> */}

                                    <FormField
                                        label='وضعیت بهره برداری'
                                        name='construction_stage'

                                        value={useStage}
                                        onChange={handleChange}

                                        onBlur={blurCheck}
                                        error={validUseStage}
                                        helperText={
                                            validUseStage === "short"
                                                ? 'لطفا این مقدار را کامل وارد کنید یا خالی بگذارید'
                                                : ""
                                        }

                                    />

                                    <FormField
                                        label='شماره شبا'
                                        name='sheba_number'
                                        type='Number'
                                        ltr='true'

                                        value={sheba}
                                        onChange={handleChange}

                                        onBlur={blurCheck}
                                        error={validSheba}
                                        helperText={
                                            validSheba === 'empty'
                                                ? 'ورود شماره شبا الزامی است'
                                                : validSheba === 'short'
                                                    ? 'لطفا شماره شبا را کامل وارد کنید'
                                                    : validSheba === 'long'
                                                        ? 'لطفا از صحت شماره شبا اطمینان کنید'
                                                        : validSheba === 'invalid'
                                                            ? 'مقدار نامعتبر'
                                                            : ''
                                        }
                                    />

                                    {!editAddress
                                        ? <EditField
                                            label='آدرس'
                                            text={address?.address || '-'}
                                            setEdit={setEditAddress}
                                        />
                                        : <SearchAutoComplete
                                            label='آدرس'
                                            name='address'

                                            onFocus={() => handleFocus("address")}
                                            handleType={(e) => handleSearch(e, 'address')}

                                            options={myAddressList}
                                            onChange={handleAddressChange}
                                        />
                                    }

                                    <FormDropDown
                                        label='وضعیت ساختمان'
                                        name='status'

                                        value={buildingStatus}

                                        options={buildingStatusItems}
                                        onChange={(e) => handleDropdownChange(e, setBuildingStatus)}
                                    />
                                </div>
                                <div className='form_wide'
                                >
                                    <WideField
                                        label='توضیحات'
                                        name='descriptions'

                                        value={description}

                                        onChange={handleChange}

                                        onBlur={blurCheck}
                                        error={validDescriptions}
                                        helperText={
                                            validDescriptions === 'short'
                                                ? 'لطفا این مقدار را کامل وارد کنید یا خالی بگذارید'
                                                : ''
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
                                            objId={buildingId}
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

export default EditBuilding