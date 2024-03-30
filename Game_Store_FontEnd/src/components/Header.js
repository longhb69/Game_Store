import { useEffect, useRef, useState } from 'react'
import { Link, useNavigate, useLocation } from 'react-router-dom'
import { useAccount, useLogin, useCart } from '../LoginContext'
import axios from 'axios'
import { baseUrl } from '../shared'
import { faL } from '@fortawesome/free-solid-svg-icons'

export default function Header(props) {
    const [loggedIn, setLoggedIn] = useLogin()
    const [
        itemsInCart,
        setItemsInCart,
        getItemInCart,
        cartQuantity,
        setCartQuantity,
        getCartQuantity,
    ] = useCart()
    const [account, setAccount, libary, setLibary, getLibary] = useAccount()
    const [username, setUsername] = useState('')
    const [typing, setTyping] = useState(false)
    const [query, setQuery] = useState('')
    const [result, setResult] = useState()
    const typeFieldRef = useRef()
    const navigate = useNavigate()
    const location = useLocation()
    const [isInputFocused, setIsInputFocused] = useState(false)
    const [onHover, setOnHover] = useState(true)
    const [searching, setSearching] = useState(false)
    const searchRef = useRef()
    const loadingitems = Array.from({ length: 4 })

    useEffect(() => {
        const handleKeyPress = (event) => {
            if (event.key === 'Enter') {
                GoToSearch(query)
                resetInputField()
                setOnHover(false)
                setIsInputFocused(false)
            }
        }
        const divElement = searchRef.current
        // Cleanup: remove the event listener when the component unmounts
        divElement.addEventListener('keydown', handleKeyPress)
        return () => {
            divElement.removeEventListener('keydown', handleKeyPress)
        }
    }, [query])

    const handleInputChange = debounce((event) => {
        setQuery(event.target.value)
    })
    function debounce(cb, delay = 1000) {
        let timeout
        return (...args) => {
            clearTimeout(timeout)
            setSearching(true)
            timeout = setTimeout(() => {
                cb(...args)
            }, delay)
        }
    }
    const GoToSearch = (query) => {
        navigate(`search/${query}`)
    }
    const resetInputField = () => {
        typeFieldRef.current.value = ''
    }

    function handleLogout(value) {
        localStorage.clear()
        navigate('')
        setLoggedIn(value)
        setAccount(null)
        setItemsInCart(null)
        setLibary(null)
    }
    const handleSetUsername = (username) => {
        setUsername(username)
    }
    const handleLogin = () => {
        navigate('/login', {
            state: {
                previousUrl: location.pathname,
            },
        })
    }
    useEffect(() => {
        if (query.trim() !== '') {
            fetchData()
            setTyping(true)
        } else {
            setTyping(false)
        }
        setSearching(false)
    }, [query])
    const fetchData = async () => {
        const url = baseUrl + `search?q=${query}`
        try {
            const response = await axios.get(url)
            const data = await response.data
            setResult(data)
        } catch (e) {
            console.log(e)
        }
    }
    return (
        <>
            <div className="header flex sticky top-0 h-[85px] z-[900] bg-[#121212]">
                <div className="flex justify-between mx-auto w-[75%] max-w-[1600px] relative">
                    <div className="flex justify-center items-center">
                        <Link to={''}>
                            <div
                                id="logo"
                                className="p-2 bg-[#5532db] rounded border border-[#fff]"
                            >
                                <img
                                    className="h-9"
                                    src="https://res.cloudinary.com/dfo61m8dy/image/upload/v1704796277/Store_yr1avb.svg"
                                />
                            </div>
                        </Link>
                        <div className="flex h-[55px] ml-5 ">
                            <div
                                ref={searchRef}
                                className={`flex items-center rounded-[40px] my-2 min-w-[240px] w-[240px] ${
                                    isInputFocused
                                        ? 'bg-[#fff]/[.1]'
                                        : 'bg-[#202020]'
                                } transition ease-in-out duration-100`}
                            >
                                <div className="flex shirk-0 h-full m-[13.62px]">
                                    <button className="cursor-default text-[#F5F5F5]/[.6]">
                                        <span className="h-[13px] w-[13px] block">
                                            <svg
                                                xmlns="http://www.w3.org/2000/svg"
                                                class="w-full h-full"
                                                viewBox="0 0 21 20"
                                                preserveAspectRatio="xMidYMid meet"
                                            >
                                                <g
                                                    transform="scale(1 -1) rotate(-45 -11.93502884 -2)"
                                                    stroke="currentColor"
                                                    stroke-width="1.65"
                                                    fill="none"
                                                    fill-rule="evenodd"
                                                >
                                                    <circle
                                                        cx="7.70710678"
                                                        cy="7.70710678"
                                                        r="7"
                                                    ></circle>
                                                    <path
                                                        d="M15.2071068 8.62132034h5.6923881"
                                                        stroke-linecap="square"
                                                    ></path>
                                                </g>
                                            </svg>
                                        </span>
                                    </button>
                                </div>
                                <div className="w-full h-full">
                                    <div className="items-center flex h-full w-full text-sm">
                                        <input
                                            ref={typeFieldRef}
                                            name="query"
                                            onChange={(event) => {
                                                handleInputChange(event)
                                            }}
                                            className={`mr-[13.62px] text-[#F5F5F5] border-none overflow-hidden whitespace-nowrap w-full outline-0 ${
                                                isInputFocused
                                                    ? 'bg-transparent'
                                                    : 'bg-[#202020] transition ease-in-out duration-100'
                                            }`}
                                            placeholder="Search Store"
                                            onFocus={() =>
                                                setIsInputFocused(true)
                                            }
                                            onBlur={() =>
                                                setIsInputFocused(false)
                                            }
                                        />
                                    </div>
                                    {(isInputFocused || onHover) && typing ? (
                                        <div
                                            className={`search-live-container`}
                                            onMouseEnter={(e) => {
                                                setOnHover(true)
                                            }}
                                            onMouseLeave={(e) => {
                                                setOnHover(false)
                                            }}
                                        >
                                            <div className="shadow-[0px_5px_10px_rgba(0,0,0,0.3)] rounded px-2.5 py-5 bg-[#202020] text-center]">
                                                <span className="transition">
                                                    <div className="h-full w-[490px] max-w-[490px] text-left">
                                                        <ul className="p-0 m-0 list-none ml-3.5">
                                                            {searching ? (
                                                                <>
                                                                    {loadingitems.map(
                                                                        (
                                                                            loading
                                                                        ) => {
                                                                            return (
                                                                                <li className="w-full mb-3">
                                                                                    <div className="h-[46px] max-h-[46px] flex gap-4">
                                                                                        <div className="w-[8%] h-full skeleton"></div>
                                                                                        <div className="flex items-center w-[92%] pr-1">
                                                                                            <div className="skeleton h-[20px] w-full"></div>
                                                                                        </div>
                                                                                    </div>
                                                                                </li>
                                                                            )
                                                                        }
                                                                    )}
                                                                </>
                                                            ) : (
                                                                <>
                                                                    {result &&
                                                                    result.length >
                                                                        0 ? (
                                                                        <>
                                                                            {result.map(
                                                                                (
                                                                                    game
                                                                                ) => {
                                                                                    return (
                                                                                        <li className="w-full">
                                                                                            <div className="h-[46px] max-h-[46px] my-2">
                                                                                                <a
                                                                                                    className="text-left game-display relative overflow-hidden text-ellipsis	whitespace-nowrap w-full h-full max-w-[100%] flex items-center"
                                                                                                    href={`/app/${game.slug}`}
                                                                                                >
                                                                                                    <div className="transition w-full flex items-center h-full opacity-1">
                                                                                                        <div className="mr-3.5 rounded shrink-0 overflow-hidden w-[37px] h-full">
                                                                                                            <div className="relative w-full h-full pb-[calc(4/3 * 100%)]">
                                                                                                                <div className="items-center flex h-full w-full absolute overflow-hidden">
                                                                                                                    <div className="w-full h-full">
                                                                                                                        <img
                                                                                                                            className="transition ease-in-out delay-[450ms] absolute w-full h-full opacity-1"
                                                                                                                            src={
                                                                                                                                game.cover
                                                                                                                            }
                                                                                                                        />
                                                                                                                    </div>
                                                                                                                </div>
                                                                                                            </div>
                                                                                                        </div>
                                                                                                        <div className="overflow-hidden text-ellipsis whitespace-nowrap shrink-1 max-w-[100%]">
                                                                                                            <span className="transition">
                                                                                                                <strong className="game-display-title">
                                                                                                                    {
                                                                                                                        game.name
                                                                                                                    }
                                                                                                                </strong>
                                                                                                            </span>
                                                                                                        </div>
                                                                                                    </div>
                                                                                                </a>
                                                                                            </div>
                                                                                        </li>
                                                                                    )
                                                                                }
                                                                            )}
                                                                        </>
                                                                    ) : (
                                                                        <li>
                                                                            <div className="overflow-hidden text-ellipsis whitespace-nowrap w-full max-w-full h-[34px] flex items-center">
                                                                                <div className="overflow-hidden text-ellipsis whitespace-nowrap w-full max-w-full shrink-1">
                                                                                    <span>
                                                                                        No
                                                                                        matching
                                                                                        title
                                                                                        found
                                                                                    </span>
                                                                                </div>
                                                                            </div>
                                                                            <div>
                                                                                <a className="flex h-[34px] items-center w-full max-w-[100%] overflow-hidden text-ellipsis whitespace-nowrap text-[#F5F5F5]/[.6]">
                                                                                    <div className="underline w-full items-center flex">
                                                                                        <span>
                                                                                            Browse
                                                                                            all
                                                                                            titles
                                                                                        </span>
                                                                                    </div>
                                                                                </a>
                                                                            </div>
                                                                        </li>
                                                                    )}
                                                                </>
                                                            )}
                                                        </ul>
                                                    </div>
                                                </span>
                                            </div>
                                        </div>
                                    ) : null}
                                </div>
                                <div></div>
                            </div>
                        </div>
                    </div>
                    <div className="flex items-center">
                        {loggedIn ? (
                            <>
                                <div className="dropdown cursor-pointer relative">
                                    <p className="account-name text-xl text-[#fff] p-2 mr-2">
                                        {account}
                                    </p>
                                    <div className="friendly-box friendly-box-top"></div>
                                    <div className="friendly-box friendly-box-wide-adjust"></div>
                                    <div className="flex flex-col items-center rounded-lg dropdown-menu bg-[#202024] p-2 pr-3">
                                        <button
                                            className="dropdown-btn"
                                            onClick={() => navigate('/libary')}
                                        >
                                            Libary
                                        </button>
                                        <button
                                            className="dropdown-btn"
                                            onClick={() =>
                                                navigate(
                                                    '/account/transactions'
                                                )
                                            }
                                        >
                                            Account
                                        </button>
                                        <button className="dropdown-btn">
                                            Wishlist
                                        </button>
                                        <div className="flex dropdown-btn dropdown-logout-btn">
                                            <button
                                                onClick={() =>
                                                    handleLogout(false)
                                                }
                                                className="logout-btn"
                                            >
                                                Logout
                                            </button>
                                            <div className="logout-icon"></div>
                                        </div>
                                    </div>
                                </div>
                                <div>
                                    <div>
                                        <li className="flex whitespace-nowrap items-center">
                                            <div>
                                                <Link
                                                    to={'/cart'}
                                                    className="text-[#fff] hover:text-[#8F32db] text-xl flex items-center p-2"
                                                >
                                                    Cart
                                                </Link>
                                            </div>
                                            {cartQuantity !== 0 && loggedIn ? (
                                                <div
                                                    id="cart-quantity-container"
                                                    className="cart-quantity-container bg-[#fff] h-auto w-[30px] text-center rounded-xl ml-0.5"
                                                >
                                                    <span
                                                        id="CartQuantity"
                                                        className="font-bold text-black "
                                                    >
                                                        {cartQuantity}
                                                    </span>
                                                </div>
                                            ) : null}
                                        </li>
                                    </div>
                                </div>
                            </>
                        ) : (
                            <button
                                className="text-white text-xl"
                                onClick={() => handleLogin()}
                            >
                                Login
                            </button>
                        )}
                    </div>
                </div>
            </div>
            {props.children}
        </>
    )
}
