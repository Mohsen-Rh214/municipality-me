const TableCell = ({ children, fontSize, color, checkbox, ...rest }) => {
  const { onClick } = { ...rest }
  return (
    <td
      style={{
        fontSize: fontSize == null && "0.83vw",
        color: color,
        fontWeight: onClick && "600",
        cursor: onClick && "pointer",
      }}
      id={checkbox && "checkbox"}
      onClick={onClick}
    >
      {children}
    </td>
  )
}

export default TableCell
