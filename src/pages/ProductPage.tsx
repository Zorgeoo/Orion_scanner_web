import { useLocation } from "react-router-dom";
import { useState } from "react";
import { ProductModel } from "@/types/ProductModel";
import CustomButton from "@/components/common/CustomButton";

const ProductPage = () => {
  const location = useLocation();
  const product = location.state?.product as ProductModel | undefined;

  // quantity editable (index 6 in your tuple)
  const [quantity, setQuantity] = useState<number | null>(product?.[6] ?? null);

  if (!product) return <p className="p-4">No product data available</p>;

  return (
    <div className="min-h-screen p-6 max-w-2xl mx-auto space-y-6">
      <h1 className="text-2xl font-bold text-gray-800">{product[1]}</h1>

      <div className="bg-white p-6 rounded-2xl shadow space-y-4">
        {/* Quantity */}
        <div className="flex items-center justify-between">
          <span className="font-medium text-gray-700">Quantity</span>
          <input
            type="number"
            value={quantity ? quantity : ""}
            onChange={(e) => setQuantity(Number(e.target.value))}
            className="w-20 text-center border rounded-lg px-2 py-1 focus:ring-2 focus:ring-blue-500 outline-none"
          />
          <CustomButton title="Хадгалах" />
        </div>

        {/* Price info */}
        <div className="flex justify-between">
          <span className="font-medium text-gray-700">Quantity & Price</span>
          <span className="text-gray-600">{product[2]}</span>
        </div>

        {/* Internal code */}
        <div className="flex justify-between">
          <span className="font-medium text-gray-700">Internal Code</span>
          <span className="text-gray-600">{product[3]}</span>
        </div>

        {/* Product name */}
        <div className="flex justify-between">
          <span className="font-medium text-gray-700">Product Name</span>
          <span className="text-gray-600">{product[4]}</span>
        </div>

        {/* Barcode */}
        <div className="flex justify-between">
          <span className="font-medium text-gray-700">Barcode</span>
          <span className="text-gray-600">{product[5]}</span>
        </div>

        {/* Purchase and Selling price */}
        <div className="flex justify-between">
          <span className="font-medium text-gray-700">Purchase Price</span>
          <span className="text-gray-600">{product[8]}₮</span>
        </div>
        <div className="flex justify-between">
          <span className="font-medium text-gray-700">Selling Price</span>
          <span className="text-gray-600">{product[11]}₮</span>
        </div>
      </div>
    </div>
  );
};

export default ProductPage;
