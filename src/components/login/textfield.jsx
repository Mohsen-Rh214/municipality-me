import TextField from "@mui/material/TextField"
import InputAdornment from "@mui/material/InputAdornment"

const Textfield = ({
  icon,
  type,
  placeholder,
  onChange,
  maxLength,
  minLength,
  autoFocus,
}) => {
  const TextFieldstyles = {
    display: "flex",
    alignItems: "center",
    border: "none",
    direction: 'ltr',
    "& .MuiInputBase-root": {
      height: "45px",
      width: "21.6vw",
      borderRadius: "10px",
    },
    "& input::placeholder": {
      fontSize: "14px",
      paddingLeft: "10px",
      textAlign: 'right'
    },
  }

  return (
    <TextField
      placeholder={placeholder}
      sx={TextFieldstyles}
      type={type}
      InputProps={{
        autoComplete: "new-password",
        // startAdornment: (
        //   <InputAdornment position='start'>
        //     <img src={icon} alt='' />
        //   </InputAdornment>
        // ),
        endAdornment: (
          <InputAdornment position='end'>
            <img src={icon} alt='' />
          </InputAdornment>
        ),
      }}
      onChange={(e) => onChange(e.target.value)}
      autoFocus={autoFocus}
      inputProps={{ maxLength, minLength }}
    />
  )
}

export default Textfield
