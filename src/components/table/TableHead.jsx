import TableRow from "./TableRow"
import TableCell from "./TableCell"

// mui
import Checkbox from "@mui/material/Checkbox"

function TableHead({
  headCells,
  indexRow,
  selectRow,
  onSelectAllClick,
  numSelected,
  rowCount,
}) {
  return (
    <thead>
      <TableRow borderBottom='head'>
        {selectRow && (
          <TableCell checkbox>
            <Checkbox
              indeterminate={numSelected > 0 && numSelected < rowCount}
              checked={rowCount > 0 && numSelected === rowCount}
              onChange={onSelectAllClick}
            />
          </TableCell>
        )}
        {indexRow && <TableCell>#</TableCell>}
        {headCells.map((headCell) => {
          if (headCell.permission === undefined)
            return <TableCell key={headCell.id}>{headCell.label}</TableCell>
          if (headCell.permission === true)
            return <TableCell key={headCell.id}>{headCell.label}</TableCell>
        })}
      </TableRow>
    </thead>
  )
}

export default TableHead
