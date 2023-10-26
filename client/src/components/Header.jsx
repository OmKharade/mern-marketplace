import {FaSearch} from 'react-icons/fa'
import { Link } from 'react-router-dom'

export default function Header() {
  return (
    <header className='border'>
        <div className='flex justify-between items-center max-w-6xl mx-auto p-3'>
        <Link to='/'>
        <h1 className='font-bold text-sm sm:text-xl flex flex-wrap'>
            <span>Market</span>
            <span>Place</span>
        </h1>
        </Link>
        <form className='bg-gray-100 p-3 rounded-lg flex items-center'>
            <input type="text" placeholder='Search' className='bg-transparent focus:outline-none w-24 sm:w-64'/>
            <FaSearch className='text-gray-500'/>
        </form>
        <ul className='flex gap-4'>
            <Link to='/'><li className='hidden sm:inline hover:underline underline-offset-8'>Home</li></Link>
            <Link to='/about'><li className='hidden sm:inline hover:underline underline-offset-8'>About</li></Link>
            <Link to='/sign-in'><li className='inline hover:underline underline-offset-8'>Sign In</li></Link>
        </ul>
        </div>
    </header>
  )
}