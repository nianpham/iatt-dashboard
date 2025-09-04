import { HELPER } from "@/utils/helper";
import Image from "next/image";

interface Product {
  _id: string;
  name: string;
  description: string;
  introduction: string;
  product_option: [
    {
      size: string;
      price: string;
    }
  ];
  category: string;
  color: string[];
  thumbnail: string;
  images: string[];
  sold: number;
  created_at: string;
}

const ProductCard: React.FC<{ product: Product }> = ({ product }) => {
  return (
    <div className="cursor-pointer group relative bg-white overflow-hidden transition-all duration-300">
      {Number(product._id.charAt(7)) % 2 !== 0 && (
        <div className="absolute top-4 left-4 z-10">
          <span className="bg-amber-600 text-white text-xs font-semibold px-3 py-1 rounded">
            Khuyến mãi
          </span>
        </div>
      )}

      {/* Product Image Container */}
      <div className="relative aspect-square overflow-hidden">
        <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-gray-100 to-gray-200">
          <Image
            src={product.thumbnail}
            alt={product.name}
            layout="fill"
            objectFit="cover"
            className={`transition-opacity duration-300 ${
              product.images[1]
                ? "group-hover:opacity-0"
                : "group-hover:opacity-100"
            }`}
          />
          {product.images[1] && (
            <Image
              src={product.images[1]}
              alt={`${product.name} hover`}
              layout="fill"
              objectFit="cover"
              className="opacity-0 group-hover:opacity-100 transition-opacity duration-300"
            />
          )}
        </div>
      </div>

      {/* Product Info */}
      <div className="py-4 flex flex-row justify-between items-end h-full">
        <div className="flex flex-col justify-between h-[72px]">
          <h3 className="font-light text-gray-900 mb-1 text-[16px] lg:text-[16px] h-full line-clamp-2 leading-6">
            {product.name}
          </h3>
          <div className="flex items-center space-x-2">
            <span className="text-[16px] lg:text-[16px] font-semibold text-gray-900 ">
              {HELPER.formatVND(product.product_option[0].price)}
            </span>
            {Number(product._id.charAt(7)) % 2 !== 0 && (
              <span className="text-[12px] lg:text-[12px] text-gray-500 line-through">
                {HELPER.formatVND(
                  HELPER.upPrice(product.product_option[0].price)
                )}
              </span>
            )}
          </div>
        </div>

        {/* Color Options for Arctander Chair */}
        <div className="flex space-x-2 mt-3">
          {product.color.slice(0, 3).map((color, index) => (
            <div
              key={index}
              className={`w-4 h-4 ${HELPER.renderColor(
                color
              )} rounded-full border border-gray-200`}
            ></div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ProductCard;
