import { getSeriesList } from "@/api/services";
import { ProductContext } from "@/context/ProductContext";
import { UserContext } from "@/context/UserContext";
import { SerialModel } from "@/types/SerialModel";
import { useContext, useEffect, useState } from "react";
import { useParams } from "react-router-dom";

const SerialListPage = () => {
  const userContext = useContext(UserContext);
  const productContext = useContext(ProductContext);

  if (!productContext) return;
  if (!userContext) return;

  const { currentCounting } = productContext;
  const { userInfo } = userContext;

  const { groupNum } = useParams<{ groupNum: string }>();

  const [serials, setSerials] = useState<SerialModel[] | null>(null);
  const [selectedSerial, setSelectedSerial] = useState<string | null>(null);

  useEffect(() => {
    const getSeries = async () => {
      try {
        if (userInfo?.dbase?.dbName && currentCounting && groupNum) {
          const serials = await getSeriesList(
            userInfo?.dbase?.dbName,
            currentCounting?.id,
            groupNum
          );
          setSerials(serials);
        }
      } catch (error) {
        console.log(error);
      }
    };
    getSeries();
  }, []);
  return (
    <div className="flex flex-col">
      {serials &&
        serials.map((serial, index) => {
          return (
            <div
              // onClick={()=>setSelectedSerial(serial.)}
              key={index}
              className="flex flex-col pt-2 border-b-2 border-green-600 text-gray-500 text-sm"
            >
              <p className="">{serial.fullSeriesNumber}</p>
            </div>
          );
        })}
    </div>
  );
};
export default SerialListPage;
