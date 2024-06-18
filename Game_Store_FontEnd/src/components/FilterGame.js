import { Link } from 'react-router-dom'
export default function FilterGame({slug, cover, name, price, type}) {
    const renderLink = () => {
        console.log(type)
        if(type === 'game') {
            console.log(`/app/${slug}`)
            return `/app/${slug}`
        } else if(type === 'dlc') {
            return `/app/dlc/${slug}`
        } else {
            return ""
        }
    }
    return (
        <>
            <div className="h-full w-full font-normal font-inter mb-10">
                <Link className="flex flex-col h-full w-full" to={renderLink()}>
                    <div className="rounded-md h-full hover-affect relative">
                        <img className="rounded-md w-full h-full block object-cover" src={cover} loading="lazy" />
                    </div>
                    <div className="text-base flex flex-col font-normal">
                        <div className="overflow-hidden mt-5">{name}</div>
                        <div className="flex items-center mt-1">
                            {price ? (
                                <div>
                                    {price}
                                    <span className="underline">đ</span>
                                </div>
                            ) : null}
                        </div>
                    </div>
                </Link>
            </div>
        </>
    )
}
