import React, { useState, useEffect } from "react"
import { p2e } from "../../utils/convertNumerics"
import MonthSelector from "./MonthSelector"

// style
import style from "./contracts.module.css"
import nextYearAc from "../../assets/svg/charge-next-year-active.svg"
import nextYearD from "../../assets/svg/charge-next-year-disable.svg"
import prevYearAc from "../../assets/svg/charge-prev-year-active.svg"
import prevYearD from "../../assets/svg/charge-prev-year-disable.svg"

// mui
import Divider from "@mui/material/Divider"
import Button from "@mui/material/Button"

const DueDateModal = ({
  startYear,
  endYear,
  year1,
  year2,
  handleConfirmDuePayments,
  close,
  open,
  counter,
  setCounter,
}) => {
  const [monthsList1, setMonthsList1] = useState([...year1])
  const [monthsList2, setMonthsList2] = useState([...year2])

  const [selectedYear, setSelectedYear] = useState({
    year: p2e(startYear),
    month: monthsList1,
    set: setMonthsList1,
  })

  const onClose = () => {
    // getSelectedLists()
    handleConfirmDuePayments(counter)
    close()
    // console.log("counter count: ", counter)
  }

  useEffect(() => {
    // getSelectedLists()
  }, [])

  useEffect(() => {
    handleConfirmDuePayments(counter)
  }, [open])

  return (
    <div className={style.dueDateModal}>
      <div className={style.modal_header}>
        <p>انتخاب چندین گزینه برای پرداخت هم امکان پذیر است</p>
      </div>
      <Divider />
      <div className={style.modal_months}>
        <div className={style.selectYear}>
          <div
            className={style.prevYear}
            onClick={() => {
              // getSelectedLists()
              if (selectedYear.year > p2e(startYear))
                setSelectedYear((prev) => ({
                  ...prev,
                  year: Number(prev.year) - 1,
                  month: monthsList1,
                  set: setMonthsList1,
                }))
            }}
          >
            {selectedYear.year > p2e(startYear) ? (
              <img src={prevYearAc} alt='' />
            ) : (
              <img src={prevYearD} alt='' />
            )}
            <p>سال قبل</p>
          </div>
          <div className={style.isSelectedYear}>
            <p>سال {selectedYear.year}</p>
          </div>
          <div
            className={style.nextYear}
            onClick={() => {
              // getSelectedLists()
              if (selectedYear.year < p2e(endYear))
                setSelectedYear((prev) => ({
                  ...prev,
                  year: Number(prev.year) + 1,
                  month: monthsList2,
                  set: setMonthsList2,
                }))
            }}
          >
            <p>سال بعد</p>
            {selectedYear.year < p2e(endYear) ? (
              <img src={nextYearAc} alt='' />
            ) : (
              <img src={nextYearD} alt='' />
            )}
          </div>
        </div>

        {/* --- >>> S E L E C T O R */}
        <MonthSelector
          counter={counter}
          setCounter={setCounter}
          year={selectedYear.month}
          // setYear={selectedYear.set}
          startYear={startYear}
          endYear={p2e(endYear)}
          currentYear={selectedYear.year.toString()}
          year1={year1}
          year2={year2}
          // setYear1={setMonthsList1}
          setYear2={setMonthsList2}
        />
      </div>
      <Divider />
      <Button variant='text' onClick={onClose}>
        تائید انتخاب
      </Button>
    </div>
  )
}
export default DueDateModal
