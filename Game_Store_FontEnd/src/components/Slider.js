import { Link } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faChevronLeft, faChevronRight } from '@fortawesome/free-solid-svg-icons';
import { useEffect, useState } from 'react';
import { baseUrl } from '../shared';
import axios from 'axios';

export default function Slider() {
  const [categories, setCategories] = useState();
  const [next, setNext] = useState(null);
  const [prev, setPrev] = useState(null);
  const [last, setLast] = useState(null);
  const [pages, setPages] = useState(null);
  const [currentpage, setCurrentPage] = useState();
  const url_category = baseUrl + 'api/category2/'

  function request(url) {
    axios.get(url, {
      method: 'GET',
      'Content-Type': 'application/json',
    }).then((response) => {
      setCategories(response.data)
      // setNext(response.data.links.next)
      // setPrev(response.data.links.previous)
      // setLast(response.data.total_pages)
      // setPages(Array.from({ length: response.data.total_pages }));
      // setCurrentPage(response.data.current_page)
    })
      .catch((e) => {
        console.error('Error fetching data:', e);
      })

  }
  const handleNextButtonClick = (url) => {
    url ? request(url) : request(url_category)
  }
  const handlePrevButtonClick = (url) => {
    if (url) {
      request(url)
    } else {
      console.log('last')
      let last_url = `${url_category}?page=${last}`
      request(last_url)
    }
  }

  useEffect(() => {
    request(url_category)
  }, [url_category])

  const gradientColors = [
    'from-[#8B0000] to-[#000000]/[.0]',
    'from-[#00008B] to-[#000000]/[.0]',
    'from-[#B8860B] to-[#000000]/[.0]',
    'from-[#006400] to-[#000000]/[.0]',
    'from-[#880189] to-[#000000]/[.0]',

  ];
  return (
    <>
      {categories ? (
        <>
          <div className='flex flex-wrap justify-center max-w-[75%]'>
            {/* <div className='flex my-[60px] pl-4 pr-2 mr-2 bg-gradient-to-r from-[#5532db]/[.4] to-[#5532db]/[0] arrow-left items-center cursor-pointer'
              onClick={(e) => {
                handlePrevButtonClick(prev)
              }}>
              <FontAwesomeIcon className='text-white text-5xl' icon={faChevronLeft} />
            </div> */}
            {categories.map((category, index) => (
              <Link className="w-[15%] category-item mr-4 transition-transform transform transform group hover:scale-105 hover:brightness-125 my-5" key={category.id} to={`/category/${category.slug}`}>
                <div className="relative">
                  <div
                    className={`gradient-overlay absolute bottom-0 left-0 right-0 h-full bg-gradient-to-t ${gradientColors[index % gradientColors.length]}`}
                  ></div>
                  <img
                    className="mx-auto w-full h-full"
                    src={category.image}
                    alt={category.name}
                    loading='lazy'
                  />
                  <span className="absolute bottom-2 left-0 right-0 bg-transparent text-white text-center py-3 text-2xl font-medium">
                    {category.name}
                  </span>

                </div>

              </Link>
            ))}
            {/* <div className='flex my-[60px] pl-0 pr-4 mr-2 bg-gradient-to-l from-[#5532db]/[.4] to-[#5532db]/[0] arrow-right items-center cursor-pointer'
              onClick={(e) => {
                handleNextButtonClick(next)
              }}>
              <FontAwesomeIcon className='text-white text-5xl' icon={faChevronRight} />
            </div> */}
          </div>
          <div className='text-center flex min-h-[40px]'>
            {/* {pages.map((item, index) => (
                    <div className={`slider-thumbs inline-block mx-[2px] my-[12px] w-5 h-3 rounded cursor-pointer ${index===currentpage-1 ? 'focus' : ''}`}
                         onClick={() => {
                          request(`${url_category}?page=${index+1}`)
                        }}></div>
                  ))} */}
          </div>
        </>
      ) : null}
    </>
  );
};