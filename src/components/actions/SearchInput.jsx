import React from "react"

// mui
import Button from "@mui/material/Button"
import TextField from "@mui/material/TextField"

// style
import style from "./actions.module.css"
import searchIcon from "../../assets/svg/action-search.svg"

// component style
const TextFieldStyle = {
  "& .MuiInputBase-root": {
    width: "12.8vw",
    height: "34px",
  },
  "& input::placeholder": {
    fontSize: "14px",
  },
  "& .MuiOutlinedInput-root": {
    backgroundColor: "white",
    borderRadius: "0 10px 10px 0",
    "& fieldset": {
      borderRadius: "0 10px 10px 0",
    },
  },
}

const SearchInput = ({ onSearch, ...rest }) => {
  const { onChange } = { ...rest }
  return (
    <div className={style.searchInput}>
      <TextField
        sx={TextFieldStyle}
        variant='outlined'
        placeholder='جستجو'
        onChange={onChange}
        {...rest}
      />
      <Button variant='contained' disableElevation onClick={onSearch}>
        <img src={searchIcon} alt='' />
      </Button>
    </div>
  )
}

export default SearchInput
