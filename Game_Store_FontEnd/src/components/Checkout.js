import axios from 'axios';
import { useAccount, useCart, useLogin } from "../LoginContext";
import { useNavigate } from 'react-router-dom';
import { baseUrl } from '../shared';
import { useState } from 'react';

export default function Checkout(props) {
    const [loggedIn, setLoggedIn] = useLogin();
    const [itemsInCart, setItemsInCart,getItemInCart, cartQuantity, setCartQuantity, getCartQuantity] = useCart();
    const navigate = useNavigate();
    const [account] = useAccount();

    function Checkout(url,data=null) {
        axios.post(url,data,{
            headers: {
            'Content-Type': 'application/json',
            'Authorization': 'Bearer ' + localStorage.getItem('access'),
            },
        }
        ).then((response) => {
            if (response.status < 200 || response.status >= 300) {
                navigate('/404')
            }
            else {
                navigate(`/cart/success/${response.data.transaction_id}`);
                getCartQuantity();
            }
        })
    }
    function CheckoutFromCart(fromcart = true) {
        if(fromcart) {
            const url = baseUrl + 'cart/checkout_cart'
            Checkout(url);
        }
        else {
            //const url = baseUrl + 'cart/checkout'
            //const data = {type:props.type, game_id: props.game.id, }
            //Checkout(url,data)
        }
    }
    return (props.trigger ? (
        <>
            <div className="fixed left-0 right-0 bottom-1 w-full h-screen bg-[#fff] max-w-[75rem] max-h-[60rem] mx-auto z-[997]">
                <div className="z-[998] w-full h-full flex ">
                    <div className="basis-[67%] text-[#121212] pl-5 pr-1 py-8">
                        <div className="border-b pb-3">
                            <div className="flex justify-between">
                                <h1 className="text-base">CHECKOUT</h1>
                                <div className="flex mr-4">
                                    <svg width="20px" height="20px" viewBox="0 0 24 24" fill="#5532db" xmlns="http://www.w3.org/2000/svg">
                                        <path d="M16 7C16 9.20914 14.2091 11 12 11C9.79086 11 8 9.20914 8 7C8 4.79086 9.79086 3 12 3C14.2091 3 16 4.79086 16 7Z" stroke="#5532db" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                                        <path d="M12 14C8.13401 14 5 17.134 5 21H19C19 17.134 15.866 14 12 14Z" stroke="#5532db" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                                    </svg>
                                    <p className="ml-1 text-[#5532db]">{account}</p>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="basis-[33%] bg-[#e6e1e1]/[.5]  pl-3 pt-8 pb-5 flex flex-col">
                        <div className="text-[#121212] flex justify-between pb-3 pr-5">
                            <div>
                                ORDER SUMMARY
                            </div>
                            <button className="" onClick={() => props.setTrigger(false)}>
                                <svg xmlns="http://www.w3.org/2000/svg"  viewBox="0 0 50 50" width="20px" height="20px"><path d="M 7.71875 6.28125 L 6.28125 7.71875 L 23.5625 25 L 6.28125 42.28125 L 7.71875 43.71875 L 25 26.4375 L 42.28125 43.71875 L 43.71875 42.28125 L 26.4375 25 L 43.71875 7.71875 L 42.28125 6.28125 L 25 23.5625 Z"/></svg>
                            </button>
                        </div>
                        {props.cart ? (
                            <>
                                <div className="text-[#121212] overflow-y-scroll mt-2 pr-5">
                                    {props.cart.items.map((game) => (
                                        <>
                                            <div className="flex mb-2" key={game.id}>
                                                <div className="basis-2/5 max-h-[110px] max-w-[80px]">
                                                    <img className="h-full w-full rounded min-w-[80px]" src={game.cover} alt={game.name} />
                                                </div>
                                                <div className="ml-2 my-auto">
                                                    <div className="font-bold">{game.name}</div>
                                                    <div className="text-sm">{game.price}<span className="underline">đ</span></div>
                                                </div>
                                            </div>
                                            {game.dlcs ? (
                                                game.dlcs.map((dlc) => (
                                                    <div className="flex ml-5 mb-2" key={dlc.id}>
                                                        <div className="basis-2/5 max-h-[110px] max-w-[80px]">
                                                            <img className="h-full w-full rounded min-w-[80px]" src={dlc.cover} alt={dlc.name} />
                                                        </div>
                                                        <div className="ml-2 my-auto">
                                                            <div className="font-medium">{dlc.name}</div>
                                                            <div className="text-sm">{dlc.price}<span className="underline">đ</span></div>
                                                        </div>
                                                    </div>
                                                ))
                                            ) : null}
                                    </>
                                ))}
                                <div className="my-5">
                                    <div className="flex justify-between pb-2 border-b border-gray-300">
                                        <div>Price</div>
                                        <div>{props.cart.total_price}<span className="underline">đ</span></div>
                                    </div>
                                    <div className="flex justify-between pt-2 font-medium">
                                        <div>Total</div>
                                        <div>{props.cart.total_price}<span className="underline">đ</span></div>
                                    </div>
                                </div>
                                </div>
                            </>
                        ) : null}  
                        {props.game ? 
                            <div className="text-[#121212] h-[90%] mt-2 pr-5">
                                <div className="flex mb-2" key={props.game.id}>
                                    <div className="basis-2/5 max-h-[110px] max-w-[80px]">
                                        <img className="h-full w-full rounded min-w-[80px]" src={props.game.cover} alt={props.game.name} />
                                    </div>
                                    <div className="ml-2 my-auto">
                                        <div className="font-bold">{props.game.name}</div>
                                        <div className="text-sm">{props.game.price}<span className="underline">đ</span></div>
                                    </div>
                                </div>
                                <div className="my-5">
                                    <div className="flex justify-between pb-2 border-b border-gray-300">
                                        <div>Price</div>
                                        <div>{props.game.price}<span className="underline">đ</span></div>
                                    </div>
                                    <div className="flex justify-between pt-2 font-medium">
                                        <div>Total</div>
                                        <div>{props.game.price}<span className="underline">đ</span></div>
                                    </div>
                                </div>
                            </div>
                        : null}      

                        <div className="h-[150px] w-full flex flex-col text-sm font-medium border-t-2 pr-5">
                            <div className="mt-2 w-full h-2/6">
                            </div>
                            <div className="mt-5 pl-1 w-full h-4/6">
                                <button className="rounded w-full px-4 py-5 bg-[#32db55] hover:brightness-110 transition ease-in duration-[150ms]"
                                    onClick={() =>  CheckoutFromCart(props.game ? false : true)}>
                                    PLACE ORDER
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    ) : null
    );
}