import { BarcodeProductModel } from "@/types/BarcodeProductModel";
import { ProductModel } from "@/types/ProductModel";
import { createContext, ReactNode, useState } from "react";

interface ProductContextValue {
  barcodeList: BarcodeProductModel[] | null;
  productList: ProductModel[] | null;
  setBarcodeList: (productList: BarcodeProductModel[] | null) => void;
  setProductList: (productList: ProductModel[] | null) => void;
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

  return (
    <ProductContext.Provider
      value={{ barcodeList, setBarcodeList, productList, setProductList }}
    >
      {children}
    </ProductContext.Provider>
  );
};
