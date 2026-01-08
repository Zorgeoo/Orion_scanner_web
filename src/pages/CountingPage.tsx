import { getBarcodeList, getProducts } from "@/api/services";
import ListSkeleton from "@/components/common/ListSkeleton";
import { UserContext } from "@/context/UserContext";
import { ProductModel } from "@/types/ProductModel";
import { useContext, useEffect, useState } from "react";
import { Link, useLocation, useParams } from "react-router-dom";

const CountingPage = () => {
  const context = useContext(UserContext);
  if (!context) return null;
  const { userInfo } = context;

  const { countingId } = useParams<{ countingId: string }>();

  const location = useLocation();
  const date = location.state?.date;

  const [products, setProducts] = useState<ProductModel[] | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const fetchProducts = async () => {
      if (!userInfo?.dbase?.dbName || !countingId) return;

      setIsLoading(true);
      try {
        const products = await getProducts(userInfo.dbase.dbName, countingId);
        const barcodes = await getBarcodeList(
          userInfo.dbase.dbName,
          countingId
        );
        console.log(`Barcode list : ${barcodes}`);

        setProducts(products);
        console.log(products);
      } catch (error) {
        console.error("Error fetching products:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchProducts();
  }, [userInfo, countingId]);

  return (
    <div className="min-h-screen pb-40 p-6">
      {" "}
      {/* pb-40 ensures content doesn't go under buttons */}
      <div className="max-w-4xl mx-auto">
        <h4 className="text-3xl font-bold mb-6 text-gray-900">{date}</h4>

        {isLoading && <ListSkeleton />}

        {!isLoading && (!products || products.length === 0) && (
          <div className="text-center py-10 text-gray-500 text-lg">
            No products found
          </div>
        )}

        {!isLoading && products && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {products.map((product, index) => {
              const productId = product[0];
              const barcodeAndName = product[1];
              const qtyAndPrice = product[2];

              return (
                <Link
                  key={index}
                  to={`/toollogo/${countingId}/${productId}`}
                  state={{ product }}
                >
                  <div className="bg-white p-5 rounded-2xl shadow-md hover:shadow-xl transition-shadow duration-300 flex flex-col">
                    <p className="font-semibold text-gray-900 text-lg mb-2">
                      {barcodeAndName}
                    </p>
                    <p className="text-gray-500 text-sm">{qtyAndPrice}</p>
                  </div>
                </Link>
              );
            })}
          </div>
        )}
      </div>
      {/* Fixed bottom buttons */}
      <div className="fixed bottom-0 left-1/2 transform -translate-x-1/2 z-20 flex flex-col gap-3 w-[90%] max-w-md bg-white">
        <Link to={"/barcodeScanner"}>
          <button className="w-full py-4 bg-yellow-500 text-white font-semibold rounded-2xl shadow-lg hover:bg-yellow-600 transition-all">
            Баркод уншуулж тоолох
          </button>
        </Link>
        <button className="w-full py-4 bg-yellow-500 text-white font-semibold rounded-2xl shadow-lg hover:bg-yellow-600 transition-all">
          Барааны нэрээр хайж тоолох
        </button>
      </div>
    </div>
  );
};

export default CountingPage;
