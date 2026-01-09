import { getBarcodeByGroupNum, getSeriesList } from "@/api/services";
import { Skeleton } from "@/components/ui/skeleton";
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
  const [isLoading, setIsLoading] = useState<boolean>(false);

  useEffect(() => {
    const getSeries = async () => {
      setIsLoading(true);
      try {
        if (userInfo?.dbase?.dbName && currentCounting && groupNum) {
          const serials = await getSeriesList(
            userInfo?.dbase?.dbName,
            currentCounting?.id,
            groupNum
          );
          setSerials(serials);
        }
        setIsLoading(false);
      } catch (error) {
        console.log(error);
        setIsLoading(false);
      }
    };
    getSeries();
  }, []);

  const getBarcode = async () => {
    try {
      if (userInfo?.dbase?.dbName && groupNum) {
        const res = getBarcodeByGroupNum(userInfo?.dbase?.dbName, groupNum);
        console.log(res);
      }
    } catch (error) {}
  };
  return (
    <div className="p-4 mx-auto">
      <h1 className="px-4 mx-auto text-base font-semibold pb-2 text-center">
        Тоолж буй серийн дугаараа сонгоно уу!
      </h1>
      {isLoading ? (
        <div className="space-y-4 flex flex-col items-center content-center">
          <Skeleton className="h-4 w-full" />
          <Skeleton className="h-4 w-full" />
          <Skeleton className="h-4 w-full" />
        </div>
      ) : (
        <div className="flex flex-col gap-2">
          {serials &&
            serials.map((serial, index) => {
              return (
                <div
                  onClick={() => getBarcode()}
                  key={index}
                  className="flex flex-col pt-2 border-b-2 border-green-600 text-gray-500 text-sm"
                >
                  <p className="">{serial.fullSeriesNumber}</p>
                </div>
              );
            })}
        </div>
      )}
    </div>
  );
};
export default SerialListPage;
