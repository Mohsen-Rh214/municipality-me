import React from "react"

// mui
import Button from "@mui/material/Button"

// style
import style from "./actions.module.css"

const DeleteBtn = ({ children, ...rest }) => {
  return (
    <Button
      style={{ background: "#FF2B37", borderRadius: 10 }}
      variant='contained'
      className={style.delete_btn}
      {...rest}
    >
      {children}
    </Button>
  )
}

export default DeleteBtn
