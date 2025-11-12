import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import OfferteRoute from "./pages/OfferteRoute";
import ShowroomRoute from "./pages/ShowroomRoute";
import InformatieRoute from "./pages/InformatieRoute";
import ThankYouOfferte from "./pages/ThankYouOfferte";
import ThankYouShowroom from "./pages/ThankYouShowroom";
import ThankYouInformatie from "./pages/ThankYouInformatie";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Index />} />
          <Route path="/offerte" element={<OfferteRoute />} />
          <Route path="/showroom" element={<ShowroomRoute />} />
          <Route path="/informatie" element={<InformatieRoute />} />
          <Route path="/bedankt/offerte" element={<ThankYouOfferte />} />
          <Route path="/bedankt/showroom" element={<ThankYouShowroom />} />
          <Route path="/bedankt/informatie" element={<ThankYouInformatie />} />
          {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
