import React, { useEffect } from "react"

import Fade from "@mui/material/Fade"
import Modal from "@mui/material/Modal"

// style
import style from "./contracts.module.css"
import cardSwipe from "../../assets/img/contract-pose-modal.png"
import failedImg from "../../assets/img/contract-pay-failed.png"
import successImg from "../../assets/img/contract-pay-success.png"

const PoseModal = ({ open, onClose, poseResponse }) => {

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
        <div className={style.posePaper}>
          {poseResponse === "empty" && (
            <div className={style.poseWaiting}>
              <p>لطفا کارت خود را بکشید</p>

              <img src={cardSwipe} alt='' />
            </div>
          )}
          {poseResponse === "success" && (
            <div className={style.poseSuccess}>
              <p>پرداخت موفقیت آمیز</p>
              <img src={successImg} alt='' />
            </div>
          )}
          {poseResponse === "failed" && (
            <div className={style.poseFailed}>
              <p>پرداخت انجام نشد</p>
              <img src={failedImg} alt='' />
            </div>
          )}
        </div>
      </Fade>
    </Modal>
  )
}

export default PoseModal
