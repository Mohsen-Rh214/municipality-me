import React, { useEffect } from "react"

import Fade from "@mui/material/Fade"
import Modal from "@mui/material/Modal"

// style
import style from "./upload.module.css"
import cardSwipe from "../../assets/img/contract-pose-modal.png"
import failedImg from "../../assets/img/contract-pay-failed.png"
import successImg from "../../assets/img/contract-pay-success.png"
import loadingSvg from "../../assets/svg/loading.svg"

const ProcessModal = ({ open, onClose, response }) => {

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
                <div className={style.responsePaper}>
                    {response === "loading" && (
                        <div className={style.resLoading}>
                            <p>لطفا شكيبا باشيد</p>

                            <img src={loadingSvg} alt='' />
                        </div>
                    )}
                    {response === "success" && (
                        <div className={style.resSuccess}>
                            <img src={successImg} alt='' />
                            <p>موفقیت آمیز</p>
                        </div>
                    )}
                    {response === "failed" && (
                        <div className={style.resSuccess}>
                            <img src={failedImg} alt='' />
                            <p>عمليات با خطا مواجه شد!</p>
                        </div>
                    )}
                </div>
            </Fade>
        </Modal>
    )
}

export default ProcessModal
