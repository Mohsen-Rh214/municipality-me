import React from "react"

// mui
import Select from "@mui/material/Select"
import MenuItem from "@mui/material/MenuItem"

// style
import style from "./address.module.css"
import RTL from "../layout/RTL"

const Dropdown = (props) => {
  const { value, options, ...rest } = props

  const selectStyles = {
    height: "42px",
    width: "7.5vw",
    borderRadius: "10px",
  }

  return (
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
  )
}

export default Dropdown
