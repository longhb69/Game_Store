import { Swiper, SwiperSlide} from 'swiper/react';
import { Autoplay } from 'swiper/modules';
import { Link } from 'react-router-dom';
import {  useRef, useState } from 'react';
import useFetchData from '../useFetchData';

export default function Carousel(props) {
    const [activeSlide, setActiveSlide] = useState(0)
    const swiperRef = useRef(null);
    const {data: games, loading, error} = useFetchData(props.url)

    function handSlideChange() {
        const gamelogosRef = document.querySelectorAll(".game-logo");
        const GameInfoRef = document.querySelectorAll('.css-show');
        const realIndex = swiperRef.current.swiper.realIndex
        setActiveSlide(realIndex);

        GameInfoRef[realIndex].classList.add('game-name-show')
        GameInfoRef.forEach((info,i) => {
            if(i !== realIndex) {
                info.classList.remove('game-name-show')
            }
        })
        
        //gamelogosRef[realIndex].style.backgroundImage = `url(${props.newfeatured[realIndex].logo})`;
        gamelogosRef[realIndex].classList.remove("disappear")
        gamelogosRef[realIndex].classList.add("show")
        gamelogosRef.forEach((logo,i) => {
            if(i !== realIndex) {
                logo.classList.remove('show')
                logo.classList.add('disappear')
            }
    });
        
    }
    function Silde(index) {
        swiperRef.current.swiper.slideTo(index);
        const gamelogosRef = document.querySelectorAll(".game-logo");
        const GameInfoRef = document.querySelectorAll('.css-show');
        const miniThumbnail = document.querySelectorAll(".thumbnail-container")

        miniThumbnail[index].classList.add('zoom')
        miniThumbnail[index].addEventListener('animationend', () => {
            miniThumbnail[index].classList.remove('zoom')
        })

        gamelogosRef[index].classList.remove('disappear')
        gamelogosRef[index].classList.add('show')
        gamelogosRef.forEach((logo,i) => {
            if(i !== index) {
                logo.classList.remove('show')
                logo.classList.add('disappear')
            }
        });
        
    }
    const getResizeImage = (imageUrl, width) => {
        const part = imageUrl.split('/upload/')
        return part[0] + `/upload/w_${width},c_fill/` + part[1]
    }
    return (
        <>
            {loading ? 
                <div className='mb-[50px] h-[600px]'>
                    <div className='flex w-full h-full'>
                        <div className='h-full max-w-[1150px] w-[75%] h-[600px] '>
                            <div className='w-full h-full basis-3/4 skeleton rounded'>
                            </div>
                        </div>
                        <div className='ml-[30px] basis-1/4 w-[25%] h-[600px] max-h-[100%] flex flex-col gap-4'>
                            <div className='w-full min-w-[60px] my-auto h-[20%] skeleton rounded'>
                            </div>
                            <div className='w-full min-w-[60px] my-auto h-[20%] skeleton rounded'>
                            </div>
                            <div className='w-full min-w-[60px] my-auto h-[20%] skeleton rounded'>
                            </div>
                            <div className='w-full min-w-[60px] my-auto h-[20%] skeleton rounded'>
                            </div>
                            <div className='w-full min-w-[60px] my-auto h-[20%] skeleton rounded'>
                            </div>
                        </div>
                    </div>
                </div>
            : <>
                {games && games.length > 0 ? 
                    <div className='mb-[50px] h-full w-full'>
                        <div className='flex w-full h-full'>
                            <div className="relative w-[80%] h-full">
                                <Swiper
                                    ref={swiperRef}
                                    modules={[Autoplay]}
                                    autoplay={{ delay: 7600, disableOnInteraction: false }}
                                    //loop
                                    allowTouchMove={false}
                                    noSwiping={true}
                                    speed={500}
                                    className='carousel-swiper'
                                    onSlideChange={() => {
                                        handSlideChange()
                                    }}
                                >
                                {games.map((game, index) => {
                                    return (
                                        <SwiperSlide>
                                            <div className='h-full w-full relative cursor-pointer rounded-xl'>
                                                <Link to={`/app/${game.slug}`} className='w-full h-full block rounded-xl'>
                                                        <img className='object-cover rounded-xl block h-full w-full' src={game.background}/>
                                                        <div className='css-backlight'></div>
                                                    <div className={`absolute z-[1] left-[38px] w-[320px] bottom-[70px] flex flex-col items-start pointer-events-none transition-opacity duration-300 ease-in-out`}>
                                                        <div className='css-show game-name-show'>
                                                            <div>
                                                                <div className={`game-logo show w-[280px] h-[200px] md:w-[230px] md:h-[150px]`} style={{ backgroundImage: `url('${game.logo}')` }}></div>
                                                                <div className='mb-3 overflow-hidden break-words text-base md:text-[13px] text-[#fff]/[.9] leading-5 font-base'>
                                                                    {game.overview_description}
                                                                </div>
                                                            </div>
                                                            <div className=''>
                                                                <div className='text-lg font-medium'>
                                                                    <span>
                                                                        {game.price}<span className='underline'>đ</span>
                                                                    </span>
                                                                </div>
                                                            </div>
                                                            <div className='mt-2'>
                                                                <div className='flex'>
                                                                    <Link to={`/app/${game.slug}`} className='mr-[10px] min-w-[120px] relative items-center text-[#000] h-[40px] w-auto bg-[#fff] justify-center text-center rounded-sm inline-flex rounded'>
                                                                        BUY NOW
                                                                    </Link>
                                                                    {/* <button className='mr-[10px] min-w-[150px] relative items-center text-[#fff] h-[50px] bg-transparent w-auto  justify-center text-center rounded-sm inline-flex hover:bg-[#db55db] pointer-events-auto'
                                                                        onClick={() => addCart(game.id)}>
                                                                        <span>ADD TO CART</span>
                                                                    </button> */}
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </Link>
                                            </div>
                                        </SwiperSlide>
                                    );
                                })}
                                </Swiper>
                            </div>
                            <div className='ml-[20px] w-full max-h-[100%]'>
                                <ul className='h-full w-full flex flex-col gap-1 relative'>
                                    {games.map((game, index) => {
                                        return (
                                            <li className='rounded-2xl h-1/6 flex overflow-hidden'>
                                                <div className='w-full h-full'>
                                                    <Link className='block w-full h-full'>
                                                        <div className={`carouselThumbnail ${index === activeSlide ? ' slide addbackground' : 'removebackground'} rounded-2xl relative h-full`}
                                                            onClick={(e) => Silde(index)}>
                                                            <div className='pr-[10px] w-full h-full relative flex justify-start  cursor-pointer items-center'>
                                                                <div className='md:min-w-[40px] min-w-[60px] thumbnail-container mx-[15px] my-auto h-[74px] md:h-[50px] rounded-lg overflow-hidden z-[1]'>
                                                                    <div className='relative h-full'>
                                                                        <div className='items-center flex w-full h-full absolute overflow-hidden'>
                                                                            <img className='thumbnail-image w-full h-full' src={getResizeImage(game.cover, 60)}/>
                                                                        </div>
                                                                    </div>
                                                                </div>
                                                                <div className='font-base text-[16px] md:text-[10px] z-[1] leading-6 items-center'>
                                                                    <div className='overflow-hidden'>{game.name}</div>
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </Link>
                                                </div>
                                            </li>
                                        );
                                    })}
                                </ul>
                            </div>
                        </div>
                    </div>
                : null}
            </>}
        </>
    );
}