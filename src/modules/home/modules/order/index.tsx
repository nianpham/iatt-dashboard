/* eslint-disable react-hooks/exhaustive-deps */
"use client"

import Image from "next/image"
import { useEffect, useState } from "react"
import { Loader } from "lucide-react"

export default function Order() {

    const COUNT = 6

    const [data, setData] = useState([] as any)
    const [isLoading, setIsLoading] = useState<boolean>(false)
    const [totalPage, setTotalPage] = useState<number>(0)
    const [currenPage, setCurrenPage] = useState<any>(1 as any)
    const [currenData, setCurrenData] = useState<any>([] as any)

    const selectPage = (pageSelected: any) => {
        setCurrenPage(pageSelected)
        const start = (pageSelected - 1) * COUNT
        const end = pageSelected * COUNT
        setCurrenData(data.slice(start, end))
    }

    const render = (data: any) => {
        setData(data)
        setTotalPage(Math.ceil(data.length / COUNT))
        setCurrenPage(1)
        setCurrenData(data.slice(0, COUNT))
    }

    const init = async () => {
        // const res = await ProductService.getAll()
        // if (res && res.data.length > 0) {
        //     render(res.data)
        //     setIsLoading(false)
        // }
    }

    useEffect(() => {
        init()
    }, [])

    useEffect(() => { }, [totalPage, isLoading, currenData, currenPage])

    return (
        <section className="p-4">
            <div className="relative overflow-hidden">
                <div className="flex">
                    <div className="flex items-start flex-1">
                        <h5>
                            <span className="text-gray-800 text-[20px] font-bold">DANH SÁCH ĐƠN HÀNG ({data?.length})</span>
                        </h5>
                    </div>
                </div>
                <div className="overflow-x-auto mt-4">
                </div>
                {
                    isLoading
                        ?
                        <div className="w-full flex justify-center items-center pt-60">
                            <Loader className="animate-spin" size={48} />
                        </div>
                        :
                        <nav className="flex flex-col items-start justify-center mt-4 p-4 space-y-3 md:flex-row md:items-center md:space-y-0" aria-label="Table navigation">
                            {/* <ul className="inline-flex items-stretch -space-x-px">
                                <li>
                                    <a href="#" className="flex items-center justify-center h-full py-1.5 px-3 ml-0 text-gray-500 bg-white rounded-l-lg border border-gray-300 hover:bg-gray-100 hover:text-gray-700 dark:bg-gray-800 dark:border-gray-700 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-white">
                                        <span className="sr-only">Previous</span>
                                        <svg className="w-5 h-5" aria-hidden="true" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                                            <path fillRule="evenodd" d="M12.707 5.293a1 1 0 010 1.414L9.414 10l3.293 3.293a1 1 0 01-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z" clipRule="evenodd" />
                                        </svg>
                                    </a>
                                </li>
                                {
                                    Array.from({ length: totalPage }, (_, i) => i + 1)?.map((item: any, index: any) => {
                                        return (
                                            <li key={index} onClick={() => selectPage(item)}>
                                                <a href="#" className={`${item === currenPage ? 'bg-orange-100' : 'bg-white'} flex items-center justify-center px-3 py-2 text-sm leading-tight text-gray-500 border border-gray-300 hover:bg-gray-100 hover:text-gray-700 dark:bg-gray-800 dark:border-gray-700 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-white`}>
                                                    {item}
                                                </a>
                                            </li>
                                        )
                                    })
                                }
                                <li>
                                    <a href="#" className="flex items-center justify-center h-full py-1.5 px-3 leading-tight text-gray-500 bg-white rounded-r-lg border border-gray-300 hover:bg-gray-100 hover:text-gray-700 dark:bg-gray-800 dark:border-gray-700 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-white">
                                        <span className="sr-only">Next</span>
                                        <svg className="w-5 h-5" aria-hidden="true" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                                            <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd" />
                                        </svg>
                                    </a>
                                </li>
                            </ul> */}
                        </nav>
                }
            </div>
        </section>
    )
}
