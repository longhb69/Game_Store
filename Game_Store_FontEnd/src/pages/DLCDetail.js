import { useRef, useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import { baseUrl } from '../shared'
import { Link, useNavigate, useLocation } from 'react-router-dom'
import { useAccount, useCart, useLogin } from '../LoginContext'
import useFetchData from '../useFetchData'
import GameImageVideo from '../components/GameImageVideo'
import Lottie from 'lottie-react'
import * as animationData from '../loading.json'
import SystemRequirements from '../components/SystemRequirements'
import Checkout from '../components/Checkout'

export default function DLCDetail() {
    const slug = useParams().slug
    const url = baseUrl + `api/dlc/${slug}`
    const { data: game, loading, error } = useFetchData(url)
    const [buttonBuyNow, setButtonBuyNow] = useState(false)
    const [loggedIn, setLoggedIn] = useLogin()
    const [itemsInCart, setItemsInCart, getItemInCart, cartQuantity, setCartQuantity, getCartQuantity] = useCart()
    const [account, setAccount, library, setLibrary, getLibrary] = useAccount()
    const loadingItems = Array.from({ length: 4 })
    const lottieRef = useRef()
    const addCartRef = useRef()
    const navigate = useNavigate()
    const location = useLocation()

    useEffect(() => {
        getItemInCart()
        getLibrary()
        console.log('game', game)
    }, [])

    useEffect(() => {
        const originalBackgroundColor = window.getComputedStyle(document.body).backgroundColor
        if (game.specialColor) document.body.style.background = game.specialColor
        return () => {
            document.body.style.backgroundColor = originalBackgroundColor
        }
    }, [game.specialColor])

    useEffect(() => {
        if (buttonBuyNow) {
            document.body.classList.add('overlay-active')
        } else {
            document.body.classList.remove('overlay-active')
        }
    }, [buttonBuyNow])

    function addCart(game_id) {
        const url = baseUrl + 'cart/'
        const data = { type: 'dlc', game_id: game_id }
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
            addCartRef.current.classList.add('loading')
            setTimeout(() => {
                addCartRef.current.classList.remove('loading')
                getCartQuantity()
                getItemInCart()
            }, 1000)
            return response.json()
        })
    }

    function BuyNow(trigger) {
        if (localStorage.getItem('access') !== null) {
            setButtonBuyNow(trigger)
        } else {
            navigate('/login', {
                state: {
                    previousUrl: location.pathname,
                },
            })
        }
    }

    return (
        <>
            {loading ? (
                <div className="mx-auto w-[75%] mt-2">
                    <div className="flex flex-col w-full">
                        <div className="w-[200px] h-[50px] skeleton mb-2"></div>
                        <div className="flex gap-2">
                            <div className="skeleton w-[70px] h-[20px]"></div>
                            <div className="skeleton w-[70px] h-[20px]"></div>
                        </div>
                    </div>
                    <div className="flex w-full h-[650px] mt-5">
                        <div className="basis-[75%] max-w-[1100px] h-full">
                            <div className="skeleton h-[90%] w-full"></div>
                            <div className="flex justify-center gap-3 w-full h-full mt-5">
                                <div className="skeleton h-[10%] w-[10%]"></div>
                                <div className="skeleton h-[10%] w-[10%]"></div>
                                <div className="skeleton h-[10%] w-[10%]"></div>
                            </div>
                        </div>
                        <div className="basis-[25%] ml-7 flex gap-3 flex-col w-full h-[750px]">
                            <div className="w-full h-[25%] skeleton"></div>
                            <div className="border border-[#252410] rounded h-[15%] flex">
                                <div className="p-4 w-full h-full flex">
                                    <div className="basis-[20%] mr-2">
                                        <div className="w-full h-[50px] skeleton"></div>
                                    </div>
                                    <div className="basis-[80%] flex flex-col">
                                        <div className="w-full h-[15px] skeleton mb-2"></div>
                                        <div className="w-full h-[15px] skeleton"></div>
                                        <div className="w-full border-b my-3 border-[#252410]"></div>
                                        <div className="w-full h-[15px] skeleton"></div>
                                    </div>
                                </div>
                            </div>
                            <div className="w-[150px] h-[4%] skeleton"></div>
                            <div className="w-[100px] h-[4%] skeleton"></div>
                            <div className="w-full h-[8%] skeleton"></div>
                            <div className="w-full h-[8%] skeleton"></div>
                            <div className="w-full h-[4%] skeleton"></div>
                            <div className="h-[32%] w-full">
                                {loadingItems.map((item) => {
                                    return (
                                        <div className="w-full flex flex-col">
                                            <div className="w-full flex justify-between">
                                                <div className="basis-[25%] w-full h-[20px] skeleton"></div>
                                                <div className="basis-[25%] w-full h-[20px] skeleton"></div>
                                            </div>
                                            <div className="border border-[#252410] my-2.5"></div>
                                        </div>
                                    )
                                })}
                            </div>
                        </div>
                    </div>
                    <div className="w-[74%] h-[15px] mt-14 skeleton"></div>
                    <div className="w-[74%] h-[15px] mt-5 skeleton"></div>
                    <div className="w-[74%] h-[15px] mt-5 skeleton"></div>
                </div>
            ) : (
                <>
                    {game ? (
                        <>
                            <div className={`mx-auto w-[75%] mt-2 text-nowrap overlay ${buttonBuyNow ? '' : 'active'}`}>
                                <div className="text-white text-6xl mb-2 mt-8">{game.name}</div>
                                <div className="flex">
                                    <div className="w-[75%] mt-5">
                                        <div className="w-[calc(100%)] ">
                                            <GameImageVideo image={game.image} video={game.video} game_image={game.game_images} />
                                        </div>
                                        <div className="flex flex-col mt-3">
                                            <div className="flex flex-row mb-10 mt-10">
                                                <div className="flex flex-col px-5 border-r border-l border-[#F5F5F5]/[.6]">
                                                    <div className="text-white">
                                                        <div>
                                                            <span className="text-[#F5F5F5]/[.6]">Genres</span>
                                                        </div>
                                                        <div>
                                                            {game.category
                                                                ? game.category.map((category) => {
                                                                      return (
                                                                          <Link to={`/category/${category.slug}`} key={category.id}>
                                                                              <span className="mr-2 underline hover:no-underline">{category.name},</span>
                                                                          </Link>
                                                                      )
                                                                  })
                                                                : null}
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                        <div className="flex mt-5 w-full">
                                            <div className="w-full">
                                                <h2 className="text-lg border-b">ABOUT THIS GAME</h2>
                                                <p
                                                    className="mt-5"
                                                    dangerouslySetInnerHTML={{
                                                        __html: game.detail_description,
                                                    }}></p>
                                            </div>
                                        </div>
                                    </div>
                                    <aside className="max-w-[350px]">
                                        <div className="flex sticky top-[100px] mt-5 flex-nowrap w-full">
                                            <div className=" text-white ml-7 w-[100%]">
                                                <div className="mb-3 ">
                                                    <img className="rounded" src={game.image} />
                                                </div>
                                                <div className="mb-3 text-nowrap">
                                                    <p className="text-white text-base">{game.overview_description}</p>
                                                </div>
                                                <div className="text-nowrap	text-base">
                                                    <div className="flex flex-nowrap pb-2 border-b border-[#fff]/[.1]">
                                                        <span className="basis-2/5 text-[#aaae]">RELEASE DATE</span>
                                                        <span className="basis-3/5 text-end">{game.year}</span>
                                                    </div>
                                                    <div className="flex flex-nowrap pt-2 pb-2 border-b border-[#fff]/[.1]">
                                                        <span className="basis-2/5 text-[#aaae]">Developer</span>
                                                        <a href="#" className="basis-3/5 text-end">
                                                            {game.developer ? game.developer.name : null}
                                                        </a>
                                                    </div>
                                                    <div className="flex flex-nowrap pt-2 pb-2 border-b border-[#fff]/[.1]">
                                                        <span className="basis-2/5 text-[#aaae]">Publisher</span>
                                                        <a href="#" className="basis-3/5 text-end">
                                                            {game.publisher ? game.publisher.name : null}
                                                        </a>
                                                    </div>
                                                </div>
                                                <div className="text-base flex flex-col">
                                                    <div className="mt-1 text-lg">
                                                        <p>
                                                            {game.price}
                                                            <span className="underline">đ</span>
                                                        </p>
                                                    </div>
                                                    {library && library.items_name.includes(game.slug) ? (
                                                        <div className="text-center rounded n bg-[#5532db] mt-3 opacity-[0.6] select-none">
                                                            <button
                                                                className="p-3 w-full"
                                                                style={{
                                                                    pointerEvents: 'none',
                                                                }}>
                                                                <span className="">IN LIBRARY</span>
                                                            </button>
                                                        </div>
                                                    ) : (
                                                        <>
                                                            <div className="text-center rounded transition ease-in bg-[#5532db] mt-3 hover:bg-[#db55db] duration-[300ms] hover:font-semibold">
                                                                <button className="p-3 w-full" onClick={() => BuyNow(true)}>
                                                                    <span className="">BUY NOW</span>
                                                                </button>
                                                            </div>
                                                            <div
                                                                ref={addCartRef}
                                                                className="flex flex-col justify-items-center rounded border border-[245_245_245_0.6] mt-3 hover:bg-white/[.07] transition ease-out duration-[200ms] w-full max-h-[50px]">
                                                                <Lottie className="lottie" lottieRef={lottieRef} animationData={animationData} loop={true} />
                                                                <button
                                                                    className="p-3 w-full"
                                                                    onClick={(e) => {
                                                                        e.preventDefault()
                                                                        addCart(game.id)
                                                                    }}>
                                                                    {itemsInCart && itemsInCart.items_name.includes(game.slug) ? (
                                                                        <span className="cart-text">IN CART</span>
                                                                    ) : (
                                                                        <span className="cart-text">ADD TO CART</span>
                                                                    )}
                                                                </button>
                                                            </div>
                                                            <div className="rounded border border-[245_245_245_0.6] mt-3 hover:bg-white/[.07] transition ease-out duration-[200ms]">
                                                                <button className="p-3 w-full">
                                                                    <span>ADD TO WISHLIST</span>
                                                                </button>
                                                            </div>
                                                        </>
                                                    )}
                                                </div>
                                            </div>
                                        </div>
                                    </aside>
                                </div>
                                <div className="text-white text-lg w-[75%]">
                                    <SystemRequirements
                                        os_min={game.os_min}
                                        processor_min={game.processor_min}
                                        memory_min={game.memory_min}
                                        graphics_min={game.graphics_min}
                                        storage_min={game.storage_min}
                                        os_rec={game.os_rec}
                                        processor_rec={game.processor_rec}
                                        memory_rec={game.memory_rec}
                                        graphics_rec={game.graphics_rec}
                                        storage_rec={game.storage_rec}
                                    />
                                </div>
                            </div>
                        </>
                    ) : null}
                    ;
                    <Checkout trigger={buttonBuyNow} setTrigger={setButtonBuyNow} game={game} type={'dlc'} />
                </>
            )}
        </>
    )
}
