import React from "react"

// style
import style from "./form.module.css"

const EditField = ({ label, text, onClick, setEdit }) => {
  return (
    <div className={style.form_field}>
      <p>{label}</p>
      <div
        style={{
          width: "18vw",
          display: "flex",
          justifyContent: "space-between",
          padding: "0 10px",
        }}
      >
        <p style={{ fontWeight: "bold" }}>{text}</p>
        <p
          style={{ fontWeight: "bold", color: "#49B2FF", cursor: "pointer" }}
          onClick={() => setEdit(true)}
        >
          ویرایش
        </p>
      </div>
      {/* <div></div> */}
    </div>
  )
}

export default EditField
