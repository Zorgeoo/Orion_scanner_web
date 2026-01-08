import { ProductContext } from "@/context/ProductContext";
import { useContext } from "react";

const SearchByProductnamePage = () => {
  const productContext = useContext(ProductContext);

  if (!productContext) return null;
  const { productList } = productContext;

  console.log(`here ${productList}`);

  return <div></div>;
};

export default SearchByProductnamePage;
