import { useContext, useState, createContext, useEffect, useCallback } from 'react'
import { baseUrl } from './shared'
import axios from 'axios'

const LoginContext = createContext()
const AccountContext = createContext()
const CartContext = createContext()

export function useLogin() {
    return useContext(LoginContext)
}
export function useAccount() {
    return useContext(AccountContext)
}
export function useCart() {
    return useContext(CartContext)
}

export function LoginProvider({ children }) {
    const [loggedIn, setLoggedIn] = useState(localStorage.access ? true : false)
    const [account, setAccount] = useState(null)
    const [cartQuantity, setCartQuantity] = useState(0)
    const [itemsInCart, setItemsInCart] = useState()
    const [library, setLibrary] = useState()

    function changeLoggedIn(value) {
        setLoggedIn(value)
        if (value === false) {
            localStorage.clear()
        }
    }
    const getCartQuantity = useCallback(() => {
        if (loggedIn) {
            const url = baseUrl + 'cart/quantity'
            axios
                .get(url, {
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
        }
    })
    const getItemInCart = useCallback(() => {
        if (loggedIn) {
            const url2 = baseUrl + 'cart/item-in-cart'
            axios
                .get(url2, {
                    headers: {
                        'Content-Type': 'application/json',
                        Authorization: 'Bearer ' + localStorage.getItem('access'),
                    },
                })
                .then((response) => {
                    setItemsInCart(response.data)
                    console.log(response.data)
                })
                .catch((e) => {
                    console.log('Error can not get items in cart', e)
                })
        }
    })
    const getLibrary = useCallback(() => {
        const url3 = baseUrl + 'api/account/game_in_libary'
        if (localStorage.access) {
            axios
                .get(url3, {
                    headers: {
                        'Content-Type': 'application/json',
                        Authorization: 'Bearer ' + localStorage.getItem('access'),
                    },
                })
                .then((response) => {
                    setLibrary(response.data)
                })
                .catch((e) => {
                    console.log('Error can not get library', e)
                })
        }
    })

    useEffect(() => {
        function refreshTokens() {
            if (localStorage.refresh) {
                const url = baseUrl + 'api/token/refresh/'
                axios
                    .post(url, {
                        refresh: localStorage.refresh,
                    })
                    .then((response) => {
                        localStorage.access = response.data.access
                        localStorage.refresh = response.data.refresh
                        setAccount(localStorage.account)
                        setLoggedIn(true)
                    })
                    .catch((error) => {
                        console.error('Error refreshing token:', error)
                    })
            }
        }
        const minute = 1000 * 60
        refreshTokens()
        getCartQuantity()
        getLibrary()
        const intervalId = setInterval(() => {
            refreshTokens()
        }, minute * 3)
    }, [])
    return (
        <LoginContext.Provider value={[loggedIn, changeLoggedIn]}>
            <AccountContext.Provider value={[account, setAccount, library, setLibrary, getLibrary]}>
                <CartContext.Provider value={[itemsInCart, setItemsInCart, getItemInCart, cartQuantity, setCartQuantity, getCartQuantity]}>
                    {children}
                </CartContext.Provider>
            </AccountContext.Provider>
        </LoginContext.Provider>
    )
}
