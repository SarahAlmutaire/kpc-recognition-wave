
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import NotFound from "./pages/NotFound";
import MyRequestsPage from "./pages/MyRequestsPage";
import ApprovalsPage from "./pages/ApprovalsPage";
import EmployeeSubmissionsPage from "./pages/EmployeeSubmissionsPage";
import ReportsPage from "./pages/ReportsPage";
import { MainLayout } from "./components/layout/MainLayout";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Index />} />
          <Route path="/my-requests" element={
            <MainLayout>
              <MyRequestsPage />
            </MainLayout>
          } />
          <Route path="/approvals" element={
            <MainLayout>
              <ApprovalsPage />
            </MainLayout>
          } />
          <Route path="/submissions" element={
            <MainLayout>
              <EmployeeSubmissionsPage />
            </MainLayout>
          } />
          <Route path="/reports" element={
            <MainLayout>
              <ReportsPage />
            </MainLayout>
          } />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
