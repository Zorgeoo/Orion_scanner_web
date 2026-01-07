import { getProducts } from "@/api/services";
import { UserContext } from "@/context/UserContext";
import { use, useContext, useEffect, useState } from "react";
import { useParams } from "react-router-dom";

const CountingPage = () => {
  const context = useContext(UserContext);

  if (!context) return null; // fallback if context not provided

  const { userInfo } = context;

  const { countingId } = useParams();
  const [products, setProducts] = useState();
  const [isLoading, setIsLoading] = useState<boolean>(false);

  useEffect(() => {
    const fetchProducts = async () => {
      setIsLoading(true);
      if (userInfo?.dbase?.dbName && countingId) {
        try {
          const products = await getProducts(
            userInfo?.dbase?.dbName,
            countingId
          );

          console.log(products);
        } catch (error) {
          console.error("Error fetching counting list:", error);
        }
      }
      setIsLoading(false);
    };

    fetchProducts();
  }, []);
  return <div>{countingId}</div>;
};

export default CountingPage;
