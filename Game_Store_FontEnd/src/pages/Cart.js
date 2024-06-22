import axios from 'axios'
import { baseUrl } from '../shared'
import { useEffect, useState } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { useCart, useLogin } from '../LoginContext'
import CartItem from '../components/CartItem'
import Checkout from '../components/Checkout'

export default function Cart() {
    const [cart, setCart] = useState()
    const navigate = useNavigate()
    const location = useLocation()
    const [loggedIn, setLoggedIn] = useLogin()
    const [itemsInCart, setItemsInCart, getItemInCart, cartQuantity, setCartQuantity, getCartQuantity] = useCart()
    const [buttonCheckout, setButtonCheckOut] = useState(false)

    useEffect(() => {
        if (buttonCheckout) {
            document.body.classList.add('overlay-active')
        } else {
            document.body.classList.remove('overlay-active')
        }
    }, [buttonCheckout])

    useEffect(() => {
        const url = baseUrl + 'cart/'
        fetch(url, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                Authorization: 'Bearer ' + localStorage.getItem('access'),
            },
        })
            .then((response) => {
                if (response.status === 403 || response.status === 401) {
                    setLoggedIn(false)
                    navigate('/login', {
                        state: {
                            previousUrl: location.pathname,
                        },
                    })
                } else if (!response.ok) {
                    throw new Error('Something went wrong')
                }
                return response.json()
            })
            .then((response) => {
                const reversedItems = response.items.reverse()
                const updateItem = { ...cart, items: reversedItems }
                setCart({
                    ...updateItem,
                    pk: response.pk,
                    total_price: response.total_price,
                })
            })
            .catch((e) => {
                console.error('Error fetching cart data:', e)
            })
    }, [])

    function handleDelete(item_id) {
        const divElement = document.getElementById(item_id)
        divElement.style.animationPlayState = 'running'
        const url = baseUrl + `cart/cartitem/delete/${item_id}`
        axios
            .delete(url, {
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: 'Bearer ' + localStorage.getItem('access'),
                },
            })
            .then((response) => {
                if (response.status >= 200 && response.status < 300) {
                    setTimeout(() => {
                        setCart((prevCart) => {
                            const updatedItems = prevCart.items.filter((item) => item.id !== item_id)
                            let newTotal = 0
                            updatedItems.forEach((element) => {
                                newTotal += parseFloat(element.price.replace(/,/g, ''))
                            })
                            return {
                                ...prevCart,
                                items: updatedItems,
                                total_price: newTotal.toLocaleString(),
                            }
                        })
                        getCartQuantity()
                    }, 600)
                }
            })
            .catch((error) => {
                console.error('Error deleting item:', error)
            })
    }
    return (
        <>
            <div className={`mx-auto w-[70%] min-h-screen mt-10 overlay ${buttonCheckout ? '' : 'active'} mb-[100px]`}>
                <div className="mb-12">
                    <h1>
                        <span className="text-5xl">Your Shopping Cart</span>
                    </h1>
                </div>
                <div className={`flex ${cart && cart.items.length <= 0 ? 'justify-center items-center' : ''}`}>
                    {cart && cart.items.length > 0 ? (
                        <>
                            <div className="flex flex-col  gap-x-10 basis-9/12 mr-10">
                                {cart.items.map((item) => {
                                    return (
                                        <CartItem
                                            key={cart.pk}
                                            id={item.id}
                                            slug={item.slug}
                                            type={item.type}
                                            name={item.name}
                                            price={item.price}
                                            cover={item.cover}
                                            dlcs={item.dlcs}
                                            handleDelete={handleDelete}
                                        />
                                    )
                                })}
                            </div>
                        </>
                    ) : (
                        <>
                            <div className="flex flex-col justify-center items-center">
                                <div className="mb-3 h-[100px]"></div>
                                <div className="text-3xl mb-5">
                                    <span>Your cart is empty.</span>
                                </div>
                                <div>
                                    <span>
                                        <Link to={'/'} className="text-lg border-b border-dotted border-gray-600 hover:border-white hover:border-solid">
                                            Shop for Games
                                        </Link>
                                    </span>
                                </div>
                            </div>
                        </>
                    )}
                    {cart && cart.items.length > 0 ? (
                        <div className="basis-3/12">
                            <div>
                                <div className="text-3xl">
                                    <span>Games Summary</span>
                                </div>
                                <div className="mt-2 text-lg">
                                    <div className="flex justify-between">
                                        <div className="mr-5">
                                            <span>Price</span>
                                        </div>
                                        <span>
                                            {cart.total_price}
                                            <span className="underline">đ</span>
                                        </span>
                                    </div>
                                </div>
                                <div className="pt-6 border-t mt-8 border-gray-100 text-lg">
                                    <div className="flex justify-between">
                                        <div className="mr-5 font-bold">
                                            <span>Subtotal</span>
                                        </div>
                                        <span className="font-bold ">
                                            {cart.total_price}
                                            <span className="underline">đ</span>
                                        </span>
                                    </div>
                                </div>
                                <div className="mt-5">
                                    <button
                                        className="w-full h-[50px] bg-[#32db55] rounded font-medium	hover:brightness-125 text-[#000000] transition ease-in duration-[150ms]"
                                        onClick={() => setButtonCheckOut(true)}>
                                        <span>CHECK OUT</span>
                                    </button>
                                </div>
                            </div>
                        </div>
                    ) : null}
                </div>
            </div>
            <Checkout trigger={buttonCheckout} setTrigger={setButtonCheckOut} cart={cart} />
        </>
    )
}
