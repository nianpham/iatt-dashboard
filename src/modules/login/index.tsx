"use client";

import React, { useState } from "react";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { IMAGES } from "@/utils/image";
import Cookies from "js-cookie";
import { ROUTES } from "@/utils/route";
import { Loader } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

export default function LoginClient() {
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  const validateForm = () => {
    if (username === "" || password === "") {
      toast({
        variant: "destructive",
        title: "Vui lòng điền đầy đủ thông tin",
      });
      return false;
    } else {
      return true;
    }
  };

  const handleSubmit = async () => {
    if (!validateForm()) return;
    setIsLoading(true);
    if (username === "inanhtructuyen" && password === "Iatt@6789") {
      setTimeout(() => {
        Cookies.set("isLogin", "true", { expires: 7 });
        window.location.href = ROUTES.HOME;
        setIsLoading(false);
      }, 2000);
    } else {
      setIsLoading(false);
      toast({
        variant: "destructive",
        title: "Tài khoản hoặc mật khẩu chưa chính xác",
      });
    }
  };

  return (
    <div className="w-full h-screen flex flex-col justify-center items-center p-60">
      <div className="flex w-3/4 bg-slate-100 rounded-xl">
        <div className="w-1/2 p-8 flex flex-col">
          <div className="mb-4">
            <div className="flex justify-start items-center gap-4">
              <Image src={IMAGES.LOGO} alt="Logo" width={40} height={40} />
              <h1 className="text-2xl font-bold">In Ảnh Trực Tuyến</h1>
            </div>
          </div>
          <div className="mt-4">
            <div className="space-y-6">
              <div className="space-y-2">
                <label
                  htmlFor="email"
                  className="text-sm font-medium flex items-center"
                >
                  Tài khoản <span className="text-blue-600 ml-1">*</span>
                </label>
                <input
                  id="email"
                  type="text"
                  placeholder="Nhập tên tài khoản"
                  className="w-full p-3 rounded-md border"
                  onChange={(e) => setUsername(e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <label
                  htmlFor="password"
                  className="text-sm font-medium flex items-center"
                >
                  Mật khẩu <span className="text-blue-600 ml-1">*</span>
                </label>
                <div className="relative">
                  <input
                    id="password"
                    type="password"
                    placeholder="Nhập mật khẩu"
                    className="w-full p-3 rounded-md border pr-10"
                    onChange={(e) => setPassword(e.target.value)}
                  />
                </div>
              </div>
              <Button
                onClick={() => handleSubmit()}
                className="w-full text-[14px py-6 bg-indigo-600 hover:bg-indigo-700 text-white rounded-md"
              >
                {isLoading ? "Vui lòng đợi" : "Đăng nhập"}{" "}
                {isLoading && <Loader className="animate-spin" size={48} />}
              </Button>
            </div>
          </div>
        </div>
        <div className="hidden md:block md:w-1/2 bg-indigo-600 relative overflow-hidden rounded-br-xl rounded-tr-xl">
          <div className="absolute inset-0">
            <div className="grid grid-cols-2 grid-rows-3 h-full w-full">
              <div className="bg-indigo-500 relative">
                <div className="absolute bottom-0 right-0 w-full h-full">
                  <div className="absolute bottom-0 right-0 w-3/4 h-3/4 bg-indigo-400 rounded-tl-full"></div>
                </div>
              </div>
              <div className="bg-indigo-900 relative p-6">
                <div className="flex justify-center mb-4">
                  <div className="flex space-x-1">
                    <div className="w-4 h-4 bg-yellow-400 rotate-45"></div>
                    <div className="w-4 h-4 bg-orange-400 rotate-45"></div>
                  </div>
                </div>
                <div className="space-y-3">
                  <div className="w-full h-1 bg-indigo-400"></div>
                  <div className="flex space-x-0.5">
                    {Array(20)
                      .fill(0)
                      .map((_, i) => (
                        <div key={i} className="w-0.5 h-3 bg-indigo-400"></div>
                      ))}
                  </div>
                  <div className="w-full h-1 bg-indigo-400"></div>
                  <div className="w-3/4 h-1 bg-indigo-400"></div>
                </div>
                <div className="absolute top-0 right-0 grid grid-cols-4 grid-rows-4 gap-0.5">
                  {Array(16)
                    .fill(0)
                    .map((_, i) => (
                      <div
                        key={i}
                        className="w-1 h-1 bg-indigo-400 rounded-full"
                      ></div>
                    ))}
                </div>
              </div>
              <div className="col-span-2 relative">
                <div className="absolute left-1/4 top-0 transform -translate-x-1/2">
                  <div className="flex flex-col items-center">
                    <div className="w-8 h-8 bg-indigo-400 rotate-45 mb-1"></div>
                    <div className="w-8 h-8 bg-indigo-400 rotate-45"></div>
                  </div>
                </div>
                <div className="absolute right-1/4 bottom-0">
                  <div className="w-12 h-12 bg-yellow-400 rounded-full"></div>
                </div>
                <div className="absolute left-1/4 bottom-1/4">
                  <div className="w-16 h-16 bg-cyan-400"></div>
                </div>
              </div>
              <div className="col-span-2 relative">
                <div className="absolute bottom-0 right-0 w-1/3 h-full rounded-tl-full bg-indigo-900"></div>
                <div className="absolute bottom-1/4 right-1/4 flex space-x-1">
                  {Array(4)
                    .fill(0)
                    .map((_, i) => (
                      <div
                        key={i}
                        className="w-2 h-2 bg-indigo-300 rounded-full opacity-50"
                      ></div>
                    ))}
                </div>
                <div className="absolute bottom-0 right-0 flex flex-col items-center justify-center w-1/3 h-1/3">
                  {Array(3)
                    .fill(0)
                    .map((_, i) => (
                      <div
                        key={i}
                        className="w-16 h-0.5 my-1 bg-indigo-400"
                      ></div>
                    ))}
                </div>
                <div className="absolute bottom-0 right-1/2 grid grid-cols-3 grid-rows-3 gap-1">
                  {Array(9)
                    .fill(0)
                    .map((_, i) => (
                      <div
                        key={i}
                        className="w-1 h-1 bg-white rounded-full"
                      ></div>
                    ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
