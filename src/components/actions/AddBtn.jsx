import React from "react"

// mui
import Button from "@mui/material/Button"

// style
import style from "./actions.module.css"
import addIcon from "../../assets/svg/actions-add-icon.svg"

const AddBtn = ({ ...rest }) => {
  return (
    <Button 
    style={{
      borderRadius: 10,
    }}
    className={style.addBtn} variant='outlined' {...rest}>
      <img src={addIcon} alt='' />
      افزودن یکی دیگر
    </Button>
  )
}

export default AddBtn
