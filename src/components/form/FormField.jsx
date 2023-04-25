import React from "react"

// mui
import TextField from "@mui/material/TextField"

// style
import style from "./form.module.css"

const FormField = ({ label, ...rest }) => {
  return (
    <div className={style.form_field}>
      <p>{label}</p>
      <FormTextField {...rest} />
    </div>
  )
}

const FormTextField = ({ ...rest }) => {
  const { maxLength, minLength, ltr, ltr2, center } = { ...rest }
  const TextFieldstyles = {
    display: "flex",
    alignItems: !!ltr ? "end" : "start",
    // textAlign: !!center && "center",
    border: "none",
    direction: !!ltr && "ltr",
    "& .MuiInputBase-root": {
      height: "42px",
      width: "18vw",
      borderRadius: "10px",
    },
    "& input::placeholder": {
      fontSize: "14px",
      paddingLeft: "10px",
      textAlign: !!ltr2 && "right",
    },
  }
  return (
    <TextField
      sx={TextFieldstyles}
      inputProps={{
        maxLength,
        minLength,
        style: { textAlign: !!center && "center" },
      }}
      {...rest}
    />
  )
}

export default FormField
