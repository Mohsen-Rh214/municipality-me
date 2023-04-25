import React, { useContext } from "react"
import { Outlet } from "react-router-dom"
import { DrawerContext } from "../../utils/drawerContext"

// style
import style from "./layout.module.css"

// Componentes
import Sidebar from "./Sidebar"
import Navbar from "./Navbar"

const Panel = () => {
  // const [openDrawer, setOpenDrawer] = useState(true)
  const { isOpen, setIsOpen } = useContext(DrawerContext)

  return (
    <div className={style.panel}>
      <Navbar />
      <Sidebar open={isOpen} setOpen={setIsOpen} />
      <div
        className={
          isOpen === true ? style.body_drawerOpen : style.body_drawerClosed
        }
      >
        <Outlet />
      </div>
    </div>
  )
}

export default Panel
