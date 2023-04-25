import React from "react"

// mui
import Button from "@mui/material/Button"

// style
import style from "./form.module.css"

const AddressBtn = ({ label, ...rest }) => {
  return (
    <div className={style.form_field}>
      <p>{label}</p>
      <Button
        {...rest}
        variant='contained'
        style={{
          background: "#007AF5",
          borderRadius: "10px",
          width: "18vw",
          height: "42px",
        }}
        // fullWidth
      >
        انتخاب آدرس
      </Button>
    </div>
  )
}

export default AddressBtn
