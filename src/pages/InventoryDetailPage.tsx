import { getInventoryDetail } from "@/api/services";
import { UserContext } from "@/context/UserContext";
import { ProductModel } from "@/types/ProductModel";
import { useContext, useEffect, useState } from "react";
import { useParams } from "react-router-dom";

const InventoryDetailPage = () => {
  const userContext = useContext(UserContext);
  if (!userContext) return null;

  const { userInfo } = userContext;

  const { groupNum } = useParams<{ groupNum: string }>();
  const [isLoading, setIsLoading] = useState(false);
  const [product, setProduct] = useState<ProductModel | null>(null);

  useEffect(() => {
    const getDetail = async () => {
      setIsLoading(true);
      if (!userInfo?.dbase?.dbName || !groupNum || !userInfo.userId) return;
      try {
        const res = await getInventoryDetail(
          userInfo?.dbase?.dbName,
          groupNum,
          userInfo?.userId
        );
        if (res.success) {
          setProduct(res.product);
        }
      } catch (error) {
        console.log(error);
      } finally {
        setIsLoading(false);
      }
    };
    getDetail();
  }, []);

  return (
    <div>{isLoading ? <div>Loading</div> : <div>{product?.name}</div>}</div>
  );
};
export default InventoryDetailPage;
