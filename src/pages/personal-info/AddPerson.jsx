import React, { useState } from "react"
import moment from "moment-jalaali"
import { useNavigate } from "react-router-dom"
import { mayadinAx } from "../../services/AxiosRequest"

// style
import style from "./personal.module.css"
import titleIcon from "../../assets/svg/personal-title-icon.svg"
import personalInfoIcon from "../../assets/svg/personal-chip-personal.svg"
import callInfoIcon from "../../assets/svg/personal-chip-call.svg"
import cloudIcon from "../../assets/svg/personal-chip-cloud.svg"
import defaultQR from "../../assets/img/default-qr.png"

// custom components
import ActionBar from "../../components/layout/ActionBar"
import MainCol from "../../components/containers/MainCol"
import SideCol from "../../components/containers/SideCol"
import FormChip from "../../components/form/FormChip"
import FormField from "../../components/form/FormField"
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

const AddPerson = () => {
  // navigations
  const navigate = useNavigate()

  // form values and validations
  // all data
  const [person, setPerson] = useState()

  // other data
  const [gender, setGender] = useState(null)
  const [date, setDate] = useState(null)

  // time
  const timetoShow = (api) => {
    if (date === undefined) return " "
    if (date === null) return " "
    const fullDate = `${date?.year}/${date?.month}/${date?.day}`
    const showDate = moment(fullDate, "jYYYY/jM/jD").format("jYYYY/jMM/jDD")
    const birth_date = moment(fullDate, "jYYYY/jM/jD").format("jYYYY-jMM-jDD")
    if (api === "api") return p2e(birth_date) || null
    return showDate
  }

  // validation
  // -- step 1: set value to state

  const [personAddress, setPersonAddress] = useState(null)
  const onSelectAddress = (a) => {
    setPersonAddress(a)
    setValidAddress(false)
  }

  const handleChange = (event) => {
    setPerson({
      ...person,
      [event.target.name]: event.target.value,
      gender,
      birth_date: timetoShow("api"),
    })
  }
  const defaultDate = { year: 1370, month: 1, day: 1 }
  const [filesToUpload, setFiles] = useState([])
  const handleFile = (file) => {
    filesToUpload.push(file)
    // handleChange()
  }

  // -- step 2: validate every field on onBlur event
  const [validFirstName, setValidFirstName] = useState()
  const [validLastName, setValidLastName] = useState()
  const [validFathersName, setValidFathersName] = useState()
  const [validIdCode, setValidIdCode] = useState()
  const [validNationalCode, setValidNationalCode] = useState()
  const [validBirthDay, setValidBirthday] = useState()
  const [validBirthPlace, setValidBirthPlace] = useState() // cannot validate, not easy.
  // const [validProvince, setValidProvince] = useState() /// not required
  // const [validCity, setValidCity] = useState()
  const [validPostalCode, setValidPostalCode] = useState()
  const [validAddress, setValidAddress] = useState()
  const [validMobileNumber, setValidMobileNumber] = useState()
  // const [validTelephone, setValidTelephone] = useState()
  // const [validEmail, setValidEmail] = useState()

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
      default:
        return false
    }
  }

  // -- step 3: check if any field is empty before submit
  const [isEmpty, setIsEmpty] = useState(false)
  const [errorMsg, setErrorMsg] = useState(null)

  const checkValidForm = () => {
    if (
      (validFirstName ||
        validLastName ||
        validFathersName ||
        validIdCode ||
        validPostalCode ||
        validAddress ||
        validMobileNumber ||
        personAddress === null ||
        gender === null) !== false
    ) {
      console.log(
        "field empty: ",
        (validFirstName ||
          validLastName ||
          validFathersName ||
          validIdCode ||
          validPostalCode ||
          validAddress ||
          validMobileNumber === null) !== false
      )

      setIsEmpty(true)
      return false
    } else {

      setIsEmpty(false)
      return true
    }
  }

  // Add new person Api
  const [loading, setLoading] = useState(false)
  const registerEndpoint = "auth/api/Citizen/"

  // -- step 4: after running a check, submit new user
  const handleSubmit = () => {
    if (checkValidForm() === true) {
      setLoading(true)
      mayadinAx
        .post(registerEndpoint, {


          // this part can be changed, better code is in ground module
          first_name: person.first_name,
          last_name: person.last_name,
          father_name: person.father_name,
          gender: person.gender,
          certificate_number: person.certificate_number,
          national_code: person.national_code,
          birth_date: person.birth_date,
          birth_location: person?.birth_location,
          birth_get_certificate: person?.birth_get_certificate,
          province: person?.province,
          // city
          post_code: person.post_code,
          address: personAddress.id,
          mobile_number: person.mobile_number,
          home_number: person?.home_number,
          email: person?.email,
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

  // modal
  const [openAddress, setOpenAddress] = useState(false)
  const onClose = () => setOpenAddress(false)

  const [openAdd, setOpenAdd] = useState()
  const onCloseAdd = () => setOpenAdd(false)

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
        <ActionBar title='افزودن فرد جدید' icon={titleIcon} />
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

            <div className={style.form}> {/* this can change to this: className='form' */}
              <FormChip text='اطلاعات شخصی' icon={personalInfoIcon} />
              <div className={style.form_part1}>
                <FormField
                  label='* نام'
                  name='first_name'
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
                <FormRadioGroup label='* جنسیت'>
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
                  ltr
                  name='certificate_number'
                  onChange={handleChange}
                  maxLength={10}
                  onBlur={blurCheck}
                  error={validIdCode}
                  type='Number'
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
                  ltr
                  name='national_code'
                  onChange={handleChange}
                  maxLength={10}
                  onBlur={blurCheck}
                  error={validNationalCode}
                  type='Number'
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
                  setdate={setDate}
                  timeshow={timetoShow()}
                  defaultDate={defaultDate}
                  name='birth_date'
                  onChange={handleChange}
                  onBlur={blurCheck}
                  error={validBirthDay}
                  helperText={
                    validBirthDay === "empty"
                      ? "لطفا محل تولد را انتخاب کنید"
                      : ""
                  }
                // disabled
                />
                <FormField
                  label='محل تولد'
                  name='birth_location'
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
                <FormField
                  label='استان محل سکونت'
                  name='province'
                  onChange={handleChange}
                  onBlur={blurCheck}
                // error={validProvince}
                // helperText={
                //   validProvince === "empty"
                //     ? "ورود استان الزامی است"
                //     : validProvince === "short"
                //       ? "لطفا اطلاعات را کامل وارد کنید"
                //       : validProvince === "long"
                //         ? "لطفا مطئن شوید که اطلاعات وارد شده صحیح است"
                //         : ""
                // }
                />
                <FormField
                  label='شهر محل سکونت'
                  name='city'
                  onChange={handleChange}
                  onBlur={blurCheck}
                // error={validCity}
                // helperText={
                //   validCity === "empty"
                //     ? "ورود شهر الزامی است"
                //     : validCity === "short"
                //       ? "لطفا اطلاعات را کامل وارد کنید"
                //       : validCity === "long"
                //         ? "لطفا مطئن شوید که اطلاعات وارد شده صحیح است"
                //         : ""
                // }
                />
                <FormField
                  label='* کد پستی'
                  ltr
                  name='post_code'
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
                        : validPostalCode === "long"
                          ? "کد پستی باید 10 رقم باشد"
                          : ""
                  }
                />
                {/* <div /> */}

                {/* --- >>> -- >>  Address Section */}
                <AddressBtn
                  label='* آدرس محل سکونت'
                  onClick={() => setOpenAddress(true)}
                />
                <AddressField
                  name='address'
                  onChange={handleChange}
                  onBlur={blurCheck}
                  value={
                    personAddress?.properties.address !== undefined
                      ? personAddress?.properties.address
                      : ""
                  }
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
              <div className={style.form_part1}>
                <FormField
                  label='* شماره همراه'
                  ltr
                  name='mobile_number'
                  onChange={handleChange}
                  maxLength={10}
                  onBlur={blurCheck}
                  error={validMobileNumber}
                  type='Number'
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
                  ltr
                  name='home_number'
                  type='Number'
                  onChange={handleChange}
                  maxLength={11}
                  onBlur={blurCheck}
                // error={validTelephone}
                // helperText={
                //   validTelephone === "empty"
                //     ? "ورود تلفن ثابت الزامی است"
                //     : validTelephone === "short"
                //       ? "لطفا تلفن ثابت را با پیش شماره وارد کنید"
                //       : ""
                // }
                />
                <FormField
                  label='* ایمیل'
                  ltr
                  name='email'
                  onChange={handleChange}
                  onBlur={blurCheck}
                // error={validEmail}
                // helperText={
                //   validEmail === "empty"
                //     ? "ورود ایمیل الزامی است"
                //     : validEmail === "short"
                //       ? "لطفا ایمیل را کامل وارد کنید"
                //       : validEmail === "long"
                //         ? "لطفا مطئن شوید که ایمیل وارد شده صحیح است"
                //         : ""
                // }
                />
              </div>


              {/* <FormDivider /> */}

              {/* --- >>> form part 3 <<< --- */}
              {/* <FormChip text='آپلود تصاویر' icon={cloudIcon} upload /> */}

              {/* <div className={style.form_part_upload}>
              <UploadContainer
                desc='تصویر روی کارت ملی'
                handleFile={handleFile}
              />
              <UploadContainer
                desc='تصویر پشت کارت ملی'
                handleFile={handleFile}
              />
              <UploadContainer
                desc='صفحه اول شناسنامه'
                handleFile={handleFile}
              />
              <UploadContainer
                desc='صفحه دوم شناسنامه'
                handleFile={handleFile}
              />
              <UploadContainer
                desc='صفحه سوم شناسنامه'
                handleFile={handleFile}
              />
              <UploadContainer desc='الحاقیه' attach handleFile={handleFile} />
            </div> */}
            </div>
          </MainCol>
          <SideCol qr={defaultQR} add />
        </div>
      </div>
    </>
  )
}

export default AddPerson
