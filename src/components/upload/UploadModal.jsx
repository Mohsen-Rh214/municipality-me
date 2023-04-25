import React, { useEffect, useState } from 'react'

import WideField from '../form/WideField'
import UploadImageContainer from './UploadImageContainer'
import { mayadinAx } from '../../services/AxiosRequest'

import Fade from "@mui/material/Fade"
import Modal from "@mui/material/Modal"
import Button from "@mui/material/Button"

// style
import style from "./upload.module.css"
import ProcessModal from './ProcessModal'

const UploadModal = ({ open, onClose, file, name, id, cId, onClick }) => {
    const [fileImage, setFileImage] = useState(null)
    const [fileDesc, setFileDesc] = useState(null)
    const [loading, setLoading] = useState(false)

    useEffect(() => {

        if (file?.name) {
            setFileImage(URL.createObjectURL(file))
        } else {
            setFileImage(file?.doc)
        }

    }, [open])


    // Upload or Edit file
    const uploadEndPoint = 'asset/api/Asset/'

    const handleFile = (e) => {

        // using formdata for upload
        const formData = new FormData();
        formData.append('doc', file);
        formData.append('tittle', name);
        formData.append('description', fileDesc);
        formData.append('object_id', id);
        formData.append('content_type', cId);

        setLoading('loading')
        setOpenProccess(true)
        mayadinAx.post(
            uploadEndPoint,
            formData,
            { headers: { 'Content-Type': 'multipart/form-data' } }
        )
            .then(res => {
                console.log('res: ', res)

                setLoading('success')
            })

            .catch(e => {
                console.log('error: ', e)
                setLoading('failed')
            })
            .finally(() => setTimeout(() => {
                onClose()
                setOpenProccess(false)
            }, 1000))
    }


    // proccess modal
    const [openProccess, setOpenProccess] = useState(false)
    const closeProcess = () => setOpenProccess(false)

    return (
        <>

            <ProcessModal
                open={openProccess}
                onClose={closeProcess}

                response={loading}
            />


            <Modal
                aria-labelledby='transition-modal-title'
                aria-describedby='transition-modal-description'
                className={style.modal}
                open={open}
                onClose={onClose}
                closeAfterTransition
            >
                <Fade in={open}>

                    <div className={style.paper_upload}>
                        <div className='form'>
                            <UploadImageContainer
                                label='تصوير سند'
                                image={fileImage && fileImage}

                                onClick={onClick}
                            />


                            <WideField
                                label='عنوان سند'
                                rows={1}
                                value={name}

                                disabled
                            />

                            <WideField
                                label='توضيحات'

                                value={fileDesc}
                                onChange={(e) => setFileDesc(e.target.value)}
                            />


                            <div className={style.btn_submit}>
                                <Button variant='contained'
                                    onClick={handleFile}
                                >
                                    تائید و ثبت
                                </Button>
                            </div>
                        </div>
                    </div>
                </Fade>
            </Modal>
        </>
    )
}

export default UploadModal
