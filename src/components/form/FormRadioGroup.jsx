import React from "react"

// style
import style from "./form.module.css"

const FormRadioGroup = ({ label, children }) => {
  return (
    <div className={style.form_field}>
      <p>{label}</p>
      <div className={style.radio_field}>{children}</div>
    </div>
  )
}

export default FormRadioGroup
