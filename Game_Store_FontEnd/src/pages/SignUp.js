import React, { useEffect, useRef, useState } from 'react'
import { baseUrl } from '../shared'
import { useNavigate } from 'react-router-dom'
import { useAccount, useCart, useLogin } from '../LoginContext'

export default function SignUp() {
    const [username, setUsername] = useState('')
    const [password, setPassword] = useState('')
    const [email, setEmail] = useState('')
    const [incorrect, setIncorrect] = useState(false)
    const [loggedIn, setLoggedIn, cartQuantity, setCartQuantity, getCartQuantity] = useLogin()
    const [account, setAccount, library, setLibrary, getLibrary] = useAccount()
    const [itemsInCart, setItemsInCart] = useCart()
    const [notValid, setNotValid] = useState(false)

    const [isValid, setIsValid] = useState(false)
    const label1Ref = useRef()
    const label2Ref = useRef()
    const label3Ref = useRef()
    const navigate = useNavigate()

    useEffect(() => {
        localStorage.clear()
        setLoggedIn(false)
        setAccount(null)
        setItemsInCart(null)
        setLibrary(null)
    }, [])

    function createUser(e) {
        e.preventDefault()
        console.log('Create')
        const url = baseUrl + 'api/account/register'
        fetch(url, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ username: username, email: email, password: password }),
        })
            .then((response) => {
                if (!response.ok) {
                    if (response.status === 400) {
                        setNotValid(true)
                        throw new Error(`HTTP error! Status: ${response.status}`)
                    }
                }
                navigate('/login')
                return response.json()
            })
            .then((data) => {
                console.log(data)
            })
            .catch((error) => {
                console.error('Fetch error:', error)
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
    function handleFocus3() {
        label3Ref.current.classList.add('move-up')
    }
    function handleBlur3() {
        if (email.trim() === '') label3Ref.current.classList.remove('move-up')
    }
    return (
        <div className="w-full h-[817px] login-container text-center">
            <div className="max-w-[550px] w-[500px] inline-block text-left align-middle bg-[#202020] mt-20 m-8 rounded">
                <div className="text-center pb-[60px] pt-[50px] px-[45px] h-full">
                    <div className="flex flex-col w-full max-w-[500px]">
                        <h6 className="text-center overflow-hidden text-lg">SIGN UP</h6>
                        <form className="flex flex-col mx-auto w-full max-w-[350px] mt-5" onSubmit={createUser}>
                            <div className="w-full h-[100px] inline-flex flex-col relative">
                                <label ref={label3Ref} className="label absolute top-0 left-0">
                                    Email
                                </label>
                                <div className="input-field relative rounded w-full border border-[#5532db]">
                                    <input
                                        required
                                        type="email"
                                        name="email"
                                        onFocus={handleFocus3}
                                        onBlur={handleBlur3}
                                        className="login-input-field h-[60px] p-6 pt-[30px] w-full pb-[10px] bg-transparent "
                                        value={email}
                                        onChange={(e) => {
                                            setEmail(e.target.value)
                                        }}
                                    />
                                </div>
                            </div>
                            <div className="w-full h-[100px] inline-flex flex-col relative">
                                <label ref={label1Ref} className="label absolute top-0 left-0">
                                    Username
                                </label>
                                <div className={`input-field relative rounded w-full border ${notValid ? 'border-red-500' : 'border-[#5532db]'}`}>
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
                                <div className={`input-field relative rounded w-full border ${notValid ? 'border-red-500' : 'border-[#5532db]'}`}>
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
                            {incorrect ? <p className="text-red">Incorrect username or password</p> : null}
                            <div
                                className={`flex flex-col rounded w-full bg-[#5532db] hover:bg-[#32db55] transition ease-in duration-[120ms]  ${
                                    isValid ? '' : 'pointer-events-none'
                                }`}>
                                <button className={`w-full font-medium  login-btn ${isValid ? '' : 'opacity-[0.5] cursor-default'}`} type="submit">
                                    SIGN UP
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    )
}
