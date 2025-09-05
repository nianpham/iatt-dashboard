import { HELPER } from "@/utils/helper";
import Image from "next/image";
import React from "react";

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
  avatar: string;
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
}

const CustomerCard: React.FC<{ customer: UserData }> = ({ customer }) => {
  return (
    <div className="cursor-pointer group relative bg-white overflow-hidden flex flex-row gap-5 transition-all duration-300 hover:bg-gray-100 rounded-lg px-4 py-2">
      {/* Product Image Container */}
      <div className="relative overflow-hidden flex items-center justify-center">
        <div className="w-24 h-24 flex items-center justify-center bg-gradient-to-br from-gray-100 to-gray-200 rounded-full">
          <Image
            src={customer.avatar}
            alt={customer.name}
            width={1000}
            height={1000}
            className={`object-cover rounded-full`}
          />
        </div>
      </div>

      {/* Product Info */}
      <div className="py-4 flex flex-row justify-between items-center h-full">
        <div className="flex flex-col justify-between items-start">
          <h3 className="font-bold text-gray-900 mb-0 text-[16px] lg:text-xl h-full line-clamp-2">
            {customer.name}
          </h3>
          <div className="flex items-center space-x-2">
            <div>{customer.email ? customer.email : "Chưa có email."}</div>
          </div>
          <div className="flex items-center space-x-2">
            <div>
              {customer.phone ? customer.phone : "Chưa có số điện thoại."}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CustomerCard;
