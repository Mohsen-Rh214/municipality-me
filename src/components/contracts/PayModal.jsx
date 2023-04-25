import React, { useEffect } from "react"

import Fade from "@mui/material/Fade"
import Modal from "@mui/material/Modal"
import Button from "@mui/material/Button"

// style
import style from "./contracts.module.css"
import numberWithCommas from "../../utils/numbersWithComma"
import { useState } from "react"

const PayModal = ({ payCallback, open, onClose, payData, charge_cost }) => {
  const handleClickPay = () => {
    payCallback()
    onClose()
  }

  const [myList, setMyList] = useState([])
  const makeList = () => {
    let list = []

    if(payData && payData.link) return 

    if (
      payData &&
      payData.part_month &&
      payData.part_month.first_month !== null
    ) {
        const cost = payData.part_month.first_month?.cost
      list.push({
        name: payData.part_month.first_month?.name,
        cost: numberWithCommas(cost.toFixed(3)) || 0,
      })
    }

    if (payData && payData.full_month) {
      for (let i = 0; i < payData.full_month?.length; i++) {
        list.push({
          name: payData.full_month[i],
          cost: numberWithCommas(charge_cost.toFixed(3)),
        })
      }
    }

    if (
      payData &&
      payData?.part_month &&
      payData?.part_month.end_month !== null
    ) {
        const cost = payData.part_month.end_month?.cost
      list.push({
        name: payData?.part_month?.end_month?.name,
        cost: numberWithCommas(cost.toFixed(3)) || 0,
      })
    }

    setMyList(list)
  }

  useEffect(() => {
    makeList()
  }, [open])

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
        {payData === undefined ? (
          <div className={style.empty}>
            <p>هیچ موردی انتخاب نشده است!</p>
          </div>
        ) : (
          <div className={style.paper}>
            <div className={style.row1}>
              <div className={style.row1Item}>
                <p>از تاریخ</p>
                <p>{payData?.start_date}</p>
              </div>
              <div className={style.row1Item}>
                <p>تا تاریخ</p>
                <p>{payData?.pay_until_date}</p>
              </div>
            </div>
            <div className={style.row2}>
              <p>ماه‌های انتخاب شده</p>
              <div className={style.row2Rows}>
                {myList &&
                  myList.map((item, index) => {
                    return (
                      <>
                        <div className={style.row2Item}>
                          <div>
                            <p>{item.name}</p>
                            <p>{item.cost}</p>
                          </div>
                        </div>
                        <hr className={style.rowDivider} />
                      </>
                    )
                  })}
              </div>
              <div className={style.row2Total}>
                <p>مجموع</p>
                <p>
                  {numberWithCommas(payData?.cost_until_date?.toFixed(0) || 0)}{" "}
                  ریال
                </p>
              </div>
            </div>
            <div className={style.row3}>
              <Button variant='contained' onClick={handleClickPay}>
                پرداخت
              </Button>
            </div>
          </div>
        )}
      </Fade>
    </Modal>
  )
}

export default PayModal
