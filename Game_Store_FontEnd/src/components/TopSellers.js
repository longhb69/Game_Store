import { baseUrl } from "../shared";
import Game from '../components/Game';
import { Link } from 'react-router-dom';
import useFetchData from '../useFetchData';

export default function TopSellers() {
    const url = baseUrl + 'api/top-sellers'
    const {data: games, loading, error} = useFetchData(url)
    return(
        <>
            <div className='flex justify-between items-center mb-[15px]'>
                <h2 className='text-lg'>Top Sellers</h2>
                <Link to={'/fillter/top-sellers'} className='text-center text-[11px] items-center justify-center font-base text-sm inline-flex rounded border leading-normal  border-[#fff]/[.6] px-3 py-1 transition ease-in-out hover:border-[#fff]/[.3]'>VIEW MORE</Link>
            </div>
            <div className='flex items-stretch w-full top-sellers-container h-full'>
                {games ? (
                    <>
                        {games.slice(0,5).map((game, index) => {
                            return (
                                <>
                                    <div className={`css-5a ${index===0 ? 'ml-0' : 'ml-4'}` }>
                                        <Game 
                                            key={game.id}
                                            name={game.name}
                                            slug={game.slug}
                                            price={game.price}
                                            image={game.image}
                                            cover={game.cover}
                                            discounted_price={game.discounted_price}
                                            discount_percentage={game.discount_percentage}
                                        />
                                    </div>
                                </>
                            );
                        })}
                    </>
                )
                : null }
            </div>
        </>
    );
}