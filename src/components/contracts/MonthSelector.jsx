import React from "react"

// style
import style from "./contracts.module.css"
import monthTick from "../../assets/svg/pay-month-tick.svg"

const MonthSelector = ({
  counter,
  setCounter,
  year,
  // setYear,
  startYear,
  endYear,
  currentYear,
  year1,
  year2,
  // setYear1,
  setYear2,
}) => {
  function handleCheckboxChange(monthId) {
    let newYear = [...year]
    let monthIndex = newYear.findIndex((month) => month.id === monthId)
    let month = newYear[monthIndex]

    // if previous month is not checked, return
    if (monthIndex > 0 && !newYear[monthIndex - 1].isSelected) return

    // check if year1[11].isSelected before year2
    if (startYear !== endYear) {
      if (currentYear === endYear && !year1[11].isSelected) {
        let selectedMonths = 0
        year2.forEach((month) => {
          if (month.isSelected) {
            selectedMonths++
            month.isSelected = false
          }
        })
        setCounter(counter - selectedMonths)
        return

        // if a month in year1 is unchecked, year2 gets unchecked and subtrtacted
      } else if (currentYear === startYear && month.isSelected) {
        let selectedMonths = 0
        let copyMonth = [...year2]
        copyMonth.forEach((month) => {
          if (month.isSelected) {
            selectedMonths++
            month.isSelected = false
          }
        })
        setYear2(copyMonth)
        setCounter(counter - selectedMonths)
        // return
      }
    }

    // toggle check or uncheck click
    if (!month.isSelected) {
      if (
        month.status !== "paid" &&
        month.status !== "unavailable" &&
        month.status !== "debt"
      ) {
        month.isSelected = true

        // count selected months
        setCounter(counter + 1)
      }
    } else {
      // if click is 'uncheck', uncheck months after and subtract from counter
      if (
        month.status !== "paid" &&
        month.status !== "unavailable" &&
        month.status !== "debt"
      ) {
        let selectedMonths = 0
        for (let i = monthIndex; i < newYear.length; i++) {
          let selectedMonth = newYear[i]
          if (selectedMonth.isSelected) {
            selectedMonths++
            selectedMonth.isSelected = false
          }
        }

        setCounter((counter) => counter - selectedMonths)
      }
    }
  }

  return (
    <div className={style.month_selector}>
      {year.map((item, index) => {
        return (
          <div
            className={style.month_item}
            key={item.id}
            onClick={() => {
              handleCheckboxChange(item.id)
            }}
          >
            <div
              className={`${style.month_checkbox} ${
                item.status === "disabled"
                  ? style.month_empty
                  : item.status === "paid"
                  ? style.month_paid
                  : item.status === "debt"
                  ? style.month_debt
                  : item.status === "current" && item.isSelected === true
                  ? style.month_current_select
                  : item.status === "current"
                  ? style.month_current
                  : item.status === "avalible" && item.isSelected === true
                  ? style.month_avalible_select
                  : item.status === "avalible"
                  ? style.month_avalible
                  : style.month_avalible
              } `}
            >
              {item.isSelected === true && <img src={monthTick} alt='' />}
            </div>
            <div className={style.month_texts}>
              <p>{item.label}</p>
              {item.status === "disabled" ? (
                <p style={{ color: "#D5D5D5" }}>غیر فعال</p>
              ) : item.status === "paid" ? (
                <p style={{ color: "#44C2A8" }}>پرداخت شده</p>
              ) : item.status === "debt" ? (
                <p style={{ color: "#FF2B37" }}>بدهی</p>
              ) : item.status === "current" && item.isSelected === true ? (
                <p style={{ color: "#FDBC71" }}>انتخاب شده</p>
              ) : item.status === "current" ? (
                <p style={{ color: "#FDBC71" }}>جاری</p>
              ) : item.status === "avalible" && item.isSelected === true ? (
                <p style={{ color: "#B5B5B5" }}>انتخاب شده</p>
              ) : item.status === "avalible" ? (
                <p style={{ color: "#B5B5B5" }}>قابل انتخاب</p>
              ) : (
                ""
              )}
            </div>
          </div>
        )
      })}
    </div>
  )
}

export default MonthSelector
