import "./App.css";

import { UserProvider } from "./context/UserContext";
import { Bounce, ToastContainer } from "react-toastify";
import { ProductContextProvider } from "./context/ProductContext";
import RootPage from "./Root";

function App() {
  if ("scrollRestoration" in window.history) {
    window.history.scrollRestoration = "manual";
  }

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
