import React, { useState, useEffect } from "react"
import { mayadinAx } from "../../services/AxiosRequest"

// Mui
import Button from "@mui/material/Button"
import Fade from "@mui/material/Fade"
import Modal from "@mui/material/Modal"

// style
import style from "./address.module.css"
import loadingSvg from "../../assets/svg/loading.svg"
import chipIcon from "../../assets/svg/address-chip-icon.svg"

// custom Component
import FormChip from "../../components/form/FormChip"
import FormField from "../../components/form/FormField"
import WideField from "../../components/form/WideField"
import MapContainer from "../../components/address/MapContainer"

// Mui
// import Divider from "@mui/material/Divider"
import FormDropDown from "../../components/form/FormDropDown"

const AddAddress = ({ open, onClose }) => {
  const buttonStyles = {
    background: "#3569E7",
    borderRadius: "10px",
    width: "9.5vw",
    height: "42px",
  }

  // States
  const [isLoading, setIsLoading] = useState()
  const [title, setTitle] = useState()

  // get address from user click
  const [addressByClick, setAddressByClick] = useState()
  const selectCity = addressByClick !== undefined && addressByClick.city
  const selectNeighbourhood =
    addressByClick !== undefined && addressByClick.neighbourhood
  const selectStreet = addressByClick !== undefined && addressByClick.primary
  const selectPostalCode =
    addressByClick !== undefined && addressByClick.postal_code
  const selectCompact =
    addressByClick !== undefined && addressByClick.address_compact

  const cityItems = [{ label: "بندرعباس", value: "1" }]

  const [city, setCity] = useState(cityItems[0])
  const [street, setStreet] = useState()
  const [neighbourhood, setNeighbourhood] = useState()
  const [postalCode, setPostalCode] = useState()
  const [compact, setCompact] = useState()

  // set states when clicked
  useEffect(() => {
    setStreet(selectStreet || "")
    setNeighbourhood(selectNeighbourhood || "")
    setPostalCode(selectPostalCode || "")
    setCompact(selectCompact || "")
  }, [addressByClick])

  // validations
  const [validNeighbourhood, setValidNeighbourhood] = useState()
  const [validStreet, setValidStreet] = useState()
  const [validCompact, setValidCompact] = useState()
  const [validTitle, setValidTitle] = useState()
  // const [validPostalCode,setValidPostalCode]=useState()

  const blurCheck = (e) => {
    const value = e.target.value
    switch (e.target.name) {
      case "neighbourhood":
        !value
          ? setValidNeighbourhood("empty")
          : value.length < 2
          ? setValidNeighbourhood("short")
          : setValidNeighbourhood(false)
        return
      case "street":
        !value
          ? setValidStreet("empty")
          : value.length < 2
          ? setValidStreet("short")
          : setValidStreet(false)
        return
      case "tittle":
        !value
          ? setValidCompact("empty")
          : value.length < 2
          ? setValidCompact("short")
          : setValidCompact(false)
        return
      case "short_name":
        !value
          ? setValidTitle("empty")
          : value.length < 2
          ? setValidTitle("short")
          : setValidTitle(false)
        return
      case "address":
        !value
          ? setValidCompact("empty")
          : value.length < 2
          ? setValidCompact("short")
          : setValidCompact(false)
        return
    }
  }

  // -- >> api call

  const [isEmpty, setIsEmpty] = useState()
  const [geolocation, setGeo] = useState([])
  const setMyLocation = (location) => {
    setGeo(location)
  }

  const endpoint = "location/api/UserAddress/"
  const submitAddress = (refresh) => {
    if (validStreet || validCompact || validTitle === undefined) {
      setIsEmpty(true)
      return console.log("field Empty")
    }

    setIsEmpty(false)
    setIsLoading(true)
    mayadinAx
      .post(endpoint, {
        short_name: title,
        city: city.value,
        neighbourhood: neighbourhood,
        street,
        post_code: postalCode,
        address: compact,
        geolocation,
      })
      .then((res) => {
        console.log("res: ", res)
        setIsLoading(false)
        setIsEmpty(false)
        // toast.success("کاربر جدید با موفقیت ثبت شد", {})

        if (refresh === true) refreshForm(true)

        if (refresh === false)
          setTimeout(() => {
            setIsLoading(false)
            onClose()
          }, 1500)
      })
      .catch((e) => {
        console.log("e: ", e)
        setIsEmpty(true)
        setIsLoading(false)
      })
  }

  const refreshForm = (submit) => {
    if (submit) {
      setIsLoading(false)
      setIsEmpty(false)
    }

    if (!submit) {
      setIsLoading(undefined)
      setIsEmpty(undefined)
    }

    setTitle("")
    setStreet("")
    setNeighbourhood("")
    setPostalCode("")
    setCompact("")
  }

  useEffect(() => {
    refreshForm()
  }, [open])

  return (
    <Modal
      aria-labelledby='transition-modal-title'
      aria-describedby='transition-modal-description'
      className={style.modal}
      open={open}
      onClose={onClose}
      closeAfterTransition
    >
      <Fade in={open}>
        <div className={style.paperAdd}>
          <div className='form'>
            <FormChip text='افزودن آدرس' icon={chipIcon} upload />
            <div style={{ fontSize: "12px", paddingRight: "35px" }}>
              <p>
                {"🔹 "}آدرس مورد نظر را از روی نقشه انتخاب کرده یا در فرم زیر
                وارد کنید.
              </p>
            </div>
            <div className='form_part1'>
              <FormField
                label='*عنوان آدرس'
                name='short_name'
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder='مثال: شهرداری بندرعباس'
                onBlur={blurCheck}
                helperText={
                  validTitle === "empty"
                    ? "این مورد نمیتواند خالی باشد"
                    : validTitle === "short"
                    ? "لطفا مقدار معتبر وارد کنید"
                    : ""
                }
              />

              <div />

              <FormDropDown
                label='*شهر'
                name='city'
                value={city.value}
                // onChange={handleConStatus}
                options={cityItems}
              />
              <FormField
                label='*محله'
                name='neighbourhood'
                value={neighbourhood}
                onChange={(e) => setNeighbourhood(e.target.value)}
                placeholder='مثال: خواجه عطا'
                onBlur={blurCheck}
                error={validNeighbourhood}
                helperText={
                  validNeighbourhood === "empty"
                    ? "این مورد نمیتواند خالی باشد"
                    : validNeighbourhood === "short"
                    ? "لطفا مقدار معتبر وارد کنید"
                    : ""
                }
              />
              <FormField
                label='*خیابان'
                name='street'
                value={street}
                onChange={(e) => setStreet(e.target.value)}
                onBlur={blurCheck}
                error={validStreet}
                helperText={
                  validStreet === "empty"
                    ? "این مورد نمیتواند خالی باشد"
                    : validStreet === "short"
                    ? "لطفا مقدار معتبر وارد کنید"
                    : ""
                }
                placeholder='مثال: بلوار چمران'
              />
              <FormField
                label='کد پستی'
                name='post_code'
                value={postalCode}
                onChange={(e) => setPostalCode(e.target.value)}
                placeholder='مثال: 7981711111'
              />
            </div>
            <div className='form_wide'>
              <WideField
                label='*آدرس'
                name='address'
                value={compact}
                onChange={(e) => setCompact(e.target.value)}
                onBlur={blurCheck}
                error={validCompact}
                helperText={
                  validCompact === "empty"
                    ? "این مورد نمیتواند خالی باشد"
                    : validCompact === "short"
                    ? "لطفا مقدار معتبر وارد کنید"
                    : ""
                }
              />
            </div>

            {/* -- >> Map << -- */}
            <MapContainer
              label='محل ملک روی نقشه'
              onClick={setAddressByClick}
              setGeo={setMyLocation}
            />

            {/* -- >> Submit << -- */}

            <div className={style.submitButtons}>
              <Button variant='outlined' onClick={() => submitAddress(true)}>
                ثبت و ایجاد یکی دیگر
              </Button>

              <Button variant='contained' onClick={() => submitAddress(false)}>
                ثبت
              </Button>

              {isLoading === false && isEmpty === false ? (
                <div className={style.loadingIndicator}>
                  <p>آدرس شما ثبت شد!</p>
                </div>
              ) : isLoading ? (
                <div className={style.loadingIndicator}>
                  <img src={loadingSvg} alt='' />
                  <p>درحال ارسال درخواست</p>
                </div>
              ) : isEmpty ? (
                <div className={style.loadingIndicator}>
                  <p>از پر بودن فیلدهای ستاره دار اطمینان حاصل کنید</p>
                </div>
              ) : null}
            </div>
          </div>
        </div>
      </Fade>
    </Modal>
  )
}

export default AddAddress
