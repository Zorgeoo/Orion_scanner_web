import { getBarcodeByGroupNum, getSeriesList } from "@/api/services";
import { Skeleton } from "@/components/ui/skeleton";
import { ProductContext } from "@/context/ProductContext";
import { UserContext } from "@/context/UserContext";
import { FullProductModel } from "@/types/FullProductModel";
import { SerialModel } from "@/types/SerialModel";
import { showToast } from "@/utils/toast";
import { useContext, useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
const SerialListPage = () => {
  const userContext = useContext(UserContext);
  const productContext = useContext(ProductContext);

  if (!productContext) return;
  if (!userContext) return;

  const { currentCounting, selectedProduct } = productContext;
  const { userInfo } = userContext;

  const { groupNum } = useParams<{ groupNum: string }>();

  const [serials, setSerials] = useState<SerialModel[] | null>(null);
  const [expiryDate, setExpiryDate] = useState<string>(
    new Date().toISOString().split("T")[0]
  );
  const [serial, setSerial] = useState<string>("");
  const [cost, setCost] = useState<number | undefined>();

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
                  replace={true}
                  to={`/toollogo/${currentCounting?.id}/${groupNum}`}
                  state={{
                    withSerial: true,
                    countingId: currentCounting?.id,
                    product: {
                      lineId: 0,
                      barcodeAndName: "",
                      qtyAndPrice: "",
                      groupNum: groupNum,
                      name: selectedProduct?.name,
                      barcode: barcode,
                      sellingPrice: selectedProduct?.price,
                      quantity: serial.qty,
                      serial: serial.seriesNumber,
                      costPrice: serial.cost,
                      expiryISO: serial.endDate,
                      expiryDisplay: serial.endDate,
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
      <div className="fixed bottom-8 left-1/2 transform -translate-x-1/2">
        <Dialog>
          <DialogTrigger className="px-4 py-2 bg-orange-400 text-white rounded-xl">
            Шинэ сери нэмэх
          </DialogTrigger>
          <DialogContent className="max-w-xs bg-white rounded-xl p-6 shadow-lg">
            <DialogTitle>Серийн дугаар шинээр үүсгэх :</DialogTitle>
            <div className="flex flex-col gap-8">
              <div className="flex flex-col gap-4 items-start rounded-xl">
                <div>
                  <label className="block text-sm font-medium text-gray-700 pb-2">
                    * Серийн дугаар :
                  </label>
                  <input
                    type="number"
                    value={serial}
                    onChange={(e) => setSerial(e.target.value)}
                    className="w-full border-2 border-gray-200 rounded-xl px-4 py-1 focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 pb-2">
                    * Дуусах хугацаа :
                  </label>
                  <input
                    type="date"
                    value={expiryDate}
                    onChange={(e) => setExpiryDate(e.target.value)}
                    className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 pb-2">
                    Авсан үнэ :
                  </label>
                  <input
                    type="number"
                    value={cost ? cost : ""}
                    onChange={(e) => setCost(Number(e.target.value))}
                    className="w-full border-2 border-gray-200 rounded-xl px-4 py-1 focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all"
                  />
                </div>
              </div>
              <div
                className="w-full px-6 py-4 font-semibold rounded-2xl shadow-md text-white text-center 
             bg-gradient-to-r from-blue-500 to-purple-600 
             hover:from-blue-600 hover:to-purple-700 
             transition-all duration-300"
              >
                Хадгалах
              </div>
            </div>
            <div className="[data-radix-dialog-close]:hidden" />
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
};
export default SerialListPage;
