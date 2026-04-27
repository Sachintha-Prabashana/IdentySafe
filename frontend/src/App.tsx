import { useEffect } from "react";
import { RouterProvider } from "react-router-dom";
import { router } from "./routes";
import { Toaster } from "react-hot-toast";
import { useAuthContext } from "@asgardeo/auth-react";
import { setupInterceptors } from "./service/api";

function App() {
  const { getAccessToken, state } = useAuthContext();

  useEffect(() => {
    if (state.isAuthenticated) {
        setupInterceptors(getAccessToken);
    }
  }, [getAccessToken, state.isAuthenticated]);

  return (
    <>
      <Toaster position="top-right" />
      <RouterProvider router={router} />
    </>
  );
}

export default App;