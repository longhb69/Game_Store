import { useRef, useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import { baseUrl } from '../shared'
import { Link, useNavigate, useLocation } from 'react-router-dom'
import axios from 'axios'
import { useAccount, useCart, useLogin } from '../LoginContext'
import GameDLC from '../components/GameDLC'
import GameImageVideo from '../components/GameImageVideo'
import Lottie from 'lottie-react'
import * as animationData from '../loading.json'
import SystemRequirements from '../components/SystemRequirements'
import Checkout from '../components/Checkout'
import Review from '../components/Review'
import Comments from '../components/Comments'

export default function GameDetail() {
    const { slug } = useParams()
    const [game, setGame] = useState()
    const [categories, setCategories] = useState()
    const [totalDlcPrice, setTotalDlcPrice] = useState()
    const [buttonBuyNow, setButtonBuyNow] = useState(false)
    const [showMore, setShowMore] = useState(false)
    const navigate = useNavigate()
    const location = useLocation()
    const [showAllDLC, setShowAllDLC] = useState(false)
    const [loggedIn, setLoggedIn] = useLogin()
    const [specialColor, setSpecialColor] = useState('')
    const [itemsInCart, setItemsInCart, getItemInCart, cartQuantity, setCartQuantity, getCartQuantity] = useCart()
    const [account, setAccount, library, setLibrary, getLibrary] = useAccount()
    const url = baseUrl + 'cart/'
    const addCartRef = useRef()
    const lottieRef = useRef()
    const [loading, setLoading] = useState(true)
    const loadingItems = Array.from({ length: 4 })
    //const originalBackgroundColor = window.getComputedStyle(document.body).backgroundColor;

    useEffect(() => {
        if (buttonBuyNow) {
            document.body.classList.add('overlay-active')
        } else {
            document.body.classList.remove('overlay-active')
        }
    }, [buttonBuyNow])

    useEffect(() => {
        const url = baseUrl + 'api/game/' + slug
        axios
            .get(url)
            .then((response) => {
                setGame(response.data)
                setCategories(response.data.category)
                var totalDLCPrice = 0
                response.data.dlc.forEach((dlc) => {
                    totalDLCPrice += parseFloat(dlc.price)
                })
                setTotalDlcPrice(totalDLCPrice.toFixed(3))
                if (response.data.specialColor) setSpecialColor(response.data.specialColor)
                else setSpecialColor('#121212')
            })
            .catch((e) => {
                console.log(e)
            })
            .finally(() => {
                setLoading(false)
            })
        getItemInCart()
        getLibrary()
    }, [])

    useEffect(() => {
        const originalBackgroundColor = window.getComputedStyle(document.body).backgroundColor
        if (specialColor) {
            document.body.style.background = specialColor
            document.querySelector('.header').style.background = specialColor
        }
        return () => {
            document.body.style.backgroundColor = originalBackgroundColor
            document.querySelector('.header').style.background = originalBackgroundColor
        }
    }, [specialColor])

    function addCart(game_id) {
        const data = { type: 'game', game_id: game_id }
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
            addCartRef.current.classList.add('custom-loading')
            setTimeout(() => {
                if(addCartRef.current?.classList) {
                    addCartRef.current.classList.remove('custom-loading')
                }
                getCartQuantity()
                getItemInCart()
            }, 1000)
            return response.json()
        })
    }
    function addAllDlcToCart(game_id) {
        const add_on = game.dlc.map((dlc) => ({
            game_id: dlc.id,
        }))
        const data = { type: 'game', game_id: game_id, add_on: add_on }
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
                    {game && (
                        <>
                            <div className={`mx-auto w-[75%] mt-2 text-nowrap overlay mb-10  ${buttonBuyNow ? '' : 'active'}`}>
                                <div className="text-white text-6xl mb-2 mt-8 game-title">{game.name}</div>
                                <div className="flex">
                                    <div className="w-[75%] mt-5">
                                        <div className="w-[calc(100%)] ">
                                            <GameImageVideo image={game.image} video={game.video} game_image={game.game_image} />
                                        </div>
                                        <div className="flex flex-col mt-3">
                                            <div className="flex flex-row mb-10 mt-10">
                                                <div className="flex flex-col px-5 border-r border-l border-[#F5F5F5]/[.6]">
                                                    <div className="text-white">
                                                        <div>
                                                            <span className="text-[#F5F5F5]/[.6]">Genres</span>
                                                        </div>
                                                        <div>
                                                            {categories
                                                                ? categories.map((category) => {
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
                                        <div className="text-white text-lg">
                                            {game.dlc && game.dlc.length > 0 ? (
                                                <>
                                                    <h2 className="mb-1">Content For This Game</h2>
                                                    <div className="flex flex-wrap flex-col gap-4">
                                                        {game.dlc.slice(0, 5).map((dlc) => {
                                                            return (
                                                                <GameDLC
                                                                    key={dlc.id}
                                                                    id={dlc.id}
                                                                    name={dlc.name}
                                                                    slug={dlc.slug}
                                                                    price={dlc.price}
                                                                    cover={dlc.cover}
                                                                    image={dlc.image}
                                                                    overview_description={dlc.overview_description}
                                                                />
                                                            )
                                                        })}
                                                        {game.dlc.slice(5).map((dlc) => {
                                                            return (
                                                                <div className={`${showAllDLC ? '' : 'hidden'} flex flew-row w-full`}>
                                                                    <GameDLC
                                                                        key={dlc.id}
                                                                        id={dlc.id}
                                                                        name={dlc.name}
                                                                        slug={dlc.slug}
                                                                        price={dlc.price}
                                                                        cover={dlc.cover}
                                                                        image={dlc.image}
                                                                        overview_description={dlc.overview_description}
                                                                    />
                                                                </div>
                                                            )
                                                        })}
                                                    </div>
                                                    {game.dlc? (
                                                        <div className="flex flex-row ">
                                                            <div className="ml-auto">
                                                                <div className="flex justify-end">
                                                                    <div
                                                                        className={`flex ${
                                                                            showAllDLC ? 'mt-2 p-1 pl-3 rounded bg-[#202020]' : 'mt-2'
                                                                        } bg-[#202020] rounded`}>
                                                                        {(game.dlc) || showAllDLC ? (
                                                                            <>
                                                                                <div className="flex items-center pl-3">
                                                                                    {totalDlcPrice}
                                                                                    <span className="underline">đ</span>
                                                                                </div>
                                                                                <div className="ml-2 hover:brightness-110 text-[#d2efa9] hover:text-white">
                                                                                    <button
                                                                                        className="bg-gradient-to-r from-[#75b022] to-[#588a1b] py-1 px-3 rounded"
                                                                                        onClick={(e) => {
                                                                                            e.preventDefault()
                                                                                            addAllDlcToCart(game.id)
                                                                                        }}>
                                                                                        <span className="">Add all DLC to Cart</span>
                                                                                    </button>
                                                                                </div>
                                                                            </>
                                                                        ) : (
                                                                            <>
                                                                                {game.dlc.length === 1 ? null : (
                                                                                    <>
                                                                                        <div className="flex mr-3 items-center text-base text-cyan-500">
                                                                                            SHOWING 1-5 OF {game.dlc.length}
                                                                                        </div>
                                                                                        <div className="bg-[#202020] py-0.5 pl-6 pr-3 rounded-sm hover:brightness-110 cursor-pointer hover:bg-gradient-to-r from-[#06BFFF] to-[#2D73FF]">
                                                                                            <div
                                                                                                className="pr-5 bg-[length:22px_22px] bg-[url(https://store.akamai.steamstatic.com/public/shared/images/popups/btn_arrow_down_padded.png)] bg-no-repeat bg-right"
                                                                                                onClick={(e) => {
                                                                                                    e.preventDefault()
                                                                                                    setShowAllDLC(true)
                                                                                                }}>
                                                                                                <span className="text-base">SEE ALL</span>
                                                                                            </div>
                                                                                        </div>
                                                                                    </>
                                                                                )}
                                                                            </>
                                                                        )}
                                                                    </div>
                                                                </div>
                                                            </div>
                                                            <div className="space"></div>
                                                        </div>
                                                    ) : null}
                                                </>
                                            ) : null}
                                        </div>
                                        <div className="flex mt-5 w-full">
                                            <div className="w-full">
                                                <h2 className="text-lg md:text-sm border-b">ABOUT THIS GAME</h2>
                                                <p
                                                    className={`mt-5 ${showMore ? '' : 'max-h-[400px]'} overflow-hidden`}
                                                    dangerouslySetInnerHTML={{ __html: game.detail_description }}></p>
                                                <div className={`relative bg-[${specialColor}] flex flex-col opacity-1`}>
                                                    <button
                                                        className="showmore-btn hover:bg-[#fff]/[.3]"
                                                        onClick={() => {
                                                            setShowMore(!showMore)
                                                        }}>
                                                        <span className="text-center text-sm uppercase">{showMore ? 'Show less' : 'Show more'}</span>
                                                        <span className={`block w-[20px] h-[20px] ${showMore ? 'rotate-180' : ''}`}>
                                                            <svg xmlns="http://www.w3.org/2000/svg" class="w-full h-full" viewBox="0 0 1024 1024">
                                                                <path
                                                                    fill="currentColor"
                                                                    d="M255.583 340.917c-23.562.006-42.66 19.108-42.66 42.671 0 11.987 4.942 22.819 12.9 30.57l256.009 256.009c7.721 7.718 18.387 12.492 30.167 12.492s22.445-4.774 30.167-12.492l256-256c8.091-7.778 13.118-18.692 13.118-30.781 0-23.567-19.104-42.671-42.671-42.671-12.089 0-23.003 5.027-30.767 13.104l-.013.014L512 579.666 286.167 353.833c-7.76-7.971-18.594-12.916-30.583-12.917z"></path>
                                                            </svg>
                                                        </span>
                                                    </button>
                                                    <div
                                                        className={`${
                                                            showMore ? 'hidden' : 'absolute'
                                                        } -top-[100px] h-[100px] w-full bg-gradient-to-b from-[${specialColor}]/[.0] to-[${specialColor}]`}></div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                    <aside className="max-w-[350px] laptop">
                                        <div className="flex sticky top-[100px] mt-5 flex-nowrap w-full">
                                            <div className="text-white ml-7 w-[100%] ">
                                                <div className="mb-3 ">
                                                    <img className="rounded" src={game.image} />
                                                </div>
                                                <div className="mb-3 text-nowrap">
                                                    <p className="text-white">{game.overview_description}</p>
                                                </div>
                                                <div className="text-nowrap">
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
                                                <div className="text-base md:text-sm flex flex-col">
                                                    <div className="mt-1 text-lg">
                                                        <p>
                                                            {game.price}
                                                            <span className="underline">đ</span>
                                                        </p>
                                                    </div>
                                                    {library && library.items_name.includes(game.slug) ? (
                                                        <div className="text-center rounded n bg-[#5532db] mt-3 opacity-[0.6] select-none">
                                                            <button className="p-3 w-full" style={{ pointerEvents: 'none' }}>
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
                                                            {itemsInCart && itemsInCart.items_name.includes(game.slug) ? (
                                                                <div
                                                                    ref={addCartRef}
                                                                    className="flex flex-col justify-items-center rounded border border-[245_245_245_0.6] mt-3 hover:bg-white/[.07] transition ease-out duration-[200ms] w-full max-h-[50px]">
                                                                    <Lottie
                                                                        className="lottie"
                                                                        lottieRef={lottieRef}
                                                                        animationData={animationData}
                                                                        loop={true}
                                                                    />
                                                                    <button
                                                                        className="p-3 w-full"
                                                                        onClick={(e) => {
                                                                            e.preventDefault()
                                                                            navigate('/cart')
                                                                        }}>
                                                                        <span className="cart-text">IN CART</span>
                                                                    </button>
                                                                </div>
                                                            ) : (
                                                                <div
                                                                    ref={addCartRef}
                                                                    className="flex flex-col justify-items-center rounded border border-[245_245_245_0.6] mt-3 hover:bg-white/[.07] transition ease-out duration-[200ms] w-full max-h-[50px]">
                                                                    <Lottie
                                                                        className="lottie"
                                                                        lottieRef={lottieRef}
                                                                        animationData={animationData}
                                                                        loop={true}
                                                                    />
                                                                    <button
                                                                        className="p-3 w-full"
                                                                        onClick={(e) => {
                                                                            e.preventDefault()
                                                                            addCart(game.id)
                                                                        }}>
                                                                        <span className="cart-text">ADD TO CART</span>
                                                                    </button>
                                                                </div>
                                                            )}
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
                                <div className="w-[75%]">
                                    <Review name={game.name} specialColor={specialColor} />
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
                                <div className="w-[75%]">
                                    <Comments
                                        inLibrary={library && library.items_name.includes(game.slug) ? true : false}
                                        game={game.name}
                                        type={'game'}
                                        game_id={game.id}
                                    />
                                </div>
                            </div>
                        </>
                    )}
                    <Checkout trigger={buttonBuyNow} setTrigger={setButtonBuyNow} game={game} type={'game'} />
                </>
            )}
        </>
    )
}
