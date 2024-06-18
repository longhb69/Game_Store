import { useParams } from 'react-router-dom'
import { useEffect, useState } from 'react'
import CategoryPageSlider from '../components/CategoryPageSlider'
import axios from 'axios'
import { baseUrl } from '../shared'
import SaleSection from '../components/SaleSection'

export default function CategoryGame() {
    const slug = useParams().slug
    const [games, setGames] = useState()
    const [loading, setLoading] = useState(true)
    const [next, setNext] = useState()
    const [pre, setPre] = useState()
    const url = baseUrl + `api/category/${slug}/`
    useEffect(() => {
        axios
            .get(url)
            .then((response) => {
                setGames(response.data.results)
                setNext(response.data.next)
                setPre(response.data.pre)
            })
            .finally(() => {
                setLoading(false)
            })
    }, [])

    function showMore() {
        axios.get(next).then((response) => {
            setGames((prevComments) => [...prevComments, ...response.data.results])
            setNext(response.data.next)
            setPre(response.data.pre)
        })
    }
    return (
        <>
            {loading ? (
                <div className="max-w-[1100px] mx-auto mb-[50px]">
                    <div className="text-5xl font-bold max-w-[1050px] mt-[4rem] uppercase">{slug}</div>
                    <div className="flex mt-7 w-full">
                        <div className="h-[400px] w-[400px] skeleton"></div>
                        <div className="flex flex-col w-full ml-3 gap-3">
                            <div className="w-[50%] h-[50px] skeleton"></div>
                            <div className="w-[20%] h-[30px] skeleton"></div>
                            <div className="w-[30%] h-[30px] skeleton"></div>
                            <div className="w-[100%] h-[40px] skeleton"></div>
                        </div>
                    </div>
                </div>
            ) : (
                <div className="mx-auto flex flex-col relative bg-[#0e141bcc]">
                    <CategoryPageSlider name={slug} games={games} count={games.length} />
                </div>
            )}
            <div className="mx-auto mb-[90px] w-[60%] mt-[90px] z-[99] max-w-[950px]">
                <SaleSection games={games} showMore={showMore} next={next?.length > 0} />
            </div>
        </>
    )
}
