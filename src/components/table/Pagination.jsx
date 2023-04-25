// style
import style from "./table.module.css"

const Pagination = ({
  desc,
  icon,
  count,
  standAlone,
  currentPage,
  onPageChange,
}) => {
  //// const currentPage = 39
  // making a list of pages
  const pages = (count%10) > 0 ? Math.floor(count / 10) + 1 : Math.trunc(count / 10)
  // making the list renderable
  let pagination = []
  for (let i = 1; i <= pages; i++) {
    pagination.push(i)
  }

  // helper method to config showing numbers
  const checkNumber = (number) => {
    if (currentPage === number) return number
    else if (number === currentPage + 1) return number
    else if (number === currentPage - 1) return number
    else if (number === pagination[0]) return number
    else if (number === pagination[pagination.length - 1]) return number
    else if (number === currentPage - 2 && number === pagination[1]) return number
    else if (
      number === currentPage + 2 &&
      number === pagination[pagination.length - 1 - 1]
    )
      return number
    else return "..."
  }

  const disableNext = currentPage < pages ? false : true
  const disablePrev = currentPage > 1 ? false : true

  const newList = (pagination || []).map((item, index) => {
    return checkNumber(item)
  })

  return (
    <div
      className={style.pagination}
      style={{ width: standAlone && "80vw" }}
    >
      <div>
        <div>
          <button
            className={style.paginPrev}
            onClick={() => onPageChange("prev")}
            disabled={disablePrev}
          >
            <p>صفحه قبل</p>
          </button>
        </div>
        {(newList || []).map((item, index) => {
          return item !== "..." ? (
            <div key={index}>
              <button
                className={style.paginationButton}
                onClick={() => onPageChange("num", item)}
                disabled={currentPage === item ? true : false}
              >
                {item}
              </button>
            </div>
          ) : (
            (newList[index + 1] || newList[index - 1]) !== "..." && (
              <div key={index}>
                <button
                  className={style.paginationButton}
                  // onClick={() => onPageChange("num", item)}
                  // disabled
                  style={{ cursor: "default" }}
                >
                  {item}
                </button>
              </div>
            )
          )
        })}
        <div>
          <button
            className={style.paginNext}
            onClick={() => onPageChange("next")}
            disabled={disableNext}
          >
            <p>صفحه بعد</p>
          </button>
        </div>
      </div>
      <div className={style.total}>
        <img src={icon} alt=''/>
        <p>
          {desc}: {count}
        </p>
      </div>
    </div>
  )
}

export default Pagination
