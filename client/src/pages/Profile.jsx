import {useSelector} from 'react-redux'

export default function Profile() {
  const {currentUser} = useSelector((state) => state.user)
  return (
    <div className='p-3 max-w-lg mx-auto'>
      <h1 className='text-3xl font-semibold my-7 text-center'>Profile</h1>
      <form className='flex flex-col gap-4'>
        <img src={currentUser.avatar} alt="profile" className='rounded-full h-24 w-24 object-cover cursor-pointer self-center'/>
        <input type="text" id='username' placeholder='Username' className='border p-3 rounded-lg' />
        <input type="email" id='email' placeholder='Email' className='border p-3 rounded-lg' />
        <input type="password" id='password' placeholder='Password' className='border p-3 rounded-lg' />
        <button className='bg-black text-white rounded-lg p-3 hover:opacity-90 disabled:opacity-80'>Update</button>
      </form>
      <div className="flex justify-between m-5">
        <span className='text-red-600 cursor-pointer'>Delete Account</span>
        <span className='text-red-600 cursor-pointer'>Sign Out</span>
      </div>
    </div>
  )
}
