import React, { useState, useEffect } from "react"
import { useNavigate, useParams } from "react-router-dom"
import { mayadinAx } from "../../services/AxiosRequest"
import moment from "moment-jalaali"

// style
// import infoChip from "../../assets/svg/building-chip-info.svg"
import defaultQR from "../../assets/img/default-qr.png"
import loadingSvg from "../../assets/svg/loading.svg"
import titleIcon from "../../assets/svg/personal-title-icon.svg"
import personalInfoIcon from "../../assets/svg/personal-chip-personal.svg"
import callInfoIcon from "../../assets/svg/personal-chip-call.svg"
import cloudIcon from "../../assets/svg/personal-chip-cloud.svg"

// custom components
import ActionBar from "../../components/layout/ActionBar"
import MainCol from "../../components/containers/MainCol"
import SideCol from "../../components/containers/SideCol"
import FormChip from "../../components/form/FormChip"
import FormField from "../../components/form/FormField"
// import FormDropDown from "../../components/form/FormDropDown"
// import WideField from "../../components/form/WideField"
import FormRadioGroup from "../../components/form/FormRadioGroup"
import FormRadio from "../../components/form/FormRadio"
import DateField from "../../components/form/DateField"
import AddressBtn from "../../components/form/AddressBtn"
import AddressField from "../../components/form/AddressField"
import FormDivider from "../../components/form/FormDivider"
import UploadContainer from "../../components/form/UploadContainer"
import { p2e } from "../../utils/convertNumerics"
import AddressModal from "../address/AddressModal"
import AddAddress from "../address/AddAddress"

