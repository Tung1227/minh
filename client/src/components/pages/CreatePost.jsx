import React, { Fragment, useEffect, useState } from "react";


export default function CreatePost(props) {
    const [selectedImage, setSelectedImage] = useState({
        files: []
    });

    // const [cities, setCities] = useState([])
    // const [districts, setDistricts] = useState([])
    // const [wards, setWards] = useState([])
    const [inputs, setInputs] = useState({
        title: "",
        price: "",
        water: "",
        elect: "",
        content: "",
        city: "",
        district: "",
        ward: "",
        address: "",
        air_condition: false,
        washing: false
    })
    const { title, price, water, elect, content, city, district, ward, address, air_condition, washing } = { ...inputs }

    const fetchCity = async () => {
        const url = await `${process.env.REACT_APP_API_URL}/address/city`
        const respone = await fetch(url, {
            method: 'get'
        })

        const parseRes = await respone.json()
        let arr = [{ code: '', name: '' }]
        console.log(parseRes)
        parseRes.splice(0, 0, { code: '', name: 'Toàn quốc' });
        props.setCities(parseRes)
    }

    const fetchDistrict = async () => {
        const url = await `${process.env.REACT_APP_API_URL}/address/district`
        const respone = await fetch(url, {
            method: 'post',
            headers: { "content-Type": "application/json" },
            body: JSON.stringify({ "code": city })
        })
        const parseRes = await respone.json()
        console.log(parseRes[0].districts)
        parseRes[0].districts.splice(0, 0, { code: '', name: 'Tất cả' })
        props.setDistricts(parseRes[0].districts)
    }
    const fetchWard = async () => {
        const url = await `${process.env.REACT_APP_API_URL}/address/ward`
        const respone = await fetch(url, {
            method: 'post',
            headers: { "content-Type": "application/json" },
            body: JSON.stringify({ "code": district })
        })

        const parseRes = await respone.json()
        parseRes[0].wards.splice(0, 0, { code: '', name: 'Tất cả' })
        props.setWards(parseRes[0].wards)
    }
    useEffect(() => {
        fetchCity()
    }, [])
    useEffect(() => {
        console.log(city)
        if (city != '') {
            fetchDistrict()
        }
    }, [city])
    useEffect(() => {
        if (district != '') {
            fetchWard()
        }
    }, [district])

    const onChange = e => {
        if (e.target.type == 'checkbox') {
            setInputs({ ...inputs, [e.target.name]: e.target.checked })
        }
        else {
            setInputs({ ...inputs, [e.target.name]: e.target.value })
        }
    }
    const { files } = { ...selectedImage }
    const fileExtensions = ['png', 'jpeg', 'jpg']
    const checkfile = (files) => {
        for (const file of files) {
            const extension = file.name.split('.').pop();
            console.log(extension)
            if (fileExtensions.indexOf(extension) == -1) {
                props.setNoti('red')
                props.setNotiMessage('Chỉ nhận những file có đuôi png, jpg, jpeg')
                setTimeout(() => {
                    props.setNoti('')
                }, 3000);
                return false
            }
        }
        return true
    }

    // console.log(e.target.files.size)
    // if (e.target.files.length > 4) {
    //     props.setNoti('red')
    //     props.setNotiMessage('Không được tải lên quá 5 ảnh')
    //     setTimeout(() => {
    //         props.setNoti('')
    //     }, 3000);
    // } else {
    const fileSelectedHandler = (e) => {
        if (e.target.files.length > (5 - files.length)) {
            props.setNoti('red')
            props.setNotiMessage('Không được tải lên quá 5 ảnh')
            setTimeout(() => {
                props.setNoti('')
            }, 3000);
        } else {
            if (!checkfile(e.target.files)) {
                props.setNoti('red')
                props.setNotiMessage('Chỉ nhận những file có đuôi png, jpg, jpeg')
                setTimeout(() => {
                    props.setNoti('')
                }, 3000);
            }
            else {
                setSelectedImage({ files: [...selectedImage.files, ...e.target.files] })
            }
        }
    }
    const fieldCheck = () => {
        for (const field in inputs) {
            if (inputs[field] == '' && field != 'air_condition' && field != 'washing') {
                return false
            }
        }
        return true;
    }

    const onSubmitForm = async e => {
        e.preventDefault()
        try {
            if (!fieldCheck()) {
                props.setNoti('red')
                props.setNotiMessage("Hãy điền đủ thông tin")
                setTimeout(() => {
                    props.setNoti('')
                }, 3000)
            } else {

                let formData = new FormData();
                files.map(file => {
                    formData.append('multi_files', file)
                })
                formData.append('title', title)
                formData.append('content', content)
                formData.append('city', city)
                formData.append('district', district)
                formData.append('ward', ward)
                formData.append('price', price)
                formData.append('address', address)
                formData.append('electric_price', elect)
                formData.append('water_price', water)
                formData.append('air_condition', air_condition)
                formData.append('washing', washing)
                console.log(formData)
                e.preventDefault()
                props.setNoti('')
                const url = await `${process.env.REACT_APP_API_URL}/post/createpost`
                const respone = await fetch(url, {
                    method: "post",
                    headers: { token: localStorage.token },
                    body: formData
                })
                const parseRes = await respone.json()
                if (parseRes.message) {
                    props.setNoti('green')
                    props.setNotiMessage(parseRes.message)
                    setTimeout(() => {
                        props.setNoti('')
                    }, 3000)
                    window.location.href = "/"
                }
                if (parseRes.error) {
                    props.setNoti('red')
                    props.setNotiMessage(parseRes.error)
                    setTimeout(() => {
                        props.setNoti('')
                    }, 3000)
                    // window.location.href ="/"
                }
            }
        } catch (error) {
            console.log(error.message)
        }
    }
    return (
        <Fragment>
            <div className="container" style={{ minHeight: '836px' }}>
                {/* <!-- component --> */}
                <div className="min-h-screen p-6 bg-gray-100 flex items-center justify-center" style={{ background: 'transparent' }}>
                    <div className="container max-w-screen-lg mx-auto">
                        <form onSubmit={onSubmitForm}>
                            <div className="bg-white rounded shadow-lg p-4 px-4 md:p-8 mb-6">
                                <div className="grid gap-4 gap-y-2 text-sm grid-cols-1 lg:grid-cols-3">
                                    <div className="text-gray-600">
                                        <p className="font-medium text-lg">Chọn ảnh</p>
                                        <div className="text-gray-600">
                                            {selectedImage.files.length !== 0 && (
                                                <div className="flex">
                                                    {selectedImage.files.map((img, index) => (
                                                        <div style={{ marginBottom: '1rem;' }}>
                                                            <img key={index} className="h-20 w-20" style={{ borderRadius: '.7rem', padding: '.2rem' }}
                                                                alt="not found"
                                                                src={URL.createObjectURL(img)}
                                                            />
                                                            <br />
                                                            <button key={img.name} value={img.name} onClick={(e) => {
                                                                const arr = selectedImage.files.filter(img => img.name != e.currentTarget.value)
                                                                setSelectedImage({ files: [...arr] })
                                                            }}>xoá ảnh</button>
                                                        </div>
                                                    ))}


                                                </div>
                                            )}

                                            <br />
                                            <label htmlFor="file-upload" className="custom-file-upload">
                                                <i className="fa fa-cloud-upload"></i> choose File
                                            </label>
                                            <input id="file-upload" type="file" onInput={(e) => fileSelectedHandler(e)} multiple />
                                        </div>
                                    </div>
                                    <div className="lg:col-span-2">
                                        <div className="grid gap-4 gap-y-2 text-sm grid-cols-1 md:grid-cols-5">
                                            <div className="md:col-span-5 text-left">
                                                <label htmlFor="title">Tiêu đề</label>
                                                <input type="text" name="title" id="title" className="h-10 border mt-1 rounded px-4 w-full bg-gray-50"
                                                    value={title} onChange={(e) => onChange(e)} />
                                            </div>
                                            <div className="md:col-span-5 text-left">
                                                <label htmlFor="content">Mô tả</label>
                                                <input type="text" name="content" id="content" className="h-10 border mt-1 rounded px-4 w-full bg-gray-50"
                                                    value={content} onChange={(e) => onChange(e)} />
                                            </div>

                                            <div className="md:col-span-3 text-left">
                                                <label htmlFor="price">Giá nhà</label>
                                                <input type="number" maxLength={10} name="price" id="price" className="h-10 border mt-1 rounded px-4 w-full bg-gray-50"
                                                    value={price} placeholder="" onChange={(e) => onChange(e)} />
                                            </div>
                                            <div className="md:col-span-1 text-left">
                                                <label htmlFor="elec">Giá điện</label>
                                                <input type="number" name="elect" id="elect" className="h-10 border mt-1 rounded px-4 w-full bg-gray-50"
                                                    value={elect} placeholder="" onChange={(e) => onChange(e)} />
                                            </div>
                                            <div className="md:col-span-1 text-left">
                                                <label htmlFor="water">Giá nước</label>
                                                <input type="number" name="water" id="water" className="h-10 border mt-1 rounded px-4 w-full bg-gray-50"
                                                    value={water} onChange={(e) => onChange(e)} />
                                            </div>
                                            <div className="md:col-span-1 text-left">
                                                {/* <div className="flex items-center h-5"> */}
                                                <input
                                                    id="air_condition"
                                                    name="air_condition"
                                                    value={air_condition}
                                                    onChange={(e) => { onChange(e) }}
                                                    type="checkbox"
                                                    className="w-4 h-4 border border-gray-300 rounded bg-gray-50 focus:ring-3 focus:ring-blue-300 dark:bg-gray-600 dark:border-gray-500 dark:focus:ring-blue-600 dark:ring-offset-gray-800 dark:focus:ring-offset-gray-800"
                                                    required=""
                                                />
                                                {/* </div> */}
                                                <label
                                                    htmlFor="air_condition"
                                                    className="ml-2 text-sm font-medium text-gray-900 dark:text-gray-300"
                                                >
                                                    Điều hoà
                                                </label>
                                            </div>
                                            <div className="md:col-span-1 text-left">
                                                {/* <div className="flex items-center h-5"> */}
                                                <input
                                                    id="washing"
                                                    name="washing"
                                                    value={washing}
                                                    onChange={(e) => { onChange(e) }}
                                                    type="checkbox"
                                                    className="w-4 h-4 border border-gray-300 rounded bg-gray-50 focus:ring-3 focus:ring-blue-300 dark:bg-gray-600 dark:border-gray-500 dark:focus:ring-blue-600 dark:ring-offset-gray-800 dark:focus:ring-offset-gray-800"
                                                    required=""
                                                />
                                                {/* </div> */}
                                                <label
                                                    htmlFor="washing"
                                                    className="ml-2 text-sm font-medium text-gray-900 dark:text-gray-300"
                                                >
                                                    Máy giặt
                                                </label>
                                            </div>

                                            <div className="md:col-span-5 text-left">
                                                <label htmlFor="address">Địa chỉ</label>
                                                <input type="textarea" name="address" id="address" className="h-10 border mt-1 rounded px-4 w-full bg-gray-50"
                                                    value={address} onChange={(e) => onChange(e)} />
                                            </div>

                                            <div className="md:col-span-2 text-left">
                                                <label htmlFor="city">Thành phố</label>
                                                <select className="h-10 border mt-1 rounded px-4 w-full bg-gray-50" value={city} name="city" id="city" onChange={(e) => onChange(e)} onLoad={(e) => onChange(e)}>
                                                    {props.cities.map((city, index) =>
                                                        <option key={index} value={city.code}>{city.name}</option>
                                                    )}

                                                </select>
                                            </div>

                                            <div className="md:col-span-2 text-left">
                                                <label htmlFor="country">Quận/Huyện</label>
                                                <select className="h-10 border mt-1 rounded px-4 w-full bg-gray-50" value={district} name="district" id="district" onChange={(e) => onChange(e)}>
                                                    {props.districts.map((district, index) =>
                                                        <option key={index} value={district.code}>{district.name}</option>
                                                    )}
                                                </select>
                                            </div>

                                            <div className="md:col-span-2 text-left">
                                                <label htmlFor="state">Phường/Xã</label>
                                                <select className="h-10 border mt-1 rounded px-4 w-full bg-gray-50" value={ward} name="ward" id="ward" onChange={(e) => onChange(e)}>
                                                    {props.wards.map((ward, index) =>
                                                        <option key={index} value={ward.code}>{ward.name}</option>
                                                    )}
                                                </select>
                                            </div>
                                            {/* <div className="md:col-span-5">
                                            <div className="inline-flex items-center">
                                                <input type="checkbox" name="billing_same" id="billing_same" className="form-checkbox" />
                                                <label htmlFor="billing_same" className="ml-2">My billing address is different than above.</label>
                                            </div>
                                        </div> */}

                                            <div className="md:col-span-5 text-right">
                                                <div className="inline-flex items-end">
                                                    <button type="submit" className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">Tạo</button>
                                                </div>
                                            </div>

                                        </div>
                                    </div>
                                </div>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </Fragment>

    );
}
