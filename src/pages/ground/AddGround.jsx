import React, { useState } from "react"
import { useNavigate } from "react-router-dom"
import { mayadinAx } from "../../services/AxiosRequest"

// style
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
import WideField from "../../components/form/WideField"


const AddGround = () => {

    // navigations
    const navigate = useNavigate()

    // form values and validations
    // all data
    const [isLoading, setIsLoading] = useState(false)
    const [buildingData, setBuildingData] = useState()

    // Auto component lsit state variables
    const [addressList, setAddressList] = useState([])

    const [address, setAddress] = useState(null)

    // - Fields

    // used for validation, not useful now.
    // const [title, setTitle] = useState(null)
    // const [space, setSpace] = useState(null)
    // const [docNum, setDocNum] = useState(null)
    // const [plate, setPlate] = useState(null)
    // const [description, setDescription] = useState(null)

    // -- >> Dropdown values 
    // const [useType, setUseType] = useState()
    // const [buildingStatus, setBuildingStatus] = useState()


    const addressApi = { endpoint: `location/api/UserAddress/`, fields: null }

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
                            setList(respond.data.results.features)
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
                            setList(respond.data.results.features)
                        }, 200)
                    })
                    .catch((e) => console.log("error: ", e))
                    .finally(() => setIsLoading(false))
            }
        }
    }

    // triggers api for lists on click
    const handleFocus = (button) => {
        switch (button) {

            case "address":
                dataForSearchFields(addressApi, setAddressList)
                break

        }
    }

    // Search -- >> for search autocomplete components
    const handleSearch = (e, button) => {
        const mySearch = e.target.value

        switch (button) {

            case "address":
                dataForSearchFields(addressApi, setAddressList, mySearch)
                break
        }
    }

    // AutoComplete lists
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
    const handleAddressChange = (event, newValue) => {
        setBuildingData({
            ...buildingData,
            address: newValue.id,
        })
        setAddress(newValue)
    }

    //   value for simple text fields with name
    const handleChange = (event, newEvent) => {
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
    const [validTitle, setValidTitle] = useState()
    const [validDocNum, setValidDocNum] = useState()
    const [validSpace, setValidSpace] = useState()
    const [valdiPlate, setValdiPlate] = useState()
    const [validDescriptions, setValidDescriptions] = useState()


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

            case "registration_plate":
                !value
                    ? setValdiPlate("empty")
                    : value.length < 2
                        ? setValdiPlate("short")
                        : value.length > 10
                            ? setValdiPlate("long")
                            : value < 1
                                ? setValdiPlate("invalid")
                                : setValdiPlate(false)
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
    const [errorMsg, setErrorMsg] = useState(null)

    const checkValidForm = () => {
        if (validTitle ||
            validDocNum ||
            valdiPlate ||
            validSpace === undefined
        ) {
            console.log(
                'empty fields: ',
                validTitle,
                validDocNum,
                validSpace,
            )

            // if (address ||
            //     title || space || docNum ||
            //     description || useType === null) {
            setIsEmpty(true)
            return false
            // }
        } else {
            setIsEmpty(false)
            return true
        }
    }






    // --- *** >>> Api Call <<< *** ---

    const [loading, setLoading] = useState(false)
    let endpoint = `/ground/api/Ground/`

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
        <div className="page">
            <ActionBar title='افزودن زمین جدید' icon={titleIcon} />

            <div className="page_body_row">

                <MainCol
                    confirmText={'تائید و ثبت'}
                    onConfirm={handleSubmit}
                    deleteText='انصراف'
                    onDelete={() => navigate(-1, { replace: true })}
                    isLoading={loading}

                    error={isEmpty}
                // errorMsg={errorMsg}
                >


                    <div className="form">
                        <FormChip text='اطلاعات زمین' icon={infoChip} />

                        <div className="form_part1">

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

                            <div></div>

                            <SearchAutoComplete
                                label='* آدرس'
                                name='address'

                                onFocus={() => handleFocus("address")}
                                handleType={(e) => handleSearch(e, 'address')}

                                options={myAddressList}
                                onChange={handleAddressChange}
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
                                label='* پلاک ثبتی'
                                name='registration_plate'
                                type='Number'
                                ltr='true'

                                onChange={handleChange}

                                onBlur={blurCheck}
                                error={valdiPlate}
                                helperText={
                                    valdiPlate === "empty"
                                        ? "ورود پلاک الزامی است"
                                        : valdiPlate === 'invalid'
                                            ? 'مقدار نامعتبر'
                                            : valdiPlate === "short"
                                                ? "لطفا پلاک را کامل وارد کنید"
                                                : valdiPlate === "long"
                                                    ? "لطفا مطئن شوید پلاک وارد شده صحیح است"
                                                    : ""
                                }
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


                            <FormDropDown
                                label='وضعیت ساختمان'
                                name='status'

                                value={buildingStatus}
                                options={buildingStatusItems}
                                onChange={(e) => handleDropdownChange(e, setBuildingStatus)}
                            />

                            <FormDropDown
                                label='نوع کاربری'
                                name='usage_type'

                                value={useType}
                                options={useTypeItems}
                                onChange={(e) => handleDropdownChange(e, setUseType)}
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

export default AddGround