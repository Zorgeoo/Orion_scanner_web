import { getSeriesList } from "@/api/services";
import { ProductContext } from "@/context/ProductContext";
import { UserContext } from "@/context/UserContext";
import { useContext, useEffect } from "react";
import { useParams } from "react-router-dom";

const SerialListPage = () => {
  const userContext = useContext(UserContext);
  const productContext = useContext(ProductContext);

  if (!productContext) return;
  if (!userContext) return;

  const { currentCounting } = productContext;
  const { userInfo } = userContext;

  const { groupNum } = useParams<{ groupNum: string }>();

  useEffect(() => {
    const getSeries = async () => {
      try {
        if (userInfo?.dbase?.dbName && currentCounting && groupNum) {
          const res = await getSeriesList(
            userInfo?.dbase?.dbName,
            currentCounting?.id,
            groupNum
          );
          console.log(res);
        }
      } catch (error) {
        console.log(error);
      }
    };
    getSeries();
  }, []);
  return (
    <div>
      <div>{currentCounting?.IsBySeriesNumber}</div>
      <div>{currentCounting?.id}</div>
    </div>
  );
};
export default SerialListPage;
