import React, { useState } from "react"
import Button from "@mui/material/Button"

// style
import style from "./containers.module.css"

const TabsContainer = ({ children, tabs }) => {
  const [selected, setSelected] = useState(tabs[0]?.text)
  return (
    <div className={style.tabsContainer}>
      <div className={style.tabBar}>
        {tabs?.map((item) => {
          return (
            <Tab
              selected={selected}
              onClick={() => {
                setSelected(item.text)
                item.onClick()
              }}
              tab={item}
              key={item.text}
            >
              {item.text}
            </Tab>
          )
        })}
      </div>
      <div className={style.tabBox}>{children}</div>
    </div>
  )
}

const Tab = ({ tab, children, selected, onClick }) => {
  const buttonStyle = {
    width: "7vw",
    height: "44px",
    borderRadius: "12px 12px 0px 0px",

    color: selected === tab.text ? "#3569E7" : "##FEFEFE",

    fontSize: "13px",
    fontWeight: "500",
  }
  return (
    <div className={style.tab}>
      <Button
        sx={buttonStyle}
        style={{ background: selected === tab.text ? "#FFFF" : "#3569E7" }}
        variant='contained'
        onClick={onClick}
        disableElevation
      >
        {children}
      </Button>
      {selected === tab.text && <div className={style.selectedBar}></div>}
    </div>
  )
}

export default TabsContainer
