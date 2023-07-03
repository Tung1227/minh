import { Fragment } from "react"
import { useState, useEffect } from "react";

export default function Profile(props) {

    const [selectedImage, setSelectedImage] = useState({
        files: []
    });
    const [imgUrl, setImgUrl] = useState('')

    // const [cities, setCities] = useState([])
    // const [districts, setDistricts] = useState([])
    // const [wards, setWards] = useState([])
    const [inputs, setInputs] = useState({
        userName: "",
        phoneNumber: "",
        city: "",
        district: "",
        ward: "",
        address: "",
    })
    const { userName, phoneNumber, city, district, ward, address } = { ...inputs }

    const getInfo = async () => {
        const url = await `${process.env.REACT_APP_API_URL}/user/info`
        const respone = await fetch(url, {
            method: 'get',
            headers: { token: localStorage.getItem('token') }
        })

        const parseRes = await respone.json()
        setInputs({
            ...inputs, userName: parseRes.user_name, phoneNumber: parseRes.userinfo[0].phone_number, address: parseRes.userinfo[0].street_address,
            city: (parseRes.userinfo[0].city == null ? '' : parseRes.userinfo[0].city),
            district: (parseRes.userinfo[0].district == null ? '' : parseRes.userinfo[0].district),
            ward: (parseRes.userinfo[0].ward == null ? '' : parseRes.userinfo[0].ward)
        })
        const img_url = await `${process.env.REACT_APP_MEDIA_URL}${parseRes.userinfo[0].avatar_img}`
        setImgUrl(img_url)
    }
    const fetchCity = async () => {
        const url = await `${process.env.REACT_APP_API_URL}/address/city`
        const respone = await fetch(url, {
            method: 'get'
        })

        const parseRes = await respone.json()
        let arr = [{ code: '', name: '' }]
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
        getInfo()
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


    const fileSelectedHandler = (e) => {
        if (!checkfile(e.target.files)) {
            props.setNoti('red')
            props.setNotiMessage('Chỉ nhận những file có đuôi png, jpg, jpeg')
            setTimeout(() => {
                props.setNoti('')
            }, 3000);
        }
        else {
            setSelectedImage({ files: [e.target.files[0]] })
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
                formData.append('userName', userName)
                formData.append('phoneNumber', phoneNumber)
                formData.append('city', city)
                formData.append('district', district)
                formData.append('ward', ward)
                formData.append('address', address)
                console.log(formData)
                e.preventDefault()
                props.setNoti('')
                const url = await `${process.env.REACT_APP_API_URL}/user/updateinfo`
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
            <div className="container">

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
                                                <div className="text-center">
                                                    {selectedImage.files.map((img, index) => (
                                                        <div>
                                                            <img key={index} className="avaterSelect h-20 w-20" style={{ margin: 'auto', borderRadius: '0.7rem' }}
                                                                alt="not found"
                                                                src={URL.createObjectURL(img)}
                                                            />
                                                        </div>
                                                    ))}


                                                </div>
                                            )}
                                            {imgUrl != '' && selectedImage.files.length == 0 && <div className="avaterSelect text-center">
                                                <img className="h-20 w-20" style={{ margin: 'auto', borderRadius: '0.7rem' }}
                                                    alt="not found"
                                                    src={imgUrl}
                                                />
                                            </div>
                                            }

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
                                                <label htmlFor="title">Họ và tên</label>
                                                <input type="text" name="userName" id="userName" className="h-10 border mt-1 rounded px-4 w-full bg-gray-50"
                                                    value={userName} onChange={(e) => onChange(e)} />
                                            </div>
                                            <div className="md:col-span-5 text-left">
                                                <label htmlFor="phoneNumber">Số điện thoại</label>
                                                <input type="text" name="phoneNumber" id="phoneNumber" className="h-10 border mt-1 rounded px-4 w-full bg-gray-50"
                                                    value={phoneNumber} onChange={(e) => onChange(e)} />
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
                                                    <button type="submit" className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">Cập nhật</button>
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
    )
}