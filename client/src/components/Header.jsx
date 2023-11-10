import {FaSearch} from 'react-icons/fa'
import { Link, useNavigate } from 'react-router-dom'
import { useSelector } from 'react-redux'
import { useEffect, useState } from 'react'

export default function Header() {
  const {currentUser} = useSelector(state=>state.user)
  const [searchTerm, setSearchTerm] = useState('')
  const navigate = useNavigate()

  const handleSubmit = (e) =>{
    e.preventDefault()
    const urlParams = new URLSearchParams(window.location.search)
    urlParams.set('searchTerm', searchTerm)
    const searchQuery = urlParams.toString()
    navigate(`/search?${searchQuery}`)
  }

  useEffect(()=>{
    const urlParams = new URLSearchParams(window.location.search)
    const searchTermFromUrl = urlParams.get('searchTerm')
    if (searchTermFromUrl)  setSearchTerm(searchTermFromUrl)
  },[])

  return (
    <header className='border'>
        <div className='flex justify-between items-center max-w-6xl mx-auto p-3'>
        <Link to='/'>
        <h1 className='font-bold text-sm sm:text-xl flex flex-wrap'>
            <span>Market</span>
            <span>Place</span>
        </h1>
        </Link>
        <form onSubmit={handleSubmit} className='bg-gray-100 p-3 rounded-lg flex items-center'>
            <input onChange={(e) => setSearchTerm(e.target.value)} type="text" placeholder='Search' value={searchTerm} className='bg-transparent focus:outline-none w-24 sm:w-64'/>
            <button>
              <FaSearch className='text-gray-500'/>
            </button>
        </form>
        <ul className='flex gap-4'>
            <Link to='/'><li className='hidden sm:inline hover:underline underline-offset-8'>Home</li></Link>
            <Link to='/about'><li className='hidden sm:inline hover:underline underline-offset-8'>About</li></Link>
            <Link to='/profile'>
              {currentUser?(
                <img className='rounded-full h-9 w-9 object-cover' src={currentUser.avatar} alt="Profile" />
              ):(
                <li className='inline hover:underline underline-offset-8'>Sign In</li>)}
            </Link>
        </ul>
        </div>
    </header>
  )
}
