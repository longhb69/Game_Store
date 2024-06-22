import { useRef, useEffect, useState } from 'react'
import { Swiper, SwiperSlide, useSwiper } from 'swiper/react'
import { Navigation, A11y } from 'swiper/modules'
import 'swiper/css'

export default function GameImageVideo(props) {
    const swiperContainerRef = useRef()
    const videoRef = useRef(null)
    const smallSwiper = useRef()
    const miniSwiperRef = useRef()
    const buttonRef = useRef()
    const [loading, setLoading] = useState(true)
    const [currentSlide, setCurrentSlide] = useState(0)
    useEffect(() => {
        swiperContainerRef.current.swiper.slideTo(currentSlide)
        if (miniSwiperRef.current) miniSwiperRef.current.swiper.slideTo(currentSlide)
    }, [currentSlide])
    function playVideo(play) {
        if (play) {
            if (videoRef.current) {
                try {
                    videoRef.current.play()
                } catch (e) {
                    console.log(e)
                }
            }
        } else {
            try {
                videoRef.current.pause()
            } catch (e) {
                console.log(e)
            }
        }
    }
    function VideoHandle() {
        const swiper = swiperContainerRef.current.swiper
        const activeIndex = swiper.activeIndex
        setCurrentSlide(activeIndex)
        if (activeIndex !== 0) {
            playVideo(false)
        } else {
            playVideo(true)
        }
    }
    function main_prev() {
        swiperContainerRef.current.swiper.slidePrev()
    }
    function prev() {
        miniSwiperRef.current.swiper.slidePrev()
    }
    function main_next() {
        swiperContainerRef.current.swiper.slideNext()
    }
    function next() {
        miniSwiperRef.current.swiper.slideNext()
    }
    function changeSlide(index) {
        swiperContainerRef.current.swiper.slideTo(index)
        setCurrentSlide(index)
    }
    const getResizeImage = (imageUrl, width) => {
        const part = imageUrl.split('/upload/')
        return part[0] + `/upload/w_${width},c_fill/` + part[1]
    }
    return (
        <>
            <div className="flex .main-container">
                <Swiper
                    ref={swiperContainerRef}
                    modules={[Navigation, A11y]}
                    navigation
                    rewind
                    className="swiper_slide"
                    onSlideChange={() => VideoHandle()}
                    style={{
                        '--swiper-theme-color': '#fff',
                        '--swiper-navigation-size': '30px',
                    }}>
                    <button className="swiper-button-prev w-[18px] h-[18px] rotate-180" onClick={() => main_prev()}>
                        <span className="">
                            <svg xmlns="http://www.w3.org/2000/svg" class="svg css-uwwqev" viewBox="0 0 5 9">
                                <path stroke="currentColor" d="M1 1l3 3.5L1 8" fill="none" fill-rule="evenodd"></path>
                            </svg>
                        </span>
                    </button>
                    {props.video ? (
                        <SwiperSlide>
                            <video ref={videoRef} className="h-full w-full rounded object-cover" controls autoPlay muted>
                                <source src={props.video} type="video/webm" />
                                <span>Your browser does not support the video tag.</span>
                            </video>
                        </SwiperSlide>
                    ) : null}
                    {props.game_image && props.game_image.length > 0
                        ? props.game_image.map((image, index) => (
                              <SwiperSlide key={index}>
                                  <img src={image.image} className="h-full w-full" />
                              </SwiperSlide>
                          ))
                        : null}
                    <button className="w-[18px] h-[18px] swiper-button-next" onClick={() => main_next()}>
                        <span className="">
                            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 5 9">
                                <path stroke="currentColor" d="M1 1l3 3.5L1 8" fill="none" fill-rule="evenodd"></path>
                            </svg>
                        </span>
                    </button>
                </Swiper>
            </div>
            <div className="flex items-center justify-between mt-[20px] text-center overflow-hidden ">
                {props.game_image && props.game_image.length > 3 ? (
                    <div className="flex justify-center items-center px-2 rounded-full">
                        <button className="w-[18px] h-[18px] pb-10 rotate-180" onClick={() => prev()}>
                            <span className="">
                                <svg className="rotate-180 w-[20px] h-[20px]" xmlns="http://www.w3.org/2000/svg" class="" viewBox="0 0 5 9">
                                    <path stroke="currentColor" d="M1 1l3 3.5L1 8" fill="none" fill-rule="evenodd"></path>
                                </svg>
                            </span>
                        </button>
                    </div>
                ) : (
                    <div></div>
                )}
                <div className="max-w-[800px] md:w-[600px]">
                    {props.game_image && props.game_image.length > 0 ? (
                        <Swiper
                            ref={miniSwiperRef}
                            modules={[Navigation, A11y]}
                            rewind
                            slidesPerView={props.game_image.length < 3 ? props.game_image.length + 1 : 4}
                            spaceBetween={0}
                            className="smaler-swiper2"
                            onSlideChange={() => VideoHandle()}
                            style={{
                                '--swiper-theme-color': '#fff',
                                '--swiper-navigation-size': '30px',
                                '.swiper-slide-active ': '2px',
                            }}>
                            <SwiperSlide style={{ width: '200px' }}>
                                <div className="relative" onClick={() => changeSlide(0)}>
                                    <img
                                        src={props.image}
                                        className={`${
                                            currentSlide === 0 ? 'border border-[#fff] opacity-[1]' : 'opacity-[0.6]'
                                        } hover:opacity-[1] cursor-pointer max-w-[180px] swiper-image h-[60px] transition-opacity ease-in-out duration-[450ms]`}
                                        loading="lazy"/>
                                    <div className="z-[1] absolute h-[20px] top-[30px] left-[82px] w-[20px] md:top-[15px] md:left-[50px]">
                                        <svg xmlns="http://www.w3.org/2000/svg" class="svg css-uwwqev" viewBox="0 0 11 14">
                                            <path d="M0 0v14l11-7z" fill="#8F32db" fill-rule="nonzero"></path>
                                        </svg>
                                    </div>
                                </div>
                            </SwiperSlide>
                            {props.game_image && props.game_image.length > 0
                                ? props.game_image.map((image, index) => (
                                      <SwiperSlide style={{ width: '200px', borderRadius: '4px' }} key={index}>
                                          <div className={`h-full  rounded`} onClick={() => changeSlide(index + 1)}>
                                              <img
                                                  src={getResizeImage(image.image, 142)}
                                                  className={`rounded ${
                                                      index === currentSlide - 1 ? 'border border-[#fff] opacity-[1]' : 'opacity-[0.6]'
                                                  }  hover:opacity-[1]  cursor-pointer  max-w-[180px] h-[60px] swiper-image transition-opacity ease-in-out duration-[450ms]`}></img>
                                          </div>
                                      </SwiperSlide>
                                  ))
                                : null}
                        </Swiper>
                    ) : null}
                </div>
                {props.game_image && props.game_image.length > 3 ? (
                    <div className="flex justify-center items-center px-2 rounded-full">
                        <button className="w-[18px] h-[18px] pb-10" onClick={() => next()}>
                            <span className="">
                                <svg className="w-[20px] h-[20px]" xmlns="http://www.w3.org/2000/svg" class="" viewBox="0 0 5 9">
                                    <path stroke="currentColor" d="M1 1l3 3.5L1 8" fill="none" fill-rule="evenodd"></path>
                                </svg>
                            </span>
                        </button>
                    </div>
                ) : (
                    <div></div>
                )}
            </div>
        </>
    )
}
