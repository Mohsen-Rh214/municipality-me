import React from "react"

import Fade from "@mui/material/Fade"
import Modal from "@mui/material/Modal"
import Button from "@mui/material/Button"

// style
import style from "./actions.module.css"

const DeleteModal = ({ confirmCallback, open, onClose, selected }) => {
  const handleClick = () => {
    confirmCallback()
    onClose()
  }

  return (
    <Modal
      aria-labelledby='transition-modal-title'
      aria-describedby='transition-modal-description'
      className={style.modal}
      open={open}
      onClose={onClose}
      closeAfterTransition
    >
      <Fade in={open}>
        {selected?.length < 1 ? (
          <div className={style.paper}>
            <div>
              <p>هیچ موردی انتخاب نشده است!</p>
            </div>
          </div>
        ) : (
          <div className={style.paper}>
            <div>
              <p>آیا از حذف اطمینان دارید؟</p>
            </div>

            <div>
              <Button variant='contained' onClick={handleClick}>
                تائید
              </Button>
              <Button variant='outlined' onClick={onClose}>
                انصراف
              </Button>
            </div>
          </div>
        )}
      </Fade>
    </Modal>
  )
}

export default DeleteModal
