import { getBarcodeList, getProductList, getProducts } from "@/api/services";
import ListSkeleton from "@/components/common/ListSkeleton";
import { ProductContext } from "@/context/ProductContext";
import { UserContext, UserInfo } from "@/context/UserContext";
import { FullProductModel } from "@/types/FullProductModel";
import { ProductModel } from "@/types/ProductModel";
import { showToast } from "@/utils/toast";
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";
import { useContext, useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";

declare global {
  interface Window {
    webkit?: {
      messageHandlers: {
        barcodeScanner: {
          postMessage: (message: string) => void;
        };
      };
    };
    onBarcodeScanned?: (result: string) => void;
    setUserInfo?: (userInfo: UserInfo) => void;
  }
}

const CountingPage = () => {
  const context = useContext(UserContext);
  if (!context) return null;
  const { userInfo } = context;

  const productContext = useContext(ProductContext);
  if (!productContext) return null;

  const {
    setProductList,
    setBarcodeList,
    setSelectedProduct,
    productList,
    barcodeList,
    currentCounting,
  } = productContext;

  const { countingId } = useParams<{ countingId: string }>();

  const [products, setProducts] = useState<FullProductModel[] | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isOpen, setIsOpen] = useState(false);

  const navigate = useNavigate();

  // Scan хийгдсэн код
  const [scannedCode, setScannedCode] = useState<string | null>(null);

  const startScanning = () => {
    if (window.webkit?.messageHandlers?.barcodeScanner) {
      // iOS
      setScannedCode(null);
      window.webkit.messageHandlers.barcodeScanner.postMessage("openScanner");
    } else if ((window as any).barcodeScanner) {
      // Android
      setScannedCode(null);
      (window as any).barcodeScanner.postMessage("openScanner");
    } else {
      alert("Barcode scanner not available.");
    }
  };
  useEffect(() => {
    if (!scannedCode) return;

    const selectedTbarcode = barcodeList?.find(
      (barcode) => barcode.barcode === scannedCode
    );
    let selectedTProduct: ProductModel | undefined;
    if (selectedTbarcode) {
      selectedTProduct = productList?.find(
        (product) => product.groupNum == selectedTbarcode.groupNum
      );
    }

    if (!selectedTbarcode || !selectedTProduct) {
      setIsOpen(true);
    } else if (currentCounting?.IsBySeriesNumber) {
      setSelectedProduct({
        barcode: "",
        groupNum: selectedTbarcode?.groupNum ?? "",
        name: selectedTbarcode?.name ?? "Нэр олдсонгүй",
        category: "",
        price: selectedTbarcode?.price ?? 0,
        quantity: 0,
      });
      navigate(`/toollogo/serialList/${selectedTbarcode.groupNum}`);
    } else {
      navigate(`/toollogo/${countingId}/${selectedTbarcode.groupNum},`, {
        state: {
          product: {
            lineId: 0,
            barcodeAndName: "",
            qtyAndPrice: "",
            groupNum: selectedTbarcode.groupNum,
            name: selectedTbarcode.name,
            barcode: scannedCode,
            quantity: selectedTProduct?.quantity ?? 0,
            serial: "",
            costPrice: 0,
            expiryISO: "",
            expiryDisplay: "",
            sellingPrice: selectedTProduct.price,
            createdBy: "",
          } as FullProductModel,
        },
      });
    }
  }, [scannedCode]);

  useEffect(() => {
    window.onBarcodeScanned = (result: string | null) => {
      if (result !== null) {
        setScannedCode(result);
      }
      console.log(result);
    };

    return () => {
      delete window.onBarcodeScanned;
    };
  }, []);

  useEffect(() => {
    const fetchProducts = async () => {
      if (!userInfo?.dbase?.dbName || !countingId) return;

      setIsLoading(true);
      try {
        const productResponse = await getProducts(
          userInfo.dbase.dbName,
          countingId
        );
        if (productResponse.isSuccess) {
          setProducts(productResponse.products);
          if (!productList) {
            const productListResponse = await getProductList(
              userInfo.dbase.dbName,
              countingId
            );
            if (productListResponse.success) {
              setProductList(productListResponse.products);
              if (!barcodeList) {
                const barcodes = await getBarcodeList(
                  userInfo.dbase.dbName,
                  countingId
                );
                console.log(barcodes);

                setBarcodeList(barcodes);
              } else {
                showToast.error(
                  "Бараа бүтээгдэхүүний баркод жагсаалт авахад алдаа гарлаа.",
                  {
                    position: "bottom-center",
                  }
                );
              }
            }
          }
        } else {
          showToast.error("Бараа бүтээгдэхүүнийг авахад алдаа гарлаа.", {
            position: "bottom-center",
          });
        }
      } catch (error) {
        console.error("Error fetching products:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchProducts();
  }, []);

  return (
    <div className="min-h-screen pb-48 p-6">
      <div className="max-w-4xl mx-auto">
        <h4 className="text-xl font-semibold pb-2">{currentCounting?.name}</h4>

        {isLoading && <ListSkeleton />}

        {!isLoading && (!products || products.length === 0) && (
          <div className="text-center py-10 text-gray-500 text-lg">
            Бараа олдсонгүй
          </div>
        )}

        {!isLoading && products && (
          <div className="flex flex-col gap-2">
            {products.map((product, index) => {
              return (
                <Link
                  key={index}
                  to={`/toollogo/${countingId}/${product.lineId}`}
                  state={{ product, countingId: countingId }}
                >
                  <div className="flex flex-col pt-2 border-b-2 border-green-600 text-gray-500 text-sm">
                    <p className="">{product.barcodeAndName}</p>
                    <p className="">{product.qtyAndPrice}</p>
                  </div>
                </Link>
              );
            })}
          </div>
        )}
      </div>
      {/* Fixed bottom buttons */}
      <div className="fixed bottom-0 pb-8 left-1/2 transform -translate-x-1/2 z-20 flex flex-col gap-3 w-[90%] max-w-md bg-white">
        <button
          disabled={isLoading}
          onClick={startScanning}
          className="w-full py-4 bg-yellow-500 text-white font-semibold rounded-2xl shadow-lg hover:bg-yellow-600 transition-all"
        >
          Баркод уншуулж тоолох
        </button>
        <Link to={`/toollogo/${countingId}/searchByProductName`}>
          <button className="w-full py-4 bg-yellow-500 text-white font-semibold rounded-2xl shadow-lg hover:bg-yellow-600 transition-all">
            Барааны нэрээр хайж тоолох
          </button>
        </Link>
      </div>
      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogContent className="max-w-xs bg-white rounded-xl p-6 shadow-lg flex flex-col justify-between">
          <div className="text-sm text-center">
            {`${scannedCode} баркод олдсонгүй! Хэрэв бараа нь бүртгэлтэй бол түүнрүү хадгалах уу?`}
          </div>
          <div className="flex justify justify-between gap-4">
            <div className="w-full px-2 py-2 font-semibold rounded-2xl shadow-md text-white text-center bg-orange-500">
              Тийм
            </div>{" "}
            <div className="w-full px-2 py-2 font-semibold rounded-2xl shadow-md text-orange-500 bg-gray-400 text-center">
              Үгүй
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default CountingPage;
