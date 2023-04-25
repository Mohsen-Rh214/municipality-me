import React from "react"

// mui
import { Button } from "@mui/material"

// style
import style from "./containers.module.css"
import DeleteBtn from "../actions/DeleteBtn"
import loadingSvg from "../../assets/svg/loading.svg"

const MainCol = ({
  children,
  onEdit,
  onConfirm,
  onDelete,
  editText,
  confirmText,
  deleteText,
  error,
  isLoading,
  errorMsg,
}) => {

  // const errorMsg = 'there has been some serious problem'
  const getMessage = () => {
    if (isLoading === true)
      return (
        <div className={style.loadingIndicator}>
          <img src={loadingSvg} alt='' />
          <p>درحال ارسال درخواست</p>
        </div>
      )
    if (error === true)
      return (
        <div className={style.loadingIndicator}>
          <p>* لطفا فیلدهای ستاره دار را پر کنید</p>
        </div>
      )
    if (error === "error")
      return (
        <div className={style.loadingIndicator}>
          <p>فیلدهای ورودی را دوباره چک کنید</p>
        </div>
      )
    return null
  }


  return (
    <div className={style.mainCol}>
      <div className={style.colBox}>{children}</div>

      <div className={style.extraPart}>
        <div className={style.buttons}>
          {confirmText && (
            <Button variant='contained' onClick={() => onConfirm()}>
              {confirmText}
            </Button>
          )}
          {editText && (
            <Button
              variant='outlined'
              style={{ border: "1px solid #3569E7", color: "#3569E7" }}
              onClick={onEdit}
            >
              {editText}
            </Button>
          )}
          {deleteText && <DeleteBtn onClick={onDelete}>{deleteText}</DeleteBtn>}
        </div>
        <div className={style.message}>{getMessage()}</div>
      </div>
    </div>
  )
}

export default MainCol
