import React from "react"

// mui
import TextField from "@mui/material/TextField"

const AddressField = ({ ...rest }) => {
  const TextFieldstyles = {
    display: "flex",
    alignItems: "center",
    "& .MuiInputBase-root": {
      height: "42px",
      width: "100%",
      borderRadius: "10px",
    },
    "& input::placeholder": {
      fontSize: "14px",
      paddingLeft: "10px",
    },
  }

  return (
    <div style={{padding: '0 30px'}}>
      <TextField sx={TextFieldstyles} {...rest} />
    </div>
  )
}

export default AddressField
