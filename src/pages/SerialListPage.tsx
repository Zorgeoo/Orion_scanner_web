import {
  createNewSeries,
  getBarcodeByGroupNum,
  getSeriesList,
} from "@/api/services";
import { Skeleton } from "@/components/ui/skeleton";
import { ProductContext } from "@/context/ProductContext";
import { UserContext } from "@/context/UserContext";
import { FullProductModel } from "@/types/FullProductModel";
import { SerialModel } from "@/types/SerialModel";
import { showToast } from "@/utils/toast";
import { useContext, useEffect, useState } from "react";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import {
  Dialog,
  DialogContent,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { ProductModel } from "@/types/ProductModel";
const SerialListPage = () => {
  const navigate = useNavigate();
  const userContext = useContext(UserContext);
  const productContext = useContext(ProductContext);

  if (!productContext) return;
  if (!userContext) return;

  const { currentCounting } = productContext;
  const { userInfo } = userContext;

  const location = useLocation();

  const selectedProduct = location.state.selectedProduct as
    | ProductModel
    | undefined;
  const { groupNum } = useParams<{ groupNum: string }>();

  const [serials, setSerials] = useState<SerialModel[] | null>(null);
  const [expiryDate, setExpiryDate] = useState<string>(
    new Date().toISOString().split("T")[0]
  );
  const [newSerial, setNewSerial] = useState<string>("");
  const [cost, setCost] = useState<string>("");
  const [open, setOpen] = useState(false);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [barcodeByGroupnum, setBarcodeByGroupnum] = useState<string | null>(
    null
  );
  const [selectedSerial, setSelectedSerial] = useState<SerialModel | null>(
    null
  );

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

  const getBarcode = async () => {
    try {
      if (userInfo?.dbase?.dbName && groupNum) {
        const barcode = await getBarcodeByGroupNum(
          userInfo?.dbase?.dbName,
          groupNum
        );
        if (barcode) {
          setBarcodeByGroupnum(barcode);
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

  const handleCreateSerial = async () => {
    if (!userInfo?.dbase?.dbName || !groupNum) return;

    if (!newSerial) {
      showToast.error("Серийн дугаар оруулна уу");
    }
    if (!expiryDate) {
      showToast.error("Дуусах хугацааг оруулна уу");
    }
    try {
      const res = await createNewSeries(
        userInfo?.dbase?.dbName,
        groupNum,
        newSerial,
        cost,
        expiryDate
      );
      if (res) {
        setOpen(false);
        navigate(`/toollogo/${currentCounting?.id}/${groupNum}`, {
          state: {
            uldegdel: 0.0,
            product: {
              lineId: 0,
              barcodeAndName: "",
              qtyAndPrice: "",
              groupNum: groupNum,
              name: selectedProduct?.name,
              barcode: barcodeByGroupnum,
              quantity: 0.0,
              serial: newSerial,
              costPrice: parseFloat(cost),
              expiryISO: new Date(expiryDate).toISOString(),
              expiryDisplay: expiryDate,
              sellingPrice: selectedProduct?.price,
              createdBy: "",
            } as FullProductModel,
            countingId: currentCounting?.id,
          },
          replace: true,
        });
      }
    } catch (error) {
      console.log(error);
    }
  };

  const handleSelectSerial = (serial: SerialModel) => {
    if (serial.seriesNumber === selectedSerial?.seriesNumber) {
      setSelectedSerial(null);
    } else {
      setSelectedSerial(serial);
    }
  };

  const handleNextButton = () => {
    navigate(`/toollogo/${currentCounting?.id}/${groupNum}`, {
      replace: true,
      state: {
        uldegdel: selectedSerial?.qty,
        product: {
          lineId: 0,
          barcodeAndName: "",
          qtyAndPrice: "",
          groupNum: groupNum,
          name: selectedProduct?.name,
          barcode: barcodeByGroupnum,
          sellingPrice: selectedProduct?.price,
          quantity: 0.0,
          serial: selectedSerial?.seriesNumber,
          costPrice: selectedSerial?.cost,
          expiryISO: selectedSerial?.endDate,
          expiryDisplay: selectedSerial?.endDate,
          createdBy: "",
        } as FullProductModel,
      },
    });
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
                  key={index}
                  onClick={() => handleSelectSerial(serial)}
                  className={`
    flex items-center gap-3 px-4 py-2 rounded-2xl text-sm cursor-pointer
    transition-all duration-200
    ${
      selectedSerial === serial
        ? "ring-2 ring-blue-500 bg-blue-50/70"
        : "hover:bg-gray-100"
    }
  `}
                >
                  {/* Radio Button */}
                  <div className="flex-shrink-0">
                    <div
                      className={`
        w-5 h-5 rounded-full border-2 flex items-center justify-center
        transition-all duration-200
        ${
          selectedSerial === serial
            ? "border-blue-500 bg-blue-500"
            : "border-gray-300 bg-white"
        }
      `}
                    >
                      {selectedSerial === serial && (
                        <div className="w-2.5 h-2.5 rounded-full bg-white" />
                      )}
                    </div>
                  </div>

                  {/* Serial Name */}
                  <div className="flex-1 min-w-0">
                    <h3 className="text-gray-700 truncate">
                      {serial.fullSeriesNumber}
                    </h3>
                  </div>
                </div>

                // <div
                //   className={`
                //  px-4 py-2 rounded-2xl text-sm
                //   ${
                //     selectedSerial === serial
                //       ? "ring-2 ring-blue-500 bg-blue-50/70 "
                //       : ""
                //   }
                // `}
                //   onClick={() => handleSelectSerial(serial)}
                //   key={index}
                // >
                //   {/* Radio Button */}
                //   <div className="flex-shrink-0">
                //     <div
                //       className={`
                //         w-5 h-5 rounded-full border-2 flex items-center justify-center
                //         transition-all duration-200
                //         ${
                //           selectedSerial === serial
                //             ? "border-blue-500 bg-blue-500"
                //             : "border-gray-300 bg-white"
                //         }
                //       `}
                //     >
                //       {selectedSerial === serial && (
                //         <div className="w-2.5 h-2.5 rounded-full bg-white" />
                //       )}
                //     </div>
                //   </div>

                //   {/* Serial Name */}
                //   <div className="flex-1 min-w-0">
                //     <h3 className="text-gray-500 truncate">
                //       {serial.fullSeriesNumber}
                //     </h3>
                //   </div>
                // </div>
              );
            })}
        </div>
      )}
      <div className="fixed bottom-12 left-1/2 transform -translate-x-1/2">
        <Dialog open={open} onOpenChange={setOpen}>
          <DialogTrigger className="px-4 py-2 bg-orange-400 text-white rounded-xl">
            Шинэ сери нэмэх
          </DialogTrigger>
          <DialogContent className="max-w-xs bg-white rounded-xl p-6 shadow-lg">
            <DialogTitle className="font-semibold text-gray-800 ">
              Серийн дугаар шинээр үүсгэх :
            </DialogTitle>
            <div className="flex flex-col gap-8">
              <div className="flex flex-col gap-4 items-start rounded-xl">
                <div>
                  <label className="block text-sm font-medium text-gray-700 pb-2">
                    * Серийн дугаар :
                  </label>
                  <input
                    type="text"
                    value={newSerial}
                    onChange={(e) => setNewSerial(e.target.value)}
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
                    type="text"
                    inputMode="decimal"
                    pattern="[0-9,]*"
                    value={cost ? cost : ""}
                    onChange={(e) => setCost(e.target.value)}
                    className="w-full border-2 border-gray-200 rounded-xl px-4 py-1 focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all"
                  />
                </div>
              </div>
              <div
                onClick={handleCreateSerial}
                className="w-full px-4 py-2 font-semibold rounded-2xl shadow-md text-white text-center 
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
      {selectedSerial && (
        <div className="fixed bottom-6 left-1/2 transform -translate-x-1/2 z-50 w-[calc(100%-2rem)] max-w-md">
          <button
            onClick={handleNextButton}
            className="
                w-full bg-gradient-to-r from-blue-500 to-purple-600 text-white
                px-8 py-4 rounded-2xl font-semibold shadow-2xl
                hover:from-blue-600 hover:to-purple-700
                active:scale-95 transition-all duration-200
                flex items-center justify-center gap-2
              "
          >
            <svg
              className="w-5 h-5"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M5 13l4 4L19 7"
              />
            </svg>
            Үргэлжлүүлэх
          </button>
        </div>
      )}
    </div>
  );
};
export default SerialListPage;
