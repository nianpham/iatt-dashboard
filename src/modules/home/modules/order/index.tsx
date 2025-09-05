/* eslint-disable react-hooks/exhaustive-deps */
"use client";

import Image from "next/image";
import { useEffect, useState } from "react";
import { Loader } from "lucide-react";
import { OrderService } from "@/services/order";
import { ModalUpdateBlog } from "./modal.update";
import { HELPER } from "@/utils/helper";
import { AccountService } from "@/services/account";
import { ProductService } from "@/services/product";
import { ModalCustomer } from "./modal.customer";

export default function Order() {
  const COUNT = 5;

  const [originalData, setOriginalData] = useState([] as any);
  const [products, setProducts] = useState([] as any);
  const [accounts, setAccounts] = useState([] as any);
  const [data, setData] = useState([] as any);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [totalPage, setTotalPage] = useState<number>(0);
  const [currenPage, setCurrenPage] = useState<any>(1 as any);
  const [currenData, setCurrenData] = useState<any>([] as any);
  const [searchId, setSearchId] = useState<string>("");

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

  const render = (data: any) => {
    setData(data);
    setTotalPage(Math.ceil(data.length / COUNT));
    setCurrenPage(1);
    setCurrenData(data.slice(0, COUNT));
  };

  const renderAccount = async () => {
    const res = await AccountService.getAll();
    if (res && res.data.length > 0) {
      setAccounts(res.data);
      // Remove this line: setOriginalData(res.data);
      // setIsLoading(false);
    }
  };

  const renderProduct = async () => {
    const res = await ProductService.getAllWithDeleted();
    if (res && res.data.length > 0) {
      setProducts(res.data);
      // setIsLoading(false);
    }
  };

  const renderOrder = async () => {
    const res = await OrderService.getAll();
    if (res && res.data.length > 0) {
      const ordersWithTotal = res.data.filter(
        (order: { total: number | null | undefined }) =>
          order.total !== undefined && order.total !== null && order.total > 0
      );
      if (ordersWithTotal.length > 0) {
        setOriginalData(ordersWithTotal);
        render(ordersWithTotal);
      } else {
        setData([]);
        setOriginalData([]);
      }
      // setIsLoading(false);
    } else {
      setData([]);
      setOriginalData([]);
      // setIsLoading(false);
    }
  };

  const init = async () => {
    setIsLoading(true);
    try {
      await Promise.all([renderAccount(), renderProduct(), renderOrder()]);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    init();
  }, []);

  useEffect(() => {}, [
    totalPage,
    isLoading,
    currenData,
    currenPage,
    accounts,
    products,
  ]);

  const searchCustomerById = (id: string) => {
    const trimmedId = id.trim();
    setSearchId(id);

    if (!trimmedId) {
      setData(originalData);
      setTotalPage(Math.ceil(originalData.length / COUNT));
      setCurrenPage(1);
      setCurrenData(originalData.slice(0, COUNT));
      return;
    }

    const filteredData = originalData.filter((order: any) => {
      const customer = accounts?.find(
        (account: any) => account._id.toString() === order?.account_id
      );
      return customer?.name?.toLowerCase().includes(trimmedId.toLowerCase());
    });

    setData(filteredData);
    setTotalPage(Math.ceil(filteredData.length / COUNT));
    setCurrenPage(1);
    setCurrenData(filteredData.slice(0, COUNT));
  };

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    searchCustomerById(value);
  };

  return (
    <section className="p-4">
      <div className="relative overflow-hidden">
        <div className="flex">
          <div className="flex items-center flex-1">
            <h5>
              <span className="text-gray-800 text-[20px] font-bold">
                DANH SÁCH ĐƠN HÀNG{" "}
                <span className="text-indigo-600">({data?.length})</span>
              </span>
            </h5>
          </div>
          <div className="flex flex-row gap-4">
            <div className="w-full sm:w-64">
              <input
                type="text"
                placeholder="Tìm kiếm theo tên KH..."
                value={searchId}
                onChange={handleSearchChange}
                className="h-[40px] w-full focus:outline-none focus:ring-0 border border-gray-300 rounded-md px-3 py-2 text-sm text-gray-700 dark:bg-gray-800 dark:text-gray-300 dark:border-gray-600"
              />
            </div>
            <div>
              <ModalCustomer />
            </div>
          </div>
        </div>
        <div className="h-[640px] flex flex-col justify-between">
          {isLoading ? (
            <div className="w-full flex justify-center items-center pt-72">
              <Loader className="animate-spin text-indigo-600" size={36} />
            </div>
          ) : currenData.length === 0 ? (
            <div className="col-span-2 text-center w-full flex justify-center items-center py-4">
              <p className="text-gray-500 text-lg">
                Không tìm thấy đơn hàng nào.
              </p>
            </div>
          ) : (
            <>
              <div className="overflow-x-auto mt-4">
                <table className="w-full text-sm text-left text-gray-500 dark:text-gray-400">
                  <thead className="text-md text-gray-700 uppercase bg-gray-50 border dark:bg-gray-700 dark:text-gray-400">
                    <tr>
                      <th scope="col" className="w-64 px-4 py-3">
                        Sản phẩm
                      </th>
                      <th scope="col" className="w-40 px-4 py-3">
                        Khách hàng
                      </th>
                      <th scope="col" className="w-32 px-4 py-3">
                        Trạng thái
                      </th>
                      <th scope="col" className="w-40 px-4 py-3">
                        Thành tiền
                      </th>
                      <th scope="col" className="w-32 px-4 py-3">
                        Tổng
                      </th>
                      <th scope="col" className="w-24 px-4 py-3">
                        Chi tiết
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
                          <td className="w-64 px-4 py-2 grid grid-cols-12 items-center">
                            {item?.order_type === "frame" && (
                              <>
                                <Image
                                  src={item?.image}
                                  alt="img"
                                  className="col-span-5 w-20 h-20 object-cover rounded-md border border-gray-300"
                                  width={100}
                                  height={0}
                                />
                              </>
                            )}
                            {item?.order_type === "album" && (
                              <Image
                                src={item?.album_data[0]}
                                alt="img"
                                className="col-span-5 w-20 h-20 object-cover rounded-md border border-gray-300"
                                width={100}
                                height={0}
                              />
                            )}
                            <span className="uppercase w-44 col-span-7 text-[14px] line-clamp-2 leading-[1.7] bg-primary-100 text-gray-900 font-medium rounded dark:bg-primary-900 dark:text-primary-300">
                              {item?.order_type === "album"
                                ? "Album " +
                                  HELPER.renderAlbumCover(item?.album_cover)
                                : // + ", " +
                                  // HELPER.renderAlbumCore(item?.album_core)
                                  products?.find((pro: any) => {
                                    return item?.product_id === pro._id;
                                  })?.name}
                            </span>
                          </td>
                          <td className="w-40 px-4 py-2">
                            <span className="text-[14px] bg-primary-100 text-gray-900 font-medium py-0.5 rounded dark:bg-primary-900 dark:text-primary-300">
                              {
                                accounts?.find(
                                  (pro: any) =>
                                    pro._id.toString() === item?.account_id
                                )?.name
                              }
                            </span>
                          </td>
                          <td
                            className={`w-32 text-[14px] px-4 py-2 font-medium text-gray-900 whitespace-nowrap dark:text-white`}
                          >
                            <span
                              className={`rounded-md px-4 py-2 font-medium text-gray-900 whitespace-nowrap dark:text-white
                        ${
                          item.status === "completed"
                            ? "bg-green-600 text-white"
                            : ""
                        }
                        ${
                          item.status === "delivering"
                            ? "bg-blue-600 text-white"
                            : ""
                        }
                        ${
                          item.status === "waiting"
                            ? "bg-yellow-600 text-white"
                            : ""
                        }
                        ${
                          item.status === "pending"
                            ? "bg-orange-500 text-white"
                            : ""
                        }
                        ${
                          item.status === "paid pending"
                            ? "bg-gray-600 text-white"
                            : ""
                        }
                        ${
                          item.status === "paid"
                            ? "bg-purple-600 text-white"
                            : ""
                        }
                        ${
                          item.status === "cancelled"
                            ? "bg-red-600 text-white"
                            : ""
                        }`}
                            >
                              {HELPER.renderStatus(item?.status)}
                            </span>
                          </td>
                          <td className="w-40 px-4 py-2">
                            <span
                              className={`text-[14px] ${
                                item?.isPayed === true ? " text-green-600" : ""
                              } line-clamp-2 bg-primary-100 text-gray-900 font-medium py-0.5 rounded dark:bg-primary-900 dark:text-primary-300`}
                            >
                              {item?.isPayed === true
                                ? "Đã thanh toán"
                                : "Chưa thanh toán"}
                            </span>
                          </td>
                          <td className="w-32 text-[14px] px-4 py-2 font-medium text-gray-900 whitespace-nowrap dark:text-white">
                            {HELPER.formatVND(item?.total)}
                          </td>
                          <td className="w-24 text-[14px] px-4 py-2 font-medium text-gray-900 whitespace-nowrap dark:text-white">
                            <ModalUpdateBlog
                              data={item}
                              accounts={accounts}
                              products={products}
                            />
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
                {totalPage === 0 ? (
                  <div className="col-span-2 text-center w-full flex justify-center items-center py-40">
                    <p className="text-gray-500 text-lg">Order not found.</p>
                  </div>
                ) : (
                  <ul className="inline-flex items-stretch -space-x-px">
                    <li>
                      <button
                        onClick={prevPage}
                        disabled={currenPage === 1}
                        className="flex items-center justify-center h-full py-1.5 px-3 ml-0 text-gray-500 bg-white rounded-l-lg border border-gray-300 hover:bg-indigo-50 hover:text-gray-700 dark:bg-gray-800 dark:border-gray-700 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-white"
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
                                  ? "bg-indigo-100 hover:bg-indigo-100 text-gray-700"
                                  : "bg-white hover:bg-indigo-50"
                              } flex items-center justify-center px-3 py-2 text-sm leading-tight text-gray-500 border border-gray-300 hover:bg-gray-100 hover:text-gray-700 dark:bg-gray-800 dark:border-gray-700 dark:text-gray-400 dark:hover:bg-gray-700`}
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
                        className="flex items-center justify-center h-full py-1.5 px-3 leading-tight text-gray-500 bg-white rounded-r-lg border border-gray-300 hover:bg-indigo-50 hover:text-gray-700 dark:bg-gray-800 dark:border-gray-700 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-white"
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
                )}
              </nav>
            </>
          )}
        </div>
      </div>
    </section>
  );
}
