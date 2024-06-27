import { Link} from 'react-router-dom';

export default function CartItem(props) {
    return (
        <div key={props.id} id={props.id} className='flex flex-row rounded bg-[#202020] wrapper-item px-[20px] py-[16px]'>
            <div className=''>
                <Link to={props.type === 'game' ? '/app/'+props.slug : '/app/dlc/'+props.slug}>
                    <img className='min-w-[150px] h-[200px] rounded object-fit hover:brightness-125' src={props.cover}/>
                </Link>
            </div>
            <div className='px-3 w-4/6'>
                <Link to={props.type === 'game' ? '/app/'+props.slug : '/app/dlc/'+props.slug}>
                    <p className='text-2xl hover:underline decoration-1'>{props.name}</p>
                </Link>
                <div className='flex flex-col flex-wrap'>
                   {props.dlcs ? 
                        props.dlcs.map((dlc) => {
                            return (
                                <Link to={'/app/dlc/'+dlc.slug}>
                                    <p className='text-sm hover:underline decoration-1'>{dlc.name}</p>
                                </Link>
                            )
                        })
                   :null}
                </div>
            </div>
            <div className='ml-auto'>
                <div className='text-right'>
                    <div className='text-lg'>
                        {props.price}<span className='underline'>đ</span>
                    </div>
                    <div className='mt-2'>
                        <button className='text-gray-400 underline hover:no-underline'
                                onClick={() => props.handleDelete(props.id)}>
                            <span className=''>Remove</span>
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
    
}