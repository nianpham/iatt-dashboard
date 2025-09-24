"use client";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogClose,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { BlogService } from "@/services/blog";
import { UploadService } from "@/services/upload";
import { ImageUp, Loader, Plus, Upload } from "lucide-react";
import Image from "next/image";
import React, { useCallback, useRef, useState } from "react";
import { AccountService } from "@/services/account";
import { IMAGES } from "@/utils/image";

export interface Province {
  code: number;
  codename: string;
  districts: District[];
  division_type: string;
  name: string;
  phone_code: number;
}

export interface District {
  code: number;
  codename: string;
  division_type: string;
  name: string;
  short_codename: string;
  wards: Ward[];
}

export interface Ward {
  code: number;
  codename: string;
  division_type: string;
  name: string;
  short_codename: string;
}

export interface UserData {
  _id?: string;
  name: string;
  email: string;
  phone: string;
  password: string;
  address: string;
  ward?: string | number;
  district?: string | number;
  province?: string | number;
  provinceName?: string;
  districtName?: string;
  wardName?: string;
}

export interface FormData extends UserData {
  ward: number;
  district: number;
  province: number;
  active: boolean;
}

export function ModalCreateCustomer() {
  const { toast } = useToast();

  const mainImageInputRef = useRef<HTMLInputElement>(null);

  const [isLoading, setIsLoading] = useState<boolean>(false);

  const [mainPreview, setMainPreview] = useState<string | null>(null);

  const [openProvinces, setOpenProvinces] = useState(false);
  const [openDistrict, setOpenDistrict] = useState(false);
  const [openWard, setOpenWard] = useState(false);
  const [province, setProvince] = useState("");
  const [district, setDistrict] = useState("");
  const [ward, setWard] = useState("");
  const [provinces, setProvinces] = useState<Province[]>([]);
  const [districts, setDistricts] = useState<District[]>([]);
  const [wards, setWards] = useState<Ward[]>([]);
  const [loading, setLoading] = useState(false);
  const [provinceSearchTerm, setProvinceSearchTerm] = useState("");
  const [districtSearchTerm, setDistrictSearchTerm] = useState("");
  const [wardSearchTerm, setWardSearchTerm] = useState("");
  const [formData, setFormData] = useState<FormData>({
    name: "",
    email: "",
    phone: "",
    password: "",
    address: "",
    ward: 0,
    district: 0,
    province: 0,
    active: true,
  });

  React.useEffect(() => {
    if (formData.province) {
      const selectedProvince = provinces.find(
        (p) => Number(p.code) === formData.province
      );
      if (selectedProvince) {
        setDistricts(selectedProvince.districts);
        const selectedDistrict = selectedProvince.districts.find(
          (d) => Number(d.code) === formData.district
        );
        setProvince(selectedProvince.name);
        if (selectedDistrict) {
          setDistrict(selectedDistrict.name);
          setWards(selectedDistrict.wards);
          const selectedWard = selectedDistrict.wards.find(
            (w) => Number(w.code) === formData.ward
          );

          if (selectedWard) {
            setWard(selectedWard.name);
          }
        }
      }
    }
  }, [formData.province, formData.district, provinces, formData.ward]);

  React.useEffect(() => {
    const fetchProvinces = async () => {
      try {
        setLoading(true);
        const response = await fetch(
          "https://provinces.open-api.vn/api/?depth=3"
        );
        const data = await response.json();
        const formattedData = data.map((province: any) => ({
          ...province,
          code: province.code.toString(),
          districts: province.districts.map((district: any) => ({
            ...district,
            code: district.code.toString(),
            wards: district.wards.map((ward: any) => ({
              ...ward,
              code: ward.code.toString(),
            })),
          })),
        }));
        setProvinces(formattedData);
      } catch (error) {
        console.error("Error fetching provinces:", error);
        toast({
          title: "Lỗi",
          description: "Không thể tải dữ liệu tỉnh/thành phố",
          variant: "destructive",
        });
      } finally {
        setLoading(false);
      }
    };
    fetchProvinces();
  }, [toast]);

  React.useEffect(() => {
    if (formData.province && provinces.length > 0) {
      const selectedProvince = provinces.find(
        (p) => Number(p.code) === formData.province
      );
      if (selectedProvince) {
        setProvince(selectedProvince.name);
        setDistricts(selectedProvince.districts);

        if (formData.district) {
          const selectedDistrict = selectedProvince.districts.find(
            (d) => Number(d.code) === formData.district
          );
          if (selectedDistrict) {
            setDistrict(selectedDistrict.name);
            setWards(selectedDistrict.wards);

            if (formData.ward) {
              const selectedWard = selectedDistrict.wards.find(
                (w) => Number(w.code) === formData.ward
              );
              if (selectedWard) {
                setWard(selectedWard.name);
              } else {
                setWard("Vui lòng chọn Phường/Xã");
                setFormData((prev) => ({ ...prev, ward: 0 }));
              }
            } else {
              setWard("Vui lòng chọn Phường/Xã");
              setFormData((prev) => ({ ...prev, ward: 0 }));
            }
          } else {
            setDistrict("Vui lòng chọn Quận/Huyện");
            setWards([]);
            setFormData((prev) => ({ ...prev, district: 0, ward: 0 }));
          }
        } else {
          setDistrict("Vui lòng chọn Quận/Huyện");
          setWards([]);
          setFormData((prev) => ({ ...prev, district: 0, ward: 0 }));
        }
      } else {
        setProvince("Vui lòng chọn Tỉnh/Thành phố");
        setDistricts([]);
        setWards([]);
        setFormData((prev) => ({ ...prev, province: 0, district: 0, ward: 0 }));
      }
    }
  }, [formData.province, formData.district, formData.ward, provinces]);

  const handleProvinceChange = (provinceCode: string) => {
    // setFormData((prev) => ({
    //   ...prev,
    //   province: provinceCode,
    //   district: "",
    //   ward: "",
    // }));

    const selectedProvince = provinces.find(
      (p) => Number(p.code) === Number(provinceCode)
    );
    if (selectedProvince) {
      setDistricts(selectedProvince.districts);
      setWards([]);
      setFormData((prev) => ({
        ...prev,
        province: Number(provinceCode),
        district: 0,
        ward: 0,
      }));
      setProvince(selectedProvince.name);
      setDistrict("Vui lòng chọn Quận/Huyện");
      setWard("Vui lòng chọn Phường/Xã");
      setOpenProvinces(false);
    } else {
      setDistricts([]);
      setWards([]);
      setFormData((prev) => ({ ...prev, province: 0, district: 0, ward: 0 }));
      setProvince("Vui lòng chọn Tỉnh/Thành phố");
      setDistrict("Vui lòng chọn Quận/Huyện");
      setWard("Vui lòng chọn Phường/Xã");
    }
  };

  const handleDistrictChange = (districtCode: string) => {
    // setFormData((prev) => ({
    //   ...prev,
    //   district: districtCode,
    //   ward: "",
    // }));

    const selectedDistrict = districts.find(
      (d) => Number(d.code) === Number(districtCode)
    );
    if (selectedDistrict) {
      setWards(selectedDistrict.wards || []);
      setFormData((prev) => ({
        ...prev,
        district: Number(districtCode),
        ward: 0,
      }));
      setDistrict(selectedDistrict.name);
      setWard("Vui lòng chọn Phường/Xã");
      setOpenDistrict(false);
    } else {
      setWards([]);
      setFormData((prev) => ({ ...prev, district: 0, ward: 0 }));
      setDistrict("Vui lòng chọn Quận/Huyện");
      setWard("Vui lòng chọn Phường/Xã");
    }
  };

  const handleWardChange = (wardCode: string) => {
    // setFormData((prev) => ({
    //   ...prev,
    //   ward: wardCode,
    // }));

    const selectedWard = wards.find((w) => Number(w.code) === Number(wardCode));
    if (selectedWard) {
      setFormData((prev) => ({
        ...prev,
        ward: Number(wardCode),
      }));
      setWard(selectedWard.name);
      setOpenWard(false);
    } else {
      setFormData((prev) => ({ ...prev, ward: 0 }));
      setWard("Vui lòng chọn Phường/Xã");
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleProvinceSearchChange = (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    setProvinceSearchTerm(e.target.value);
  };

  const handleDistrictSearchChange = (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    setDistrictSearchTerm(e.target.value);
  };

  const handleWardSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setWardSearchTerm(e.target.value);
  };

  const handleMainImageChange = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const file = event.target.files?.[0];
    if (!file) return;
    if (file.size > 5 * 1024 * 1024) {
      alert("File quá lớn. Vui lòng chọn file nhỏ hơn 5MB");
      return;
    }
    if (!file.type.startsWith("image/")) {
      alert("Vui lòng chọn file hình ảnh");
      return;
    }
    const reader = new FileReader();
    reader.onloadend = () => {
      setMainPreview(reader.result as string);
    };
    reader.readAsDataURL(file);
  };

  const handleUpdateMainImage = () => {
    mainImageInputRef.current?.click();
  };

  const validateForm = () => {
    if (!formData.address.trim()) {
      toast({
        title: "Lỗi",
        description: "Vui lòng nhập địa chỉ giao hàng!",
        variant: "destructive",
      });
      return false;
    }

    if (!formData.province || !formData.district || !formData.ward) {
      toast({
        title: "Lỗi",
        description:
          "Vui lòng chọn đầy đủ Tỉnh/Thành phố, Quận/Huyện, Phường/Xã.",
        variant: "destructive",
      });
      return false;
    }

    if (!formData.name.trim()) {
      toast({
        title: "Lỗi",
        description: "Vui lòng nhập tên!",
        variant: "destructive",
      });
      return false;
    }

    if (!formData.password.trim()) {
      toast({
        title: "Lỗi",
        description: "Vui lòng password!",
        variant: "destructive",
      });
      return false;
    }

    if (!formData.phone.trim()) {
      toast({
        title: "Lỗi",
        description: "Vui lòng nhập số điện thoại!",
        variant: "destructive",
      });
      return false;
    }

    const phoneRegex = /^\d{10,11}$/;
    if (!phoneRegex.test(formData.phone)) {
      toast({
        title: "Lỗi",
        description:
          "Số điện thoại phải là một dãy số hợp lệ (10 đến 11 chữ số)!",
        variant: "destructive",
      });
      return false;
    }
    return true;
  };

  const handleImageUpload = useCallback(async (file: File) => {
    const formData = new FormData();
    formData.append("file", file);
    try {
      const uploadResponse = await UploadService.uploadToCloudinary([file]);
      if (
        uploadResponse &&
        Array.isArray(uploadResponse) &&
        uploadResponse[0]
      ) {
        return uploadResponse[0]?.secure_url;
      } else {
        console.error("Upload failed or response is not as expected");
        return "";
      }
    } catch (error) {
      console.error("Image upload failed:", error);
      return "";
    }
  }, []);

  const extractBase64Images = (htmlContent: string) => {
    const imgTagRegex =
      /<img[^>]+src=["'](data:image\/[^;]+;base64[^"']+)["'][^>]*>/g;
    const matches = [...htmlContent.matchAll(imgTagRegex)];
    return matches.map((match) => match[1]);
  };

  const replaceBase64WithCloudUrls = async (
    htmlContent: string,
    uploadFunc: (file: File) => Promise<string>
  ) => {
    const imgTagRegex =
      /<img[^>]+src=["'](data:image\/[^;]+;base64[^"']+)["'][^>]*>/g;
    let updatedContent = htmlContent;

    const matches = [...htmlContent.matchAll(imgTagRegex)];
    for (const match of matches) {
      const base64String = match[1];
      const file = base64ToFile(base64String);
      const uploadedUrl = await uploadFunc(file);
      updatedContent = updatedContent.replace(base64String, uploadedUrl);
    }

    return updatedContent;
  };

  const base64ToFile = (base64String: string): File => {
    const arr = base64String.split(",");
    const mime = arr[0].match(/:(.*?);/)?.[1];
    const bstr = atob(arr[1]);
    let n = bstr.length;
    const u8arr = new Uint8Array(n);
    while (n--) {
      u8arr[n] = bstr.charCodeAt(n);
    }
    return new File([u8arr], "image.png", { type: mime });
  };

  const handleSubmit = async () => {
    if (!validateForm()) return;
    setIsLoading(true);

    const uploadMainImage: any = await UploadService.uploadToCloudinary([
      mainPreview,
    ]);

    const selectedProvince = provinces.find(
      (p) => Number(p.code) === formData.province
    );
    const selectedDistrict = districts.find(
      (d) => Number(d.code) === formData.district
    );
    const selectedWard = wards.find((w) => Number(w.code) === formData.ward);

    const formattedData = {
      ...formData,
      provinceName: selectedProvince?.name || "",
      districtName: selectedDistrict?.name || "",
      wardName: selectedWard?.name || "",
      avatar: uploadMainImage[0]?.url || IMAGES.DEFAULT_AVT,
      role: "personal",
    };

    const response = await AccountService.createClientAccount(formattedData);
    if (response === false) {
      toast({
        title: "Lỗi",
        description: "Số điện thoại đã được sử dụng!",
        variant: "destructive",
      });
      setIsLoading(false);
    } else {
      toast({
        title: "Thành công",
        description: "Cập nhật thông tin thành công!",
        className: "bg-green-500 text-white",
      });
      setIsLoading(false);
      window.location.href = "/?tab=customer";
    }
  };

  return (
    <Dialog>
      <DialogTrigger asChild>
        <button
          type="button"
          className="flex items-center justify-center text-white bg-indigo-600 hover:opacity-80 font-medium rounded-lg text-sm px-5 py-2.5 text-center"
        >
          <Plus size={16} className="mr-2" /> Thêm khách hàng
        </button>
      </DialogTrigger>
      <DialogContent
        className="sm:max-w-[1200px]"
        onOpenAutoFocus={(e) => e.preventDefault()}
      >
        <DialogHeader>
          <DialogTitle>
            <span className="!text-[20px]">Thêm khách hàng mới</span>
          </DialogTitle>
          <DialogDescription>
            <span className="!text-[16px]">
              Điền thông tin khách hàng và nhấn{" "}
              <strong className="text-indigo-600">Lưu</strong> để tạo khách hàng
              mới.
            </span>
          </DialogDescription>
        </DialogHeader>
        <div className="w-full grid grid-cols-3 gap-8">
          <div className="col-span-1">
            <div className="mb-6">
              <Label htmlFor="thumbnail" className="text-right !text-[16px]">
                Ảnh đại diện
              </Label>
              <div className="mt-2">
                {!mainPreview && (
                  <div
                    onClick={handleUpdateMainImage}
                    className="flex w-full items-center justify-center gap-2 rounded-lg border-2 border-dashed border-gray-300 bg-white px-5 py-16 text-sm font-medium text-gray-900 hover:bg-gray-50 hover:text-primary-700 cursor-pointer"
                  >
                    <div className="flex flex-col items-center">
                      <span>+ Tải hình lên</span>
                      <span className="text-xs text-gray-500">
                        hoặc kéo thả file vào đây
                      </span>
                    </div>
                  </div>
                )}
                <input
                  type="file"
                  ref={mainImageInputRef}
                  onChange={handleMainImageChange}
                  accept="image/*"
                  className="hidden"
                />
                {mainPreview && (
                  <div className="mt-2">
                    <div className="relative group w-full h-80">
                      <div className="absolute top-0 left-0 right-0 bottom-0 group-hover:bg-black rounded-md opacity-25 z-0 transform duration-200"></div>
                      <div className="cursor-pointer absolute top-[43%] left-[43%] hidden group-hover:flex z-10 transform duration-200">
                        <div className="bg-indigo-600 hover:bg-indigo-700 p-2 rounded-full">
                          <Upload
                            onClick={handleUpdateMainImage}
                            color="white"
                            size={30}
                          />
                        </div>
                      </div>
                      <Image
                        src={mainPreview}
                        alt="main-preview"
                        className="w-full h-full object-cover rounded-md mt-2 border border-gray-200"
                        width={1000}
                        height={1000}
                      />
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
          <div className="flex flex-col justify-start items-start gap-2 col-span-2 overflow-y-auto hide-scrollbar max-h-[65vh] px-2 pb-2">
            <div className="w-full">
              <Label htmlFor="name" className="text-[16px]">
                Họ và tên
              </Label>
              <Input
                id="name"
                name="name"
                value={formData.name}
                onChange={handleInputChange}
                className="mt-2 focus:border-none focus:!ring-2 focus:!ring-indigo-700 outline-none h-[40px]"
                style={{ fontSize: "16px" }}
                placeholder="Nhập họ và tên"
              />
            </div>
            <div className="w-full">
              <Label htmlFor="email" className="text-[16px]">
                Email
              </Label>
              <Input
                id="email"
                name="email"
                type="email"
                value={formData.email}
                onChange={handleInputChange}
                style={{ fontSize: "16px" }}
                className="mt-2 h-[40px] focus:border-none focus:!ring-2 focus:!ring-indigo-700 outline-none"
                placeholder="Nhập Email"
              />
            </div>
            <div className="w-full">
              <Label htmlFor="phone" className="text-[16px]">
                Số điện thoại
              </Label>
              <Input
                id="phone"
                name="phone"
                value={formData.phone}
                onChange={handleInputChange}
                className="mt-2 focus:border-none focus:!ring-2 focus:!ring-indigo-700 outline-none h-[40px]"
                style={{ fontSize: "16px" }}
                placeholder="Nhập số điện thoại"
              />
            </div>
            <div className="w-full">
              <Label htmlFor="name" className="text-[16px]">
                Password
              </Label>
              <Input
                id="password"
                name="password"
                value={formData.password}
                onChange={handleInputChange}
                className="mt-2 focus:border-none focus:!ring-2 focus:!ring-indigo-700 outline-none h-[40px]"
                style={{ fontSize: "16px" }}
                placeholder="Nhập password"
              />
            </div>
            <div className="w-full">
              <Label htmlFor="province" className="text-[16px]">
                Tỉnh/Thành phố
              </Label>
              <Select
                value={formData.province ? String(formData.province) : ""}
                onValueChange={handleProvinceChange}
                disabled={loading}
              >
                <SelectTrigger className="mt-2 text-[16px] focus:border-none focus:!ring-2 focus:!ring-indigo-700 outline-none h-[40px]">
                  <SelectValue placeholder="Chọn Tỉnh/Thành phố" />
                </SelectTrigger>
                <SelectContent className="z-[80]">
                  <div className="p-2">
                    <Input
                      placeholder="Tìm kiếm tỉnh/thành phố..."
                      value={provinceSearchTerm}
                      onChange={handleProvinceSearchChange}
                      className="h-8 text-base focus:border-none focus:!ring-2 focus:!ring-indigo-700 outline-none"
                    />
                  </div>
                  {provinces
                    .filter((province) =>
                      province.name
                        .toLowerCase()
                        .includes(provinceSearchTerm.toLowerCase())
                    )
                    .map((province) => (
                      <SelectItem
                        className="!pl-3"
                        key={province.code}
                        value={String(province.code)}
                      >
                        {province.name}
                      </SelectItem>
                    ))}
                </SelectContent>
              </Select>
            </div>
            <div className="w-full">
              <Label htmlFor="district" className="text-[16px]">
                Quận/Huyện
              </Label>
              <Select
                value={formData.district ? String(formData.district) : ""}
                onValueChange={handleDistrictChange}
                disabled={!formData.province || loading}
              >
                <SelectTrigger className="mt-2 text-[16px] focus:border-none focus:!ring-2 focus:!ring-indigo-700 outline-none h-[40px]">
                  <SelectValue placeholder="Chọn Quận/Huyện" />
                </SelectTrigger>
                <SelectContent className="z-[80]">
                  <div className="p-2">
                    <Input
                      placeholder="Tìm kiếm quận/huyện..."
                      value={districtSearchTerm}
                      onChange={handleDistrictSearchChange}
                      className="h-8 text-base focus:border-none focus:!ring-2 focus:!ring-indigo-700 outline-none"
                    />
                  </div>
                  {districts
                    .filter((district) =>
                      district.name
                        .toLowerCase()
                        .includes(districtSearchTerm.toLowerCase())
                    )
                    .map((district) => (
                      <SelectItem
                        className="!pl-3"
                        key={district.code}
                        value={String(district.code)}
                      >
                        {district.name}
                      </SelectItem>
                    ))}
                </SelectContent>
              </Select>
            </div>
            <div className="w-full">
              <Label htmlFor="ward" className="text-[16px]">
                Phường/Xã
              </Label>
              <Select
                value={formData.ward ? String(formData.ward) : ""}
                onValueChange={handleWardChange}
                disabled={!formData.district || loading}
              >
                <SelectTrigger className="mt-2 text-[16px] focus:border-none focus:!ring-2 focus:!ring-indigo-700 outline-none h-[40px]">
                  <SelectValue placeholder="Chọn Phường/Xã" />
                </SelectTrigger>
                <SelectContent className="z-[80]">
                  <div className="p-2">
                    <Input
                      placeholder="Tìm kiếm phường/xã..."
                      value={wardSearchTerm}
                      onChange={handleWardSearchChange}
                      className="h-8 text-base focus:border-none focus:!ring-2 focus:!ring-indigo-700 outline-none"
                    />
                  </div>
                  {wards
                    .filter((ward) =>
                      ward.name
                        .toLowerCase()
                        .includes(wardSearchTerm.toLowerCase())
                    )
                    .map((ward) => (
                      <SelectItem
                        className="!pl-3"
                        key={ward.code}
                        value={String(ward.code)}
                      >
                        {ward.name}
                      </SelectItem>
                    ))}
                </SelectContent>
              </Select>
            </div>
            <div className="w-full">
              <Label htmlFor="address" className="text-[16px]">
                Số nhà, tên đường
              </Label>
              <Input
                id="address"
                name="address"
                placeholder="Ví dụ: 123 Đường ABC"
                value={formData.address}
                onChange={handleInputChange}
                className="mt-2 focus:border-none focus:!ring-2 focus:!ring-indigo-700 outline-none h-[40px]"
                style={{ fontSize: "16px" }}
              />
            </div>
          </div>
        </div>
        <DialogFooter className="px-2">
          <DialogClose asChild>
            <Button
              type="button"
              variant="secondary"
              className="!px-10 !text-[16px]"
            >
              Huỷ
            </Button>
          </DialogClose>
          <button
            type="submit"
            onClick={handleSubmit}
            className="flex flex-row justify-center items-center gap-2 text-white bg-indigo-600 hover:opacity-80 font-medium rounded-md text-sm !px-10 !text-[16px] py-2.5 text-center"
          >
            Lưu
            {isLoading && <Loader className="animate-spin" size={17} />}
          </button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
