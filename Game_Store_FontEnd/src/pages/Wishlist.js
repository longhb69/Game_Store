import { useEffect, useState } from "react"
import { baseUrl } from "../shared"
import axios from "axios"
import WishlistItem from "../components/WishlistItem"

export default function Wishlist() {
    const [wishlist, setWishlist] = useState()
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        const url = baseUrl + 'api/account/wishlist'
        const fetchData = async () => {
            try {
                const response = await axios.get(url, {
                    headers: {
                        'Content-Type': 'application/json',
                        Authorization: 'Bearer ' + localStorage.getItem('access'),
                    },
                })
                setWishlist(response.data)
                console.log(response.data)
            } catch(e) {
                console.log(e)
            } finally {
                setLoading(false)
            }
        }

        fetchData()
    }, [])

    return (
        <div className="mt-8 w-[75%] min-h-screen mx-auto h-auto mb-[100px]">
            <h1 className="text-5xl">My Wishlist</h1>
            <div className="flex">
                {wishlist && wishlist.items.length > 0 ? (
                    <>
                        <div className="flex flex-col gap-y-4 basis-4/5 mt-14">
                            {wishlist.items.map((product) => {
                                return (
                                    <WishlistItem
                                        item_id={product.id}
                                        id={product.item.id}
                                        slug={product.item.slug}
                                        type={product.type}
                                        name={product.item.name}
                                        price={product.item.price}
                                        discounted_price={product.item.discounted_price}
                                        discount_percentage={product.item.discount_percentage}
                                        cover={product.item.cover12x12}
                                        setWishlist={setWishlist}
                                    />
                                )
                            })}
                        </div>
                    </>
                ) : null}
            </div>
        </div>
    )
}