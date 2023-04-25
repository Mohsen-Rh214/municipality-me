import React from "react"

// style
import style from "./form.module.css"

const PField = ({ label, text }) => {
  return (
    <div className={style.form_field}>
      <p>{label}</p>
      <div style={{ width: "18vw", padding: "0 10px" }}>
        <p style={{ fontWeight: "bold" }}>{text}</p>
      </div>
      {/* <div></div> */}
    </div>
  )
}

export default PField
