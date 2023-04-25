import React, { useState, useEffect } from "react"
import { useNavigate } from "react-router-dom"
import { setInStorage, getToken } from "../../utils/SessionStorage"

// styles
import style from "./layout.module.css"
import closeIcon from "../../assets/svg/drawer-close.svg"
import homeImg from "../../assets/svg/drawer-home.svg"
import personalImg from "../../assets/svg/drawer-personal-info.svg"
import employeeImg from "../../assets/svg/drawer-employee.svg"
import propertyImg from "../../assets/svg/drawer-property.svg"
import buildingImg from "../../assets/svg/drawer-building.svg"
import unitImg from "../../assets/svg/drawer-unit.svg"
import contractImg from "../../assets/svg/drawer-contract.svg"
import transactionsImg from "../../assets/svg/drawer-transactions.svg"
import exitImg from "../../assets/svg/drawer-exit.svg"

const menu = [
  // { title: "خانه", icon: homeImg, route: "" },
  { title: "اطلاعات فردی", icon: personalImg, route: "personal-info" },
  // { title: "اطلاعات کارمندان", icon: employeeImg, route: "employees-info" },
  { title: "اطلاعات زمین", icon: propertyImg, route: "ground-info" },
  { title: "اطلاعات ساختمان", icon: buildingImg, route: "building-info" },
  { title: "اطلاعات واحد", icon: unitImg, route: "unit-info" },
  { title: "اطلاعات قرارداد", icon: contractImg, route: "contracts" },
  // { title: "تراکنش ها", icon: transactionsImg, route: "transactions" },
]

const Sidebar = ({ open, setOpen }) => {
  const navigate = useNavigate()

  const [selected, setSelected] = useState()
  const windPath = window.location.pathname

  const isSelected = (item) => {
    if (!item) return false
    if (windPath === `/panel/${item.route}`) return true
    return false
  }

  const isHome = () => {
    if (windPath === `/panel`) return true
  }

  return (
    <div
      className={`${style.drawer} ${open === true ? style.drawer_open : style.drawer_closed
        }`}
    >
      <div
        className={`${style.drawer_header} ${open === true ? style.drawer_header_open : style.drawer_header_closed
          }`}
      >
        <img src={closeIcon} alt='' onClick={() => setOpen(!open)} />
      </div>
      <div
        className={`${style.drawer_body} ${open === true ? style.drawer_body_Open : style.drawer_body_closed
          }`}
      >
        {/* <DrawerItem item={menu[0]} open={open} selected={isHome} /> */}
        <DrawerItem item={menu[0]} open={open} selected={isSelected} />
        <DrawerItem item={menu[1]} open={open} selected={isSelected} />
        <DrawerItem item={menu[2]} open={open} selected={isSelected} />
        <DrawerItem item={menu[3]} open={open} selected={isSelected} />
        <DrawerItem item={menu[4]} open={open} selected={isSelected} />
        {/* <DrawerItem item={menu[5]} open={open} selected={isSelected} /> */}
        {/* <DrawerItem item={menu[6]} open={open} selected={isSelected} /> */}
        {/* <DrawerItem item={menu[7]} open={open} selected={isSelected} /> */}
        <div
          className={`${style.drawerItem} ${style.exit}`}
          onClick={() => navigate("/", { replace: true })}
        >
          <img src={exitImg} alt='' />
          {open === true ? <p>خروج</p> : null}
        </div>
      </div>
    </div>
  )
}

const DrawerItem = ({ item, selected, open }) => {
  const navigate = useNavigate()

  if (selected(item) !== true)
    return (
      <div className={style.notSelectedDrawerItem}>
        <div
          className={style.drawerItem}
          key={item.title}
          onClick={() => {
            setInStorage("selected-tab", item.title)
            navigate(item.route, { replace: true })
          }}
        >
          <img src={item.icon} alt='' />
          {open === true ? <p>{item.title}</p> : null}
        </div>
      </div>
    )
  return (
    <div className={style.selectedDrawerItem}>
      <div className={style.selectedBar}></div>
      <div
        className={style.drawerItem}
        key={item.title}
        onClick={() => navigate(item.route, { replace: true })}
      >
        <img src={item.icon} alt='' />
        {open === true ? <p>{item.title}</p> : null}
      </div>
    </div>
  )
}

export default Sidebar
