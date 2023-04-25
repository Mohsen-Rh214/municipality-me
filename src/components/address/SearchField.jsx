import React from "react"

// mui
import TextField from "@mui/material/TextField"

// style
import style from "./address.module.css"
import searchIcon from "../../assets/svg/modal-search.svg"

const SearchField = ({ ...rest }) => {
  const TextFieldstyles = {
    display: "flex",
    alignItems: "center",
    border: "none",
    // direction: 'ltr',
    "& .MuiInputBase-root": {
      height: "42px",
      width: "15.15vw",
      borderRadius: "10px",

      // padding for icon
      paddingLeft: "10px",
    },
    "& input::placeholder": {
      fontSize: "14px",
      paddingLeft: "10px",
      textAlign: "right",
    },
  }

  return (
    <div>
      <TextField
        sx={TextFieldstyles}
        {...rest}
        InputProps={{
          endAdornment: <img src={searchIcon} alt='' />,
        }}
      />
    </div>
  )
}

export default SearchField
