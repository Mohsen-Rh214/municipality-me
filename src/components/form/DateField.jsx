import React, { useState } from "react"

// mui
import TextField from "@mui/material/TextField"
import Button from "@mui/material/Button"

// style
import style from "./form.module.css"
import calendarSvg from "../../assets/svg/form-calendar.svg"

// import time
// import moment from "moment-jalaali"
import { DtCalendar } from "react-calendar-datetime-picker"
import "react-calendar-datetime-picker/dist/index.css"

// component style
const TextFieldStyle = {
  "& .MuiInputBase-root": {
    width: "14vw",
    height: "42px",
  },
  "& input::placeholder": {
    fontSize: "14px",
  },
  "&.MuiOutlinedInput-input": {},
  "& .MuiOutlinedInput-root": {
    backgroundColor: "white",
    borderRadius: "0 10px 10px 0",
    "& fieldset": {
      borderRadius: "0 10px 10px 0",
    },
    "&:hover fieldset": {
      // cursor: "pointer",
    },
  },
  input: { cursor: "pointer" },
}

// const ButtonStyle = {
//   "&.MuiButton-contained": {},
//   "&.MuiButton-root": {},
//   "&.MuiButton-sizeSmall": {},
// }

const DateField = ({ label, ...rest }) => {
  const { date, setdate, timeshow, defaultDate, permission, setIsChanged } = { ...rest }
  const [open, setOpen] = useState(false)
  const [visible, setVisible] = useState(false)

  const checkPermit = () => {
    if (permission === true) return false
    else if (permission === undefined) return false
    else return true
  }

  // init date, today
  const initValue = {
    year: defaultDate?.year,
    month: defaultDate?.month,
    day: defaultDate?.day,
  }
  //  defaultDate
  //   ? {
  //       year: defaultDate.year,
  //       month: defaultDate.month,
  //       day: defaultDate.day,
  //     }
  //   : {
  //       year: Number(moment().format("jYYYY")),
  //       month: Number(moment().format("jM")),
  //       day: Number(moment().format("jDD")),
  //     }
  return (
    <div className={style.form_field}>
      <p>{label}</p>
      <div className={style.date_field}>
        <TextField
          sx={TextFieldStyle}
          style={{ caretColor: "transparent" }}
          value={timeshow}
          inputProps={{ min: 0, style: { textAlign: "center" } }}
          {...rest}
        // disabled
        />
        <Button
          variant='contained'
          onClick={() => {
            setOpen(!open)
            setTimeout(() => {
              return setVisible(!open)
            }, 400)
          }}
          disableElevation
          disabled={checkPermit()}
        >
          <img src={calendarSvg} alt='' />
        </Button>
        <div
          className={
            open === true ? style.calendar_modal : style.calendar_modal_close
          }
          style={{ direction: "ltr" }}
        >
          <div hidden={visible === false && true}>
            <DtCalendar
              initValue={initValue && initValue}
              onChange={(e) => {
                if (setdate) {

                  if (setIsChanged) {
                    setIsChanged(true)
                  }

                  setdate(e)
                  setTimeout(() => {
                    setVisible(false)
                    setOpen(false)
                  }, 200)
                }
              }}
              local='fa'
            />

          </div>
        </div>
      </div>
    </div>
  )
}

export default DateField
