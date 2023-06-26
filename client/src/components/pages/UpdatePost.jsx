import { Fragment, useEffect, useState } from "react";

export default function UpdatePost(props) {

    console.log(props.post)
    const post = props.post
    useEffect(() => {
        setInputs({
            ...inputs, title: post.post.title, content: post.post.detail_post[0].content,
            price: post.post.detail_post[0].price, elect: post.post.detail_post[0].electric_price,
            water: post.post.detail_post[0].water_price, air_condition: post.post.detail_post[0].air_condition,
            washing: post.post.detail_post[0].washing, city: post.address.code, district: post.address.districts[0].code,
            ward: post.address.districts[0].wards[0].code
        })
    }, [])

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

    const fieldCheck = () => {
        for (const field in inputs) {
            if (inputs[field] == '' && field != 'air_condition' && field != 'washing') {
                return false
            }
        }
        return true;
    }
    const onSubmitForm = async (e) => {
        e.preventDefault()
        try {
            if (!fieldCheck()) {
                props.setNoti('red')
                props.setNotiMessage("Hãy điền đủ thông tin")
                setTimeout(() => {
                    props.setNoti('')
                }, 3000)
            }
            else {
                const params = { ...inputs, post_id: post.post.post_id }
                const url = await `${process.env.REACT_APP_API_URL}/user/updatepost`
                const respone = await fetch(url, {
                    method: 'post',
                    headers: { token: localStorage.getItem('token'), "content-Type": "application/json" },
                    body: JSON.stringify(params)

                })

                const parseRes = await respone.json()
                console.log(parseRes)
                if (parseRes.message) {
                    props.setNoti('green')
                    props.setNotiMessage(parseRes.message)
                    setTimeout(() => {
                        props.setNoti('')
                    }, 3000)
                }
            }
        } catch (error) {
            console.log(error.message)
        }
    }

    const onChange = e => {
        if (e.target.type == 'checkbox') {
            setInputs({ ...inputs, [e.target.name]: e.target.checked })
        }
        else {
            setInputs({ ...inputs, [e.target.name]: e.target.value })
        }
    }


    return (
        <Fragment>
            <div className="container">

                {/* <!-- component --> */}
                <div className="min-h-screen p-6 bg-gray-100 flex items-center justify-center">
                    <div className="container max-w-screen-lg mx-auto">
                        <form onSubmit={onSubmitForm}>
                            <div className="bg-white rounded shadow-lg p-4 px-4 md:p-8 mb-6">
                                <div className="grid gap-4 gap-y-2 text-sm grid-cols-1 lg:grid-cols-3">
                                    <div className="lg:col-span-3">
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
                                                    <button type="submit" className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">Submit</button>
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