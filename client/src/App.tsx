import { Switch, Route, useLocation } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import NotFound from "@/pages/not-found";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import Home from "@/pages/Home";
import EventDetails from "@/pages/EventDetails";
import Calendar from "@/pages/Calendar";
import History from "@/pages/History";
import Gallery from "@/pages/Gallery";
import AdminLogin from "@/pages/AdminLogin"; 
import AdminEvents from "@/pages/AdminEvents";
import { ProtectedRoute } from "@/components/auth/ProtectedRoute";
import { useTranslation } from "react-i18next";
import { useEffect } from "react";
import { useLanguage } from "./context/LanguageContext";
import { AuthProvider } from "./hooks/use-auth";

function Router() {
  const [location] = useLocation();
  const isAdminRoute = location.startsWith('/admin');

  return (
    <Switch>
      <Route path="/" component={Home} />
      <Route path="/events/:id" component={EventDetails} />
      <Route path="/calendar" component={Calendar} />
      <Route path="/history" component={History} />
      <Route path="/gallery" component={Gallery} />
      <Route path="/admin-login" component={AdminLogin} />
      <ProtectedRoute path="/admin" component={AdminEvents} adminOnly={true} />
      <Route component={NotFound} />
    </Switch>
  );
}

function AppLayout() {
  const [location] = useLocation();
  const isAdminRoute = location.startsWith('/admin') || location === '/admin-login';

  return (
    <div className="flex flex-col min-h-screen">
      {!isAdminRoute && <Header />}
      <main className="flex-grow">
        <Router />
      </main>
      {!isAdminRoute && <Footer />}
    </div>
  );
}

function App() {
  const { language } = useLanguage();
  const { i18n } = useTranslation();
  
  useEffect(() => {
    i18n.changeLanguage(language);
    document.documentElement.lang = language;
  }, [language, i18n]);

  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <TooltipProvider>
          <Toaster />
          <AppLayout />
        </TooltipProvider>
      </AuthProvider>
    </QueryClientProvider>
  );
}

export default App;
