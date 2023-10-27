import React from 'react'
import {Link} from 'react-router-dom'

export default function SignUp() {
  return (
    <div className='p-3 max-w-lg mx-auto'>
      <h1 className='text-2xl text-center font-semibold my-7'>Sign Up</h1>
      <form className='flex flex-col gap-4'>
        <input type="text" placeholder='Username' className='border p-3 rounded-lg' id='username'/>
        <input type="email" placeholder='Email' className='border p-3 rounded-lg'id='email'/>
        <input type="password" placeholder='Password' className='border p-3 rounded-lg'id='password'/>
        <button className='bg-black text-white p-3 rounded-lg hover:opacity-90 disabled:opacity-80'>Sign Up</button>
      </form>
      <div className="flex gap-2 mt-5">
        <p>Have an account?</p>
        <Link to={'/sign-in'}>
          <span className='font-semibold'>Sign In</span>
        </Link>
      </div>
    </div>
  )
}
