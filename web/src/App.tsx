import React from "react";
import { CookiesProvider } from "react-cookie";
import { QueryClientProvider } from "react-query";

import { AuthContextProvider } from "./contexts/auth";
import { AxiosContextProvider } from "./contexts/axios";
import AppRoutes from "./routes";
import { queryClient } from "./services/queryClient";

const App: React.FC = () => {
  return (
    <QueryClientProvider client={queryClient}>
      <CookiesProvider>
        <AxiosContextProvider>
          <AuthContextProvider>
            <AppRoutes />
          </AuthContextProvider>
        </AxiosContextProvider>
      </CookiesProvider>
    </QueryClientProvider>
  );
};

export default App;
{
  /* <a href="https://www.flaticon.com/free-icons/beach" title="beach icons">Beach icons created by Smashicons - Flaticon</a> */
}
