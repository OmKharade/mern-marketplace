import { useState } from "react"
import {getDownloadURL, getStorage, ref, uploadBytesResumable} from 'firebase/storage'
import {app} from '../firebase.js'
import {useSelector} from 'react-redux'
import {useNavigate} from 'react-router-dom'

export default function CreateListing() {
    const [files,setFiles] = useState([])
    const [formData,setFormData] = useState({
        imageUrls:[],
        name:'',
        description:'',
        address:'',
        type:'rent',
        bedrooms:1,
        bathrooms:1,
        regularPrice:50,
        discountPrice:0,
        offer:false,
        parking:false,
        furnished:false,
    })
    const [imageUploadError,setImageUploadError] = useState(false)
    const [uploading, setUploading] = useState(false)
    const [error,setError] = useState(false)
    const [loading,setLoading] = useState(false)
    const {currentUser} = useSelector(state => state.user)
    const navigate = useNavigate()
    console.log(formData)

    const handleImageSubmit = (e) =>{
        if(files.length > 0 && files.length + formData.imageUrls.length < 7){
            setUploading(true)
            setImageUploadError(false)
            const promises = []

            for(let i=0;i<files.length;i++){
                promises.push(storeImage(files[i]))
            }
            Promise.all(promises).then((urls)=>{
                setFormData({
                    ...formData,
                    imageUrls:formData.imageUrls.concat(urls)
                })
                setImageUploadError(false)
                setUploading(false)
            }).catch((err)=>{
                setImageUploadError('Image upload failed (2mb per image only')
                setUploading(false)
            })
        }
        else{
            setImageUploadError('You can only upload 6 images per listing')
            setUploading(false)
        }
    }

    const storeImage = async (file)=>{
        return new Promise((resolve,reject)=>{
            const storage = getStorage(app)
            const fileName = new Date().getTime() + file.name
            const storageRef = ref(storage,fileName)
            const uploadTask = uploadBytesResumable(storageRef,file)
            uploadTask.on(
                'state_changed',
                (snapshot)=>{
                    const progress = (snapshot.bytesTransferred/snapshot.totalBytes)*100
                    console.log(`Upload is ${progress}%`)
                },
                (error)=>{
                    reject(error)
                },
                ()=>{
                    getDownloadURL(uploadTask.snapshot.ref).then((downloadURL)=>{
                        resolve(downloadURL)
                    })
                }
            )
        })
    }

    const handleRemoveImage = (index) => {
        setFormData({
            ...formData,
            imageUrls: formData.imageUrls.filter((_, i)=> i!==index)
        })
    }

    const handleChange = (e)=>{
        if(e.target.id === 'sale' || e.target.id === 'rent'){
            setFormData({...formData, type: e.target.id})
        }
        if(e.target.id === 'parking' || e.target.id === 'furnished' || e.target.id === 'offer'){
            setFormData({...formData, [e.target.id]:e.target.checked})
        }
        if(e.target.type === 'number' || e.target.type === 'text' || e.target.type === 'textarea'){
            setFormData({...formData, [e.target.id]:e.target.value})
        }
    }

    const handleSubmit = async (e) =>{
        e.preventDefault()
        try {
            if(formData.imageUrls.length < 1) 
                return setError('Atleast 1 Image Required')
            if(+formData.regularPrice < +formData.discountPrice) 
                return setError('Discount Price must be lower than the Regular Price')
            setLoading(true)
            setError(false)
            const res = await fetch('/api/listing/create',{
                method: 'POST',
                headers:{
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    ...formData,
                    userRef: currentUser._id,
                }),
            })
            const data = await res.json()
            setLoading(false)
            if(data.success === false){
                setError(data.message)
            }
            navigate(`/listing/${data._id}`)
        } catch (error) {
            setError(error.message)
            setLoading(false)
        }
    }

  return (
    <main className="p-3 max-w-4xl mx-auto">
        <h1 className="text-3xl font-semibold text-center m-7">Create a Listing</h1>
        <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-4">
            <div className="flex flex-col gap-4 flex-1">
                <input onChange={handleChange} value={formData.name} type="text" className="border p-3 rounded-lg" placeholder="Name" id="name" maxLength='62' minLength='10' required/>
                <textarea onChange={handleChange} value={formData.description} type="text" className="border p-3 rounded-lg" placeholder="Description" id="description" required/>
                <input onChange={handleChange} value={formData.address} type="text" className="border p-3 rounded-lg" placeholder="Address" id="address" required/>
                <div className="flex gap-5 flex-wrap">
                    <div className="flex gap-2">
                        <input onChange={handleChange} checked={formData.type === 'sale'} type="checkbox" id="sale" className="w-3"/>
                        <span>Sell</span>
                    </div>
                    <div className="flex gap-2">
                        <input onChange={handleChange} checked={formData.type === 'rent'} type="checkbox" id="rent" className="w-3"/>
                        <span>Rent</span>
                    </div>
                    <div className="flex gap-2">
                        <input onChange={handleChange} checked={formData.parking} type="checkbox" id="parking" className="w-3"/>
                        <span>Parking Spot</span>
                    </div>
                    <div className="flex gap-2">
                        <input onChange={handleChange} checked={formData.furnished} type="checkbox" id="furnished" className="w-3"/>
                        <span>Furnished</span>
                    </div>
                    <div className="flex gap-2">
                        <input onChange={handleChange} checked={formData.offer} type="checkbox" id="offer" className="w-3"/>
                        <span>Offer</span>
                    </div>
                </div>
                <div className="flex flex-wrap gap-4">
                    <div className="flex items-center gap-2">
                        <input onChange={handleChange} checked={formData.bedrooms} type="number" className="p-2 border border-gray-300 rounded-md" id="bedrooms" min='1' max='10' required />
                        <span>Beds</span>
                    </div>
                    <div className="flex items-center gap-2">
                        <input onChange={handleChange} checked={formData.bathrooms} type="number" className="p-2 border border-gray-300 rounded-md" id="bathrooms" min='1' max='10' required />
                        <span>Baths</span>
                    </div>
                    <div className="flex items-center gap-2">
                        <input onChange={handleChange} checked={formData.regularPrice} type="number" className="p-2 border border-gray-300 rounded-md" id="regularPrice" min='50' max='10000000' required />
                        <div className="flex flex-col items-center">
                            <p>Regular Price</p>
                            <span className="text-xs">($ / Month)</span>
                        </div>
                    </div>
                    {formData.offer && (
                    <div className="flex items-center gap-2">
                        <input onChange={handleChange} checked={formData.discountPrice} type="number" className="p-2 border border-gray-300 rounded-md" id="discountPrice" min='0' max='10000000' required />
                        <div className="flex flex-col items-center">
                            <p>Discounted</p>
                            <span className="text-xs">($ / Month)</span>
                        </div>
                    </div>
                    )}
                </div>
            </div>
            <div className="flex flex-col gap-4 flex-1">
                <p className="font-semibold">Images: <span className="text-gray-600 m-2"> The first image will be the cover (max 6)</span> </p>
                <div className="flex gap-4">
                    <input onChange={(e)=>setFiles(e.target.files)} className="p-3 border border-gray-300 rounded w-full"type="file" accept="image/*" id="images" multiple/>
                    <button type='button' disabled={uploading} onClick={handleImageSubmit} className="p-3 text-white border bg-black rounded hover:shadow-md disabled:opacity-80">
                        {uploading?'Uploading':'Upload'}
                    </button>
                </div>
                <p className="text-red-500 text-sm">{imageUploadError && imageUploadError}</p>
                {
                    formData.imageUrls.length>0 && formData.imageUrls.map((url, index)=>(
                        <div key={url} className="flex justify-between p-3 border items-center">
                        <img src={url} alt="listing" className="w-36 h-36 object-cover rounded-md"/>
                        <button onClick={()=>handleRemoveImage(index)} className="p-2 text-white bg-red-500 rounded hover:opacity-90">Remove</button>
                        </div>
                    ))
                }
            <button disabled={loading || uploading}className="p-3 bg-green-500 text-white rounded-lg hover:opacity-90 disabled:opacity-80">
                {loading?'Creating':'Create'}
            </button>
            {error && <p className="text-red-500 text-sm text-center">{error}</p>}
            </div>
        </form>
    </main>
  )
}
