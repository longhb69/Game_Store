import { useEffect } from "react";
import { baseUrl } from "../shared";
import useFetchData from "../useFetchData"

export default function Transactions() {
    const url = baseUrl + 'api/account/transactions';
    const {data, loading, error, refetch, next, pre} = useFetchData(url, localStorage.getItem('access'));
    var count = 10;
    function showMoreInfo(index) {
        var tableBody = document.getElementById(index);
        var sibling = tableBody.firstElementChild;
        while(sibling) {
            if(sibling.tagName === 'TR' && sibling.classList.contains('table-hidden')) {
                sibling.classList.remove('table-hidden')
            }
            else {
                if(!sibling.classList.contains('main-table')) {
                    sibling.classList.add('table-hidden')
                }
            }
            sibling = sibling.nextElementSibling;
        }
    }
    function handleShowMore() {
        for(let i=0;i<10;i++) {
            if(next) refetch(next, localStorage.getItem('access'));
        }
    }
    useEffect(() => {
        if(data.length < 10 && next) refetch(next, localStorage.getItem('access'));
    }, [data])


    return (
        <div className="basis-[75%] max-w-[75%] p-2.5 ">
            <div className="relative">
                <div>
                    <div className="p-[40px] relative pointer-events-auto rounded bg-[#fff]">
                        <div>
                            <h2 className="overflow-visible text-3xl font-normal">Transactions</h2>
                        </div>
                        <div className="mt-[20px]">
                            <div className="mt-[15px]">
                                <div className="px-[20px] pb-[20px] rounded bg-[#F2F2F2]">
                                    <table className="w-full bg-[#fff] border-collapse table border-gray-300 border-spacing-1">
                                        <colgroup>
                                            <col style={{width: '100px'}}/>
                                            <col span={2}/>
                                            <col style={{width: 'min-content'}}/>
                                        </colgroup>
                                        <thead>
                                            <tr>
                                                <th className="bg-[#F2F2F2] p-[20px] text-left">
                                                    <p className="text-sm font-normal">Date</p>
                                                </th>
                                                <th className="bg-[#F2F2F2] p-[20px] text-left">
                                                    <p className="text-sm font-normal">Description</p>
                                                </th>
                                                <th className="bg-[#F2F2F2] p-[20px] text-left">
                                                    <p className="text-sm font-normal">Price</p>
                                                </th>
                                                <th className="bg-[#F2F2F2] p-[20px] text-left">
                                                    <p className="text-sm font-normal">Status</p>
                                                </th>
                                            </tr>
                                        </thead>
                                        {data && data.length > 1 ?
                                                <>
                                                {data.map((d) => {
                                                    return (
                                                        <>
                                                            {d.order.map((order) => (
                                                                <tbody id={order.id} className="border-b border-[#141414]/[.16]" key={order.id}>
                                                                    <tr className="main-table">
                                                                        <td className="text-left px-[20px] py-[25px] text-sm align-middle">{d.date_orderd}</td>
                                                                        <td className="text-left px-[20px] py-[25px] text-sm align-middle">
                                                                            <a className="text-[#006FCC] text-sm no-underline cursor-pointer text-xs" onClick={() => showMoreInfo(order.id)}>
                                                                                <span>{order.item?.name}</span>
                                                                            </a>
                                                                        </td>
                                                                        <td className="text-left px-[20px] py-[25px] text-xs align-middle">
                                                                            <p>{order.item?.price}<span className="underline">đ</span></p>
                                                                        </td>
                                                                        <td className="text-left px-[20px] py-[25px] text-sm align-middle" style={{width: 'fit-content'}}>
                                                                            <span className="flex items-center justify-between" onClick={() => {showMoreInfo(order.id)}}>
                                                                                <span className="text-xs">Purchased</span>
                                                                                <span className="ml-2.5" >
                                                                                    <svg className="Dropdown-Icon" focusable="false" viewBox="0 0 24 24" aria-hidden="true"><path d="M7 10l5 5 5-5z"></path></svg>
                                                                                </span>
                                                                            </span>
                                                                        </td>
                                                                    </tr>
                                                                    <tr className='bg-[#F2F2F2] table-hidden'>
                                                                        <td className="text-left px-[20px] py-[5px] text-sm align-middle"></td>
                                                                        <td colspan="2" className="text-left px-[20px] py-[5px] text-sm align-middle text-xs">
                                                                            <span className="">
                                                                                <strong className="">Order_ID:
                                                                                </strong>
                                                                                {d.transaction_id}
                                                                            </span>
                                                                        </td>
                                                                        <td className="text-left px-[20px] py-[5px] text-sm align-middle text-xs">
                                                                        </td>
                                                                    </tr>
                                                                    <tr className='table-hidden'>
                                                                        <td className="text-left px-[20px] py-[5px] text-sm align-middle"></td>
                                                                        <td colspan="1" className="text-left px-[20px] py-[10px] text-sm align-middle text-xs">
                                                                            <span className="">
                                                                                {order.item?.name}
                                                                            </span>
                                                                        </td>
                                                                        <td className="text-left px-[20px] py-[5px] text-sm align-middle text-xs">
                                                                            {order.item?.price}<span className="underline">đ</span>
                                                                        </td>
                                                                    </tr>
                                                                    <tr className='table-hidden'>
                                                                        <td className="text-left px-[20px] py-[5px] text-sm align-middle"></td>
                                                                        <td colspan="1" className="text-left px-[20px] py-[10px] text-sm align-middle text-xs">
                                                                            <span className="">
                                                                                <strong className="">Discounts
                                                                                </strong>
                                                                            </span>
                                                                        </td>
                                                                        <td className="text-left px-[20px] py-[5px] text-sm align-middle text-xs">
                                                                        </td>
                                                                    </tr>
                                                                    <tr className='table-hidden'>
                                                                        <td className="text-left px-[20px] py-[5px] text-sm align-middle"></td>
                                                                        <td colspan="1" className="text-left px-[20px] py-[10px] text-sm align-middle text-xs">
                                                                            <span className="">
                                                                                Sale Discount	
                                                                            </span>
                                                                        </td>
                                                                        <td className="text-left px-[20px] py-[5px] text-sm align-middle text-xs">
                                                                            -0<span className="underline">đ</span>
                                                                        </td>
                                                                    </tr>
                                                                    <tr className='table-hidden'>
                                                                        <td className="text-left px-[20px] py-[5px] text-sm align-middle"></td>
                                                                        <td colspan="1" className="text-left px-[20px] py-[10px] text-sm align-middle text-xs">
                                                                            <span className="">
                                                                                <strong className="">Total
                                                                                </strong>
                                                                            </span>
                                                                        </td>
                                                                        <td className="text-left px-[20px] py-[5px] text-sm align-middle text-xs">
                                                                            {order.item?.price}<span className="underline">đ</span>
                                                                        </td>
                                                                    </tr>
                                                                    <tr className='table-hidden'>
                                                                        <td colspan="5" className="text-left px-[20px] py-[10px] text-sm align-middle text-xs"></td>
                                                                    </tr>
                                                                </tbody>
                                                            ))}
                                                        </>
                                                    );
                                                })}
                                            </>
                                        : null}
                                    </table>
                                </div>
                                {next ? 
                                    <div className="flex justify-center mt-[15px]">
                                        <button className="showmore-btn2 hover:bg-[#aaa6a6]" onClick={() => handleShowMore()}>
                                            <span className="w-full">SHOW MORE</span>
                                        </button>
                                    </div>
                                : null}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}