import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.jsx";
import { BrowserRouter } from "react-router-dom";
import { GoogleOAuthProvider } from "@react-oauth/google";
import SearchContext from "./context/SearchContext.jsx";
import RouterGuardContext from "./context/RouterGuardContext";

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <BrowserRouter>
      <GoogleOAuthProvider clientId="202367305072-8gecttvjpfpeoktuig5sevh6vdiupbgu.apps.googleusercontent.com">
        <SearchContext>
          <RouterGuardContext>
            <App />
          </RouterGuardContext>
        </SearchContext>
      </GoogleOAuthProvider>
    </BrowserRouter>
  </StrictMode>,
);
