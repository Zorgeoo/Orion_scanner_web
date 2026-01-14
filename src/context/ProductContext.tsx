import { BarcodeProductModel } from "@/types/BarcodeProductModel";
import { CountingModel } from "@/types/CountingModel";
import { ProductModel } from "@/types/ProductModel";
import { createContext, ReactNode, useState } from "react";

interface ProductContextValue {
  barcodeList: BarcodeProductModel[] | null;
  productList: ProductModel[] | null;
  currentCounting: CountingModel | null;
  setBarcodeList: (barcodeList: BarcodeProductModel[] | null) => void;
  setProductList: (productList: ProductModel[] | null) => void;
  setCurrentCounting: (counting: CountingModel | null) => void;
  shouldStartScan: boolean;
  setShouldStartScan: (bool: boolean) => void;
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
  const [shouldStartScan, setShouldStartScan] = useState(false);

  return (
    <ProductContext.Provider
      value={{
        barcodeList,
        setBarcodeList,
        productList,
        setProductList,
        currentCounting,
        setCurrentCounting,
        shouldStartScan,
        setShouldStartScan,
      }}
    >
      {children}
    </ProductContext.Provider>
  );
};
