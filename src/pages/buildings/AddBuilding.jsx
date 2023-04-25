import React, { useState } from "react"
import { useNavigate } from "react-router-dom"
import { mayadinAx } from "../../services/AxiosRequest"
import moment from "moment-jalaali"

// style
import style from "./building.module.css"
import titleIcon from "../../assets/svg/building-title-icon.svg"
import infoChip from "../../assets/svg/building-chip-info.svg"
import defaultQR from "../../assets/img/default-qr.png"

// custom components
import ActionBar from "../../components/layout/ActionBar"
import MainCol from "../../components/containers/MainCol"
import SideCol from "../../components/containers/SideCol"
import FormChip from "../../components/form/FormChip"
import FormField from "../../components/form/FormField"
import SearchAutoComplete from "../../components/form/SearchAutoComplete"
import FormDropDown from "../../components/form/FormDropDown"
import { p2e } from "../../utils/convertNumerics"
import WideField from "../../components/form/WideField"


const AddBuilding = () => {

    // navigations
    const navigate = useNavigate()

    // form values and validations
    // all data
    const [isLoading, setIsLoading] = useState(false)
    const [buildingData, setBuildingData] = useState()

    // Auto component lsit state variables
    const [landList, setLandList] = useState([])
    const [ownerList, setOwnerList] = useState([])
    const [poseList, setPoseList] = useState([])
    const [addressList, setAddressList] = useState([])

    // const [land, setLand] = useState(null)
    // const [owner, setOwner] = useState(null)
    // const [pose, setPose] = useState(null)
    // const [address, setAddress] = useState(null)

    // - Fields
    // const [title, setTitle] = useState(null)
    // const [space, setSpace] = useState(null)
    // const [docNum, setDocNum] = useState(null)
    // const [buildYear, setBuildYear] = useState(null)
    // const [unitCount, setUnitCount] = useState(null)
    // const [floorCount, setFloorCount] = useState(null)
    // const [buildType, setBuildType] = useState(null)
    // const [useStatus, setUseStatus] = useState(null)
    // const [sheba, setSheba] = useState(null)
    // const [description, setDescription] = useState(null)

    // -- >> Dropdown values 
    // const [useType, setUseType] = useState()
    // const [buildingStatus, setBuildingStatus] = useState()


    const landApi = { endpoint: `ground/api/Ground/`, fields: 'id,doc_number,tittle,usage_type' }
    const ownerApi = { endpoint: `auth/api/Citizen/`, fields: 'id,first_name,last_name,national_code' }
    const addressApi = { endpoint: `location/api/UserAddress/`, fields: null }
    const poseApi = { endpoint: 'payment/api/Pose/', fields: 'name,id' }

    // api call to get values above
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
        // setLand(newValue)
    }

    const handleOwnerChange = (event, newValue) => {
        setBuildingData({
            ...buildingData,
            manager: newValue.id,
        })
        // setOwner(newValue)
    }

    const handlePoseChange = (event, newValue) => {
        setBuildingData({
            ...buildingData,
            terminal: newValue.id,
        })
        // setPose(newValue)
    }

    const handleAddressChange = (event, newValue) => {
        setBuildingData({
            ...buildingData,
            address: newValue.id,
        })
        // setAddress(newValue)
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
    const [useType, setUseType] = useState(useTypeItems[0].value)
    const [buildingStatus, setBuildingStatus] = useState(buildingStatusItems[0].value)

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

    // 07 Farvardin => No need for these, Just use blurcheck
    const [validGround, setValidGround] = useState()
    const [validTitle, setValidTitle] = useState()
    const [validManager, setValidManager] = useState() // << -- Needs to be added
    const [validDocNum, setValidDocNum] = useState()
    const [validSpace, setValidSpace] = useState()
    const [validUnitCount, setValidUnitCount] = useState()
    const [validBuildYear, setValidBuildYear] = useState()
    const [validFloorCount, setValidFloorCount] = useState()
    const [validBuildingType, setValidBuildingType] = useState()
    const [validUseStage, setValidUseStage] = useState()
    const [validSheba, setValidSheba] = useState()
    const [validDescriptions, setValidDescriptions] = useState()

    // 07 Farvardin => keep this
    const [validations, setValidations] = useState()

    /// for build year to be maximum current year
    const currentYear = moment().format("jYYYY")

    // - this function triggers after lost focus
    const blurCheck = (e) => {
        const { value, name } = e.target

        let errorMessage = "";

        switch (name) {
            case 'ground':
                setErrorMessages({ ground: '' })

                !value
                    ? errorMessage = 'زمین نمیتواند خالی باشد'
                    : errorMessage = ''
                break;

            case 'tittle':
                setErrorMessages({ tittle: '' })

                !value
                    ? errorMessage = 'زمین نمیتواند خالی باشد'
                    : value.length < 3
                        ? errorMessage = 'عنوان وارد شده نامعتبر است'
                        : errorMessage = ''
                break;

            case "doc_number":

                // 07 Farvardin => change this to errorMessage = 'message'

                !value
                    ? setValidDocNum("empty")
                    : value.length < 4
                        ? setValidDocNum("short")
                        : value.length > 10
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


        if (errorMessages[name]) {
            errorMessage = errorMessages[name]
        }

        setValidations({ ...validations, [name]: errorMessage })
    }

    /// -- >>> Check before submit, if Form is valid
    const [isEmpty, setIsEmpty] = useState(false)

    const checkValidForm = () => {
        if (validGround ||
            validTitle ||
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

            // if (land || owner || pose || address ||
            //     title || space || docNum || buildYear ||
            //     unitCount || floorCount || useStatus || sheba ||
            //     description || buildType === null) {
            setIsEmpty(true)
            return false
            // }
        } else {
            setIsEmpty(false)
            return true
        }
    }


    /// -- >>> Validations check after submit

    // error object, set in axios.catch => returns object of {inputNmae: error}
    const [errorObject, setErrorObject] = useState(null)
    const [errorFlag, setErrorFlag] = useState(false)

    const [errorMessages, setErrorMessages] = useState({});

    const findErrorMsg = (name, setValidation) => {

        if (!errorObject) return

        // const keys = Object.keys(errorObject)
        console.log('run once')

        for (const key in errorObject) {

            console.log('run twice')

            if (key === name) {

                console.log('run three')

                setValidation('error')
                setErrorFlag(false)
                return 'error here'
            } else {

                console.log('run four')
                setErrorFlag(false)
                setValidation(false)
                return ''
            }
        }

        console.log('run five')


        return ''
    }




    // --- *** >>> Api Call <<< *** ---

    const [loading, setLoading] = useState(false)
    const endpoint = 'building/api/Building/'

    const handleSubmit = () => {

        if (checkValidForm() === true) {
            setLoading(true)

            mayadinAx.post(
                endpoint,
                {
                    ...buildingData,
                    usage_type: useType,
                    status: buildingStatus,
                }
            )
                .then((res) => {
                    setLoading(false)
                    setIsEmpty(false)
                    navigate(-1, { replace: true })
                })
                .catch((e) => {
                    console.log('error: ', e)

                    setIsEmpty('error')

                    if (e.response?.data) {
                        const data = e.response?.data

                        for (const key in data) {
                            setErrorMessages({ [key]: data[key] })
                        }
                        setErrorObject(data)
                        setErrorFlag(true)
                    }
                })
                .finally(() => setLoading(false))
        } else {
            checkValidForm()
        }
    }




    return (
        <div className='page'>
            <ActionBar title='افزودن ساختمان جدید' icon={titleIcon} />

            <div className='page_body_row'>



                <MainCol
                    confirmText={'تائید و ثبت'}
                    onConfirm={handleSubmit}
                    isLoading={loading}
                    deleteText='انصراف'
                    onDelete={() => navigate(-1, { replace: true })}

                    error={isEmpty}
                // errorMsg={errorMsg}
                >

                    <div className='form'>

                        <FormChip text='اطلاعات ساختمان' icon={infoChip} />

                        <div className='form_part1'>

                            <SearchAutoComplete
                                label='* زمین مورد نظر'
                                name='ground'

                                onFocus={() => handleFocus("land")}
                                handleType={(e) => handleSearch(e, 'land')}

                                options={myLandList}
                                onChange={handleLandChange}

                                onBlur={blurCheck}
                                error={validations?.ground || errorMessages?.ground}
                                helperText={validations?.ground || errorMessages?.ground || ""}
                            />

                            <FormField
                                label='* عنوان'
                                name='tittle'

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

                            <SearchAutoComplete
                                label='* مدیر'
                                name='manager'

                                placeholder='جستجو با نام و نام خانوادگی'

                                onFocus={() => handleFocus("owner")}
                                handleType={(e) => handleSearch(e, 'owner')}

                                options={myOwnerList}
                                onChange={handleOwnerChange}
                            />

                            <FormField
                                label='* شماره سند'
                                name='doc_number'
                                type='Number'
                                ltr='true'

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

                            <FormField
                                label='* مساحت'
                                name='space'
                                type='Number'
                                ltr='true'

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

                            <FormField
                                label='* تعداد واحد'
                                name='count_unit'
                                type='Number'
                                ltr='true'

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

                            <FormField
                                label='* سال ساخت'
                                name='year_of_construction'
                                type='Number'
                                ltr='true'

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

                            <FormField
                                label='* تعداد طبقات'
                                name='count_floor'
                                type='Number'
                                ltr='true'

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

                            <FormField
                                label='* نوع سازه'
                                name='building_type'

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


                            <SearchAutoComplete
                                label='* دستگاه کارتخوان'
                                name='terminal'

                                onFocus={() => handleFocus("pose")}
                                handleType={(e) => handleSearch(e, 'pose')}

                                options={myPoseList}
                                onChange={handlePoseChange}
                            />


                            <FormField
                                label='وضعیت بهره برداری'
                                name='construction_stage'

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
                                label='* شماره شبا'
                                name='sheba_number'
                                type='Number'
                                ltr='true'
                                ltr2='true'
                                placeholder='IR شماره شبا 22 رقمی بدون'

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


                            <SearchAutoComplete
                                label='* آدرس'
                                name='address'

                                onFocus={() => handleFocus("address")}
                                handleType={(e) => handleSearch(e, 'address')}

                                options={myAddressList}
                                onChange={handleAddressChange}
                            />

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

                    </div>

                </MainCol>


                <SideCol qr={defaultQR} add />

            </div>

        </div>
    )
}

export default AddBuilding