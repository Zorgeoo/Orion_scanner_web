import "./App.css";

import { Route, Routes } from "react-router-dom";
import HomePage from "./pages/HomePage";
import FullscreenScanner from "./pages/Scanner";

import { UserProvider } from "./context/UserContext";
import CountingPage from "./pages/CountingPage";
import CountingListPage from "./pages/CountinListPage";
import ProductPage from "./pages/ProductPage";
import { Bounce, ToastContainer } from "react-toastify";
import { ProductContextProvider } from "./context/ProductContext";
import SearchByProductnamePage from "./pages/SearchByProductnamePage";
import SerialListPage from "./pages/SerialListPage";
function App() {
  return (
    <>
      <UserProvider>
        <ProductContextProvider>
          <ToastContainer
            position="top-center"
            autoClose={4000}
            hideProgressBar={false}
            newestOnTop={false}
            pauseOnHover
            pauseOnFocusLoss
            rtl={false}
            transition={Bounce}
            theme="colored"
            toastStyle={{
              width: "360px",
              maxWidth: "80vw",
              borderRadius: "12px",
              padding: "12px",
            }}
          />
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/barcodeScanner" element={<FullscreenScanner />} />
            <Route path="/toollogo" element={<CountingListPage />} />
            <Route path="/toollogo/serialList" element={<SerialListPage />} />
            <Route path="/toollogo/:countingId" element={<CountingPage />} />
            <Route
              path="/toollogo/:countingId/searchByProductName"
              element={<SearchByProductnamePage />}
            />
            <Route
              path="/toollogo/:countingId/:productId"
              element={<ProductPage />}
            />
          </Routes>
        </ProductContextProvider>
      </UserProvider>
    </>
  );
}

export default App;
