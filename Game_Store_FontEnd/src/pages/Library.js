import { baseUrl } from '../shared'
import useFetchData from '../useFetchData'
import FilterGame from '../components/FilterGame'
import { useEffect, useState } from 'react'

export default function Library() {
    const [url, setUrl] = useState(`${baseUrl}api/account/libary`)
    const { data: games, loading, error, refetch, categories } = useFetchData(url, localStorage.getItem('access'))
    const [btnActive, setBtnActive] = useState(false)
    const [tags, setTags] = useState([])
    const [tagIds, setTagIds] = useState([])
    const [query, setQuery] = useState('')
    const [isPressed, setIsPressed] = useState(false)

    useEffect(() => {
        const newUrl = tags && tags.length > 0 ? `${baseUrl}api/account/libary?q=${query}&tag=${tags}` : `${baseUrl}api/account/libary?q=${query}`

        setUrl(newUrl)
    }, [tags, query])

    function filter(game_name, id) {
        if (tagIds.includes(id)) {
            setTagIds((prevId) => prevId.filter((tagId) => tagId !== id))
            setTags((prevTags) => prevTags.filter((name) => name != game_name))
        } else {
            setTagIds((prevId) => [...(prevId || null), id])
            setTags((prevTags) => [...(prevTags || null), game_name])
        }
    }
    const handleInputChange = (event) => {
        setQuery(event.target.value)
    }
    const handlePress = () => {
        setIsPressed(true)
        setTimeout(() => {
            setIsPressed(false)
        }, 150)
    }
    return (
        <>
            <div className="w-[75%] mx-auto my-8 ">
                <div className="flex items-center text-5xl">
                    <h1>Library</h1>
                </div>
                <div className="pb-20 ">
                    <section className="h-full">
                        <div className="flex w-full max-w-[none]">
                            <div className="flex flex-row-reverse w-full h-full text-base">
                                <aside className="w-[280px] shrink-0">
                                    <div className="w-full overflow-hidden">
                                        <div className="mb-2">
                                            <div className="flex h-[54px] justify-between pt-2 flex items-center">
                                                <div className="">Filters ({tagIds.length})</div>
                                                <button
                                                    className={`text-xs text-center items-center cursor-pointer flex py-3 px-1 ${isPressed ? 'border' : ''}`}>
                                                    <div
                                                        onClick={() => {
                                                            setTagIds([])
                                                            setTags([])
                                                            setQuery('')
                                                            handlePress()
                                                        }}>
                                                        RESET
                                                    </div>
                                                </button>
                                            </div>
                                        </div>
                                        <div>
                                            <div className="mb-4">
                                                <div className="relative text-sm">
                                                    <span className="absolute left-[10px] block top-[13px] w-3 h-3 z-1">
                                                        <svg
                                                            xmlns="http://www.w3.org/2000/svg"
                                                            class="w-full h-full"
                                                            viewBox="0 0 21 20"
                                                            preserveAspectRatio="xMidYMid meet">
                                                            <g
                                                                transform="scale(1 -1) rotate(-45 -11.93502884 -2)"
                                                                stroke="currentColor"
                                                                stroke-width="1.65"
                                                                fill="none"
                                                                fill-rule="evenodd">
                                                                <circle cx="7.70710678" cy="7.70710678" r="7"></circle>
                                                                <path d="M15.2071068 8.62132034h5.6923881" stroke-linecap="square"></path>
                                                            </g>
                                                        </svg>
                                                    </span>
                                                    <input
                                                        value={query}
                                                        onChange={handleInputChange}
                                                        type="text"
                                                        placeholder="Keywords"
                                                        className="pr-[30px] pl-[40px] rounded bg-none outline-none w-full h-[40px] bg-[#202020]"></input>
                                                    <button
                                                        className="reset-btn absolute p-1 right-[10px] top-[12.5px]"
                                                        onClick={(e) => {
                                                            setQuery('')
                                                        }}>
                                                        <span className="block w-[14px] h-[10.5px]">
                                                            <svg xmlns="http://www.w3.org/2000/svg" class="w-full h-full" viewBox="0 0 14 15">
                                                                <g fill="currentColor" fill-rule="evenodd">
                                                                    <path d="M.98959236 14.21751442L13.71751442 1.48959236l-.70710678-.70710678L.28248558 13.51040764z"></path>
                                                                    <path d="M.28248558 1.48959236l12.72792206 12.72792206.70710678-.70710678L.98959236.78248558z"></path>
                                                                </g>
                                                            </svg>
                                                        </span>
                                                    </button>
                                                </div>
                                            </div>
                                        </div>
                                        <div>
                                            <div className="fillter-container">
                                                <div className="items-center cursor-pointer flex justify-between">
                                                    <button
                                                        className={`items-center flex font-medium justify-between opacity-[0.6] px-3.5 py-5 w-full border ${
                                                            btnActive ? 'border-[#fff]' : 'border-transparent'
                                                        } hover:opacity-[1] transition`}
                                                        onClick={(e) => {
                                                            setBtnActive(!btnActive)
                                                        }}>
                                                        <div className="text-sm">GENRE</div>
                                                        <div>
                                                            <span className={`block h-3 w-4 rotate-90 ${btnActive ? 'genre-btn-up' : 'genre-btn-down'}`}>
                                                                <svg xmlns="http://www.w3.org/2000/svg" class="w-full h-full" viewBox="0 0 7.7 12">
                                                                    <path fill="currentColor" d="M1.7 0L0 1.7 4.3 6 0 10.3 1.7 12l6-6z"></path>
                                                                </svg>
                                                            </span>
                                                        </div>
                                                    </button>
                                                </div>
                                            </div>
                                            <div className={`${btnActive ? '' : 'hidden'} transition`}>
                                                {categories ? (
                                                    <>
                                                        {categories.map(([category, count], index) => {
                                                            return (
                                                                <div>
                                                                    <div>
                                                                        <div
                                                                            className={`items-center flex font-medium justify-between opacity-[0.6] px-3.5 py-5 mb-2 w-full rounded  ${
                                                                                tagIds.includes(index) ? 'bg-[#fff]/[0.1] opacity-[1]' : ''
                                                                            } hover:opacity-[1] cursor-pointer`}
                                                                            onClick={(e) => {
                                                                                filter(category, index)
                                                                            }}>
                                                                            <div>
                                                                                {category} <span>({count})</span>
                                                                            </div>
                                                                        </div>
                                                                    </div>
                                                                </div>
                                                            )
                                                        })}
                                                    </>
                                                ) : null}
                                            </div>
                                        </div>
                                    </div>
                                </aside>
                                <div className="pr-4 w-[calc(100%-280px)]">
                                    <section className="h-full">
                                        <div className="m-w-[none] h-full mx-auto">
                                            <section className="h-full">
                                                {games && games.length > 0 ? (
                                                    <>
                                                        <section className="mb-4 w-full mt-5">
                                                            <ul className="list-none content-stretch flex flex-wrap w-full items-stretch gap-x-5 gap-y-8">
                                                                {games.map((game) => {
                                                                    return (
                                                                        <>
                                                                            <li className="mb-[48px] transition ease-in-out duration-[125ms] w-[calc(25%-75px)] max-h-[300px] min-h-[150px] min-w-[112px]">
                                                                                <div>
                                                                                    <FilterGame
                                                                                        slug={game.product.slug}
                                                                                        cover={game.product.cover}
                                                                                        name={game.product.name}
                                                                                        //price={item.product.price}
                                                                                    />
                                                                                </div>
                                                                            </li>
                                                                        </>
                                                                    )
                                                                })}
                                                            </ul>
                                                        </section>
                                                    </>
                                                ) : (
                                                    <>
                                                        <div className="flex flex-col h-full">
                                                            <div className="flex flex-col items-center justify-center text-center h-auto">
                                                                <div className="mt-10 text-5xl">
                                                                    <span>No results found</span>
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </>
                                                )}
                                            </section>
                                        </div>
                                    </section>
                                </div>
                            </div>
                        </div>
                    </section>
                </div>
            </div>
        </>
    )
}
