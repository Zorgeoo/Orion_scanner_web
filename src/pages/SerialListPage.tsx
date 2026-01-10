import { getBarcodeByGroupNum, getSeriesList } from "@/api/services";
import { Skeleton } from "@/components/ui/skeleton";
import { ProductContext } from "@/context/ProductContext";
import { UserContext } from "@/context/UserContext";
import { FullProductModel } from "@/types/FullProductModel";
import { SerialModel } from "@/types/SerialModel";
import { showToast } from "@/utils/toast";
import { useContext, useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";

const SerialListPage = () => {
  const userContext = useContext(UserContext);
  const productContext = useContext(ProductContext);

  if (!productContext) return;
  if (!userContext) return;

  const { currentCounting, setSerials, serials, selectedProduct } =
    productContext;
  const { userInfo } = userContext;

  const { groupNum } = useParams<{ groupNum: string }>();

  const [selectedSerial, setSelectedSerial] = useState<SerialModel | null>(
    null
  );

  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [barcode, setBarcode] = useState<string | null>(null);

  useEffect(() => {
    const getSeries = async () => {
      setIsLoading(true);
      try {
        if (userInfo?.dbase?.dbName && currentCounting && groupNum) {
          const res = await getSeriesList(
            userInfo?.dbase?.dbName,
            currentCounting?.id,
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
  console.log(currentCounting?.id);

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
                <Link
                  onClick={() => setSelectedSerial(serial)}
                  to={`/toollogo/${currentCounting?.id}/${groupNum}`}
                  state={{
                    countingId: currentCounting?.id,
                    product: {
                      lineId: 0,
                      barcodeAndName: "",
                      qtyAndPrice: "",
                      groupNum: groupNum,
                      name: selectedProduct?.name,
                      barcode: barcode,
                      quantity: selectedSerial?.qty,
                      serial: serial.seriesNumber,
                      costPrice: serial.cost,
                      expiryISO: serial.endDate,
                      expiryDisplay: serial.endDate,
                      sellingPrice: 0,
                      createdBy: "",
                    } as FullProductModel,
                  }}
                >
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
