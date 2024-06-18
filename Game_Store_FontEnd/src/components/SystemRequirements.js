export default function SystemRequirements(props) {
    return (
        <>
            <div className='text-xl border-b pb-[1px] my-5'>
                <span className=''>System Requirements</span>
            </div>
            <div className='container flex bg-[#fff]/[.1] gap-4 pt-3 px-10 pb-10 rounded md:text-base'>
                <div className='MINIMUM div basis-1/2'>
                    <ul>
                        <strong className='text-[#F5F5F5]/[.6]'>Minimum</strong>
                        <br/>
                        <ul className="list-inside">
                            <li className='list-outside'>
                                <span className='text-[#F5F5F5]/[.6] mr-3'>OS:</span>
                                {props.os_min}
                            </li>
                            <li className='list-outside'>
                                <span className='text-[#F5F5F5]/[.6] mr-3'>Processor:</span>
                                {props.processor_min}
                            </li>
                            <li className=''>
                                <span className='text-[#F5F5F5]/[.6] mr-3'>Memory:</span>
                                {props.memory_min}
                            </li>
                            <li className=''>
                                <span className='text-[#F5F5F5]/[.6] mr-3'>Graphics:</span>
                                {props.graphics_min}
                            </li>
                            <li className=''>
                                <span className='text-[#F5F5F5]/[.6] mr-3'>Storage:</span>
                                {props.storage_min}
                            </li>   
                        </ul>
                    </ul>
                </div>
                <div className='RECOMMENDED div basis-1/2'>
                    <ul>
                    <strong className='text-[#F5F5F5]/[.6]'>RECOMMENDED</strong>
                    <br/>
                        <ul className="list-inside">
                            <li className=''>
                                <span className='text-[#F5F5F5]/[.6] mr-3'>OS:</span>
                                {props.os_rec}
                            </li>
                            <li className=''>
                                <span className='text-[#F5F5F5]/[.6] mr-3'>Processor:</span>
                                {props.processor_rec}
                            </li>
                            <li className=''>
                                <span className='text-[#F5F5F5]/[.6] mr-3'>Memory:</span>
                                {props.memory_rec}
                            </li>
                            <li className=''>
                                <span className='text-[#F5F5F5]/[.6] mr-3'>Graphics:</span>
                                {props.graphics_rec}
                            </li>
                            <li className=''>
                                <span className='text-[#F5F5F5]/[.6] mr-3'>Storage:</span>
                                {props.storage_rec}
                            </li>   
                        </ul>
                    </ul>
                </div>
            </div>
        </>
    );
}