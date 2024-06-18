import axios from "axios";
import { useEffect, useState } from "react";
import { Swiper, SwiperSlide} from 'swiper/react';

export default function Review(props) {
    const [reviews, setReviews] = useState();
    const [loading, setLoading] = useState(true);
    const loadingitems = Array.from({ length: 3 });
    const game_search = {
        method: 'GET',
        url: 'https://opencritic-api.p.rapidapi.com/game/search',
        params: {
          criteria: `${props.name}`

        },
        headers: {
          'X-RapidAPI-Key': 'eaf7d3e7b4mshbdd135d42f3a677p1afba9jsncff158dc8fb4',
          'X-RapidAPI-Host': 'opencritic-api.p.rapidapi.com'
        }
    };
    const get_review = (game_id) => {
        return {
            method: 'GET',
            url: `https://opencritic-api.p.rapidapi.com/reviews/game/${game_id}`,
            params: { sort: 'popularity'},
            headers: {
            'X-RapidAPI-Key': 'eaf7d3e7b4mshbdd135d42f3a677p1afba9jsncff158dc8fb4',
            'X-RapidAPI-Host': 'opencritic-api.p.rapidapi.com'
            }
        };
    };
    useEffect(() => {
        const fetchData = async () => {
            try {
                axios.request(game_search).then((response) => {
                    axios.request(get_review(response.data[0].id)).then((response2) => {
                        setReviews(response2.data)
                    }).catch((err) => {
                        console.log(err)
                    })
                }).catch((err) => {
                    console.log(err)
                }).finally(() => {
                    setLoading(false)
                })
            } catch(err) {
                console.log(err)
            }
        }
        fetchData()
    },[])
    const renderScore = (score, npScore, ScoreFormat) => {
        if(ScoreFormat.isNumeric) {
            if(npScore === 0) {
                return `${score.toFixed(ScoreFormat.numDecimals)/ScoreFormat.base} / ${100/ScoreFormat.base}`
            }
            return `${score.toFixed(ScoreFormat.numDecimals)/ScoreFormat.base} / ${npScore.toFixed(ScoreFormat.numDecimals)/ScoreFormat.base}`
        }
        else if(!ScoreFormat.isNumeric) {
            var matchOption;
            if(ScoreFormat.options)
                matchOption = ScoreFormat.options.find(option => option.val === score)
            return  matchOption ? `${matchOption.label}` : null
        }
    }
    return (
        <div className="mt-10 flex flex-col">
            <div className="">
                <h2 className="text-xl">
                    <span>{props.name} Ratings & Reviews</span>
                </h2>
            </div>
            {loading ? 
                <div className="flex flex-col w-full overflow-hidden">
                    <div className="mt-11 w-full">
                        <div className="w-full relative flex gap-4">
                            {loadingitems.map((loading) => {
                                return (
                                    <div className="h-[400px] w-[400px] skeleton"></div>
                                );
                            })}
                        </div>
                    </div>
                </div>
            :
            <div className="flex flex-col w-full overflow-hidden md:text-xs">
                <div className="mt-11 w-full">
                    <div className="w-full h-full relative flex flex-col justify-between">
                        <div className="w-full relative">
                            {reviews && reviews.length > 0 ?
                                <Swiper
                                    speed={500}
                                    className=''
                                    slidesPerView={3}
                                    spaceBetween={20}
                                    slidesPerGroup={3}
                                >
                                    {reviews.slice(0,3).map((review) => {
                                        return (
                                            <SwiperSlide style={{minHeight:'400px', height: '400px'}}>
                                                <div className="h-full flex justify-stretch"> 
                                                    <div className={`rounded p-[20px] bg-[#fff]/[.1]`}>
                                                        <div className="flex flex-col h-full">
                                                            <div className="mb-5">
                                                                <div className="w-full">
                                                                    <span className="transition">{review.Outlet?.name}</span>
                                                                </div>
                                                                <div className="w-full">
                                                                    <span className="transition text-[#fff]/[.6]">by {review.Authors[0]?.name}</span>
                                                                </div>
                                                            </div>
                                                            <div className="w-full "><div className="h-[1px] max-h-[1px] min-h-[1px] bg-[#fff]/[.1]"></div></div>
                                                            <div className="my-5">
                                                                <div className="w-full">
                                                                    <span className="transition">{renderScore(review.score, review.npScore, review.ScoreFormat)}</span>
                                                                </div>
                                                                <div className="my-5 w-full">
                                                                    <span className="transition font-normal text-[#fff]/[.6]">"{review?.snippet}"</span>
                                                                </div>
                                                            </div>
                                                            <div className="uppercase mt-auto">
                                                                <span className="transition text-[#fff]/[.6]">
                                                                    <a href={`${review.externalUrl}`} className="underline hover:no-underline text-white" target="_blank">
                                                                        <span className="transition text-[#fff]/[.6]">
                                                                            <span>
                                                                                read full review
                                                                            </span>
                                                                            <span className="ml-1 inline-block relative w-[12px]">
                                                                                <svg xmlns="http://www.w3.org/2000/svg" class="svg" viewBox="0 0 12 12"><path d="M9.50362 1.91667H7.70201V0.75H11.5894V4.4621H10.3676V2.74154L6.49554 6.43883L5.63166 5.61385L9.50362 1.91667Z" fill="currentColor"></path><path d="M2.43668 1.9697C2.09366 1.9697 1.8155 2.23532 1.8155 2.56288V9.49013C1.8155 9.81769 2.09366 10.0833 2.43668 10.0833H9.69097C10.034 10.0833 10.3122 9.81769 10.3122 9.49013V6.02636H11.5339V9.49013C11.5339 10.462 10.7088 11.25 9.69097 11.25H2.43668C1.41891 11.25 0.59375 10.462 0.59375 9.49013V2.56288C0.59375 1.59099 1.41891 0.803032 2.43668 0.803032H6.06398V1.9697H2.43668Z" fill="currentColor"></path></svg>
                                                                            </span>
                                                                        </span>
                                                                    </a>
                                                                </span>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                            </SwiperSlide>
                                        )
                                    })}
                                </Swiper>
                            : null}
                        </div>
                    </div>
                </div>
            </div>
            }
        </div>
    );
}