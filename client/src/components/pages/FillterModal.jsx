import { Fragment, useEffect, useRef, useState } from "react";
import { Dialog, Transition } from "@headlessui/react";
import { ExclamationTriangleIcon } from "@heroicons/react/24/outline";

export default function FillterModal(props) {

  const modalStatus = props.fillterModal;
  const cities = props.cities;
  const districts = props.districts;
  const wards = props.wards;

  const [open, setOpen] = useState(modalStatus);

  const [inputs, setInputs] = useState({
    price: "",
    water_price: "",
    electric_price: "",
    city: "",
    district: "",
    ward: "",
    air_condition: false,
    washing: false,
  })
  const { price, water_price, electric_price, city, district, ward, air_condition, washing } = { ...inputs }
  useEffect(() => {
    setOpen(modalStatus)
  }, [modalStatus])

  const cancelButtonRef = useRef(null);
  const onChange = e => {
    if (e.target.type == 'checkbox') {
      setInputs({ ...inputs, [e.target.name]: e.target.checked })
    }
    else {
      setInputs({ ...inputs, [e.target.name]: e.target.value })
    }
  }
  const fetchCity = async () => {
    const url = await `${process.env.REACT_APP_API_URL}/address/city`
    const respone = await fetch(url, {
      method: 'get'
    })

    const parseRes = await respone.json()
    parseRes.splice(0, 0, { code: '', name: 'Toàn quốc' });
    props.setCities(parseRes)
  }

  const fetchDistrict = async () => {
    console.log(city)
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
  const onSubmitForm = async e => {
    const params = { ...inputs }
    
    console.log(params)
    e.preventDefault()
    try {
      const url = await `${process.env.REACT_APP_API_URL}/post/searchpost`
      const respone = await fetch(url, {
        method: "post",
        headers: { "content-Type": "application/json", token: localStorage.token },
        body: JSON.stringify(params)
      })
      const parseRes = await respone.json()
      console.log(parseRes)
      parseRes.posts.map((post, index) => {
        const detail_post = [{
          price: post.price,
          image_file: post.image_file
        }]
        parseRes.posts[index] = {...post, detail_post}
      })
      props.setPosts(parseRes.posts)
      props.setFillterModal(false)
    } catch (error) {
      console.log(error.message)
    }
  }
  return (
    <Transition.Root show={modalStatus} as={Fragment}>
      <Dialog
        as="div"
        className="relative z-10"
        initialFocus={cancelButtonRef}
        onClose={() => { props.setFillterModal(false) }}
      >
        <Transition.Child
          as={Fragment}
          enter="ease-out duration-300"
          enterFrom="opacity-0"
          enterTo="opacity-100"
          leave="ease-in duration-200"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <div className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" />
        </Transition.Child>

        <div className="fixed inset-0 z-10 overflow-y-auto">
          <div className="flex min-h-full items-end justify-center p-4 text-center sm:items-center sm:p-0">
            <Transition.Child
              as={Fragment}
              enter="ease-out duration-300"
              enterFrom="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
              enterTo="opacity-100 translate-y-0 sm:scale-100"
              leave="ease-in duration-200"
              leaveFrom="opacity-100 translate-y-0 sm:scale-100"
              leaveTo="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
            >
              <Dialog.Panel className="relative transform overflow-hidden rounded-lg bg-white text-left shadow-xl transition-all sm:my-8 sm:w-full sm:max-w-lg">
                <div className="bg-white px-4 pb-4 pt-5 md:p-6 md:pb-4">
                  <div className="">
                    {/* <div className="mx-auto flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-full bg-red-100 sm:mx-0 sm:h-10 sm:w-10">
                      <ExclamationTriangleIcon
                        className="h-6 w-6 text-red-600"
                        aria-hidden="true"
                      />
                    </div> */}
                    <div className="mt-3 text-center sm:ml-4 sm:mt-0 sm:text-left">
                      <Dialog.Title
                        as="h3"
                        className="text-base font-semibold leading-6 text-gray-900"
                      >
                        Tìm kiếm phòng trọ
                      </Dialog.Title>
                      <div className="mt-2">
                        <p className="text-sm text-gray-500">
                          Chọn các thông tin cần thiết để tìm kiếm
                        </p>
                      </div>
                    </div>
                    <form className="space-y-6" action="#" onSubmit={onSubmitForm}>
                      <div className="flex justify-between">
                        <div className="mr-3">
                          <label
                            htmlFor="price"
                            className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                          >
                            Giá phòng
                          </label>
                          <input
                            type="number"
                            name="price"
                            id="price"
                            value={price}
                            onChange={(e) => { onChange(e) }}
                            className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-600 dark:border-gray-500 dark:placeholder-gray-400 dark:text-white"
                            placeholder=""
                            required=""
                          />
                        </div>
                        <div className="mr-3">
                          <label
                            htmlFor="electric_price"
                            className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                          >
                            giá điện
                          </label>
                          <input
                            type="number"
                            name="electric_price"
                            id="electric_price"
                            value={electric_price}
                            onChange={(e) => { onChange(e) }}
                            placeholder=""
                            className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-600 dark:border-gray-500 dark:placeholder-gray-400 dark:text-white"
                            required=""
                          />
                        </div>
                        <div>
                          <label
                            htmlFor="water_price"
                            className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                          >
                            giá nước
                          </label>
                          <input
                            type="number"
                            name="water_price"
                            value={water_price}
                            onChange={(e) => { onChange(e) }}
                            id="water_price"
                            placeholder=""
                            className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-600 dark:border-gray-500 dark:placeholder-gray-400 dark:text-white"
                            required=""
                          />
                        </div>
                      </div>
                      <div className="flex justify-left">
                        <div className="flex items-start mr-3">
                          <div className="flex items-center h-5">
                            <input
                              id="air_condition"
                              name="air_condition"
                              value={air_condition}
                              onChange={(e) => { onChange(e) }}
                              type="checkbox"
                              defaultValue=""
                              className="w-4 h-4 border border-gray-300 rounded bg-gray-50 focus:ring-3 focus:ring-blue-300 dark:bg-gray-600 dark:border-gray-500 dark:focus:ring-blue-600 dark:ring-offset-gray-800 dark:focus:ring-offset-gray-800"
                              required=""
                            />
                          </div>
                          <label
                            htmlFor="air_condition"
                            className="ml-2 text-sm font-medium text-gray-900 dark:text-gray-300"
                          >
                            Điều hoà
                          </label>
                        </div>
                        <div className="flex items-start">
                          <div className="flex items-center h-5">
                            <input
                              id="washing"
                              name="washing"
                              value={washing}
                              onChange={(e) => { onChange(e) }}
                              type="checkbox"
                              defaultValue=""
                              className="w-4 h-4 border border-gray-300 rounded bg-gray-50 focus:ring-3 focus:ring-blue-300 dark:bg-gray-600 dark:border-gray-500 dark:focus:ring-blue-600 dark:ring-offset-gray-800 dark:focus:ring-offset-gray-800"
                              required=""
                            />
                          </div>
                          <label
                            htmlFor="washing"
                            className="ml-2 text-sm font-medium text-gray-900 dark:text-gray-300"
                          >
                            Máy giặt
                          </label>
                        </div>
                      </div>

                      <div className="flex justify-between">
                        <div className="md:col-span-1 text-left mr-3">
                          <label htmlFor="city">Thành phố</label>
                          <select className="h-10 border mt-1 rounded px-4 w-full bg-gray-50" value={city} name="city" id="city" onChange={(e) => onChange(e)} onLoad={(e) => onChange(e)}>
                            {cities.map((city) =>
                              <option key={city.code} value={city.code}>{city.name}</option>
                            )}

                          </select>
                        </div>
                        <div className="md:col-span-1 text-left ">
                          <label htmlFor="country">Quận/Huyện</label>
                          <select className="h-10 border mt-1 rounded px-4 w-full bg-gray-50" value={district} name="district" id="district" onChange={(e) => onChange(e)}>
                            {props.districts.map((district) =>
                              <option key={district.code} value={district.code}>{district.name}</option>
                            )}
                          </select>
                        </div>

                      </div>
                      <div className="md:col-span-1 text-left">
                        <label htmlFor="state">Phường/Xã</label>
                        <select className="h-10 border mt-1 rounded px-4 w-full bg-gray-50" value={ward} name="ward" id="ward" onChange={(e) => onChange(e)}>
                          {props.wards.map((ward) =>
                            <option key={ward.code} value={ward.code}>{ward.name}</option>
                          )}
                        </select>
                      </div>
                    </form>
                  </div>
                </div>
                <div className="bg-gray-50 px-4 py-3 sm:flex sm:flex-row-reverse sm:px-6">
                  <button
                    type="button"
                    className="mt-3 inline-flex w-full justify-center rounded-md bg-blue-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-blue-500 sm:ml-3 sm:w-auto"
                    onClick={(e) => {onSubmitForm(e)}}
                  >
                    Search
                  </button>
                  <button
                    type="button"
                    className="mt-3 inline-flex w-full justify-center rounded-md bg-white px-3 py-2 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50 sm:mt-0 sm:w-auto"
                    onClick={() => props.setFillterModal(false)}
                    ref={cancelButtonRef}
                  >
                    Cancel
                  </button>
                </div>
              </Dialog.Panel>
            </Transition.Child>
          </div>
        </div>
      </Dialog>
    </Transition.Root>
  );
}
