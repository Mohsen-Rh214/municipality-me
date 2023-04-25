import React, { useContext } from "react"
import { DrawerContext } from "../../utils/drawerContext"

// mui
import TextField from "@mui/material/TextField"

// style
import style from "./form.module.css"

const WideField = ({ label, ...rest }) => {
  return (
    <div className={style.wide_field}>
      <p>{label}</p>
      <FormTextField {...rest} />
    </div>
  )
}

const FormTextField = ({ ...rest }) => {
  const { maxLength, minLength, ltr, ltr2, rows } = { ...rest }

  const { isOpen } = useContext(DrawerContext)

  const TextFieldstyles = {
    display: "flex",
    alignItems: !!ltr ? "end" : "start",
    border: "none",
    direction: !!ltr && "ltr",
    "& .MuiInputBase-root": {
      width: "100%",
      borderRadius: "10px",
    },
    "& input::placeholder": {
      fontSize: "14px",
      paddingLeft: "10px",
      textAlign: !!ltr2 && "right",
    },
    "& fieldset": {
      //   height: "180px",
      //   borderRadius: "35px",
      color: "red",
    },
  }
  return (
    <TextField
      sx={TextFieldstyles}
      style={{
        width: isOpen === true ? "86%" : "82%",
        transition: "all 400ms ease",
      }}
      inputProps={{ maxLength, minLength }}
      multiline
      //   minRows={5}
      //   maxRows={5}
      rows={rows ? rows : 5}

      {...rest}
    />
  )
}

export default WideField
