import {useSelector} from 'react-redux'
import { useRef, useState, useEffect } from 'react'
import {getDownloadURL, getStorage, ref, uploadBytesResumable} from 'firebase/storage'
import {app} from '../firebase.js'
import { deleteUserFailure, deleteUserStart, deleteUserSuccess, signOutUserFailure, signOutUserStart, signOutUserSuccess, updateUserFailure,updateUserStart,updateUserSuccess } from '../redux/user/userSlice.js'
import { useDispatch } from 'react-redux'
import {Link} from 'react-router-dom'

export default function Profile() {
  const fileRef = useRef(null)
  const {currentUser,loading,error} = useSelector((state) => state.user)
  const [file,setFile] = useState(undefined)
  const [filePerc,setFilePerc] = useState(0)
  const [fileUploadError,setFileUploadError] = useState(false)
  const [formData,setFormData] = useState({})
  const dispatch = useDispatch()
  const [updateSuccess, setUpdateSuccess] = useState(false)
  const [showListingsError,setShowListingsError] = useState(false)
  const [listings, setListings] = useState({})

  useEffect(()=>{
    if(file){
      handleFileUpload(file)
    }
  },[file])
  const handleFileUpload = (file) =>{
  const storage = getStorage(app)
  const fileName = new Date().getTime() + file.name;
  const storageRef = ref(storage,fileName)
  const uploadTask = uploadBytesResumable(storageRef,file)

  uploadTask.on('state_changed',
    (snapshot) => {
      const progress = (snapshot.bytesTransferred/snapshot.totalBytes)*100
      setFilePerc(Math.round(progress))
    },
    (error)=>{
      setFileUploadError(true)
    },
    ()=>{
      getDownloadURL(uploadTask.snapshot.ref).then(
        (downloadURL)=>{
          setFormData({...formData,avatar:downloadURL})
        }
      )
    }
  )
  }

  const handleChange = (e) =>{
    setFormData({...formData, [e.target.id]:e.target.value})
  }

  const handleSubmit = async (e)=>{
    e.preventDefault()
    try {
      dispatch(updateUserStart())
      const res = await fetch(`/api/user/update/${currentUser._id}`,
        {
          method: 'POST',
          headers:{
            'Content-Type' : 'application/json'
          },
          body : JSON.stringify(formData)
        })
        const data = await res.json()

        if(data.success === false){
          dispatch(updateUserFailure(data.message))
          return
        }
        dispatch(updateUserSuccess(data))
        setUpdateSuccess(true)
    } catch (error) {
      dispatch(updateUserFailure(error.message))
    }
  }

  const handleDeleteUser = async ()=>{
    try {
      dispatch(deleteUserStart())
      const res = await fetch(`/api/user/delete/${currentUser._id}`,
      {
        method:'DELETE'
      })
      const data =  await res.json()
      if(data.success === false){
        dispatch(deleteUserFailure(data.message))
        return
      }
      dispatch(deleteUserSuccess(data))
    } catch (error) {
      dispatch(deleteUserFailure(error.message))
    }
  }

  const handleSignOut = async()=>{
    try {
      dispatch(signOutUserStart())
      const res = await fetch('/api/auth/signout')
      const data = await res.json()
      if(data.success === false){
        dispatch(signOutUserFailure(data.message))
        return
      }
      dispatch(signOutUserSuccess(data))
    } catch (error) {
      dispatch(signOutUserFailure(error.message))
    }
  }

  const handleShowListings = async ()=>{
    try {
      setShowListingsError(false)
      const res = await fetch(`/api/user/listings/${currentUser
      ._id}`)
      const data = await res.json()
      if(data.success === false){
        setShowListingsError(true)
        return
      }
      setListings(data)
    } catch (error) {
      setShowListingsError(true)
    }
  }
  return (
    <div className='p-3 max-w-lg mx-auto'>
      <h1 className='text-3xl font-semibold my-7 text-center'>Profile</h1>
      <form onSubmit={handleSubmit}className='flex flex-col gap-4'>
        <input onChange={(e)=>setFile(e.target.files[0])}type="file" ref={fileRef} hidden accept='image/*'/>
        <img onClick={()=>fileRef.current.click()} src={formData.avatar || currentUser.avatar} alt="profile" className='rounded-full h-24 w-24 object-cover cursor-pointer self-center'/>
        <p className='text-sm self-center'>
          { (fileUploadError)?
            <span className='text-red-600'>Error Uploading Image (size{'>'}2Mb)</span>:
            (filePerc>0 && filePerc<100)?
              <span className='text-black'>{`Uploading : ${filePerc}%`}</span>:
            (filePerc===100)?
              <span className='text-green-600'>Upload Successful</span>:''
          }
        </p>
        <input type="text" id='username' defaultValue={currentUser.username} placeholder='Username' className='border p-3 rounded-lg' onChange={handleChange}/>
        <input type="email" id='email' defaultValue={currentUser.email} placeholder='Email' className='border p-3 rounded-lg' onChange={handleChange}/>
        <input type="password" id='password' placeholder='Password' className='border p-3 rounded-lg' onChange={handleChange}/>
        <button disabled={loading} className='bg-black text-white rounded-lg p-3 hover:opacity-90 disabled:opacity-80'>
          {loading? 'Loading':'Update'}
        </button>
        <Link className='bg-green-500 text-white p-3 rounded-lg text-center hover:opacity-90' to='/create-listing'>Create Listing</Link>
      </form>
      <div className="flex justify-between m-5">
        <span onClick={handleDeleteUser}className='text-red-600 cursor-pointer'>Delete Account</span>
        <span onClick={handleSignOut} className='text-red-600 cursor-pointer'>Sign Out</span>
      </div>
      <p className='text-red-500 text-center'>{error? error:''}</p>
      <p className='text-green-500 text-center'>{updateSuccess? "User updated successfully":''}</p>
      <button onClick={handleShowListings} className='text-green-500 bg-gray-700 p-3 rounded-lg w-full'>Show Listings</button>      <p className='text-red-500 text-center'>{error? error:''}</p>
      <p className='text-red-500 text-center'>{showListingsError? showListingsError:''}</p>
      {listings && listings.length > 0 &&
      <div className="flex flex-col gap-2">
        <h1 className='text-center mt-11 mb-2 text-2xl font-medium'>Your Listings</h1>
        {listings.map((listing)=>(
          <div key={listing._id} className="bg-gray-50 rounded-lg m-2 p-3 flex justify-between items-center gap-4">
            <Link to={`/listings/${listing._id}`}>
              <img className='h-24 w-24 object-contain' src={listing.imageUrls[0]} alt="listing cover" />
            </Link>
            <Link className='flex-1' to={`/listings/${listing._id}`}>
              <p className='text-black font-medium truncate'>{listing.name}</p>
            </Link>
            <div className="flex flex-col items-center gap-2">
              <button className='p-2 text-white bg-red-500 rounded hover:opacity-90'>Delete</button>
              <button className='bg-green-500 text-white p-2 rounded text-center hover:opacity-90 w-full'>Edit</button>
            </div>
          </div>
        ))}
      </div>
      }
    </div>
  )
}
