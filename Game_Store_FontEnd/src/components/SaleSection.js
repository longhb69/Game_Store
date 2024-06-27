import { Link, useLocation, useNavigate } from 'react-router-dom'
import { useAccount, useCart, useLogin } from '../LoginContext'
import { baseUrl } from '../shared'
import { useRef, useState } from 'react'

export default function SaleSection(props) {
    const [loggedIn, setLoggedIn] = useLogin()
    const [itemsInCart, setItemsInCart, getItemInCart, cartQuantity, setCartQuantity, getCartQuantity] = useCart()
    const navigate = useNavigate()
    const location = useLocation()
    const url = baseUrl + 'cart/'

    function addCart(game_id) {
        const data = { type: 'game', base_game_id: game_id }
        fetch(url, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                Authorization: 'Bearer ' + localStorage.getItem('access'),
            },
            body: JSON.stringify(data),
        }).then((response) => {
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
            getCartQuantity()
            getItemInCart()
            navigate('/cart')
            return response.json()
        })
    }

    return (
        <div className="bg-gradient-to-t from-[#2C3037] to-[#505F6E]  mt-6">
            <div className="pb-2">
                <div className="flex px-[16px] py-[4px] w-full items-center text-[#c6d4df]">
                    <div className="border-b-2 p-[4px] mb-[4px] mr-[8px] whitespace-nowrap cursor-pointer text-[#fff]">All ITEMS</div>
                </div>
                <div className="px-[16px] mt-5 relative">
                    {props.games ? (
                        <>
                            {props.games.map((game) => {
                                return (
                                    <>
                                        <div className="mb-[4px] relative ">
                                            <div className="text-[#c6d4df] text-xs">
                                                <div className="h-[120px] relative">
                                                    <div className="category-game-containter overflow-hidden absolute top-0 bottom-0 flex left-0 right-0 bg-gradient-to-tl from-[#42454c99] to-[#25282e66] ">
                                                        <div className="category-game-image-containter basis-[27%]">
                                                            <Link to={`/app/${game.slug}`}>
                                                                <img className="p-1 w-full h-full" src={game.image} />
                                                            </Link>
                                                        </div>
                                                        <div className="relative basis-[75%] px-2 py-2 flex flex-col overflow-hidden">
                                                            <div className="text-base flex justify-between z-1 mt-1.5">
                                                                <Link to={`/app/${game.slug}`} className="text-[#fff]">
                                                                    <div className="uppercase hover:underline">{game.name}</div>
                                                                </Link>
                                                            </div>
                                                            <div className="flex flex-col">
                                                                <div className="my-2 h-[22px] overflow-hidden text-left block ">
                                                                    {game.category.map((category) => {
                                                                        return (
                                                                            <a
                                                                                target="_blank"
                                                                                href={`/category/${category.slug}`}
                                                                                className="inline-block px-2 py-0.5 text-[#a5b0b6] bg-[#708189]/[.15] mr-2 rounded max-w-[200px] whitespace-nowrap overflow-hidden hover:text-[#32db8F]">
                                                                                {category.name}
                                                                            </a>
                                                                        )
                                                                    })}
                                                                </div>
                                                            </div>
                                                            <div className="flex justify-start items-center shrink-0">
                                                                <div className="game-year flex text-left items-center mr-3 shrink-1 text-[#a5b0b6]">
                                                                    {game.year}
                                                                </div>
                                                                <div className="game-overview hidden text-left items-center mr-3 shrink-1 text-[#a5b0b6]">
                                                                    {game.overview_description}
                                                                </div>
                                                            </div>
                                                            <div className="z-1 mt-auto absolute right-[10px] bottom-[12px] flex flex-wrap justify-end grow-1 items-end min-h-[60px] text-base">
                                                                <div className="flex flex-end flex-row-reverse items-center text-sm">
                                                                    <div
                                                                        className="bg-[#5532db] flex basis-1/2 grow-1 items-center justify-center w-auto px-[30px] py-[12px] h-[40px] text-[#fff] text-center rounded overflow-hidden whitespace-nowrap self-center hover:brightness-110 cursor-pointer"
                                                                        onClick={(e) => {
                                                                            e.preventDefault()
                                                                            addCart(game.id)
                                                                        }}>
                                                                        <span>Add to Cart</span>
                                                                    </div>
                                                                    <div className="flex h-[40px]">
                                                                        {parseFloat(game.discounted_price) > 0 ? 
                                                                            <div className='my-1 px-1 text-xs bg-[#4C6B21] rounded text-[#caff0b] flex items-center'>-{parseInt(game.discount_percentage)}%</div>
                                                                        : null}
                                                                        <div className={`my-1 mr-0 pl-1 bg-[#000000]/[.1] text-[14px] items-center flex whitespace-nowrap ${parseFloat(game.discounted_price) > 0 ? 'line-through text-[#D0D0D0]' : ''}`}>
                                                                            {game.price}
                                                                            <span className="underline">đ</span>
                                                                        </div>
                                                                        {parseFloat(game.discounted_price) > 0 ? 
                                                                            <div className='my-1 mr-2 pl-2 bg-[#000000]/[.1] text-[14px] items-center flex whitespace-nowrap'>
                                                                                {game.discounted_price}
                                                                                <span className="underline">đ</span>
                                                                            </div>
                                                                        : null}
                                                                    </div>
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </>
                                )
                            })}
                        </>
                    ) : null}
                    {props.next ? (
                        <div className="flex justify-center mt-[14px]">
                            <button className="btn-5 relative hover-affect" onClick={props.showMore}>
                                Show more
                            </button>
                        </div>
                    ) : null}
                </div>
            </div>
        </div>
    )
}
