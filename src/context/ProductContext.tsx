import { BarcodeProductModel } from "@/types/BarcodeProductModel";
import { CountingModel } from "@/types/CountingModel";
import { ProductModel } from "@/types/ProductModel";
import { SerialModel } from "@/types/SerialModel";
import { createContext, ReactNode, useState } from "react";

interface ProductContextValue {
  barcodeList: BarcodeProductModel[] | null;
  productList: ProductModel[] | null;
  currentCounting: CountingModel | null;
  serials: SerialModel[] | null;
  selectedProduct: ProductModel | null;
  setSelectedProduct: (product: ProductModel | null) => void;
  setSerials: (serial: SerialModel[] | null) => void;
  setBarcodeList: (barcodeList: BarcodeProductModel[] | null) => void;
  setProductList: (productList: ProductModel[] | null) => void;
  setCurrentCounting: (counting: CountingModel | null) => void;
}

export const ProductContext = createContext<ProductContextValue | undefined>(
  undefined
);

interface ProductProviderProps {
  children: ReactNode;
}

export const ProductContextProvider = ({ children }: ProductProviderProps) => {
  const [barcodeList, setBarcodeList] = useState<BarcodeProductModel[] | null>(
    null
  );
  const [productList, setProductList] = useState<ProductModel[] | null>(null);

  const [currentCounting, setCurrentCounting] = useState<CountingModel | null>(
    null
  );

  const [serials, setSerials] = useState<SerialModel[] | null>(null);

  const [selectedProduct, setSelectedProduct] = useState<ProductModel | null>(
    null
  );

  return (
    <ProductContext.Provider
      value={{
        barcodeList,
        setBarcodeList,
        productList,
        setProductList,
        currentCounting,
        setCurrentCounting,
        serials,
        setSerials,
        selectedProduct,
        setSelectedProduct,
      }}
    >
      {children}
    </ProductContext.Provider>
  );
};
