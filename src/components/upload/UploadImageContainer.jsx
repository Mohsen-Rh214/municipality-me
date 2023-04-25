import React from 'react'

// style
import style from './upload.module.css'

const UploadImageContainer = ({ label, image, ...rest }) => {

    return (
        <div className={style.wide_field}>
            <p>{label}</p>
            <div className={style.image_container}

                style={{
                    background: `url(${image && image})`,
                }}

                {...rest}
            />
        </div>
    )
}

export default UploadImageContainer