import { ProductContext } from "@/context/ProductContext";
import { useContext } from "react";

const SerialListPage = () => {
  const productContext = useContext(ProductContext);

  if (!productContext) return;

  const { currentCounting } = productContext;

  return (
    <div>
      <div>{currentCounting?.IsBySeriesNumber}</div>
      <div>{currentCounting?.id}</div>
    </div>
  );
};
export default SerialListPage;
