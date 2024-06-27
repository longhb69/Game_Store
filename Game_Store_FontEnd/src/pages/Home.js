import { baseUrl } from '../shared'
import Slider from '../components/Slider'
import Carousel from '../components/Carousel'
import TopSellers from '../components/TopSellers'
import BrowseSlider from '../components/BrowseSlider'
import NewRelease from '../components/NewRelease'
import DeveloperSlider from '../components/DeveloperSlider'
import { useEffect, useRef, useState } from 'react'
import Lottie from 'lottie-react'
import * as animationData from '../loading.json'

//Analogous #5532db #7032db #8F32db  ||Split-Complementary  #db5532 #db8F32   || Tetradic #32db55 #db5532
//||Split-Tetradic #5532db #db8F32  #32db55  ||#5532db #32db8F #db55db #8F32db,
//#280f63, #5532db, #3d0e4e    #2a0e4e, #5532db, #4e0e28   #2a0e4e, #5532db, #4e552a   #2a0e4e, #5532db, #4e2a0e        #D04D1A
export default function Home() {
    const mostPopularUrl = baseUrl + 'api/most-popular'
    const newReleaseUrl = baseUrl + 'api/new-release'
    const CommingSoonUrl = baseUrl + 'api/comming-soon'
    const newFeaturedUrl = baseUrl + 'api/newfeatured/'
    const PicksForYouUrl = baseUrl + 'api/picks-for-you'
    const DeveloperUrl3 = baseUrl + 'api/developer/electronic-arts'
    const DeveloperUrl2 = baseUrl + 'api/developer/playstation-pc-llc'
    const DeveloperUrl1 = baseUrl + 'api/developer/ubisoft'

    const EAlogo = 'https://res.cloudinary.com/dfo61m8dy/image/upload/v1706551414/Electronic-Arts-Logo.svg_yfzi4s.png'
    const PSlogo = 'https://res.cloudinary.com/dfo61m8dy/image/upload/v1706551730/2560px-PlayStation_logo.svg_j6cdu8.png'
    const Ubilogo = 'https://res.cloudinary.com/dfo61m8dy/image/upload/v1707063821/pngaaa.com-374032_gmwonz.png'
    const UbiBg = 'https://res.cloudinary.com/dfo61m8dy/image/upload/v1707062851/cropped-1920-1080-1189033_oxlfgg.jpg'
    const PSBg = 'https://res.cloudinary.com/dfo61m8dy/image/upload/v1707912181/d3667b280ac3b39031d345f8a038f953_qv4te7.jpg'
    const [loading, setLoading] = useState([true, true])
    const lazyLoadRefs = [useRef(), useRef()]

    const lazyLoadCallBack = (entries, observer) => {
        entries.forEach((entry, index) => {
            if (entry.isIntersecting) {
                const index = lazyLoadRefs.findIndex((ref) => ref.current === entry.target)
                setLoading((prevLoadingList) => {
                    const newLoadingList = [...prevLoadingList]
                    newLoadingList[index] = false
                    return newLoadingList
                })
                observer.unobserve(entry.target)
            }
        })
    }
    useEffect(() => {
        window.history.scrollRestoration = 'manual';
        window.scrollTo(0,0)
        const options = {
            threshold: 0.0,
        }
        const observer = new IntersectionObserver(lazyLoadCallBack, options)
        lazyLoadRefs.forEach((ref) => {
            if (ref.current) {
                observer.observe(ref.current)
            }
        })
        return () => {
            window.history.scrollRestoration = 'auto';
          };
    }, [])

    return (
        <div className="mx-auto w-full relative">
            <div className="w-[75%] mt-10 mx-auto">
                <Carousel url={newFeaturedUrl} />
            </div>
            <div className="mt-5 w-[75%] mx-auto">
                <BrowseSlider url={mostPopularUrl} title={'Popular'} linkable={true} slug={'most-popular'} />
            </div>
            {loading[0] ? (
                <div ref={lazyLoadRefs[0]} className="mx-auto flex justify-center my-10">
                    <Lottie className="h-[60px] w-[60px]" animationData={animationData} loop={true} />
                </div>
            ) : (
                <div>
                    <div
                        className={`section-load w-[75%] mx-auto min-h-[350px] developer-container bg-gradient-to-r from-[#0d1042] to-[#792844] mt-8 pb-4 mb-5 rounded-xl border-2`}>
                        <DeveloperSlider url={DeveloperUrl3} logo={EAlogo} />
                    </div>
                    <div className={`w-[75%] mx-auto min-h-[350px] developer-container rounded-xl border-2`} style={{ backgroundImage: `url('${PSBg}')` }}>
                        <DeveloperSlider url={DeveloperUrl2} logo={PSlogo} />
                    </div>
                </div>
            )}
            <div className="mt-8">
                <NewRelease newReleaseUrl={newReleaseUrl} CommingSoonUrl={CommingSoonUrl} />
            </div>
            <div className="p-7 w-[75%] mx-auto">
                <BrowseSlider url={PicksForYouUrl} title={'Picks for you'} linkable={false} slideperview={6} />
            </div>
            {loading[1] ? (
                <div ref={lazyLoadRefs[1]} className=" mx-auto flex justify-center my-10">
                    <Lottie className="h-[60px] w-[60px]" animationData={animationData} loop={true} />
                </div>
            ) : (
                <div className="section-load w-[75%] mx-auto mt-8 pb-4 min-h-[350px] developer-container rounded-xl border-2" style={{ backgroundImage: `url('${UbiBg}')` }}>
                    <DeveloperSlider url={DeveloperUrl1} logo={Ubilogo} />
                </div>
            )}
            {loading[1] ? (
                <div ref={lazyLoadRefs[1]} className=" mx-auto flex justify-center my-10">
                    <Lottie className="h-[60px] w-[60px]" animationData={animationData} loop={true} />
                </div>
            ) : (
                <>
                    <div className="mt-5 w-[75%] mx-auto mt-5">
                        <TopSellers />
                    </div>
                </>
            )}
            <div className="flex flex-col items-center justify-center mt-5">
                <Slider />
            </div>
        </div>
    )
}
