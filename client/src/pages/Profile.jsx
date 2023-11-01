import {useSelector} from 'react-redux'
import { useRef, useState, useEffect } from 'react'
import {getDownloadURL, getStorage, ref, uploadBytesResumable} from 'firebase/storage'
import {app} from '../firebase.js'
import { updateUserFailure,updateUserStart,updateUserSuccess } from '../redux/user/userSlice.js'
import { useDispatch } from 'react-redux'

export default function Profile() {
  const fileRef = useRef(null)
  const {currentUser,loading,error} = useSelector((state) => state.user)
  const [file,setFile] = useState(undefined)
  const [filePerc,setFilePerc] = useState(0)
  const [fileUploadError,setFileUploadError] = useState(false)
  const [formData,setFormData] = useState({})
  const dispatch = useDispatch()
  const [updateSuccess, setUpdateSuccess] = useState(false)

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
      </form>
      <div className="flex justify-between m-5">
        <span className='text-red-600 cursor-pointer'>Delete Account</span>
        <span className='text-red-600 cursor-pointer'>Sign Out</span>
      </div>
      <p className='text-red-500 text-center'>{error? error:''}</p>
      <p className='text-green-500 text-center'>{updateSuccess? "User updated successfully":''}</p>
    </div>
  )
}
