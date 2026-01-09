import { getBarcodeByGroupNum, getSeriesList } from "@/api/services";
import { Skeleton } from "@/components/ui/skeleton";
import { UserContext } from "@/context/UserContext";
import { SerialModel } from "@/types/SerialModel";
import { showToast } from "@/utils/toast";
import { useContext, useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";

const SerialListPage = () => {
  const userContext = useContext(UserContext);

  if (!userContext) return;

  const { userInfo } = userContext;

  const { groupNum, countingId } = useParams<{
    groupNum: string;
    countingId: string;
  }>();

  const [serials, setSerials] = useState<SerialModel[] | null>(null);
  const [selectedSerial, setSelectedSerial] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [barcode, setBarcode] = useState<string | null>(null);
  console.log(countingId, groupNum);

  useEffect(() => {
    const getSeries = async () => {
      setIsLoading(true);
      try {
        if (userInfo?.dbase?.dbName && countingId && groupNum) {
          const res = await getSeriesList(
            userInfo?.dbase?.dbName,
            countingId,
            groupNum
          );
          if (res.isSuccess) {
            setSerials(res.serials);
            await getBarcode();
          } else {
            showToast.error("Баркод авахад алдаа гарлаа", {
              position: "bottom-center",
            });
          }
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
        const barcode = await getBarcodeByGroupNum(
          userInfo?.dbase?.dbName,
          groupNum
        );
        if (barcode) {
          setBarcode(barcode);
        } else {
          showToast.error("Баркод авахад алдаа гарлаа", {
            position: "bottom-center",
          });
        }
      }
    } catch (error) {
      console.log(error);
    }
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
                <Link to={`/toollogo/${countingId}/${groupNum}`}>
                  <div
                    key={index}
                    className="flex flex-col pt-2 border-b-2 border-green-600 text-gray-500 text-sm"
                  >
                    <p className="">{serial.fullSeriesNumber}</p>
                  </div>
                </Link>
              );
            })}
        </div>
      )}
    </div>
  );
};
export default SerialListPage;
