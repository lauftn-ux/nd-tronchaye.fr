import { createRoot } from "react-dom/client";
import App from "./App";
import "./index.css";
import { LanguageProvider } from "./context/LanguageContext";
import "./lib/i18n";
import { QueryClientProvider } from "@tanstack/react-query";
import { queryClient } from "./lib/queryClient";
import { ThemeProvider } from "./components/theme-provider";
import { AuthProvider } from "./hooks/use-auth";
import { Toaster } from "./components/ui/toaster";

// Indique que nous voulons envoyer les cookies avec chaque requête
const originalFetch = window.fetch;
window.fetch = function(input, init) {
  init = init || {};
  init.credentials = init.credentials || 'include';
  console.log('Fetch intercepted:', input, 'with credentials mode:', init.credentials);
  return originalFetch(input, init);
};

createRoot(document.getElementById("root")!).render(
  <ThemeProvider>
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <LanguageProvider>
          <App />
        </LanguageProvider>
      </AuthProvider>
      <Toaster />
    </QueryClientProvider>
  </ThemeProvider>
);
