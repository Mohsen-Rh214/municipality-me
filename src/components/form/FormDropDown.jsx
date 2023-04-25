import React, { useState } from "react"

// mui
import Select from "@mui/material/Select"
import MenuItem from "@mui/material/MenuItem"

// style
import style from "./form.module.css"
import RTL from "../layout/RTL"

const FormDropDown = ({ label, value, options, setValue, ...rest }) => {
  const selectStyles = {
    borderRadius: "10px",
    width: "18vw",
    height: "42px",
  }
  return (
    <div className={style.form_field}>
      <p>{label}</p>
      <RTL>
        <Select
          sx={selectStyles}
          value={value}
          className={style.selectSort}
          {...rest}
        >
          {options?.map((item, index) => {
            return (
              <MenuItem value={item.value} key={index} disabled={item.disable}>
                {item.label}
              </MenuItem>
            )
          })}
        </Select>
      </RTL>
    </div>
  )
}

export default FormDropDown
