import { ProductContext } from "@/context/ProductContext";
import { ProductModel } from "@/types/ProductModel";
import { useState, useMemo, useContext } from "react";

const SearchByProductnamePage = () => {
  const productContext = useContext(ProductContext);

  if (!productContext) return null;

  const { productList } = productContext;

  const [searchQuery, setSearchQuery] = useState("");
  const [selectedProduct, setSelectedProduct] = useState<string | null>(null);

  // Filter products based on search query
  const filteredProducts = useMemo(() => {
    if (!productList) return [];

    const filtered = productList.filter((product: ProductModel) =>
      product.name.toLowerCase().includes(searchQuery.toLowerCase())
    );

    return filtered.slice(0, 30);
  }, [productList, searchQuery]);

  // Default to first 30 products
  const displayProducts = useMemo(() => {
    if (!productList) return [];

    if (searchQuery === "") {
      return productList.slice(0, 30);
    }

    return filteredProducts;
  }, [productList, searchQuery, filteredProducts]);

  const handleSelectProduct = (barcode: string) => {
    setSelectedProduct(barcode);

    console.log(barcode);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50 p-4 md:p-6">
      <div className="max-w-2xl mx-auto">
        {/* Header */}
        <div className="mb-6">
          <h1 className="text-xl md:text-3xl font-bold text-gray-800 mb-2">
            🔍 Хайж буй барааныхаа нэрээр хайх
          </h1>
        </div>

        {/* Search Input */}
        <div className="bg-white/70 backdrop-blur-sm rounded-2xl p-4 shadow-lg mb-6">
          <div className="relative">
            <svg
              className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
              />
            </svg>
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Барааны нэр оруулна уу..."
              className="w-full pl-12 pr-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all text-gray-800 placeholder-gray-400"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery("")}
                className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
              >
                <svg
                  className="w-5 h-5"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              </button>
            )}
          </div>
        </div>

        {/* Products List - Name Only */}
        <div className="space-y-2">
          {displayProducts.length === 0 ? (
            <div className="bg-white/70 backdrop-blur-sm rounded-2xl p-12 text-center shadow-lg">
              <div className="text-6xl mb-4">📦</div>
              <p className="text-gray-500 text-lg">Бараа олдсонгүй</p>
            </div>
          ) : (
            displayProducts.map((product: ProductModel) => (
              <div
                key={product.barcode}
                onClick={() => handleSelectProduct(product.barcode)}
                className={`
                  bg-white/70 backdrop-blur-sm rounded-xl px-5 py-4 shadow-md
                  cursor-pointer transition-all duration-200
                  hover:shadow-lg hover:scale-[1.01]
                  ${
                    selectedProduct === product.barcode
                      ? "ring-2 ring-blue-500 bg-blue-50/70"
                      : ""
                  }
                `}
              >
                <div className="flex items-center gap-4">
                  {/* Radio Button */}
                  <div className="flex-shrink-0">
                    <div
                      className={`
                        w-5 h-5 rounded-full border-2 flex items-center justify-center
                        transition-all duration-200
                        ${
                          selectedProduct === product.barcode
                            ? "border-blue-500 bg-blue-500"
                            : "border-gray-300 bg-white"
                        }
                      `}
                    >
                      {selectedProduct === product.barcode && (
                        <div className="w-2.5 h-2.5 rounded-full bg-white" />
                      )}
                    </div>
                  </div>

                  {/* Product Name */}
                  <div className="flex-1 min-w-0">
                    <h3 className="font-semibold text-gray-800 text-lg truncate">
                      {product.name}
                    </h3>
                  </div>

                  {/* Chevron */}
                  <svg
                    className={`w-5 h-5 text-gray-400 transition-transform ${
                      selectedProduct === product.barcode
                        ? "text-blue-500 translate-x-1"
                        : ""
                    }`}
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M9 5l7 7-7 7"
                    />
                  </svg>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Selected Product Action */}
        {selectedProduct && (
          <div className="fixed bottom-6 left-1/2 transform -translate-x-1/2 z-50 w-[calc(100%-2rem)] max-w-md">
            <button
              onClick={() => {
                const product = displayProducts.find(
                  (p: ProductModel) => p.barcode === selectedProduct
                );
                console.log("Selected product:", product);
                alert(`Сонгосон: ${product?.name}`);
              }}
              className="
                w-full bg-gradient-to-r from-blue-500 to-purple-600 text-white
                px-8 py-4 rounded-2xl font-semibold shadow-2xl
                hover:from-blue-600 hover:to-purple-700
                active:scale-95 transition-all duration-200
                flex items-center justify-center gap-2
              "
            >
              <svg
                className="w-5 h-5"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M5 13l4 4L19 7"
                />
              </svg>
              Үргэлжлүүлэх
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default SearchByProductnamePage;
