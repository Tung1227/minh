import { Dialog, Transition } from "@headlessui/react";
import { Fragment, useRef, useState } from "react";

export default function ReportModal(props) {

  const {modal, post_id} = props;
  const [inputs, setInputs] = useState({
    content: ""
  })

  const {content} = inputs

  const cancelButtonRef = useRef(null);
  const onChange = e => {
    if (e.target.type == 'checkbox') {
      setInputs({ ...inputs, [e.target.name]: e.target.checked })
    }
    else {
      setInputs({ ...inputs, [e.target.name]: e.target.value })
    }
  }

  const onSubmitForm = async e => {
    const params = { ...inputs, post_id }

    console.log(params)
    e.preventDefault()
    try {
      if(content == ''){
        props.setNoti('red')
        props.setNotiMessage("Hãy nhập nội dung báo cáo")
        setTimeout(() => {
        props.setNoti('')
        }, 3000);
      }else{
        const url = await `${process.env.REACT_APP_API_URL}/post/report`
        const respone = await fetch(url, {
          method: "post",
          headers: { "content-Type": "application/json", token: localStorage.token },
          body: JSON.stringify(params)
        })
        const parseRes = await respone.json()
        console.log(parseRes)
        props.setModal(false)
        setInputs({content: ""})
      }
    } catch (error) {
      console.log(error.message)
    }
  }
  return (
    <Transition.Root show={modal} as={Fragment}>
      <Dialog
        as="div"
        className="relative z-10"
        initialFocus={cancelButtonRef}
        onClose={() => { props.setModal(false) }}
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
                        Báo cáo về phòng trọ
                      </Dialog.Title>
                    </div>
                    <form className="space-y-6" action="#" onSubmit={onSubmitForm}>
                      <div className="">
                        <div className="mr-3">
                          <label
                            htmlFor="price"
                            className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                          >
                            Nội dung báo cáo
                          </label>
                          <textarea style={{height: '200px'}}
                            name="content"
                            id="content"
                            value={content}
                            onChange={(e) => { onChange(e) }}
                            className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-600 dark:border-gray-500 dark:placeholder-gray-400 dark:text-white"
                          />
                        </div>
                      </div>
                    </form>
                  </div>
                </div>
                <div className="bg-gray-50 px-4 py-3 sm:flex sm:flex-row-reverse sm:px-6">
                  <button
                    type="button"
                    className="mt-3 inline-flex w-full justify-center rounded-md bg-blue-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-blue-500 sm:ml-3 sm:w-auto"
                    onClick={(e) => { onSubmitForm(e) }}
                  >
                    Report
                  </button>
                  <button
                    type="button"
                    className="mt-3 inline-flex w-full justify-center rounded-md bg-white px-3 py-2 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50 sm:mt-0 sm:w-auto"
                    onClick={() => props.setModal(false)}
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
