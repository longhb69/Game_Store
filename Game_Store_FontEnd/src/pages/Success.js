import { useNavigate, useParams } from 'react-router-dom'

export default function Success(props) {
    const navigate = useNavigate()
    const transaction_id = useParams()
    function continueBrowsing() {
        navigate('/')
    }
    return (
        <>
            <div className={`absolute p-8 rounded thankyou bg-[#0a262b] hidden`}>
                <div className="w-[560px]">
                    <div className="mt-[30px] text-center">
                        <div className="block text-center">
                            <img
                                className="w-[185px] h-[170px]"
                                src="https://res.cloudinary.com/dfo61m8dy/image/upload/v1705401081/ecc83371a7a66cdb0a552bd9d1c8b78c_vsdbrx.png"
                            />
                        </div>
                        <div className="mt-[20px]">
                            <span className="text-sm">Order number</span>
                        </div>
                        <div className="mt-[10px]">
                            <h1 className="text-3xl">Thanks for your order!</h1>
                        </div>
                    </div>
                    <div className="mt-5">
                        <div className="flex flex-col gap-5 flex-wrap">
                            <div className="whitespace-normal">
                                <button
                                    className="flex w-full font-bold h-[40px] px-5 justify-center text-center rounded bg-[#fff]/[0.2]"
                                    onClick={() => continueBrowsing()}>
                                    CONTINUE BROWSING
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <div className="flex justify-center mt-5">
                <div className="w-[560px] bg-[#fff]/[.2] p-5 rounded">
                    <div className="mt-[30px] text-center">
                        <div className="">
                            <img
                                className="mx-auto w-[185px] h-[170px]"
                                src="https://res.cloudinary.com/dfo61m8dy/image/upload/v1705401081/ecc83371a7a66cdb0a552bd9d1c8b78c_vsdbrx.png"
                            />
                        </div>
                        <div className="mt-[20px]">
                            <span className="text-base">Order number {transaction_id.id}</span>
                        </div>
                        <div className="mt-1">
                            <h1 className="text-5xl">Thanks for your order!</h1>
                        </div>
                    </div>
                    <div className="mt-5">
                        <div className="flex flex-col gap-5 flex-wrap">
                            <div className="whitespace-normal">
                                <button
                                    className="flex w-[70%] mx-auto font-bold h-[50px] justify-center items-center font-medium rounded bg-[#fff]/[0.2] hover:bg-[#5532db] transition ease-in duration-[120ms]"
                                    onClick={() => continueBrowsing()}>
                                    CONTINUE BROWSING
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    )
}
