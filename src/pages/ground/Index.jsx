import React, { useState, useEffect } from "react"
import { useNavigate } from "react-router-dom"
import { mayadinAx } from "../../services/AxiosRequest"

// style
import titleIcon from "../../assets/svg/building-title-icon.svg"
import loadingSvg from "../../assets/svg/loading.svg"
import totalSvg from "../../assets/svg/personal-total.svg"

// Mui
import Table from "@mui/material/Table"
import Checkbox from "@mui/material/Checkbox"
import MenuItem from "@mui/material/MenuItem"

// custom components
import ActionBar from "../../components/layout/ActionBar"
import StandAlone from "../../components/containers/StandAlone"
import TableHead from "../../components/table/TableHead"
import TableRow from "../../components/table/TableRow"
import TableCell from "../../components/table/TableCell"
import Pagination from "../../components/table/Pagination"
import SearchInput from "../../components/actions/SearchInput"
import DeleteBtn from "../../components/actions/DeleteBtn"
import AddBtn from "../../components/actions/AddBtn"
import SortDrop from "../../components/actions/SortDrop"
import DeleteModal from "../../components/actions/DeleteModal"

// table head cells
const headCells = [
    // { id: "id", label: "#" },
    { id: "tittle", label: "نام زمین" },
    { id: "usage_type", label: "نوع کاربری" },
    // { id: "count_floor", label: "تعداد طبقه" },
    { id: "doc_number", label: "شماره سند" },
]

const Ground = () => {

    // navigations
    const navigate = useNavigate()

    // loading
    const [isLoading, setIsLoading] = useState(false)

    // Custom pagination variables
    const [currentPage, setCurrentPage] = useState()
    const [totalCount, setTotalCount] = useState(0)

    // list data and api
    let endpoint = `/ground/api/Ground/`
    const [listData, setListData] = useState(null)

    const fetchOrders = (pageNum, data) => {
        setIsLoading(true)
        mayadinAx
            .get(endpoint, {
                params: {
                    ...(data || null), page: pageNum || null,
                    fields: "doc_number,id,tittle,usage_type",
                },
            })
            .then((respond) => {

                // console.log("land info: ", respond)

                setListData(respond.data.results)
                setTotalCount(respond.data.count)
                setCurrentPage(pageNum || 1)

            })
            .catch((e) => console.log("error: ", e))
            .finally(() => setIsLoading(false))
    }

    const refresh = () => {
        fetchOrders()
    }

    useEffect(() => {
        refresh()
    }, [])

    // --- >>> Functions and Actions

    // state for pagination with sorted data
    const [selectedData, setSelectedData] = useState(null)

    const handlePagination = (type, pageNumber) => {
        const plusOne = currentPage + 1
        const minOne = currentPage - 1
        switch (type) {
            case "num":
                fetchOrders(pageNumber, selectedData)
                return
            case "prev":
                fetchOrders(minOne, selectedData)
                return
            case "next":
                fetchOrders(plusOne, selectedData)
                return
            default:
                return
        }
    }

    // - sort
    const [ordering, setOrdering] = useState(null)

    const sortItems = [
        { label: "صعودی", value: "id" },
        { label: "نزولی", value: "-id" },
        { label: "جدید ترین", value: "date_joined" },
        { label: "قدیمی ترین", value: "-date_joined" },
    ]

    const handleSort = (e) => {
        if (!search) {
            fetchOrders(1, { ordering: e.target.value })
            setOrdering(e.target.value)
            setSelectedData(e.target.value)
        } else {
            fetchOrders(1, { search, ordering: e.target.value })
            setOrdering(e.target.value)
            setSelectedData({ search, ordering: e.target.value })
        }
    }

    // - search
    const [search, setSearch] = useState(null)
    const handleSearch = (e) => {
        if (!ordering) {
            fetchOrders(null, { search })
            setSelectedData({ search })
        } else {
            fetchOrders(null, { search, ordering })
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

    // -- -- delete
    const [openDel, setOpenDel] = useState(false)
    const onCloseDel = () => setOpenDel(false)

    const handleDelete = () => {
        const id_list = selected.toString()

        setIsLoading(true)

        mayadinAx
            .delete(`${endpoint}/-1/`, {
                params: { id_list },
            })
            .then((respond) => {
                console.log("respond: ", respond)
                setIsLoading(false)
                refresh()
            })
            .catch((e) => {
                console.log("error: ", e)
                setIsLoading(false)
            })
    }


    return (
        <div className="page">

            <ActionBar title='اطلاعات زمین' icon={titleIcon}>

                <AddBtn onClick={() => navigate("/panel/add-ground")} />

                <DeleteBtn
                    onClick={() => setOpenDel(true)}
                >حذف</DeleteBtn>
                {/* delete confirm modal */}
                <DeleteModal
                    open={openDel}
                    onClose={onCloseDel}
                    confirmCallback={handleDelete}
                    selected={selected}
                />


                <SearchInput
                    type='text'
                    onChange={(e) => setSearch(e.target.value)}
                    onSearch={handleSearch}
                />

                {/* -- > -- > Sort < -- < -- */}
                <SortDrop onChange={handleSort} value={ordering}>
                    {sortItems.map((item) => {
                        return <MenuItem value={item.value}
                            key={item.value}
                        >{item.label}</MenuItem>
                    })}
                </SortDrop>

            </ActionBar>




            <div className="page_body_col">
                <StandAlone>

                    {isLoading === true ? (
                        <div className='isLoading'>
                            <p>در حال بارگزاری</p>
                            <p>لطفا شکیبا باشید</p>
                            <img src={loadingSvg} alt='' />
                        </div>
                    ) : (

                        <Table>

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
                                            onClick={(event) => handleClick(event, item.id)}
                                        >
                                            <TableCell checkbox>
                                                <Checkbox
                                                    checked={isItemSelected}
                                                />
                                            </TableCell>
                                            <TableCell>
                                                <p>{item.id}</p>
                                            </TableCell>

                                            {/*  -- >> This Column is Clickable for Edit page */}
                                            <TableCell
                                                onClick={() => {
                                                    navigate(`/panel/edit-ground/${item.id}`)
                                                }}
                                            >
                                                <p>{item.tittle || "_"}</p>
                                            </TableCell>
                                            <TableCell>
                                                <p>{item.usage_type || "-"}</p>
                                            </TableCell>
                                            <TableCell>
                                                <p>{item.doc_number || "-"}</p>
                                            </TableCell>

                                        </TableRow>
                                    )
                                })}
                            </tbody>

                        </Table>
                    )}

                </StandAlone>

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

export default Ground