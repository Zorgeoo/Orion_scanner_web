import { useParams } from "react-router-dom";

const InventoryDetailPage = () => {
  const { groupNum } = useParams<{ groupNum: string }>();

  return <div>{groupNum}</div>;
};
export default InventoryDetailPage;
