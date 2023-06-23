import React, { Fragment, useEffect } from "react"

export default function Toast(props) {
    const { showed, message } = { ...props }
    const notiRef = React.createRef()
    useEffect(() => {
        const noti = notiRef.current;
        if (showed == 'red') {
            noti.classList.remove("hidden")
            noti.classList.remove("bg-green-50")
            noti.classList.remove("text-green-800")
            noti.classList.add("bg-red-50")
            noti.classList.add("text-red-800")

        } else if (showed == 'green') {
            noti.classList.remove("hidden")
            noti.classList.remove("bg-red-50")
            noti.classList.remove("text-red-800")
            noti.classList.add("bg-green-50")
            noti.classList.add("text-green-800")

        } else {
            noti.classList.add("hidden")
        }
    }, [showed])
    return (
        <Fragment>
            <div
                id="warning" ref={notiRef}
                className="absolute top-5 right-5 flex p-4 mb-4 text-sm text-red-800 rounded-lg bg-red-50  hidden"
                role="alert"
            >
                <svg
                    aria-hidden="true"
                    className="flex-shrink-0 inline w-5 h-5 mr-3"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                    xmlns="http://www.w3.org/2000/svg"
                >
                    <path
                        fillRule="evenodd"
                        d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z"
                        clipRule="evenodd"
                    ></path>
                </svg>
                <span className="sr-only">Danger</span>
                <div>
                    <span className="font-medium ">
                        {message}
                    </span>
                </div>
            </div>
        </Fragment>
    )
}