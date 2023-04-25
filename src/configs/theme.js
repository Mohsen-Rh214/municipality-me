import { createTheme } from "@mui/material/styles"

const theme = createTheme({

  // TYPOGRAPHY
  typography: {
    fontFamily: ["Shabnam", "sans-serif"].join(","),
  },

  // textField: {
  //   [`& fieldset`]: {
  //     borderRadius: "35px",
  //     color: 'red'
  //   },
  // },
  components: {
    MuiInputBase: {
      styleOverrides: {
        root: {
          fontSize: '13px'
        }
      }
    },
    MuiSelect: {
      styleOverrides: {
        root: {
          fontSize: '13px'
        }
      }
    },
    MuiMenuItem: {
      styleOverrides: {
        root: {
          fontSize: '12px',
        }
      }
    },
    MuiAutocomplete: {
      styleOverrides: {
        option: {
          fontSize: '13px'
        }
      }
    },
    MuiListItemButton: {
      styleOverrides: {
        root: {
          fontSize: '12px',
          direction: 'rtl'
        }
      }
    }
  }
});

export default theme 