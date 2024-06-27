import { Link } from 'react-router-dom';
import { useState } from 'react';

export default function GameDeatail({key, name, slug, price, image, cover, discounted_price, discount_percentage}) {
    const [isHovered, setIsHovered] = useState(false);

    return (
        <>  
            <div className="relative h-full font-normal font-inter transition-transform transform transform group " >
                <div className={`absolute -right-10 -top-9 bg-gray-800 text-white text-sm px-3 py-1 hidden rounded ${ isHovered ? 'opacity-100' : 'opacity-0'}`}>
                            Add to Wishlist
                </div>
                <div className='absolute top-0 right-0 hidden'>
                    <button className='w-[30px] h-[30px] flex items-center justify-center'
                        onMouseEnter={() => setIsHovered(true)}
                        onMouseLeave={() => setIsHovered(false)}
                    >
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" class="w-5 h-5 opacity-0 group-hover:opacity-100 transition-opacity fill-rose-300 hover:fill-rose-500">
                        <path d="m11.645 20.91-.007-.003-.022-.012a15.247 15.247 0 0 1-.383-.218 25.18 25.18 0 0 1-4.244-3.17C4.688 15.36 2.25 12.174 2.25 8.25 2.25 5.322 4.714 3 7.688 3A5.5 5.5 0 0 1 12 5.052 5.5 5.5 0 0 1 16.313 3c2.973 0 5.437 2.322 5.437 5.25 0 3.925-2.438 7.111-4.739 9.256a25.175 25.175 0 0 1-4.244 3.17 15.247 15.247 0 0 1-.383.219l-.022.012-.007.004-.003.001a.752.752 0 0 1-.704 0l-.003-.001Z" />
                    </svg>
                    </button>
                </div>

                <Link to={'/app/' + slug}>
                    <div className='h-full'>
                        <div className='flex flex-col h-full'>
                            <div className='block h-[77%] w-full mb-[10px] rounded relative'>
                                <div className='w-full h-full rounded hover-affect'>
                                        <img className="w-full h-full rounded" loading='lazy' src={cover}/>
                                </div>
                            </div>
                            <div className='text-base flex flex-col font-normal grow shrink-0 text-lg'>
                                <div className='overflow-hidden'>{name}</div>
                                <div className='flex items-center gap-2.5'>
                                    {parseFloat(discounted_price) > 0 ? 
                                        <div className='text-sm bg-[#4C6B21] px-1.5 py-0.5 rounded text-[#caff0b]'>-{parseInt(discount_percentage)}%</div>
                                    : null}
                                    <div className={`flex items-center mt-1 ${parseFloat(discounted_price) > 0 ? 'line-through text-[#D0D0D0]' : ''}`}>
                                        <div>{price}<span className="underline">đ</span></div>
                                    </div>
                                    {parseFloat(discounted_price) > 0 ? 
                                        <p className="mt-1">
                                            {discounted_price}
                                            <span className="underline">đ</span>
                                        </p>
                                    : null}
                                </div>
                            </div>
                        </div>
                    </div>
                </Link>
            </div>
        </>
    );
}
