import { useEffect, useRef, useState } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import { baseUrl } from '../shared';
import FillterGame from '../components/FillterGame';

export default function Search() {
    const params = useParams();
    const [games, setGames] = useState();
    const [categories, setCategories] = useState([]);
    const [btnActive, setBtnActive] = useState(false);
    const [loading, setLoading] = useState(true);
    const [tags, setTags] = useState([]);
    const [tagIds, setTagIds] = useState([]);
    const [query2, setQuery] = useState(params.q);
    const inputRef = useRef();
    const loadingitems = Array.from({ length: 10 });
    const [isPressed, setIsPressed] = useState(false);
    
    const getData = (query='') => {
        setLoading(true)
        const url = tags && tags.length > 0
        ? `${baseUrl}search?q=${query}&tag=${tags}`
        : `${baseUrl}search?q=${query}`;

        axios.get(url).then((response) => {
            setGames(response.data);
            setTimeout(() => {
                setLoading(false);
            }, 1000);
        }).catch((error) => {
            console.error('Error fetching data:', error);
        });;
    }
    let searchData = (query2=params.q) => {
        getData(query2)
    }
    useEffect(() => {
        axios.get(`${baseUrl}api/category2/`).then((response) => {
            setCategories(response.data)
        })
    }, [])
    useEffect(() => {
        getData(query2);
    }, [tags])
    useEffect(() => {
        getData(params.q)
        setQuery(params.q)
    }, [params])

    function fillter(game_name,  id) {
        if(tagIds.includes(id)) {
            setTagIds((prevId) => prevId.filter((tagId) => tagId !== id ))
            setTags((prevTags) => prevTags.filter((name) => name != game_name))
        }
        else {
            setTagIds((prevId) => [...prevId || null, id]);
            setTags((prevTags) => [...prevTags || null, game_name]);
        }
    }
    const handleInputChange = (event) => {
        setQuery(event.target.value);
    };
    useEffect(() => {
        searchData(query2);
    }, [query2])

    const handlePress = () => {
        setIsPressed(true);
        setTimeout(() => {
            setIsPressed(false)
        }, 150)
    }
    return (
        <>
            <div className='w-[75%] h-[1450px] mx-auto max-w-[1600px]'>
                <div className='pb-20'>
                    <section className='h-full'>
                        <div className='flex w-full max-w-[none]'>
                            <div className='flex flex-row-reverse w-full h-full text-base'>
                                <aside className='w-[280px] shrink-0 mt-5'>
                                    <div className='w-full overflow-hidden'>
                                        <div>
                                            <div className='flex h-[54px] justify-between pt-2 flex items-center'>
                                                <div className=''>Fillters ({tagIds.length})</div>
                                                <button className={`text-xs text-center items-center cursor-pointer flex py-3 px-1 ${isPressed ? 'border' : ''}`}>
                                                    <div onClick={() => {
                                                        setTagIds([]);
                                                        setTags([]);
                                                        setQuery("");
                                                        handlePress();
                                                    }}>RESET</div>
                                                </button>
                                            </div>
                                        </div>
                                        <div>
                                            <div className='mb-4'>
                                                <div className='relative text-sm'>
                                                    <span className='absolute left-[10px] block top-[13px] w-3 h-3 z-1'>
                                                        <svg xmlns="http://www.w3.org/2000/svg" class="w-full h-full" viewBox="0 0 21 20" preserveAspectRatio="xMidYMid meet"><g transform="scale(1 -1) rotate(-45 -11.93502884 -2)" stroke="currentColor" stroke-width="1.65" fill="none" fill-rule="evenodd"><circle cx="7.70710678" cy="7.70710678" r="7"></circle><path d="M15.2071068 8.62132034h5.6923881" stroke-linecap="square"></path></g></svg>
                                                    </span>
                                                    <input  
                                                        ref = {inputRef}
                                                        value={query2}
                                                        onChange={handleInputChange}
                                                        type="text" placeholder='Keywords' className='pr-[30px] pl-[40px] rounded bg-none outline-none w-full h-[40px] bg-[#202020]'>
                                                    </input>
                                                    <button className='reset-btn absolute p-1 right-[10px] top-[12.5px]' onClick={(e) => {setQuery("")}}>
                                                        <span className='block w-[14px] h-[10.5px]'>
                                                            <svg xmlns="http://www.w3.org/2000/svg" class="w-full h-full" viewBox="0 0 14 15"><g fill="currentColor" fill-rule="evenodd"><path d="M.98959236 14.21751442L13.71751442 1.48959236l-.70710678-.70710678L.28248558 13.51040764z"></path><path d="M.28248558 1.48959236l12.72792206 12.72792206.70710678-.70710678L.98959236.78248558z"></path></g></svg>
                                                        </span>
                                                    </button>
                                                </div>
                                            </div>
                                        </div>
                                        <div>
                                            <div className='fillter-container'>
                                                <div className='items-center cursor-pointer flex justify-between'>
                                                    <button className={`items-center flex font-medium justify-between opacity-[0.6] px-3.5 py-5 w-full border ${btnActive ? 'border-[#fff]' : 'border-transparent'} hover:opacity-[1] transition`}
                                                        onClick={(e) => {
                                                            setBtnActive(!btnActive);
                                                        }}>
                                                        <div className='text-sm'>GENRE</div>
                                                        <div>
                                                            <span className={`block h-3 w-4 rotate-90 ${btnActive ? 'genre-btn-up' : 'genre-btn-down' }`}>
                                                                <svg xmlns="http://www.w3.org/2000/svg" class="w-full h-full" viewBox="0 0 7.7 12"><path fill="currentColor" d="M1.7 0L0 1.7 4.3 6 0 10.3 1.7 12l6-6z"></path></svg>
                                                            </span>
                                                        </div>
                                                    </button>
                                                </div>
                                            </div>
                                            <div className={`${btnActive ? '' : 'hidden'} transition`}>
                                                {categories ? 
                                                    <>
                                                        {categories.map((category, index) => {
                                                            return (
                                                                <div>
                                                                    <div>
                                                                        <div className={`items-center flex font-medium justify-between opacity-[0.6] px-3.5 py-5 mb-2 w-full rounded  ${tagIds.includes(index) ? 'bg-[#fff]/[0.1] opacity-[1]' : '' } hover:opacity-[1] cursor-pointer`}
                                                                            onClick={(e) => {
                                                                                fillter(category.name, index)
                                                                            }}>
                                                                            <div>
                                                                                {category.name}
                                                                            </div>
                                                                        </div>
                                                                    </div>
                                                                </div>
                                                            );
                                                        })}
                                                    </>
                                                : null}
                                            </div>
                                        </div>
                                    </div>
                                </aside>
                                <div className='pr-4 w-[calc(100%-280px)] mt-5'>
                                    <section className="h-full">
                                        <div className='m-w-[none] h-full mx-auto'>
                                            {loading ? 
                                                <section className='h-full'>
                                                    <section className='mb-4 w-full mt-5'>
                                                        <ul className='list-none content-stretch flex flex-wrap w-full items-stretch gap-10'>
                                                            {loadingitems.map((item) => (
                                                                <li className='mb-[90px] transition ease-in-out duration-[125ms] w-[calc(25%-65px)] max-h-[300px] min-w-[200px]'>
                                                                    <div className='rounded w-full h-[270px] skeleton'></div>
                                                                    <div className='mt-5 rounded-md w-full h-[20px] skeleton rounded-md'></div>
                                                                    <div className='mt-2 w-full h-[20px]  skeleton rounded-md'></div>
                                                                    <div className='mt-5 w-[30%] h-[20px] mr-auto skeleton rounded-md'></div>
                                                                </li>
                                                            ))}
                                                        </ul>
                                                    </section>
                                                </section>
                                            : 
                                                <section className='h-full'>
                                                    {games && games.length > 0 ? <>
                                                        <section className='mb-4 w-full mt-5'>
                                                            <ul className='list-none content-stretch flex flex-wrap w-full items-stretch gap-4'>
                                                                {games.map((game) => {
                                                                    return (
                                                                        <>
                                                                            <li className='mb-[48px] transition ease-in-out duration-[125ms] w-[calc(25%-65px)] max-h-[300px] min-h-[150px] min-w-[112px]'>
                                                                                <div>
                                                                                    <FillterGame
                                                                                        slug={game.slug}
                                                                                        cover={game.cover}
                                                                                        name={game.name}
                                                                                        price={game.price}/>
                                                                                </div>
                                                                            </li>
                                                                        </>
                                                                    );
                                                                })}
                                                            </ul>
                                                        </section>
                                                    </>
                                                    : 
                                                    <>
                                                        <div className='flex flex-col h-full'>
                                                            <div className='flex flex-col items-center justify-center text-center h-auto'>
                                                                <div className='mt-10 text-5xl'>
                                                                    <span>No results found</span>
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </>
                                                    }
                                                </section>
                                            }
                                        </div>
                                    </section>
                                </div>
                            </div>
                        </div>
                    </section>
                </div>
            </div>
        </>
    );
}