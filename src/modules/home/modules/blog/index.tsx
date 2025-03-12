/* eslint-disable react-hooks/exhaustive-deps */
"use client";

import Image from "next/image";
import { ModalCreateBlog } from "./modal.create";
import { ModalUpdateBlog } from "./modal.update";
import { useEffect, useState } from "react";
import { Loader } from "lucide-react";
import { BlogService } from "@/services/blog";
import { HELPER } from "@/utils/helper";

export interface Blog {
  _id: string;
  title: string;
  content: string;
  tag: string;
  author: string;
  thumbnail: string;
  created_at: string;
}

export default function Blog() {
  const COUNT = 5;

  const [data, setData] = useState<Blog[]>([] as any);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [totalPage, setTotalPage] = useState<number>(0);
  const [currenPage, setCurrenPage] = useState<any>(1 as any);
  const [currenData, setCurrenData] = useState<any>([] as any);

  const selectPage = (pageSelected: any) => {
    setCurrenPage(pageSelected);
    const start = (pageSelected - 1) * COUNT;
    const end = pageSelected * COUNT;
    setCurrenData(data.slice(start, end));
  };

  const prevPage = () => {
    if (currenPage > 1) {
      selectPage(currenPage - 1);
    }
  };

  const nextPage = () => {
    if (currenPage < totalPage) {
      selectPage(currenPage + 1);
    }
  };

  const init = async () => {
    try {
      const res = await BlogService.getAll();

      if (Array.isArray(res) && res.length > 0) {
        setData(res);
        setTotalPage(Math.ceil(res.length / COUNT));
        setCurrenPage(1);
        setCurrenData(res.slice(0, COUNT));
        setIsLoading(false);
      } else {
        setData([]);
        setIsLoading(false);
      }
    } catch (error) {
      console.error("Error fetching blog data:", error);
      setData([]);
      setIsLoading(false);
    }
  };

  useEffect(() => {
    init();
  }, []);

  useEffect(() => {}, [totalPage, isLoading, currenData, currenPage]);

  return (
    <section className="p-4">
      <div className="relative overflow-hidden">
        <div className="flex">
          <div className="flex items-center flex-1">
            <h5>
              <span className="text-gray-800 text-[20px] font-bold">
                DANH SÁCH BÀI VIẾT{" "}
                <span className="text-[rgb(var(--primary-rgb))]">
                  ({data?.length})
                </span>
              </span>
            </h5>
          </div>
          <div className="flex flex-col flex-shrink-0 space-y-3 md:flex-row md:items-center lg:justify-end md:space-y-0 md:space-x-3">
            <ModalCreateBlog />
          </div>
        </div>
        <div className="h-[640px] flex flex-col justify-between">
          {isLoading ? (
            <div className="w-full flex justify-center items-center pt-60">
              <Loader className="animate-spin" size={48} />
            </div>
          ) : currenData.length === 0 ? (
            <div className="col-span-2 text-center w-full flex justify-center items-center py-4">
              <p className="text-gray-500 text-lg">
                Không tìm thấy bài viết nào.
              </p>
            </div>
          ) : (
            <>
              <div className="overflow-x-auto mt-4">
                <table className="w-full text-sm text-left text-gray-500 dark:text-gray-400">
                  <thead className="text-md text-gray-700 uppercase bg-gray-50 border dark:bg-gray-700 dark:text-gray-400">
                    <tr>
                      <th scope="col" className="w-64 px-4 py-3">
                        TIÊU ĐỀ
                      </th>
                      <th scope="col" className="w-32 px-4 py-3">
                        TAG
                      </th>
                      <th scope="col" className="w-80 px-4 py-3">
                        NỘI DUNG
                      </th>
                      <th scope="col" className="w-32 px-4 py-3">
                        TÁC GIẢ
                      </th>
                      <th scope="col" className="w-24 px-4 py-3">
                        NGÀY
                      </th>
                      <th scope="col" className="w-24 px-4 py-3">
                        CHI TIẾT
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {currenData?.map((item: any, index: any) => {
                      return (
                        <tr
                          key={index}
                          className={`${
                            item?.deleted_at ? "hidden" : ""
                          } border-b border-l border-r dark:border-gray-600 hover:bg-gray-100 dark:hover:bg-gray-700`}
                        >
                          <td className="w-64 px-4 py-2 grid grid-cols-12 gap-3 items-center">
                            <Image
                              src={item?.thumbnail}
                              alt="img"
                              className="w-20 h-20 mr-3 object-cover rounded-md col-span-6 border border-gray-300"
                              width={100}
                              height={0}
                            />
                            <span className="col-span-6 text-[14px] line-clamp-2 bg-primary-100 text-gray-900 font-medium py-0.5 rounded dark:bg-primary-900 dark:text-primary-300">
                              {item?.title}
                            </span>
                          </td>
                          <td className="w-32 px-4 py-2">
                            <span className="text-[14px] bg-primary-100 text-gray-900 font-medium py-0.5 rounded dark:bg-primary-900 dark:text-primary-300">
                              {HELPER.renderTag(item?.tag)}
                            </span>
                          </td>
                          <td className="w-80 px-4 py-2">
                            <span className="text-[14px] line-clamp-2 bg-primary-100 text-gray-900 font-medium py-0.5 rounded dark:bg-primary-900 dark:text-primary-300">
                              <div
                                dangerouslySetInnerHTML={{
                                  __html: HELPER.sanitizeContent(item?.content),
                                }}
                              />
                            </span>
                          </td>
                          <td className="w-32 text-[14px] px-4 py-2 font-medium text-gray-900 whitespace-nowrap dark:text-white">
                            {item?.author}
                          </td>
                          <td className="w-24 text-[14px] px-4 py-2 font-medium text-gray-900 whitespace-nowrap dark:text-white">
                            {HELPER.formatDate(item?.created_at)}
                          </td>
                          <td className="w-24 text-[14px] px-4 py-2 font-medium text-gray-900 whitespace-nowrap dark:text-white">
                            <ModalUpdateBlog data={item} />
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
              <nav
                className="flex flex-col items-start justify-center mt-4 p-4 space-y-3 md:flex-row md:items-center md:space-y-0"
                aria-label="Table navigation"
              >
                <ul className="inline-flex items-stretch -space-x-px">
                  <li>
                    <button
                      onClick={prevPage}
                      disabled={currenPage === 1}
                      className="flex items-center justify-center h-full py-1.5 px-3 ml-0 text-gray-500 bg-white rounded-l-lg border border-gray-300 hover:bg-gray-100 hover:text-gray-700 dark:bg-gray-800 dark:border-gray-700 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-white"
                    >
                      <span className="sr-only">Previous</span>
                      <svg
                        className="w-5 h-5"
                        aria-hidden="true"
                        fill="currentColor"
                        viewBox="0 0 20 20"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <path
                          fillRule="evenodd"
                          d="M12.707 5.293a1 1 0 010 1.414L9.414 10l3.293 3.293a1 1 0 01-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z"
                          clipRule="evenodd"
                        />
                      </svg>
                    </button>
                  </li>
                  {Array.from({ length: totalPage }, (_, i) => i + 1)?.map(
                    (item: any, index: any) => {
                      return (
                        <li key={index} onClick={() => selectPage(item)}>
                          <a
                            href="#"
                            className={`${
                              item === currenPage
                                ? "bg-gradient-to-r from-cyan-500 to-blue-500 text-white hover:text-white hover:bg-gradient-to-bl"
                                : "bg-white"
                            } flex items-center justify-center px-3 py-2 text-sm leading-tight text-gray-500 border border-gray-300 hover:bg-gray-100 hover:text-gray-700 dark:bg-gray-800 dark:border-gray-700 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-white`}
                          >
                            {item}
                          </a>
                        </li>
                      );
                    }
                  )}
                  <li>
                    <button
                      onClick={nextPage}
                      disabled={currenPage === totalPage}
                      className="flex items-center justify-center h-full py-1.5 px-3 leading-tight text-gray-500 bg-white rounded-r-lg border border-gray-300 hover:bg-gray-100 hover:text-gray-700 dark:bg-gray-800 dark:border-gray-700 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-white"
                    >
                      <span className="sr-only">Next</span>
                      <svg
                        className="w-5 h-5"
                        aria-hidden="true"
                        fill="currentColor"
                        viewBox="0 0 20 20"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <path
                          fillRule="evenodd"
                          d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z"
                          clipRule="evenodd"
                        />
                      </svg>
                    </button>
                  </li>
                </ul>
              </nav>
            </>
          )}
        </div>
      </div>
    </section>
  );
}
