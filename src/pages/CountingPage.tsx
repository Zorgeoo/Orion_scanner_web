import { getProducts } from "@/api/services";
import ListSkeleton from "@/components/common/ListSkeleton";
import { UserContext } from "@/context/UserContext";
import { ProductModel } from "@/types/ProductModel";
import { useContext, useEffect, useState } from "react";
import { useParams } from "react-router-dom";

const CountingPage = () => {
  const context = useContext(UserContext);
  if (!context) return null;
  const { userInfo } = context;

  const { countingId } = useParams<{ countingId: string }>();

  const [products, setProducts] = useState<ProductModel[] | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const fetchProducts = async () => {
      if (!userInfo?.dbase?.dbName || !countingId) return;

      setIsLoading(true);
      try {
        const products = await getProducts(userInfo.dbase.dbName, countingId);
        setProducts(products);
      } catch (error) {
        console.error("Error fetching products:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchProducts();
  }, [userInfo, countingId]);

  return (
    <div className="min-h-screen p-6 bg-gray-50">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold mb-6 text-gray-900">{countingId}</h1>

        {isLoading && <ListSkeleton />}

        {!isLoading && (!products || products.length === 0) && (
          <div className="text-center py-10 text-gray-500 text-lg">
            No products found
          </div>
        )}

        {!isLoading && products && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {products.map((product, index) => {
              const barcodeAndName = product[1];
              const qtyAndPrice = product[2];

              return (
                <div
                  key={index}
                  className="bg-white p-5 rounded-2xl shadow-md hover:shadow-xl transition-shadow duration-300 flex flex-col"
                >
                  <p className="font-semibold text-gray-900 text-lg mb-2">
                    {barcodeAndName}
                  </p>
                  <p className="text-gray-500 text-sm">{qtyAndPrice}</p>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};

export default CountingPage;
