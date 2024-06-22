import { Swiper, SwiperSlide} from 'swiper/react';
import { Link,useNavigate,useLocation } from 'react-router-dom';
import { useEffect, useRef, useState } from 'react';
import axios from 'axios';
import useFetchData from '../useFetchData';
import { baseUrl } from '../shared';

export default function MostPopular(props) {
    const swiperRef = useRef(null);
    const [endSlide, setEndSlide] = useState(false);
    const [beginSlide, setBeginSlide] = useState(true);
    const [url, setUrl] = useState(props.url);
    const loadingitems = Array.from({ length: 5 });
    
    const { data: games, loading, error, refetch} = useFetchData(url);
    init();

    function init() {
        if(swiperRef.current?.swiper.slides?.length < 6) {
            setBeginSlide(true);
            setEndSlide(true);
        }
    }
    function next() {
        swiperRef.current.swiper.slideNext();
    }
    function prev() {
        swiperRef.current.swiper.slidePrev();
    }
    function handlePosition() {
        if(!swiperRef.current.swiper.isEnd && !swiperRef.current.swiper.isBeginning) {
            setEndSlide(false);
            setBeginSlide(false);
        }
        else if(swiperRef.current.swiper.isEnd) {
            setEndSlide(true);
            setBeginSlide(false);
        }
        else if(swiperRef.current.swiper.isBeginning) {
            setEndSlide(false);
            setBeginSlide(true);
        }
    }
    return (
        <>
            {loading ? 
                <>
                <div className='flex justify-between items-center mb-5'>
                    {props.linkable ? (
                        <>
                            <Link to={`fillter/${props.slug}`}>
                                <h2 className='flex items-center link-title'>
                                    {props.title}
                                    <span className='ml-1.5 w-2.5 h-2.5 flex link-arrow'>
                                        <svg xmlns="http://www.w3.org/2000/svg" class="w-full h-full" viewBox="0 0 5 9"><path stroke="currentColor" d="M1 1l3 3.5L1 8" fill="none" fill-rule="evenodd"></path></svg>     
                                    </span>
                                </h2>
                            </Link>
                        </>
                    )
                    : <>
                        <h2 className='text-xl'>{props.title}</h2>
                    </>
                    }
                    <div className='flex'>
                            <div className={`ml-[10px] cursor-default`}>
                                <button className={`relative w-[30px] h-[30px] flex items-center justify-center`}>
                                    <span className={`lock w-[12px] h-[12px] scale-x-[-1]`}>
                                        <svg xmlns="http://www.w3.org/2000/svg" class={`w-full h-full`} viewBox="0 0 5 9"><path stroke="currentColor" d="M1 1l3 3.5L1 8" fill="none" fill-rule="evenodd"></path></svg>
                                    </span>
                                </button>
                            </div>
                            <div className={`ml-[10px]`}>
                                <button className={`relative w-[30px] h-[30px] flex items-center justify-center`}>
                                    <span className={`block w-[12px] h-[12px] z-[1]`}>
                                        <svg xmlns="http://www.w3.org/2000/svg" class={`w-full h-full`} viewBox="0 0 5 9"><path stroke="currentColor" d="M1 1l3 3.5L1 8" fill="none" fill-rule="evenodd"></path></svg>
                                    </span>
                                </button>
                            </div>
                        </div>
                </div>
                <div className="flex">
                    <ul className='list-none content-stretch flex flex-nowrap w-full items-stretch gap-10'>
                        {loadingitems.map((item) => (
                            <li className='mb-[90px] transition ease-in-out duration-[125ms] w-[20%]'>
                                <div className='rounded w-full h-[270px] skeleton'></div>
                                <div className='mt-5 rounded-md w-full h-[20px] skeleton rounded-md'></div>
                                <div className='mt-2 w-full h-[20px]  skeleton rounded-md'></div>
                                <div className='mt-5 w-[30%] h-[20px] mr-auto skeleton rounded-md'></div>
                            </li>
                        ))}
                    </ul>
                </div>
                </>
            :
            <>
            {games && games.length > 1 ? (
                <>
                    <div className='flex justify-between items-center mb-5 text-lg'>
                        {props.linkable ? (
                            <>
                                <Link to={`fillter/${props.slug}`}>
                                    <h2 className='flex items-center link-title'>
                                        {props.title}
                                        <span className='ml-1.5 w-2.5 h-2.5 flex link-arrow'>
                                            <svg xmlns="http://www.w3.org/2000/svg" class="w-full h-full" viewBox="0 0 5 9"><path stroke="currentColor" d="M1 1l3 3.5L1 8" fill="none" fill-rule="evenodd"></path></svg>     
                                        </span>
                                    </h2>
                                </Link>
                            </>
                        )
                        : <>
                            <h2 className='text-lg'>{props.title}</h2>
                        </>
                        }
                        <div className='flex'>
                            <div className={`ml-[10px] ${beginSlide ? 'pointer-events-none cursor-default' : ''}`}>
                                <button className={` ${beginSlide ? 'css-172': 'css-17'} relative w-[30px] h-[30px] flex items-center justify-center`}
                                    onClick={() => prev()}>
                                    <span className={`lock w-[12px] h-[12px] scale-x-[-1] ${beginSlide ? 'opacity-[0.5] select-none' : ''}`}>
                                        <svg xmlns="http://www.w3.org/2000/svg" class={`w-full h-full ${beginSlide ? 'pointer-events-none select-none' : ' '}`} viewBox="0 0 5 9"><path stroke="currentColor" d="M1 1l3 3.5L1 8" fill="none" fill-rule="evenodd"></path></svg>
                                    </span>
                                </button>
                            </div>
                            <div className={`ml-[10px] ${endSlide ? 'pointer-events-none cursor-default' : ' '}`}>
                                <button className={`${endSlide ? 'css-172': 'css-17'} relative w-[30px] h-[30px] flex items-center justify-center`}
                                    onClick={() => next()}>
                                    <span className={`block w-[12px] h-[12px] z-[1] ${endSlide ? 'opacity-[0.5]' : ' '}`}>
                                        <svg xmlns="http://www.w3.org/2000/svg" class={`w-full h-full ${endSlide ? 'pointer-events-none select-none' : ' '}`} viewBox="0 0 5 9"><path stroke="currentColor" d="M1 1l3 3.5L1 8" fill="none" fill-rule="evenodd"></path></svg>
                                    </span>
                                </button>
                            </div>
                        </div>
                    </div>
                    <Swiper
                        ref={swiperRef}
                        modules={[]}
                        spaceBetween={20}
                        speed={300}
                        allowTouchMove={false}
                        slidesPerView={props.slideperview ? props.slideperview : 6}
                        slidesPerGroup={props.slideperview ? props.slideperview : 6}
                        noSwiping={true}
                        className='most-popular-swiper'
                        onSlideChange={() => {
                            handlePosition();
                        }}
                        {...{
                            lazy: {
                              loadPrevNext: false,
                              loadPrevNextAmount: 0, 
                              loadOnTransitionStart: true,
                            }
                          }}
                    >
                        {games.map((game) => {
                            return (
                                <div>
                                    <SwiperSlide>
                                        <div className="h-full w-full font-normal font-inter">
                                            <Link className=' flex flex-col w-full' to={'/app/' + game.slug}>
                                                <div className='w-full h-[280px] rounded hover-affect relative slider-image'>
                                                    <img className='select-none w-full h-full rounded' src={game.cover} loading='lazy'/> 
                                                </div>
                                                <div className='md:text-base sm:text-[12px] flex flex-col font-normal'>
                                                    <div className='overflow-hidden mt-2'>{game.name}</div>
                                                    <div className='flex items-center mt-1'>
                                                        <div>{game.price}<span className="underline">đ</span></div>
                                                    </div>
                                                </div>
                                            </Link>
                                        </div>
                                    </SwiperSlide> 
                                </div>
                            );
                        })}
                    </Swiper>
                </>
            )
            : null}
            </>}
        </>
    );
}