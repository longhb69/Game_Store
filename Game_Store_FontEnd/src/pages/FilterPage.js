import axios from 'axios';
import { useEffect, useRef, useState } from 'react';
import { baseUrl } from "../shared";
import { useParams } from 'react-router-dom';
import FillterGame from '../components/FillterGame';
import { Link } from 'react-router-dom';


export default function FillterPage() {
    const params = useParams();
    const [games, setGames] = useState();
    const title = params.slug.replace(/-/g, ' ').replace(/(^|\s)\S/g, (match) => match.toUpperCase())
    useEffect(() => {
        const url = baseUrl + `api/${params.slug}`
        axios.get(url).then((response) => {
            setGames(response.data)
        })
    }, [])
    return (
        <>
            <div>
                <section className='mb-[40px]'>
                    <div className='w-[75%] max-w-[none] mx-auto'>
                        <div className='flex w-full'>
                            <div className='flex flex-col items-start justify-center min-h-[100%] w-full'>
                                <h1 className='w-[60%] text-5xl py-3'>{title}</h1>
                            </div>
                        </div>
                    </div>
                </section>
                <section className='w-[75%] mx-auto max-w-[1600px] '>
                    <div className='max-w-[none] mx-auto'>
                        <section className='pb-6 w-full'>
                            <ul className='list-none flex flex-wrap w-full items-stretch'>
                                {games && games.length > 0 ? 
                                    <>
                                    {games.map((game) => {
                                        return (
                                            <li className='css-29 mb-[48px] basics-[25%] h-[400px] ml-4 mb-32'>
                                                <div className='max-h-[450px] h-[330px] w-[270px] max-w-[270px]'>
                                                    <FillterGame
                                                        slug={game.slug}
                                                        cover={game.cover}
                                                        name={game.name}
                                                        price={game.price}/>
                                                </div>
                                            </li>
                                        );
                                    })}
                                    </>
                                : null}
                            </ul>
                        </section>
                    </div>
                </section>
            </div>
        </>
    );
}