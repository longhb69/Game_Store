import React, { useEffect, useRef, useState } from 'react'
import { baseUrl } from '../shared'
import axios from 'axios'
import { useLocation, useNavigate } from 'react-router-dom'
import { useAccount, useLogin } from '../LoginContext'

export default function Login() {
    const [username, setUsername] = useState('')
    const [password, setPassword] = useState('')
    const [incorrect, setIncorrect] = useState(false)
    const [loggedIn, setLoggedIn, cartQuantity, setCartQuantity, getCartQuantity] = useLogin()
    const [account, setAccount, library, setLibrary, getLibrary] = useAccount()
    const [isValid, setIsValid] = useState(false)
    const label1Ref = useRef()
    const label2Ref = useRef()
    const navigate = useNavigate()

    const location = useLocation()

    function login(e) {
        e.preventDefault()
        const url = baseUrl + 'api/token/'
        axios
            .post(url, {
                username: username,
                password: password,
                headers: {
                    'Content-Type': 'application/json',
                },
            })
            .then((response) => {
                localStorage.setItem('access', response.data.access)
                localStorage.setItem('refresh', response.data.refresh)
                setLoggedIn(true)
                getLibrary()
                const url2 = baseUrl + 'api/account/'
                axios
                    .get(url2, {
                        headers: {
                            Authorization: 'Bearer ' + response.data.access,
                        },
                    })
                    .then((response) => {
                        setAccount(response.data.username)
                        localStorage.setItem('account', response.data.username)
                        navigate('/')
                    })
                const url3 = baseUrl + 'cart/quantity'
                axios
                    .get(url3, {
                        headers: {
                            'Content-Type': 'application/json',
                            Authorization: 'Bearer ' + localStorage.getItem('access'),
                        },
                    })
                    .then((response) => {
                        setCartQuantity(response.data.quantity)
                    })
                    .catch((e) => {
                        console.error('Error can not get quantity')
                    })

                location.state.previousUrl ? navigate(location.state.previousUrl) : navigate('/')
            })
            .catch((e) => {
                if (e.response && (e.response.status === 401 || e.response.status === 400)) {
                    setIncorrect(true)
                    console.log('Incorrect username or password')
                }
            })
    }
    function CheckValid() {
        if (username.trim() !== '' && password.trim() !== '') {
            setIsValid(true)
        } else {
            setIsValid(false)
        }
    }
    useEffect(() => {
        CheckValid()
    }, [[username, password]])

    function handleFocus1() {
        label1Ref.current.classList.add('move-up')
    }
    function handleBlur1() {
        if (username.trim() === '') label1Ref.current.classList.remove('move-up')
    }
    function handleFocus2() {
        label2Ref.current.classList.add('move-up')
    }
    function handleBlur2() {
        if (password.trim() === '') label2Ref.current.classList.remove('move-up')
    }
    return (
        <div className="w-full h-screen	login-container text-center">
            <div className="max-w-[550px] w-[500px] inline-block text-left align-middle bg-[#202020] mt-20 m-8 rounded">
                <div className="text-center pb-[60px] pt-[50px] h-full px-[55px]">
                    <div className="text-center pb-[60px] pt-[50px] px-[45px] h-full">
                        <div className="flex flex-col w-full max-w-[500px]">
                            <h6 className="text-center overflow-hidden text-lg font-medium">LOGIN</h6>
                            <form className="flex flex-col mx-auto w-full max-w-[350px] mt-5" onSubmit={login}>
                                <div className="w-full h-[100px] inline-flex flex-col relative">
                                    <label ref={label1Ref} className="label absolute top-0 left-0">
                                        Username
                                    </label>
                                    <div className={`input-field relative rounded w-full border ${incorrect ? 'border-red-500' : ' border-[#5532db]'}`}>
                                        <input
                                            type="text"
                                            name="username"
                                            onFocus={handleFocus1}
                                            onBlur={handleBlur1}
                                            className="login-input-field h-[60px] p-6 pt-[30px] w-full pb-[10px] bg-transparent "
                                            value={username}
                                            onChange={(e) => {
                                                setUsername(e.target.value)
                                            }}
                                        />
                                    </div>
                                </div>
                                <div className="w-full h-[100px] inline-flex flex-col relative">
                                    <label ref={label2Ref} className="label absolute top-0 left-0">
                                        Password
                                    </label>
                                    <div className={`input-field relative rounded w-full border ${incorrect ? 'border-red-500' : ' border-[#5532db]'}`}>
                                        <input
                                            className="h-[60px] p-6 pt-[30px] w-full pb-[10px] bg-transparent transition ease-in-out duration-300 delay-[300ms]"
                                            type="password"
                                            name="password"
                                            onFocus={handleFocus2}
                                            onBlur={handleBlur2}
                                            value={password}
                                            onChange={(e) => {
                                                setPassword(e.target.value)
                                            }}
                                        />
                                    </div>
                                </div>
                                {incorrect ? <p className="text-red-500 mb-2">Incorrect username or password</p> : null}
                                <div
                                    className={`flex flex-col rounded w-full bg-[#5532db] hover:bg-[#32db55] transition ease-in duration-[120ms]  ${
                                        isValid ? '' : 'pointer-events-none'
                                    }`}>
                                    <button className={`w-full font-medium  login-btn ${isValid ? '' : 'opacity-[0.5] cursor-default'}`} type="submit">
                                        LOGIN
                                    </button>
                                </div>
                            </form>
                            <div className="mt-5">
                                <h1>Don't have an account?</h1>
                                <div className="">
                                    <a href="/signup" className="hover:underline cursor-pointer">
                                        SIGN UP
                                    </a>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}
