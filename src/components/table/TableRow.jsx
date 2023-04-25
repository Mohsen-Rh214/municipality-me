// style
import style from "./table.module.css"

const TableRow = ({
  children,
  borderBottom,
  height,
  hover,
  selected,
  onClick,
  pointer,
}) => {
  const border =
    borderBottom === "head"
      ? "2px solid #F4F4F4"
      : borderBottom === "body"
      ? "1px solid #F4F4F4"
      : "none"

  const tableHeight = height == null ? "6.45vh" : "34px"

  const hoverClass = hover === true ? style.tableRowBody : null

  const backgroundColor = selected === true ? "#E6EDFC" : null

  return (
    <tr
      className={hoverClass}
      style={{
        borderBottom: border,
        height: tableHeight,
        backgroundColor: backgroundColor,
        cursor: pointer && "pointer",
      }}
      onClick={onClick}
    >
      {children}
    </tr>
  )
}

export default TableRow
