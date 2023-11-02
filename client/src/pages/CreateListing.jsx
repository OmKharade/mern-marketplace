export default function CreateListing() {
  return (
    <main className="p-3 max-w-4xl mx-auto">
        <h1 className="text-3xl font-semibold text-center m-7">Create a Listing</h1>
        <form className="flex flex-col sm:flex-row gap-4">
            <div className="flex flex-col gap-4 flex-1">
                <input type="text" className="border p-3 rounded-lg" placeholder="Name" id="name" maxLength='62' minLength='10' required/>
                <textarea type="text" className="border p-3 rounded-lg" placeholder="Description" id="description" required/>
                <input type="text" className="border p-3 rounded-lg" placeholder="Address" id="address" required/>
                <div className="flex gap-5 flex-wrap">
                    <div className="flex gap-2">
                        <input type="checkbox" id="sale" className="w-3"/>
                        <span>Sell</span>
                    </div>
                    <div className="flex gap-2">
                        <input type="checkbox" id="sale" className="w-3"/>
                        <span>Sell</span>
                    </div>
                    <div className="flex gap-2">
                        <input type="checkbox" id="parking" className="w-3"/>
                        <span>Parking Spot</span>
                    </div>
                    <div className="flex gap-2">
                        <input type="checkbox" id="furnished" className="w-3"/>
                        <span>Furnished</span>
                    </div>
                    <div className="flex gap-2">
                        <input type="checkbox" id="offer" className="w-3"/>
                        <span>Offer</span>
                    </div>
                </div>
                <div className="flex flex-wrap gap-4">
                    <div className="flex items-center gap-2">
                        <input type="number" className="p-2 border border-gray-300 rounded-md" id="bedrooms" min='1' max='10' required />
                        <span>Beds</span>
                    </div>
                    <div className="flex items-center gap-2">
                        <input type="number" className="p-2 border border-gray-300 rounded-md" id="bathrooms" min='1' max='10' required />
                        <span>Baths</span>
                    </div>
                    <div className="flex items-center gap-2">
                        <input type="number" className="p-2 border border-gray-300 rounded-md" id="regularPrice" min='1' max='10' required />
                        <div className="flex flex-col items-center">
                            <p>Regular Price</p>
                            <span className="text-xs">($ / Month)</span>
                        </div>
                    </div>
                    <div className="flex items-center gap-2">
                        <input type="number" className="p-2 border border-gray-300 rounded-md" id="discountPrice" min='1' max='10' required />
                        <div className="flex flex-col items-center">
                            <p>Discounted</p>
                            <span className="text-xs">($ / Month)</span>
                        </div>
                    </div>
                </div>
            </div>
            <div className="flex flex-col gap-4 flex-1">
                <p className="font-semibold">Images: <span className="text-gray-600 m-2"> The first image will be the cover (max 6)</span> </p>
                <div className="flex gap-4">
                    <input className="p-3 border border-gray-300 rounded w-full"type="file" accept="image/*" id="images" multiple/>
                    <button className="p-3 text-white border bg-black rounded hover:shadow-md disabled:opacity-80">Upload</button>
                </div>
            <button className="p-3 bg-green-500 text-white rounded-lg hover:opacity-90 disabled:opacity-80">Create</button>
            </div>
        </form>
    </main>
  )
}
