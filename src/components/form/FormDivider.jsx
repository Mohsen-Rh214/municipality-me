import React from "react"
// mui
import Divider from "@mui/material/Divider"

// style
import style from "./form.module.css"
import dividerIcon from "../../assets/svg/form-divider.svg"

const FormDivider = () => {
  return (
    <Divider>
      <img src={dividerIcon} alt='' className={style.divider_icon} />
    </Divider>
  )
}

export default FormDivider
