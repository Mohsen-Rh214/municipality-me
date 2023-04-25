import React, { useState } from "react"
import { useNavigate } from "react-router-dom"
import qs from "qs"
import { withoutAuth } from "../../services/AxiosRequest"
import { setInStorage } from "../../utils/SessionStorage"

// components
import Textfield from "../../components/login/textfield"
import Button from "../../components/login/button"

// styles
import style from "./login.module.css"
import userIcon from "../../assets/svg/login-user.svg"
import passIcon from "../../assets/svg/login-pass.svg"
import logo from "../../assets/img/hspace-logo.png"
import loadSvg from "../../assets/svg/login-load.svg"

const Login = () => {
  const navigate = useNavigate()
  const [loading, setLoading] = useState(false)

  const [username, setUsername] = useState()
  const [password, setPassword] = useState()

  const endpoint = "/management/api/employee-login/"

  const handleLogin = () => {
    setLoading(true)
    checkFail()
    withoutAuth
      .post(
        endpoint,
        qs.stringify({
          username: username,
          password: password,
        })
      )
      .then((response) => {
        // console.log("login : ", response)
        if (response.status >= 200 && response.status < 300) {
          setLoading(false)
          setInStorage("token", response.data.auth.access)
          setInStorage("user", response.data.first_name)
          setInStorage("permissions", JSON.stringify(response.data.permissions))
          navigate("/panel/personal-info", { replace: true })
        } else {
          console.log(`${endpoint} !200: `, response)
          setFail(true)
        }
      })
      .catch((e) => {
        console.log("error: ", e)
        setFail(true)
      })
  }

  const [failed, setFail] = useState(false)
  const checkFail = () => {
    !username ? setFail(true) : setFail(false)
    !password ? setFail(true) : setFail(false)
  }

  return (
    <div className={style.login}>
      <div className={style.loginBox}>
        <p>سامانه مدیریت میادین</p>
        <div className={style.inputs}>
          <Textfield
            placeholder='نام کاربری'
            type='text'
            onChange={(value) => setUsername(value)}
            icon={userIcon}
            maxLength={32}
            minLength={5}
            autoFocus
          />
          <Textfield
            placeholder='رمز عبور'
            type='password'
            onChange={(value) => setPassword(value)}
            icon={passIcon}
            maxLength={10}
            minLength={5}
          />
        </div>
        <div className={style.button}>
          <Button variant='contained' onClick={handleLogin}>
            {loading === false || failed ? (
              <p>ورود</p>
            ) : (
              <img src={loadSvg} alt='' className={style.loading} />
            )}
          </Button>
          {failed && <p>* نام کاربری یا رمز عبور اشتباه است</p>}
        </div>
      </div>
      <div className={style.present}>
        <p>طراحی و پیاده سازی توسط تیم فضا زمان هرمزگان</p>
        <div className={style.logoBox}>
          <img src={logo} alt='' />
          <p>فضا زمان هرمزگان</p>
        </div>
      </div>
    </div>
  )
}

export default Login
