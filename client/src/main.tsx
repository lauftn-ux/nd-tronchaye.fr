import { createRoot } from "react-dom/client";
import App from "./App";
import "./index.css";
import { LanguageProvider } from "./context/LanguageContext";
import "./lib/i18n";
import { QueryClientProvider } from "@tanstack/react-query";
import { queryClient } from "./lib/queryClient";
import { AuthProvider } from "./hooks/use-auth";
import { Toaster } from "@/components/ui/toaster";

// Send session cookies with every fetch by default.
const originalFetch = window.fetch;
window.fetch = function (input, init) {
  init = init ?? {};
  init.credentials = init.credentials ?? "include";
  return originalFetch(input, init);
};

createRoot(document.getElementById("root")!).render(
  <QueryClientProvider client={queryClient}>
    <AuthProvider>
      <LanguageProvider>
        <App />
      </LanguageProvider>
      <Toaster />
    </AuthProvider>
  </QueryClientProvider>
);
