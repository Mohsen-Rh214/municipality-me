import React from "react"

// style
import style from "./form.module.css"

const FormChip = ({ text, icon, upload }) => {
  return (
    <div className={style.form_chip}>
      <img src={icon} alt='' style={{ width: upload && "18px" }} />
      <p>{text}</p>
    </div>
  )
}

export default FormChip
