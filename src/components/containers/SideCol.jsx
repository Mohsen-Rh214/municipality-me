import React from "react"

// style
import style from "./containers.module.css"

const SideCol = ({ qr, children, add }) => {
  if (qr)
    return (
      <div className={style.qrCol}>
        <p>QR Code</p>
        <img src={qr} alt='' 
        className={add && style.bluryImg}
        />
      </div>
    )

  return <div className={style.sideCol}>{children}</div>
}

export default SideCol
