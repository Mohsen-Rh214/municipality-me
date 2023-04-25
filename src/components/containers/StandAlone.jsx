import React from "react"

// style
import style from "./containers.module.css"

const StandAlone = ({ children }) => {
  return <div className={style.standAlone}>{children}</div>
}

export default StandAlone
