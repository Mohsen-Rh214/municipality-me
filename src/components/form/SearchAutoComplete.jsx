import React from "react"

// mui
import TextField from "@mui/material/TextField"
import Autocomplete from "@mui/material/Autocomplete"

// style
import style from "./form.module.css"
import RTL from "../layout/RTL"

const SearchAutoComplete = ({ label, placeholder, error, helperText, name, ...rest }) => {
  const { ltr, onBlur, onFocus, handleType } = { ...rest }

  const TextFieldstyles = {
    display: "flex",
    alignItems: !!ltr ? "end" : "start",
    border: "none",
    direction: !!ltr && "ltr",
    "& .MuiInputBase-root": {
      height: "42px",
      width: "18vw",
      borderRadius: "10px",
      fontSize: "13px",
    },
    "& input::placeholder": {
      fontSize: "13px",
      paddingLeft: "10px",
    },
  }

  const selectStyles = {
    "& .MuiAutocomplete-groupUl": {
      color: "red",
      // fontSize: "12px",
      background: "red",
    },
  }

  return (
    <div className={style.form_field}>
      <p>{label}</p>
      <RTL>
        <Autocomplete
          {...rest}
          sx={selectStyles}
          size='small'
          style={{
            height: "100%",
            width: "18vw",
          }}
          noOptionsText='خالی'
          renderInput={(params) => (
            <TextField
              name={name}
              variant='outlined'
              sx={TextFieldstyles}
              placeholder={placeholder}
              onBlur={onBlur}
              onFocus={onFocus}
              onChange={handleType}
              error={error}
              helperText={helperText}
              {...params}
            />
          )}
          className={style.selectSort}

          freeSolo={true}
        />
      </RTL>
    </div>
  )
}

export default SearchAutoComplete
