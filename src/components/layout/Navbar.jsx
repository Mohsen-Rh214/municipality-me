import React, { useState } from "react"
import { getToken } from "../../utils/SessionStorage"

// mui
import Avatar from "@mui/material/Avatar"

// moment
import moment from "moment-jalaali"

// style
import style from "./layout.module.css"
import calendar from "../../assets/svg/nav-calendar.svg"

const Navbar = () => {
  const user = getToken("user")

  // time box
  const [date, setDate] = useState(moment().format("jYYYY/jM/jD"))
  const [time, setTime] = useState(moment().format("HH:mm"))

  setInterval(() => {
    setDate(moment().format("jYYYY/jM/jD"))
    setTime(moment().format("HH:mm"))
  }, 30000)

  return (
    <div className={style.navbar}>
      <div className={style.navbar_left}>
        <Avatar />
        {user}
      </div>
      <div className={style.navbar_right}>
        <div className={style.timeBox}>
          <img src={calendar} alt='' />
          <p>{date}</p>
          <p>{time}</p>
        </div>
      </div>
    </div>
  )
}

export default Navbar
