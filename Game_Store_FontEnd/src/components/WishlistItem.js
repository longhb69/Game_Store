import { useEffect, useRef } from 'react';
import { Link, useNavigate} from 'react-router-dom';
import Lottie from 'lottie-react';
import axios from 'axios';
import { baseUrl } from '../shared';
import { useCart, useLogin } from '../LoginContext';
import * as animationData from '../loading.json'


export default function WishlistItem({item_id, id, slug, type, name, price, discounted_price, discount_percentage, cover, setWishlist}) {
    const [loggedIn, setLoggedIn] = useLogin()
    const [itemsInCart, setItemsInCart, getItemInCart, cartQuantity, setCartQuantity, getCartQuantity] = useCart()
    const addCartRef = useRef()
    const itemContainerRef = useRef()
    const lottieRef = useRef()
    const navigate = useNavigate()

    useEffect(() => {
        getItemInCart()
    }, [])

    const addCart = async () => {
        const url = baseUrl + 'cart/'
        const data = { type: type, game_id: id}
        const response = await axios.post(url, data, {
            headers: {
                'Content-Type': 'application/json',
                Authorization: 'Bearer ' + localStorage.getItem('access'),
            }
        })
        if(response.status === 403 || response.status === 401) {
            setLoggedIn(false)
            navigate('/login')
        } else if (response.status !== 201) {
            console.log(response)
            throw new Error('Something went wrong')
        }
        addCartRef.current.classList.add('custom-loading')
        setTimeout(() => {
            if(addCartRef.current?.classList) {
                addCartRef.current.classList.remove('custom-loading')
            }
            getCartQuantity()
            getItemInCart()
        }, 1000)
    }

    const handleDelete = async () => {
        //const divElement = document.getElementById(item_id)
        //if(divElement)
         //   divElement.style.animationPlayState = 'running'

        const data = {item_id:item_id}
        const url = baseUrl + `api/account/wishlist`
        console.log("wishlist Id", item_id)
        try {
            const response = await axios.delete(url, {
                data: data,
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: 'Bearer ' + localStorage.getItem('access'),
                },
            })
            if(response.status >= 200 && response.status < 300) {
                setTimeout(() => {
                    setWishlist((prevWishlist) => {
                        const updatedItems = prevWishlist.items.filter((item) => 
                            item.id !== item_id 
                        )
                        console.log(updatedItems)
                        return {
                            ...prevWishlist,
                            items: updatedItems,
                        }
                    })
                }, 600)
            }
        } catch(e) {
             console.log(e)
        }
    }

    return (
        <div id={item_id} className="rounded bg-[#202020] flex justify-between wrapper-item">
            <div className='flex w-full'>
                <div className=''>
                    <Link to={type === 'game' ? '/app/'+ slug : '/app/dlc/'+ slug}>
                        <img className='min-w-[150px] w-[200px] h-[200px] rounded object-fit hover:brightness-125' src={cover}/>
                    </Link>
                </div>
                <div className='ml-3 px-3 pt-5 w-4/6'>
                    <Link to={type === 'game' ? '/app/'+ slug : '/app/dlc/'+ slug}>
                        <p className='text-2xl hover:underline decoration-1'>{name}</p>
                    </Link>
                </div>
            </div>
            <div className='p-5 flex flex-col justify-between w-[400px]'>
                <div className='flex justify-end gap-3'>
                    {discounted_price > 0 ?
                        <div className='bg-[#4C6B21] px-2 py-1 rounded text-[#caff0b]'>-{parseInt(discount_percentage)}%</div>
                    : null}
                    <div className='text-right'>
                        <div className={`text-lg ${discounted_price > 0 ? 'line-through text-[#D0D0D0]' : ''}`}>
                            {price}<span className='underline'>đ</span> 
                        </div>
                    </div>
                    {discounted_price > 0 ?
                         <div className='text-right text-lg'>{discounted_price}<span className='underline'>đ</span></div>
                    : null}
                </div>
                <div className='mt-2 flex w-full gap-5 justify-center items-center'>
                    <button className='text-gray-400 font-semibold underline h-fit mt-3 hover:no-underline'
                        onClick={(e) => {
                            e.preventDefault()
                            handleDelete()
                        }}>
                        <span className=''>Remove</span>
                    </button>
                    <div
                        ref={addCartRef}
                        className="flex w-[200px] flex-col justify-items-center rounded border border-[245_245_245_0.6] mt-3 hover:bg-white/[.07] transition ease-out duration-[200ms] w-full max-h-[50px]">
                        <Lottie
                            className="lottie"
                            lottieRef={lottieRef}
                            animationData={animationData}
                            loop={true}
                        />
                        {itemsInCart && itemsInCart.items_name.includes(slug) ? 
                            <button
                                className="p-3 w-full"
                                onClick={(e) => {
                                    e.preventDefault()
                                    navigate('/cart')
                                }}>
                                <span className="cart-text font-semibold">VIEW IN CART</span>
                            </button>   
                        :
                            <button
                                className="p-3 w-full"
                                onClick={(e) => {
                                    e.preventDefault()
                                    addCart()
                                }}>
                                <span className="cart-text font-semibold">ADD TO CART</span>
                            </button>   
                        }
                    </div>
                </div>
            </div>
        </div>
    )
}