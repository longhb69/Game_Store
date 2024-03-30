import { useRef, useState } from 'react';
import { baseUrl } from '../shared';
import useFetchData from '../useFetchData';

export default function NewRelease(props) {
    const [activeIndex, setActivteIndex] = useState()
    const activeIndexRef = useRef();
    const NewReleaseRef = useRef();
    const CommingSoonRef = useRef();
    const [ActiveSection, setActivteSection] = useState(1);
    //const [delay, setDelay] = useState([]);

    const {data:games, loading, error } = useFetchData(props.newReleaseUrl);
    const {data:commingGames, loading2, error2 } = useFetchData(props.CommingSoonUrl);
  
    const handleMouseOver = (index) => {
        setActivteIndex(index)
        const images = document.querySelectorAll(".game-grid");
        activeIndexRef.current = index;
        images.forEach((img, i) => {
            if (i !== index) {
                img.classList.add('not_hover');
            }
            else {
                img.classList.remove('not_hover')
            }
        });
    };
    const handleMouseLeave = (index) => {
        index = activeIndexRef.current;
        const images = document.querySelectorAll(".game-grid");
        setTimeout(() => {
            if(index === activeIndexRef.current) {
                images.forEach((img, i) => {
                    img.classList.remove('not_hover')
                });
            }
        }, 150)
    }
    const toCommingSoon = (e) => {
        setActivteSection(2)
        CommingSoonRef.current.classList.remove('display-hidden');
        NewReleaseRef.current.classList.add('display-hidden');

        CommingSoonRef.current.classList.add('slideInLeft')
        NewReleaseRef.current.classList.remove('slideInLeft');
    }
    const toNewReleases = (e) => {
        setActivteSection(1)
        NewReleaseRef.current.classList.remove('display-hidden');
        CommingSoonRef.current.classList.add('display-hidden')

        NewReleaseRef.current.classList.add('slideInLeft');
        CommingSoonRef.current.classList.remove('slideInLeft')
    }
    
    return (
        <section className="w-full relative inline-block z-1 bg-[#121314]">
            <div>
                <div className="mb-5 gdk">
                    <header className="text-center mt-3 flex justify-between items-end ml-20">
                        <div className="text-center">
                            <h2 className="text-[40px] font-[300px] mb-3">Great games out now or comming soon</h2>
                        </div>
                    </header>
                    <div className="relative z-[50]">
                        <div className='mx-16'>
                            <div className="flex px-5 pb-1 mt-3 z-[999] justify-center sticky top-[90px] ">
                                <div className='select-none	 rounded-full inline-block font-medium p-1 shrink-0 cursor-pointer relative z-[29] surface-card text-sm'>
                                    <div className={`surface-default-state ${ActiveSection === 1 ? 'border-2 border-[#5532db] text-[#000]/[1] bg-[#fff]' : 'hover:text-[#32db55]'}  inline-flex gap-[2px] px-4 py-3 transition ease-in-out duration-[250ms] rounded-full`}    
                                        onClick={() => toNewReleases()}>
                                        New releases
                                    </div>
                                    <div className={`surface-default-state ${ActiveSection === 2 ? 'border-2 border-[#5532db] text-[#000]/[1] bg-[#fff]' : 'hover:text-[#32db55]'} inline-flex gap-[2px] px-4 py-3 transition ease-in-out duration-[250ms] rounded-full`}
                                        onClick={() => toCommingSoon()}>
                                        Comming soon
                                    </div>
                                </div>
                            </div>
                            <div className="mt-6">
                                {games && games.length > 1 ? 
                                    <div ref={NewReleaseRef} className="">
                                        <div className="relative w-auto">
                                            <div className="relative mx-[80px]">    
                                                <div className="flex justify-center flex-wrap max-w-none w-auto overflow-hidden py-3 carousel-grid">
                                                    {games.map((game,index) => {
                                                        const dynamticDelay = index * 50;
                                                        return (
                                                            <a href={`/app/${game.slug}`} className={`game-grid max-w-[100%] ml-4 inline-flex flex-col shrink-0 w-[17%]`} style={{ animationDelay: `${dynamticDelay}ms` }}
                                                                onMouseOver={() => {
                                                                    handleMouseOver(index)
                                                                }}
                                                                onMouseLeave={() => handleMouseLeave(index)}
                                                                >
                                                                <div className='game-grid-v2'>
                                                                    <div className='absolute z-[-1] inset-0 media-block'>
                                                                        <div className='h-full relative'>
                                                                            <figure className='relative h-full w-full overflow-y-hidden flex'>
                                                                                <img className='top-0 left-0 absolute object-cover w-full h-full media-image block' loading="lazy" src={game.cover12x12}/>
                                                                            </figure>
                                                                        </div>
                                                                    </div>
                                                                </div>
                                                                <div className='pt-2 text-sm font-normal'>
                                                                    <div className=''>
                                                                        <p className='w-full overflow-hidden text-ellipsis whitespace-nowrap'>{game.name}</p>
                                                                    </div>
                                                                    <div className=''>
                                                                        <dv>{game.price}<span className='underline'>đ</span></dv>
                                                                    </div>
                                                                </div>
                                                            </a>
                                                        );
                                                    })}
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                : null}
                                {commingGames && commingGames.length >= 1 ? 
                                    <div ref={CommingSoonRef} className="display-hidden">
                                        <div className="relative w-auto">
                                            <div className="relative mx-[80px]">    
                                                <div className="flex justify-center flex-wrap max-w-none w-auto overflow-hidden py-3 carousel-grid">
                                                    {commingGames.map((game,index) => {
                                                        const dynamticDelay = index * 50;
                                                        return (
                                                            <a href={`/app/${game.slug}`} className={`game-grid max-w-[100%] ml-4 inline-flex flex-col shrink-0 w-[16%]`}
                                                                style={{ animationDelay: `${dynamticDelay}ms` }}
                                                                onMouseOver={() => handleMouseOver(index+games.length)}
                                                                onMouseLeave={() => handleMouseLeave(index+games.length)}
                                                                >
                                                                <div className='game-grid-v2'>
                                                                    <div className='absolute z-[-1] inset-0 media-block'>
                                                                        <div className='h-full relative'>
                                                                            <figure className='relative h-full w-full overflow-hidden flex'>
                                                                                <img className='top-0 left-0 absolute object-cover w-full h-full media-image block' src={game.cover12x12}/>
                                                                            </figure>
                                                                        </div>
                                                                    </div>
                                                                </div>
                                                                <div className='pt-2'>
                                                                    <div className='text-sm font-normal	'>
                                                                        <p className='w-full overflow-hidden text-ellipsis whitespace-nowrap'>{game.name}</p>
                                                                    </div>
                                                                </div>
                                                            </a>
                                                        );
                                                    })}
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                : null}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}