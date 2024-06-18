import { Route, Routes, useNavigate } from 'react-router-dom'
import Transactions from '../components/Transactions'
import Password from '../components/Password'
import { useState } from 'react'

export default function Account() {
    const navigate = useNavigate()
    const [activeRoute, setActiveRoute] = useState(1)

    return (
        <div className="w-full h-full bg-[#F8F8F8] text-[#141414] ">
            <div className="w-[75%] pt-10 flex min-h-[100vh] flex-wrap mx-auto">
                <div className="p-2.5 basis-[25%] grow-0 max-w-[25%]">
                    <div className="rounded bg-[#fff]">
                        <nav className="relative list-none">
                            <div
                                className={` ${
                                    activeRoute === 1
                                        ? 'text-[#141414]'
                                        : 'text-[#141414]/[.70]'
                                } py-1 px-10 rounded transition w-full flex relative text-left items-center cursor-pointer justify-start hover:bg-[#121212]/[.1] hover:text-[#141414]`}
                                onClick={() => {
                                    navigate('/account/transactions')
                                    setActiveRoute(1)
                                }}>
                                <div className="inline-flex min-w-[40px] min-h-[40px] text-left items-center shrink-0 justify-center">
                                    <svg
                                        width="24"
                                        height="24"
                                        viewBox="0 0 24 24"
                                        fill="none"
                                        xmlns="http://www.w3.org/2000/svg">
                                        <path
                                            d="M12 2C6.5 2 2 6.5 2 12C2 17.5 6.5 22 12 22C17.5 22 22 17.5 22 12C22 6.5 17.5 2 12 2ZM16.2 16.2L11 13V7H12.5V12.2L17 14.9L16.2 16.2Z"
                                            fill="currentColor"></path>
                                    </svg>
                                </div>
                                <div className="p-2.5 font-bold text-sm">
                                    <p>TRANSACTIONS</p>
                                </div>
                            </div>
                        </nav>
                    </div>
                    <div className="rounded bg-[#fff]">
                        <nav className="relative list-none">
                            <div
                                className={` ${
                                    activeRoute === 2
                                        ? 'text-[#141414]'
                                        : 'text-[#141414]/[.70]'
                                } py-1 px-10 rounded transition w-full flex relative text-left items-center cursor-pointer justify-start hover:bg-[#121212]/[.1] hover:text-[#141414]`}
                                onClick={() => {
                                    navigate('/account/password')
                                    setActiveRoute(2)
                                }}>
                                <div className="inline-flex min-w-[40px] min-h-[40px] text-left items-center shrink-0 justify-center">
                                    <svg
                                        width="24"
                                        height="24"
                                        viewBox="0 0 24 24"
                                        fill="none"
                                        xmlns="http://www.w3.org/2000/svg">
                                        <path
                                            d="M12 2C6.5 2 2 6.5 2 12C2 17.5 6.5 22 12 22C17.5 22 22 17.5 22 12C22 6.5 17.5 2 12 2ZM16.2 16.2L11 13V7H12.5V12.2L17 14.9L16.2 16.2Z"
                                            fill="currentColor"></path>
                                    </svg>
                                </div>
                                <div className="p-2.5 font-bold text-sm">
                                    <p>Password</p>
                                </div>
                            </div>
                        </nav>
                    </div>
                </div>
                <Routes>
                    <Route path="transactions" element={<Transactions />} />
                    <Route path="password" element={<Password />} />
                </Routes>
            </div>
        </div>
    )
}
