import React from "react"

// mui
import Radio from "@mui/material/Radio"

// style
import style from "./form.module.css"

const FormRadio = ({ label, ...rest }) => {
  return (
    <div className={style.form_radio}>
      <Radio {...rest} />
      <p>{label}</p>
    </div>
  )
}

export default FormRadio
