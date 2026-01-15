import "./App.css";

import { UserInfo, UserProvider } from "./context/UserContext";
import { Bounce, ToastContainer } from "react-toastify";
import { ProductContextProvider } from "./context/ProductContext";
import RootPage from "./Root";

declare global {
  interface Window {
    webkit?: {
      messageHandlers: {
        barcodeScanner: {
          postMessage: (message: string) => void;
        };
      };
    };
    onBarcodeScanned?: (result: string) => void;
    setUserInfo?: (userInfo: UserInfo) => void;
    tokenRenewResolve?: (value?: void | PromiseLike<void>) => void;
  }
}
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
          <RootPage />
        </ProductContextProvider>
      </UserProvider>
    </>
  );
}

export default App;
