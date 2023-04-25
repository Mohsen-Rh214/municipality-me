import React, { useState, useEffect } from "react"
import { mayadinAx } from "../../services/AxiosRequest"
import DeleteModal from "../actions/DeleteModal"
import UploadModal from "../upload/UploadModal"

// style
import style from "./form.module.css"
import uploadImg from "../../assets/img/upload-img.png"
import attachImg from "../../assets/img/upload-attach.png"
import uploadCan from "../../assets/svg/upload-can.svg"
import uploadAttach from "../../assets/svg/upload-attach.svg"
// import uploadPen from "../../assets/svg/upload-pen.svg"
import uploadView from "../../assets/svg/upload-view.svg"
import uploadClip from "../../assets/svg/upload-attach-clip.svg"


const UploadContainer = ({ desc, attach, contentTypeId, objId, uploaded }) => {
  const hiddenFileInput = React.useRef(null)
  const [selectedFile, setSelectedFile] = useState(null)
  const [fileImg, setFileImg] = useState(null)

  // / --- >>>> *** get Default
  const uploadEndPoint = 'asset/api/Asset/'

  // Get Uploaded files
  const [isUploaded, setIsUploaded] = useState(null)

  // select file
  const handleSelectFile = (event) => {

    setFileImg(URL.createObjectURL(event.target.files[0]))
    setSelectedFile(event.target.files[0])
    setIsUploaded(false)
    setOpenUpload(true)

  }

  const handleClick = () => {
    hiddenFileInput.current.click()
  }

  // see if has default uploaded value
  const findUploadedDoc = (description) => {
    if (uploaded) {
      const file = uploaded.find((item) => item.tittle === description)
      // console.log('file: ', file)

      if (file) {
        setSelectedFile(file)
        setFileImg(file.doc)
        setIsUploaded(true)
      }
    }
  }

  // Check if uploaded file matches desc
  React.useEffect(() => {
    findUploadedDoc(desc)
  }, [uploaded, desc])


  // ----- delete 
  const [openDel, setOpenDel] = useState(false)
  const onCloseDel = () => setOpenDel(false)

  const handleDelete = () => {

    mayadinAx
      .delete(`${uploadEndPoint}/${selectedFile.id}/`)
      .then((respond) => {
        console.log("respond: ", respond)
        setFileImg(null)
        setSelectedFile(null)
      })
      .catch((e) => {
        console.log("error: ", e)
      })

  }

  const clickOnDelete = () => {

    if (isUploaded === true) {
      return setOpenDel(true)
    }
    else {
      setFileImg(null)
      return setSelectedFile(null)
    }
  }


  // ----- upload modal 
  const [openUpload, setOpenUpload] = useState(false)
  const onCloseUpload = () => setOpenUpload(false)



  // this method is for DELETE function,
  // it checks again if a file is uploaded or not
  // // if uploaded, gets the id for furthur delete
  // useEffect(() => {
  //   apiCallFlag = false
  //   getUploaded()
  // }, [openUpload])



  // open file in new tab
  const openInNewTab = (url) => {
    window.open(fileImg, "_blank", "noopener,noreferrer")
  }


  if (fileImg !== null)
    return (
      <>

        {/* --- *** --- Delete Modal --- *** --- */}
        <DeleteModal
          open={openDel}
          onClose={onCloseDel}
          confirmCallback={handleDelete}
          selected={1}
        />

        {/* --- *** --- Upload Modal --- *** --- */}
        <UploadModal
          open={openUpload}
          onClose={onCloseUpload}
          file={selectedFile}
          name={desc}

          id={objId}
          cId={contentTypeId}
          onClick={openInNewTab}
        />


        <div className={style.upload}>
          <div className={style.upload_container}>
            <div
              className={attach ? style.uploaded_attach : style.uploaded_image}
              style={{
                background: `url(${attach ? attachImg : fileImg})`,
              }}
            />
            <div className={style.upload_actions_container}>
              <div className={style.upload_actions}>
                {/* <div className={style.upload_action}>
                <img src={uploadPen} alt='' />
              </div> */}
                <div className={style.upload_action}

                  //  ---- ** handle Delete
                  onClick={clickOnDelete}
                >
                  <img src={uploadCan} alt='' />
                </div>
              </div>


              {/* --- >>> *** handle view *** <<< --- */}
              <img
                src={uploadView}
                id={style.upload_view}
                alt=''
                onClick={() => setOpenUpload(true)}
              />

            </div>
          </div>
          {attach ? (
            <p style={{ color: "#3569E7" }}>
              <img src={uploadClip} alt='' /> {desc}
            </p>
          ) : (
            <p>{desc}</p>
          )}
        </div>
      </>

    )

  return (
    <>

      {/* --- *** --- Upload Modal --- *** --- */}
      <UploadModal
        open={openUpload}
        onClose={onCloseUpload}
        file={selectedFile}
        name={desc}

        id={objId}
        cId={contentTypeId}
      />

      <div className={style.upload}>
        <div className={style.upload_container} onClick={handleClick}>
          <img src={attach ? uploadAttach : uploadImg} alt='' />
          <input
            name={desc}
            type='file'
            ref={hiddenFileInput}
            onChange={handleSelectFile}
            accept={
              attach
                ? ".doc,.docx,.xml,application/msword,application/vnd.openxmlformats-officedocument.wordprocessingml.document,image/*,.zip,.rar,.pdf"
                : "image/*"
            }
            hidden
          />
        </div>
        {attach ? (
          <p style={{ color: "#3569E7" }}>
            <img src={uploadClip} alt='' /> {desc}
          </p>
        ) : (
          <p>{desc}</p>
        )}
      </div>
    </>
  )
}

export default UploadContainer
