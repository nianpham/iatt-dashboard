"use client";

import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { Loader } from "lucide-react";
import { useState } from "react";
import Cookies from "js-cookie";
import { ROUTES } from "@/utils/route";

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
    <div className="w-full h-screen flex justify-center items-center">
      <div className="w-1/4 rounded-lg border border-gray-300 p-8 bg-white">
        <h2 className="text-center mb-4 text-xl font-bold text-black dark:text-white sm:text-title-xl2">
          ĐĂNG NHẬP
        </h2>
        <div className="mb-4">
          <label className="mb-2.5 block font-medium text-black dark:text-white">
            Tài khoản
          </label>
          <div className="relative">
            <input
              type="text"
              className="w-full rounded-lg border border-stroke bg-transparent py-2 pl-4 pr-10 text-black outline-none focus:border-primary focus-visible:shadow-none dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary"
              onChange={(e) => setUsername(e.target.value)}
            />
          </div>
        </div>
        <div className="mb-6">
          <label className="mb-2.5 block font-medium text-black dark:text-white">
            Mật khẩu
          </label>
          <div className="relative">
            <input
              id="id_password"
              className="w-full rounded-lg border border-stroke bg-transparent py-2 pl-4 pr-10 text-black outline-none focus:border-primary focus-visible:shadow-none dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary"
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>
        </div>
        <div className="">
          <Button
            className="w-full !rounded-lg bg-orange-700 hover:bg-orange-800"
            onClick={handleSubmit}
          >
            Đăng nhập
            {isLoading && <Loader className="animate-spin" size={48} />}
          </Button>
        </div>
      </div>
    </div>
  );
}
