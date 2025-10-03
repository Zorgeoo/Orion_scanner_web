import { Link } from "react-router-dom";

const HomePage = () => {
  return (
    <div>
      <h1>Welcome to the Home Page</h1>
      <Link to="/scan">
        <button>Scan</button>
      </Link>
      <Link to="/zxing">
        <button>ZXING</button>
      </Link>
    </div>
  );
};
export default HomePage;