const EditPerson = () => {


    // navigations
    const navigate = useNavigate()

    // id from url
    const { personId } = useParams()

    // form values and validations
    const [personData, setPersonData] = useState([])
    const [loadingPage, setIsLoadingPage] = useState(true)

    let endpoint = `auth/api/Citizen/${personId}/`

    const getDetails = () => {
        mayadinAx.get(endpoint)
            .then(res => {
                setPersonData(res.data)
                console.log('ress: ', res.data)
            })
            .catch((e) => {
                console.log('error :', e)
                setPersonData('empty')
            })
            .finally(() => setIsLoadingPage(false))
    }

    // get details at first render
    useEffect(() => {
        getDetails()
    }, [])


    //   init States
    const initFirst = personData !== undefined && personData.first_name
    const initLast = personData !== undefined && personData.last_name
    const initFather = personData !== undefined && personData.father_name
    const initGender = personData !== undefined && personData.gender
    const initCerti = personData !== undefined && personData.certificate_number
    const initNatNum = personData !== undefined && personData.national_code
    const initBirth = personData !== undefined && personData.birth_date
    const initBirthCity = personData !== undefined && personData.birth_location
    const initGetCertCity = personData !== undefined && personData.certificate_get_city
    // const initProvince = personData !== undefined && personData.address?.state_name
    // const initCity = personData !== undefined && personData.address?.city_name
    const initPost = personData !== undefined && personData.post_code
    const initAddress = personData !== undefined && personData.address
    const initMobile = personData !== undefined && personData.mobile_number
    const inithomeNum = personData !== undefined && personData.home_number
    const initEmail = personData !== undefined && personData.email

    // Variables & States
    const [firstName, setFirstName] = useState(null)
    const [lastName, setLastName] = useState(null)
    const [father, setFather] = useState(null)
    const [gender, setGender] = useState(null)
    const [certificateNum, setCertificateNum] = useState(null)
    const [nationNum, setNationNum] = useState(null)

    const [birthday, setBirthday] = useState(null)
    const [editBirthday, setEditBirthday] = useState(null)

    const [birthCity, setBirthCity] = useState() // init undefined, neccessary
    const [getCertCity, setGetCertCity] = useState(null)
    // const [province, setProvince] = useState(null)
    // const [city, setCity] = useState(null)
    const [postaltCode, setPostaltCode] = useState(null)
    const [address, setAddress] = useState(null)
    const [mobileNum, setMobileNum] = useState(null)
    const [homeNum, setHomeNum] = useState(null)
    const [email, setEmail] = useState(null)



    // -- initialize init states
    useEffect(() => {
        if (personData !== []) {
            // text field
            setFirstName(initFirst || null)
            setLastName(initLast || null)
            setFather(initFather || null)
            setGender(initGender || null)
            setCertificateNum(initCerti || null)
            setNationNum(initNatNum || null)
            setBirthday(initBirth || null)
            setBirthCity(initBirthCity || null)
            setGetCertCity(initGetCertCity || null)
            // setProvince(initProvince || null)
            // setCity(initCity || null)
            setPostaltCode(initPost || null)
            setAddress(initAddress || null)
            setMobileNum(initMobile || null)
            setHomeNum(inithomeNum || null)
            setEmail(initEmail || null)

            setEditBirthday(false)
        }
    }, [personData])

    // --- *** >>> Handlers <<< *** --- //

    //   value for simple text fields with name
    const handleChange = (event, newEvent) => {
        setPersonData({
            ...personData,
            [event.target.name]: event.target.value,
        })
    }


    // get address from modal
    const onSelectAddress = (a) => {
        setAddress({
            address: a.properties?.address,
            id: a.id,
            short_name: a.properties?.short_name,
        })

        // set validation to no error
        setValidAddress(false)
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



    // --- *** >>> VALIDATIONS <<< *** ---

    // -- -- Validate every field on onBlur event
    const [validFirstName, setValidFirstName] = useState(false)
    const [validLastName, setValidLastName] = useState(false)
    const [validFathersName, setValidFathersName] = useState(false)
    const [validIdCode, setValidIdCode] = useState(false)
    const [validNationalCode, setValidNationalCode] = useState(false)
    const [validBirthDay, setValidBirthday] = useState(false)
    const [validBirthPlace, setValidBirthPlace] = useState(false)
    // const [validProvince, setValidProvince] = useState()
    const [validPostalCode, setValidPostalCode] = useState(false)
    const [validAddress, setValidAddress] = useState(false)
    const [validMobileNumber, setValidMobileNumber] = useState(false)
    const [validTelephone, setValidTelephone] = useState(false)
    const [validEmail, setValidEmail] = useState(false)

    // - this function triggers after lost focus
    const blurCheck = (e) => {
        const value = e.target.value
        switch (e.target.name) {
            case "first_name":
                !value
                    ? setValidFirstName("empty")
                    : value.length < 3
                        ? setValidFirstName("short")
                        : setValidFirstName(false)
                return
            case "last_name":
                !value
                    ? setValidLastName("empty")
                    : value.length < 3
                        ? setValidLastName("short")
                        : setValidLastName(false)
                return
            case "father_name":
                !value
                    ? setValidFathersName("empty")
                    : value.length < 3
                        ? setValidFathersName("short")
                        : setValidFathersName(false)
                return
            case "certificate_number":
                !value
                    ? setValidIdCode("empty")
                    : value.length < 10
                        ? setValidIdCode("short")
                        : value.length > 10
                            ? setValidIdCode("long")
                            : setValidIdCode(false)
                return
            case "national_code":
                !value
                    ? setValidNationalCode("empty")
                    : value.length < 10
                        ? setValidNationalCode("short")
                        : value.length > 10
                            ? setValidNationalCode("long")
                            : setValidNationalCode(false)
                return
            case "birth_date":
                !value ? setValidBirthday("empty") : setValidBirthday(false)
                return
            case "post_code":
                !value
                    ? setValidPostalCode("empty")
                    : value.length < 10
                        ? setValidPostalCode("short")
                        : value.length > 10
                            ? setValidPostalCode("long")
                            : setValidPostalCode(false)
                return
            case "address":
                !value
                    ? setValidAddress("empty")
                    : value.length < 3
                        ? setValidAddress("short")
                        : setValidAddress(false)
                return
            case "mobile_number":
                !value
                    ? setValidMobileNumber("empty")
                    : value.length < 10
                        ? setValidMobileNumber("short")
                        : value.length > 10
                            ? setValidMobileNumber("long")
                            : setValidMobileNumber(false)
                return

            case "email":
                !value
                    ? setValidEmail("empty")
                    : value.length < 4
                        ? setValidEmail("short")
                        : value.length > 30
                            ? setValidEmail("long")
                            : setValidEmail(false)
                return

            default:
                return false
        }
    }


    // -- check if any field is empty before submit
    const [isEmpty, setIsEmpty] = useState(false)
    // const [errorMsg, setErrorMsg] = useState(null)

    const checkValidForm = () => {


        if (validFirstName ||
            validLastName ||
            validFathersName ||
            validIdCode ||
            validPostalCode ||
            validAddress ||
            validMobileNumber || validEmail === undefined
        ) {
            console.log(
                "field empty: ",
                validFirstName,
                validLastName,
                validFathersName,
                validIdCode,
                validPostalCode,
                validAddress,
                validMobileNumber
            )

            setIsEmpty(true)
            return false

        } else if ((address || gender) === null) {

            console.log('empty fields: ', address, gender)
            // console.log('is equal? ', address || gender === null)

            setIsEmpty(true)
            return false

        } else {

            setIsEmpty(false)
            return true
        }
    }




    // --- *** >>> Api Call <<< *** ---

    const [loading, setLoading] = useState(false)

    const handleSubmit = () => {

        if (checkValidForm() === true) {
            setLoading(true)

            mayadinAx.put(endpoint, {
                first_name: firstName,
                last_name: lastName,
                gender: gender,
                certificate_number: certificateNum,
                national_code: nationNum,
                birth_date: !editBirthday ? timetoShow(birthday, 'api2') : timetoShow(birthday, 'api'),
                birth_location: birthCity,
                certificate_get_city: getCertCity,
                post_code: postaltCode,
                address: address.id,
                mobile_number: mobileNum,
                home_number: homeNum,
                email,
            })
                .then((res) => {
                    console.log('response: ', res)
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




    // *** ---- >>> MODAL <<< ---- *** //
    const [openAddress, setOpenAddress] = useState(false)
    const onClose = () => setOpenAddress(false)

    const [openAdd, setOpenAdd] = useState()
    const onCloseAdd = () => setOpenAdd(false)








    // *** ---- >>> U P L O A D <<< ---- *** //

    const uploadContainersList = [
        { id: 1, desc: 'تصویر روی کارت ملی', attach: false },
        { id: 2, desc: 'تصویر پشت کارت ملی', attach: false },
        { id: 3, desc: 'صفحه اول شناسنامه', attach: false },
        { id: 4, desc: 'صفحه دوم شناسنامه', attach: false },
        { id: 5, desc: 'صفحه سوم شناسنامه', attach: false },
        { id: 6, desc: 'الحاقیه', attach: true },
    ]

    const ContentTypeId = 2 // -- > backend id for accounts: user

    return (
        <>
            {/* modal to select address */}
            <AddressModal
                open={openAddress}
                onClose={onClose}
                openAdd={() => setOpenAdd(true)}
                onSelect={onSelectAddress}
            />

            {/* modal to add address */}
            <AddAddress open={openAdd} onClose={onCloseAdd} />

            <div className='page'>
                <ActionBar title='ویرایش اطلاعات فرد' icon={titleIcon} />
                <div className='page_body_row'>
                    <MainCol
                        confirmText='تائید اطلاعات'
                        onConfirm={handleSubmit}
                        deleteText='انصراف'
                        onDelete={() => navigate(-1, { replace: true })}
                        isLoading={loading}

                        error={isEmpty}
                    // errorMsg={errorMsg}
                    >


                        {loadingPage === true ? (
                            <div className='loadingPage'>
                                <p>در حال بارگزاری</p>
                                <p>لطفا شکیبا باشید</p>
                                <img src={loadingSvg} alt='' />
                            </div>
                        ) : personData === 'empty' ?
                            <div className='loadingPage'>
                                <h2 style={{ color: 'white' }}>اطلاعاتی یافت نشد!</h2>
                            </div> : (
                                <div className='form'>
                                    <FormChip text='اطلاعات شخصی' icon={personalInfoIcon} />
                                    <div className='form_part1'>
                                        <FormField
                                            label='* نام'
                                            name='first_name'

                                            value={firstName}
                                            onChange={handleChange}

                                            onBlur={blurCheck}
                                            error={validFirstName}
                                            helperText={
                                                validFirstName === "empty"
                                                    ? "نام نمیتواند خالی باشد"
                                                    : validFirstName === "short"
                                                        ? "لطفا نام را کامل وارد کنید"
                                                        : ""
                                            }
                                        />

                                        <FormField
                                            label='* نام خانوادگی'
                                            name='last_name'

                                            value={lastName}
                                            onChange={handleChange}

                                            onBlur={blurCheck}
                                            error={validLastName}
                                            helperText={
                                                validLastName === "empty"
                                                    ? "نام خانوادگی نمیتواند خالی باشد"
                                                    : validLastName === "short"
                                                        ? "لطفا نام خانوادگی را کامل وارد کنید"
                                                        : ""
                                            }
                                        />
                                        <FormField
                                            label='* نام پدر'
                                            name='father_name'

                                            value={father}
                                            onChange={handleChange}

                                            onBlur={blurCheck}
                                            error={validFathersName}
                                            helperText={
                                                validFathersName === "empty"
                                                    ? "نام پدر نمیتواند خالی باشد"
                                                    : validFathersName === "short"
                                                        ? "لطفا نام پدر را کامل وارد کنید"
                                                        : ""
                                            }
                                        />



                                        <FormRadioGroup label='جنسیت'>
                                            <FormRadio
                                                label='زن'
                                                value='F'
                                                checked={gender === "F"}
                                                onChange={() => setGender("F")}
                                            />
                                            <FormRadio
                                                label='مرد'
                                                value='M'
                                                checked={gender === "M"}
                                                onChange={() => setGender("M")}
                                            />
                                        </FormRadioGroup>



                                        <FormField
                                            label='* شماره شناسنامه'
                                            name='certificate_number'
                                            type='Number'
                                            ltr

                                            value={certificateNum}
                                            onChange={handleChange}

                                            onBlur={blurCheck}
                                            error={validIdCode}
                                            helperText={
                                                validIdCode === "empty"
                                                    ? "ورود شماره شناسنامه الزامی است"
                                                    : validIdCode === "short"
                                                        ? "لطفا شماره شناسنامه را کامل وارد کنید"
                                                        : validIdCode === "long"
                                                            ? "لطفا مطئن شوید شماره شناسنامه 10 رقم است"
                                                            : ""
                                            }
                                        />



                                        <FormField
                                            label='* شماره ملی'
                                            name='national_code'
                                            ltr
                                            type='Number'

                                            value={nationNum}
                                            onChange={handleChange}

                                            onBlur={blurCheck}
                                            error={validNationalCode}
                                            helperText={
                                                validNationalCode === "empty"
                                                    ? "ورود کد ملی الزامی است"
                                                    : validNationalCode === "short"
                                                        ? "لطفا کد ملی را کامل وارد کنید"
                                                        : validNationalCode === "long"
                                                            ? "لطفا مطئن شوید کد ملی 10 رقم است"
                                                            : ""
                                            }
                                        />

                                        {/* ----- > date field < ----- */}
                                        <DateField
                                            label='* تاریخ تولد'
                                            name='birth_date'

                                            setIsChanged={setEditBirthday}

                                            setdate={setBirthday}
                                            timeshow={!editBirthday ? timetoShow(birthday, 'convert') : timetoShow(birthday)}
                                        />



                                        <FormField
                                            label='محل تولد'
                                            name='birth_location'

                                            value={birthCity}
                                            onChange={handleChange}

                                            onBlur={blurCheck}
                                            error={validBirthPlace}
                                            helperText={
                                                validBirthPlace === "empty"
                                                    ? "ورود محل تولد الزامی است"
                                                    : validBirthPlace === "short"
                                                        ? "لطفا اطلاعات را کامل وارد کنید"
                                                        : validBirthPlace === "long"
                                                            ? "لطفا مطئن شوید که اطلاعات وارد شده صحیح است"
                                                            : ""
                                            }
                                        />

                                        <FormField
                                            label='محل صدور'
                                            name='birth_get_certificate'

                                            value={getCertCity}
                                            onChange={handleChange}

                                            onBlur={blurCheck}
                                            error={validBirthPlace}
                                            helperText={
                                                validBirthPlace === "empty"
                                                    ? "ورود محل صدور الزامی است"
                                                    : validBirthPlace === "short"
                                                        ? "لطفا اطلاعات را کامل وارد کنید"
                                                        : validBirthPlace === "long"
                                                            ? "لطفا مطئن شوید که اطلاعات وارد شده صحیح است"
                                                            : ""
                                            }
                                        />

                                        {/* <div></div> */}

                                        {/* <FormField
                                        label='استان محل سکونت'
                                        name='province'

                                        value={province}
                                        onChange={handleChange}

                                        onBlur={blurCheck}
                                        error={validProvince}
                                        helperText={
                                            validProvince === "empty"
                                                ? "ورود استان الزامی است"
                                                : validProvince === "short"
                                                    ? "لطفا اطلاعات را کامل وارد کنید"
                                                    : validProvince === "long"
                                                        ? "لطفا مطئن شوید که اطلاعات وارد شده صحیح است"
                                                        : ""
                                        }
                                    />


                                    <FormField
                                        label='شهر محل سکونت'
                                        name='city'

                                        value={city}
                                        onChange={handleChange}

                                        onBlur={blurCheck}
                                        error={validCity}
                                        helperText={
                                            validCity === "empty"
                                                ? "ورود شهر الزامی است"
                                                : validCity === "short"
                                                    ? "لطفا اطلاعات را کامل وارد کنید"
                                                    : validCity === "long"
                                                        ? "لطفا مطئن شوید که اطلاعات وارد شده صحیح است"
                                                        : ""
                                        }
                                    /> */}


                                        <FormField
                                            label='کد پستی'
                                            name='post_code'
                                            type='Number'
                                            ltr

                                            value={postaltCode}
                                            onChange={handleChange}


                                            onBlur={blurCheck}
                                            error={validPostalCode}
                                            helperText={
                                                validPostalCode === "empty"
                                                    ? "ورود کد پستی الزامی است"
                                                    : validPostalCode === "short"
                                                        ? "لطفا کد پستی را کامل وارد کنید"
                                                        : validPostalCode === "long"
                                                            ? "کد پستی باید 10 رقم باشد"
                                                            : ""
                                            }
                                        />
                                        {/* <div /> */}

                                        {/* --- >>> -- >>  Address Section */}
                                        <AddressBtn
                                            label='آدرس محل سکونت'
                                            onClick={() => setOpenAddress(true)}
                                        />


                                        <AddressField
                                            name='address'

                                            value={
                                                address !== undefined
                                                    ? address?.address
                                                    : ""
                                            }
                                            onChange={handleChange}


                                            onBlur={blurCheck}
                                            error={validAddress}
                                            helperText={
                                                validAddress === "empty"
                                                    ? "ورود آدرس الزامی است"
                                                    : validAddress === "short"
                                                        ? "لطفا آدرس را کامل وارد کنید"
                                                        : ""
                                            }
                                        />

                                    </div>

                                    <FormDivider />

                                    {/* --- >>> form part 2 <<< --- */}
                                    <FormChip text='اطلاعات تماس' icon={callInfoIcon} />

                                    <div className='form_part1'>

                                        <FormField
                                            label='* شماره همراه'
                                            name='mobile_number'
                                            type='Number'
                                            ltr

                                            value={mobileNum}
                                            onChange={handleChange}


                                            onBlur={blurCheck}
                                            error={validMobileNumber}
                                            helperText={
                                                validMobileNumber === "empty"
                                                    ? "ورود تلفن همراه الزامی است"
                                                    : validMobileNumber === "short"
                                                        ? "لطفا شماره همراه را کامل وارد کنید"
                                                        : validMobileNumber === "long"
                                                            ? "شماره همراه باید 10 رقم باشد"
                                                            : ""
                                            }
                                        />


                                        <FormField
                                            label='تلفن ثابت'
                                            name='home_number'
                                            type='Number'
                                            ltr

                                            value={homeNum}
                                            onChange={handleChange}


                                            onBlur={blurCheck}
                                            error={validTelephone}
                                            helperText={
                                                validTelephone === "empty"
                                                    ? "ورود تلفن ثابت الزامی است"
                                                    : validTelephone === "short"
                                                        ? "لطفا تلفن ثابت را با پیش شماره وارد کنید"
                                                        : ""
                                            }
                                        />
                                        <FormField
                                            label='* ایمیل'
                                            name='email'
                                            ltr

                                            value={email}
                                            onChange={handleChange}


                                            onBlur={blurCheck}
                                            error={validEmail}
                                            helperText={
                                                validEmail === "empty"
                                                    ? "ورود ایمیل الزامی است"
                                                    : validEmail === "short"
                                                        ? "لطفا ایمیل را کامل وارد کنید"
                                                        : validEmail === "long"
                                                            ? "لطفا مطئن شوید که ایمیل وارد شده صحیح است"
                                                            : ""
                                            }
                                        />
                                    </div>
                                    <FormDivider />

                                    {/* --- >>> form part 3 <<< --- */}
                                    <FormChip text='آپلود تصاویر' icon={cloudIcon} upload />

                                    <div className='form_part_upload'>

                                        {uploadContainersList.map((item) => {
                                            return <UploadContainer
                                                desc={item.desc}
                                                attach={item.attach}

                                                contentTypeId={ContentTypeId}
                                                objId={personId}
                                            />
                                        })}

                                    </div>
                                </div>
                            )}
                    </MainCol>
                    <SideCol qr={defaultQR} />
                </div>
            </div>
        </>
    )
}

export default EditPerson