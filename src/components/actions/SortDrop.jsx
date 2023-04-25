import React from "react"

// mui
import Select from "@mui/material/Select"
import MenuItem from "@mui/material/MenuItem"

// style
import style from "./actions.module.css"
import RTL from "../layout/RTL"
import searchIcon from "../../assets/svg/action-search.svg"

const SortDrop = ({ defaultValue, defaultSort, value, children, ...rest }) => {
  const selectStyles = {
    borderRadius: "10px",
  }
  return (
    <RTL>
      <Select
        sx={selectStyles}
        defaultValue={defaultValue ? defaultValue : "sort"}
        value={value ? value : "sort"}
        className={style.selectSort}
        {...rest}
        // onChange={(e) => {
        //   console.log("e target: ", e.target.value)
        // }}
        // IconComponent={() => <img className={style.selectIcon} src={selectIcon} />}
      >
        <MenuItem
          value={defaultValue ? defaultValue : "sort"}
          disabled={defaultValue ? false : true}
        >
          {defaultValue ? defaultSort : <p>بر اساس</p>}
        </MenuItem>
        {/* <MenuItem>جدید ترین</MenuItem>
          <MenuItem>قدیمی ترین</MenuItem> */}
        {children}
      </Select>
    </RTL>
  )
}

export default SortDrop
