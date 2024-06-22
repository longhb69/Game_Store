import axios from 'axios'
import { baseUrl } from '../shared'
import { useEffect, useState } from 'react'
import { useLogin } from '../LoginContext'

export default function Comments(props) {
    const url = baseUrl + 'api/account/'
    const url2 = baseUrl + `api/comment/${props.type}/${props.game_id}`
    const [comments, setComments] = useState()
    const [next, setNext] = useState()
    const [pre, setPre] = useState()
    const [loggedIn, setLoggedIn] = useLogin()
    const [selectedOption, setSelectedOption] = useState(null)
    const [account, setAccount] = useState()
    const headers = {
        headers: {
            'Content-Type': 'application/json',
            Authorization: 'Bearer ' + localStorage.getItem('access'),
        },
    }
    useEffect(() => {
        axios.get(url2).then((response) => {
            setComments(response.data.results)
            setNext(response.data.next)
            setPre(response.data.pre)
        })
        if (loggedIn) {
            axios.get(url, headers).then((response) => {
                setAccount(response.data)
            })
        }
    }, [])
    const postComment = async (e) => {
        e.preventDefault()
        const formData = new FormData(e.target)
        const text = formData.get('comment')
        const type = props.type
        const recommended = selectedOption !== null ? selectedOption : 1
        const game_id = props.game_id
        try {
            const config = {
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: 'Bearer ' + localStorage.getItem('access'),
                },
            }
            const response = await axios.post(
                url2,
                {
                    text,
                    recommended,
                    type,
                    game_id,
                },
                config
            )
            if (response.status === 201) {
                const newComment = response.data
                setComments((prevComments) => [newComment, ...prevComments])
            }
            e.target.reset()
            setSelectedOption(null)
        } catch (error) {
            console.error('Error posting comment:', error)
        }
    }
    function recommendedChoice(choice) {
        if (choice === 1) {
            setSelectedOption(1)
        } else if (choice === 0) {
            setSelectedOption(0)
        }
    }
    function showMore() {
        axios.get(next).then((response) => {
            setComments((prevComments) => [...prevComments, ...response.data.results])
            setNext(response.data.next)
            setPre(response.data.pre)
        })
    }

    return (
        <>
            {props.inLibrary && loggedIn ? (
                <>
                    <div className="w-full h-full bg-[#000]/[0.3] mt-10">
                        <div className="w-full h-full p-3 mb-4">
                            <h2 className="text-xl mb-3">Write a review for {props.game}</h2>
                            <div className="flex">
                                <div className="flex basis-[10%]">
                                    <div className="w-[80px] h-[80px] user-avatar mr-3.5 relative bg-gradient-to-r from-[#5532db] to-[#32db55]">
                                        {account ? <img className="w-full h-full p-[2px]" src={account.user_avatar} alt="avatar" /> : null}
                                    </div>
                                </div>
                                <div className="basis-[90%] flex flex-col">
                                    <form className="w-full h-full" onSubmit={postComment}>
                                        <textarea
                                            id="comment"
                                            className=" p-1.5 w-full bg-[#ffe0b3] text-[#121212]"
                                            name="comment"
                                            rows="5"
                                            required></textarea>
                                        <div className="flex justify-between mt-1.5">
                                            <div className="flex flex-col">
                                                <h1 className="text-sm mb-1.5">Do you recommended this game?</h1>
                                                <div className="flex gap-1.5">
                                                    <div
                                                        className={`recommended-icon ${selectedOption === 1 ? 'bg-[#5532db]' : 'bg-[#fff]/[.1]'}`}
                                                        onClick={() => recommendedChoice(1)}>
                                                        <i class="ico16 thumb_upv6"></i>
                                                        <span>Yes</span>
                                                    </div>
                                                    <div
                                                        className={`recommended-icon ${selectedOption === 0 ? 'bg-[#5532db]' : 'bg-[#fff]/[.1]'}`}
                                                        onClick={() => recommendedChoice(0)}>
                                                        <i class="ico16 thumb_downv6"></i>
                                                        <span>No</span>
                                                    </div>
                                                </div>
                                            </div>
                                            <div>
                                                <button
                                                    className={`min-w-[40px] mt-2 px-4 py-2 bg-[#5532db] text-[#fff] rounded transition hover:bg-[#32db55]/[.9] hover:text-[#fff]`}
                                                    type="submit">
                                                    Post review
                                                </button>
                                            </div>
                                        </div>
                                    </form>
                                </div>
                            </div>
                        </div>
                    </div>
                </>
            ) : null}
            {comments && comments.length > 0 ? (
                <>
                    <div className="border-[#000] border-b pb-5 mb-5"></div>
                    <div className="text-[#c6d4df]">
                        <div className="uppercase text-[#fff] pb-2">User Reviews</div>
                        {comments.map((comment) => {
                            return (
                                <div className="mb-6 bg-[#000]/[.2]">
                                    <div className="py-4 px-2 flex">
                                        <div className="mr-3 flex basis-[10%]">
                                            <div className="w-[45px] h-[45px] relative bg-gradient-to-r from-[#5532db] to-[#32db55]">
                                                <img className="w-full h-full p-[2px]" src={`${comment.user_avatar}`} alt="avatar"></img>
                                            </div>
                                            <div className="overflow-hidden text-ellipsis ml-2 font-bold">{comment.user}</div>
                                        </div>
                                        <div className="basis-[90%]">
                                            <div className="mb-3 flex">
                                                <div className="float-left mr-3">
                                                    {comment.recommended ? (
                                                        <img
                                                            alt="recommended"
                                                            className="w-[40px] h-[40px] overflow-clip"
                                                            src="https://store.cloudflare.steamstatic.com/public/shared/images/userreviews/icon_thumbsUp_v6.png"
                                                            width="40"
                                                            height="40"
                                                        />
                                                    ) : (
                                                        <img
                                                            alt="not_recommended"
                                                            className="w-[40px] h-[40px] overflow-clip"
                                                            src="https://store.cloudflare.steamstatic.com/public/shared/images/userreviews/icon_thumbsDown_v6.png"
                                                            width="40"
                                                            height="40"
                                                        />
                                                    )}
                                                </div>
                                                <div className="text-xl pt-1 overflow-hidden whitespace-nowrap">
                                                    {comment.recommended ? 'Recommended' : 'Not Recommended'}
                                                </div>
                                            </div>
                                            <div className="text-xs inline-block opacity-[0.6] uppercase mb-2">POSTED: {comment.created_at}</div>
                                            <div className="overflow-hidden break-words">{comment.text}</div>
                                        </div>
                                    </div>
                                </div>
                            )
                        })}
                        {next && next.length > 0 ? (
                            <div className="flex justify-center mb-5">
                                <button className="px-4 py-2 bg-[#db5532] rounded hover-affect relative" onClick={() => showMore()}>
                                    See More
                                </button>
                            </div>
                        ) : null}
                    </div>
                </>
            ) : null}
        </>
    )
}
