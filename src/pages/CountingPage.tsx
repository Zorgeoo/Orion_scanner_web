import { getProducts } from "@/api/services";
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
    <div className="min-h-screen p-4">
      <h1 className="text-2xl font-bold mb-4">
        Products for Counting ID: {countingId}
      </h1>

      {isLoading && <p>Loading products...</p>}

      {!isLoading && (!products || products.length === 0) && (
        <p>No products found</p>
      )}

      {!isLoading && products && (
        <div className="space-y-4">
          {products.map((product, index) => {
            const barcodeAndName = product[1]; // index 1 = barcode + name
            const qtyAndPrice = product[2]; // index 2 = quantity & price

            return (
              <div
                key={index}
                className="bg-white p-4 rounded-xl shadow hover:shadow-lg transition"
              >
                <p className="font-semibold text-gray-800">{barcodeAndName}</p>
                <p className="text-gray-500">{qtyAndPrice}</p>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default CountingPage;
