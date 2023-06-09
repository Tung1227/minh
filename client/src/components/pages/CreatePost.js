import React, { useState } from "react";


const Listroom = () => {
    const [selectedImage, setSelectedImage] = useState({
        files: []
    });

    const fileSelectedHandler = (e) => {
        console.log(e.target.files)
        setSelectedImage({ files: [...selectedImage.files, ...e.target.files] })
    }
    return (
        <div>
            <h1>Upload and Display Image usign React Hook's</h1>

            {selectedImage.files.length !== 0 && (
                <div>
                    {selectedImage.files.map(img => (
                        <div>
                            <img
                                alt="not found"
                                width={"250px"}
                                src={URL.createObjectURL(img)}
                            />
                            <br />
                            <button key={img.name} value={img.name} onClick={(e) => {
                                const arr = selectedImage.files.filter(img => img.name != e.currentTarget.value)
                                console.log(arr)
                                setSelectedImage({ files: [...arr] })
                            }}>Remove</button>
                        </div>
                    ))}


                </div>
            )}

            <br />
            <br />
            <h1 className="text-3xl font-bold underline">
                Hello world!
            </h1>

            <label htmlFor="file-upload" className="custom-file-upload">
                <i class="fa fa-cloud-upload"></i> choose File
            </label>
            <input id="file-upload" type="file" onChange={(e) => fileSelectedHandler(e)} multiple />
            <form class="w-full max-w-lg">
                <div class="flex flex-wrap -mx-3 mb-6">
                    <div class="w-full md:w-1/2 px-3 mb-6 md:mb-0">
                        <label class="block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2" for="grid-first-name">
                            First Name
                        </label>
                        <input class="appearance-none block w-full bg-gray-200 text-gray-700 border border-red-500 rounded py-3 px-4 mb-3 leading-tight focus:outline-none focus:bg-white" id="grid-first-name" type="text" placeholder="Jane" />
                        <p class="text-red-500 text-xs italic">Please fill out this field.</p>
                    </div>
                    <div class="w-full md:w-1/2 px-3">
                        <label class="block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2" for="grid-last-name">
                            Last Name
                        </label>
                        <input class="appearance-none block w-full bg-gray-200 text-gray-700 border border-gray-200 rounded py-3 px-4 leading-tight focus:outline-none focus:bg-white focus:border-gray-500" id="grid-last-name" type="text" placeholder="Doe" />
                    </div>
                </div>
                <div class="flex flex-wrap -mx-3 mb-6">
                    <div class="w-full px-3">
                        <label class="block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2" for="grid-password">
                            Password
                        </label>
                        <input class="appearance-none block w-full bg-gray-200 text-gray-700 border border-gray-200 rounded py-3 px-4 mb-3 leading-tight focus:outline-none focus:bg-white focus:border-gray-500" id="grid-password" type="password" placeholder="******************" />
                        <p class="text-gray-600 text-xs italic">Make it as long and as crazy as you'd like</p>
                    </div>
                </div>
                <div class="flex flex-wrap -mx-3 mb-2">
                    <div class="w-full md:w-1/3 px-3 mb-6 md:mb-0">
                        <label class="block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2" for="grid-city">
                            City
                        </label>
                        <input class="appearance-none block w-full bg-gray-200 text-gray-700 border border-gray-200 rounded py-3 px-4 leading-tight focus:outline-none focus:bg-white focus:border-gray-500" id="grid-city" type="text" placeholder="Albuquerque" />
                    </div>
                    <div class="w-full md:w-1/3 px-3 mb-6 md:mb-0">
                        <label class="block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2" for="grid-state">
                            State
                        </label>
                        <div class="relative">
                            <select class="block appearance-none w-full bg-gray-200 border border-gray-200 text-gray-700 py-3 px-4 pr-8 rounded leading-tight focus:outline-none focus:bg-white focus:border-gray-500" id="grid-state">
                                <option>New Mexico</option>
                                <option>Missouri</option>
                                <option>Texas</option>
                            </select>
                            <div class="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700">
                                <svg class="fill-current h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20"><path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z" /></svg>
                            </div>
                        </div>
                    </div>
                    <div class="w-full md:w-1/3 px-3 mb-6 md:mb-0">
                        <label class="block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2" for="grid-zip">
                            Zip
                        </label>
                        <input class="appearance-none block w-full bg-gray-200 text-gray-700 border border-gray-200 rounded py-3 px-4 leading-tight focus:outline-none focus:bg-white focus:border-gray-500" id="grid-zip" type="text" placeholder="90210" />
                    </div>
                </div>
            </form>
        </div>
    );
}

export default Listroom;