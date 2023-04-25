import React from "react"

// style
import style from "./layout.module.css"

const ActionBar = ({ isOpen, icon, title, children }) => {
  return (
    <div
      className={`${style.actionbar} ${
        isOpen === true ? style.actionbar_open : style.actionbar_closed
      }`}
    >
      <div className={style.actions_right}>
        <p>{title}</p>
        <img src={icon} alt='' />
      </div>
      <div className={style.actions_left}> {children}</div>
    </div>
  )
}

export default ActionBar
