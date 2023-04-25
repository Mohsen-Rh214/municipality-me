import React, { useState, useEffect } from "react"
import { useNavigate } from "react-router-dom"
import { mayadinAx } from "../../services/AxiosRequest"
import { getToken } from "../../utils/SessionStorage"

// moment
import moment from "moment-jalaali"

// style
import style from "./contracts.module.css"
import titleIcon from "../../assets/svg/contracts-title-icon.svg"
import loadingSvg from "../../assets/svg/loading.svg"
import totalSvg from "../../assets/svg/personal-total.svg"
import editSvg from "../../assets/svg/cell-edit.svg"

// Mui
import Table from "@mui/material/Table"
import Checkbox from "@mui/material/Checkbox"
import MenuItem from "@mui/material/MenuItem"

// custom components
import ActionBar from "../../components/layout/ActionBar"
import TabsContainer from "../../components/containers/TabsContainer"
import TableHead from "../../components/table/TableHead"
import TableRow from "../../components/table/TableRow"
import TableCell from "../../components/table/TableCell"
import Pagination from "../../components/table/Pagination"
import SearchInput from "../../components/actions/SearchInput"
import DeleteBtn from "../../components/actions/DeleteBtn"
import AddBtn from "../../components/actions/AddBtn"
import SortDrop from "../../components/actions/SortDrop"
import { p2e } from "../../utils/convertNumerics"
import DeleteModal from "../../components/actions/DeleteModal"

