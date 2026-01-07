import { useParams } from "react-router-dom";

const CountingPage = () => {
  const { countingId } = useParams();
  return <div>{countingId}</div>;
};

export default CountingPage;
