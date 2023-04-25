import React, { useState, useEffect } from "react"
import { mayadinAx } from "../../services/AxiosRequest"

// Mui
import Button from "@mui/material/Button"
import Fade from "@mui/material/Fade"
import Modal from "@mui/material/Modal"
import ListItemButton from "@mui/material/ListItemButton"
import ListItemIcon from "@mui/material/ListItemIcon"

// style
import style from "./address.module.css"
import loadingSvg from "../../assets/svg/loading.svg"
import itemIcon from "../../assets/svg/modal-item.svg"

// custom Component
import SearchField from "../../components/address/SearchField"

const AddressModal = ({ open, onClose, openAdd, onSelect }) => {
  const buttonStyles = {
    background: "#3569E7",
    borderRadius: "10px",
    width: "9.5vw",
    height: "42px",
  }

  // api to get list
  const [addressList, setAddressList] = useState([])
  const [isLoading, setIsLoading] = useState()

  // to see if stops multiple api calls on first render
  const [hasFetched, setHasFetched] = useState(false)

  const endpoint = `/location/api/UserAddress/`
  const getAddressList = (page, data) => {
    setIsLoading(true)
    mayadinAx
      .get(endpoint)
      .then((respond) => {
        if (respond.status === 200) {
          setAddressList(respond.data.results.features)
          setIsLoading(false)
          setHasFetched(true)
          if (respond.data.next) {



            // this number needs changing sometimes
            setNextUrl(respond.data.next.slice(30))
            setItemsCount(respond.data.count)
          }
        }
      })
      .catch((e) => {
        console.log("error: ", e)
        setIsLoading(false)
      })
  }

  const openAddAddress = () => {
    openAdd()
    onClose()
  }

  useEffect(() => {
    getAddressList()
  }, [open])

  // send selected address to form page
  const handleSelect = (myAddress) => {
    onSelect(myAddress)
    onClose()
  }

  // --- >>> -- >> next

  const [listLoading, setListLoading] = useState(false)
  const [nextUrl, setNextUrl] = useState(null)
  const [itemsCount, setItemsCount] = useState(0)

  // scroll
  // api call on scroll list
  const [scrollTop, setScrollTop] = useState(0)
  const [isLastItemVisible, setIsLastItemVisible] = useState(false)

  // checking for last item to be invisible and then call the api
  const handleScroll = (e) => {
    setScrollTop(e.target.scrollTop)

    // console.log({ clientHeight: e.target.clientHeight, scrollTop: e.target.scrollTop, scrollHeight: e.target.scrollHeight})

    if (
      e.target.clientHeight + e.target.scrollTop + 10 >=
      e.target.scrollHeight
    ) {
      if (!isLastItemVisible) {
        setIsLastItemVisible(true)
        onLastItemReached()
      }
    }
  }

  // im not sure if neccessary
  const onLastItemReached = () => {
    setIsLastItemVisible(false)
    if (listLoading === false) {
      getNext()

      // to prevent from sending 15 request under 1s
      setTimeout(() => {
        setListLoading(true)
      }, 1)
    }
  }

  // getting next
  const getNext = () => {
    if (addressList.length > 0) {
      if (nextUrl !== null) {
        if (listLoading === false) {
          setListLoading(true)
          if (addressList.length + 1 < itemsCount) {
            mayadinAx
              .get(nextUrl)
              .then((response) => {
                setListLoading(false)
                setAddressList([
                  ...addressList,
                  ...response.data.results.features,
                ])
                if (response.data.next) {



                  // this number needs changing sometimes
                  setNextUrl(response.data.next.slice(30))
                }
              })
              .catch((e) => {
                console.log("error: ", e)
                setListLoading(false)
              })
            setListLoading(false)
          } else {
            setListLoading(false)
          }
        }
      }
    }
  }

  // --- >>> Search
  const [searchRes, setSearchRes] = useState()
  const handleSearch = (e) => {
    const value = e.target.value
    if (!value) return

    searchFunc(value)
  }

  const [fetched, setFetched] = useState(false)
  const searchFunc = (search) => {
    if (!search) return

    // console.log('inside fetch with fetched: ', fetched)
    if (fetched === false) {
      // console.log("fetching searched: ", search)
      mayadinAx
        .get(endpoint, {
          params: { search },
        })
        .then((response) => {
          // console.log("res search: ", response)
          setTimeout(() => {
            setAddressList(response.data.results.features)
          }, 500)

          setFetched(true)
        })
        .catch((e) => {
          console.log("error: ", e)
        })
    }

    // to prevent from sending 15 request under 1s
    setTimeout(() => {
      setFetched(false)
    }, 1)
  }

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
        {!isLoading ? (
          <div className={style.paper}>
            <div className={style.topRow}>
              <SearchField placeholder='جستجو' onChange={handleSearch} />
              {/* <Dropdown />
              <Dropdown />
              <Dropdown /> */}
            </div>
            <div className={style.middleRow}>
              <div
                onScroll={handleScroll}
                style={{
                  height: "42vh",
                  overflowY: "auto",
                  // border: "1px solid",
                }}
              >
                {addressList?.map((item) => {
                  const address = item.properties.address
                  const short_name = item.properties.short_name
                  return (
                    <ListItemButton
                      onClick={() => {
                        handleSelect(item)
                      }}
                      key={short_name}
                    >
                      <ListItemIcon>
                        <img src={itemIcon} style={{ width: "25px" }} />
                      </ListItemIcon>
                      <p className={style.itemP}>
                        {short_name} / {address}
                      </p>
                    </ListItemButton>
                  )
                })}
              </div>
            </div>
            <div className={style.lastRow}>
              <Button sx={buttonStyles} variant='contained' onClick={openAddAddress}>
                افزودن
              </Button>
            </div>
          </div>
        ) : (
          <div className={style.loadingPage}>
            <p>در حال بارگزاری</p>
            <p>لطفا شکیبا باشید</p>
            <img src={loadingSvg} alt='' />
          </div>
        )}
      </Fade>
    </Modal>
  )
}

export default AddressModal