const Contracts = () => {
  // navigations
  const navigate = useNavigate()

  // Permissions
  const permissions = JSON.parse(getToken("permissions"))
  const p_addContract = permissions["contract.add_contract"]
  const p_delContract = permissions["contract.delete_contract"]
  const p_viewContract = permissions["contract.view_contract"]

  //   tabs and tables
  const tablist = [
    {
      text: "همه",
      state: "A",
      onClick: () => {
        setSelectTab("A")
        dynamicFetch("A", 1)
      },
    },
    {
      text: "پرداخت نشده",
      state: "N",
      onClick: () => {
        setSelectTab("N")
        dynamicFetch("N", 1)
      },
    },
    {
      text: "رو به اتمام",
      state: "R",
      onClick: () => {
        setSelectTab("R")
        dynamicFetch("R", 1)
      },
    },
    {
      text: "مازاد",
      state: "F",
      onClick: () => {
        setSelectTab("F")
        dynamicFetch("F", 1)
      },
    },
  ]

  // state for pagination with sorted data
  const [selectedData, setSelectedData] = useState(null)

  const [selectTab, setSelectTab] = useState(tablist[0].state)
  const menuItems =
    selectTab === "A"
      ? [
          { label: "صعودی", value: "id" },
          { label: "نزولی", value: "-id" },
          { label: "وضعیت صعودی", value: "status" },
          { label: "وضعیت نزولی", value: "-status" },
        ]
      : selectTab === "N"
      ? [
          { label: "صعودی", value: "id" },
          { label: "نزولی", value: "-id" },
          { label: "موعد پرداخت صعودی", value: "paid_up_to" },
          { label: "موعد پرداخت نزولی", value: "-paid_up_to" },
        ]
      : selectTab === "R"
      ? [
          { label: "صعودی", value: "id" },
          { label: "نزولی", value: "-id" },
          { label: "تاریخ پایان صعودی", value: "finish_date" },
          { label: "تاریخ پایان نزولی", value: "-finish_date" },
        ]
      : selectTab === "F"
      ? [
          { label: "تاریخ پایان صعودی", value: "finish_date" },
          { label: "تاریخ پایان نزولی", value: "-finish_date" },
          { label: "تاریخ شروع صعودی", value: "start_date" },
          { label: "تاریخ شروع نزولی", value: "-start_date" },
        ]
      : []

  // table head cells
  const headCells =
    selectTab === "A"
      ? [
          { id: "unit", label: "واحد" },
          { id: "buyer", label: "خریدار" },
          // { id: "guild", label: "صنف" },
        ]
      : selectTab === "N"
      ? [
          { id: "unit", label: "واحد" },
          { id: "buyer", label: "خریدار" },
          { id: "due_date", label: "آخرین موعد سررسید ماهانه" },
        ]
      : selectTab === "R"
      ? [
          { id: "unit", label: "واحد" },
          { id: "buyer", label: "خریدار" },
          { id: "end_contract", label: "پایان قرارداد" },
          { id: "until_end", label: "زمان باقیمانده از قرارداد" },
        ]
      : selectTab === "F"
      ? [{ id: "unit", label: "واحد" }]
      : [
          { id: "unit", label: "واحد" },
          { id: "buyer", label: "خریدار" },
          // { id: "guild", label: "صنف" },
        ]

  //  -- time calculating
  // state for 'پرداخت نشده'
  const oneMonthAgo = moment().add(-1, "month").format("YYYY-MM-DD")
  // state for 'رو به اتمام'
  const oneMonthAhead = moment().add(1, "month").format("YYYY-MM-DD")

  // state for table: زمان باقی مانده از قرارداد
  const calculateTimeTo = (finishDate) => {
    const untilFinish = moment(finishDate, "jYYYY/jM/jD").fromNow()
    return untilFinish
  }

  // dynamic filter
  const endpoint = `contract/api/Contract/`

  // state for 'مازاد'
  // --> "F" as finished

  const dynamicFetch = (filter, pageNum, data) => {
    switch (filter) {
      case "N":
        fetchOrders(pageNum, {
          paid_up_to__lte: p2e(oneMonthAgo),
          // status: "C",
          ...(data || null),
        })
        return
      case "R":
        fetchOrders(pageNum, {
          finish_date__lte: p2e(oneMonthAhead),
          ...(data || null),
        })
        return
      case "F":
        fetchOrders(pageNum, {
          status: "F",
          ...(data || null),
        })
        return
      default:
        fetchOrders(pageNum, { ...(data || null) })
        return
    }
  }

  // pagination
  const [currentPage, setCurrentPage] = useState(1)

  const handlePagination = (type, pageNumber) => {
    const plusOne = currentPage + 1
    const minOne = currentPage - 1
    switch (type) {
      case "num":
        // fetchOrders(endpoint, pageNumber)
        dynamicFetch(selectTab, pageNumber, selectedData)
        return

      case "prev":
        // fetchOrders(endpoint, minOne)
        dynamicFetch(selectTab, minOne, selectedData)
        return

      case "next":
        // fetchOrders(endpoint, plusOne)
        dynamicFetch(selectTab, plusOne, selectedData)
        return

      default:
        return
    }
  }

  // -- state
  // - sort
  const [ordering, setOrdering] = useState(null)

  const handleSort = (e) => {
    if (!search) {
      dynamicFetch(selectTab, 1, { ordering: e.target.value })
      setOrdering(e.target.value)
      setSelectedData(e.target.value)
    } else {
      dynamicFetch(selectTab, 1, { search, ordering: e.target.value })
      setOrdering(e.target.value)
      setSelectedData({ search, ordering: e.target.value })
    }
  }

  // - search
  const [search, setSearch] = useState(null)
  const handleSearch = (e) => {
    if (!ordering) {
      dynamicFetch(selectTab, null, { search })
      setSelectedData({ search })
    } else {
      dynamicFetch(selectTab, null, { search, ordering })
      setSelectedData({ search, ordering })
    }
  }

  // -- -- Select
  const [selected, setSelected] = useState([])
  const isSelected = (id) => selected.indexOf(id) !== -1

  const handleClick = (event, id) => {
    const selectedIndex = selected.indexOf(id)
    let newSelected = []

    if (selectedIndex === -1) {
      newSelected = newSelected.concat(selected, id)
    } else if (selectedIndex === 0) {
      newSelected = newSelected.concat(selected.slice(1))
    } else if (selectedIndex === selected.length - 1) {
      newSelected = newSelected.concat(selected.slice(0, -1))
    } else if (selectedIndex > 0) {
      newSelected = newSelected.concat(
        selected.slice(0, selectedIndex),
        selected.slice(selectedIndex + 1)
      )
    }
    setSelected(newSelected)
  }

  const handleSelectAllClick = (event) => {
    if (event.target.checked) {
      const newSelecteds = (listData || []).map((n) => n.id)
      setSelected(newSelecteds)
      return
    }
    setSelected([])
  }

  // list data and api
  const [listData, setListData] = useState(null)
  const [totalCount, setTotalCount] = useState(0)

  // loading
  const [isLoading, setIsLoading] = useState(false)
  const fetchOrders = (pageNum, data) => {
    setIsLoading(true)
    mayadinAx
      .get(endpoint, {
        params: {
          ...(data || null),
          page: pageNum || null,
          fields: "id,tittle,tenant,paid_up_to,finish_date",
        },
      })
      .then((respond) => {
        console.log("respond: ", respond)
        setIsLoading(false)
        if (respond.status === 200) {
          setListData(respond.data.results)
          setTotalCount(respond.data.count)
          setCurrentPage(pageNum || 1)
        }
      })
      .catch((e) => {
        console.log("error: ", e)
        setIsLoading(false)
      })
  }

  useEffect(() => {
    fetchOrders()
  }, [])

  // -- -- delete
  const [openDel, setOpenDel] = useState(false)
  const onCloseDel = () => setOpenDel(false)

  const handleDelete = () => {
    const id_list = selected.toString()

    setIsLoading(true)

    mayadinAx
      .delete(`${endpoint}-1/`, {
        params: { id_list },
      })
      .then((respond) => {
        console.log("respond: ", respond)
        setIsLoading(false)
        fetchOrders()
      })
      .catch((e) => {
        console.log("error: ", e)
        setIsLoading(false)
      })
  }

  return (
    <div className='page'>
      {/* -- > -- > actions < -- < -- */}
      <ActionBar title='اطلاعات قرارداد' icon={titleIcon}>
        {p_addContract === true && (
          <AddBtn onClick={() => navigate("/panel/add-contract")} />
        )}

        {p_delContract === true && (
          <>
            <DeleteBtn onClick={() => setOpenDel(true)}>حذف</DeleteBtn>

            {/* delete confirm modal */}
            <DeleteModal
              open={openDel}
              onClose={onCloseDel}
              confirmCallback={handleDelete}
              selected={selected}
            />
          </>
        )}

        {/* -- > -- > Search < -- < -- */}
        <SearchInput
          type='text'
          onChange={(e) => setSearch(e.target.value)}
          onSearch={handleSearch}
        />

        {/* -- > -- > Sort < -- < -- */}
        <SortDrop onChange={handleSort} value={ordering}>
          {menuItems.map((item) => {
            return (
              <MenuItem value={item.value} key={item.label}>
                {item.label}
              </MenuItem>
            )
          })}
        </SortDrop>
      </ActionBar>
      <div className={style.page_body_col}>
        {/* -- > -- > Tabs < -- < -- */}
        <TabsContainer tabs={tablist}>
          {/* -- > -- > loading < -- < -- */}
          {isLoading === true ? (
            <div className={style.isLoading}>
              <p>در حال بارگزاری</p>
              <p>لطفا شکیبا باشید</p>
              <img src={loadingSvg} alt='' />
            </div>
          ) : (
            <Table>
              {/* table heads change based on tabs */}
              <TableHead
                headCells={headCells}
                selectRow
                indexRow
                onSelectAllClick={handleSelectAllClick}
                rowCount={(listData || []).length}
                numSelected={selected.length}
              />

              {/* ---> body <--- */}
              <tbody>
                {(listData || []).map((item, index) => {
                  const isItemSelected = isSelected(item.id)

                  return (
                    <TableRow
                      hover={true}
                      key={item.id}
                      selected={isItemSelected}
                      onClick={(event) => {
                        handleClick(event, item.id)
                        // handleEditButton(item.id)
                      }}
                    >
                      <TableCell checkbox>
                        <Checkbox checked={isItemSelected} />
                      </TableCell>
                      <TableCell>
                        <p>{item.id}</p>
                      </TableCell>
                      <TableCell
                        onClick={() => {
                          navigate(`/panel/edit-contract/${item.id}`)
                        }}
                      >
                        <p>{item.tittle}</p>
                      </TableCell>

                      {selectTab === "F" ? null : (
                        <TableCell>
                          <p>{item.tenant.get_fullname}</p>
                        </TableCell>
                      )}
                      {selectTab === "N" && (
                        <TableCell>
                          <p>{item.paid_up_to}</p>
                        </TableCell>
                      )}
                      {selectTab === "R" && (
                        <TableCell>
                          <p>{item.finish_date}</p>
                        </TableCell>
                      )}
                      {selectTab === "R" && (
                        <TableCell>
                          <p>{calculateTimeTo(item.finish_date)}</p>
                        </TableCell>
                      )}
                    </TableRow>
                  )
                })}
              </tbody>
            </Table>
          )}
        </TabsContainer>
        {/* -- > -- > PAGINATION < -- < -- */}
        <Pagination
          standAlone
          count={totalCount}
          currentPage={currentPage}
          onPageChange={handlePagination}
          icon={totalSvg}
          desc='تعداد کل'
        />
      </div>
    </div>
  )
}

export default Contracts
