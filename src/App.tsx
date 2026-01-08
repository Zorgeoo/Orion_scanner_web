import "./App.css";

import { Route, Routes } from "react-router-dom";
import HomePage from "./pages/HomePage";
import FullscreenScanner from "./pages/Scanner";

import { UserProvider } from "./context/UserContext";
import CountingPage from "./pages/CountingPage";
import CountingListPage from "./pages/CountinListPage";
import ProductPage from "./pages/ProductPage";
import { Slide, ToastContainer } from "react-toastify";
function App() {
  return (
    <>
      <UserProvider>
        <ToastContainer
          position="top-center"
          autoClose={5000}
          hideProgressBar={false}
          newestOnTop={false}
          pauseOnHover
          pauseOnFocusLoss
          rtl={false}
          transition={Slide}
          theme="colored"
          toastStyle={{
            width: "360px",
            maxWidth: "80vw",
          }}
        />
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/barcodeScanner" element={<FullscreenScanner />} />
          <Route path="/toollogo" element={<CountingListPage />} />
          <Route path="/toollogo/:countingId" element={<CountingPage />} />
          <Route
            path="/toollogo/:countingId/:productId"
            element={<ProductPage />}
          />
        </Routes>
      </UserProvider>
    </>
  );
}

export default App;
