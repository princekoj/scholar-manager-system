import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import ProtectedRoute from "./components/ProtectedRoute";
import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import Students from "./pages/Students";
import StudentDetail from "./pages/StudentDetail";
import EditStudent from "./pages/EditStudent";
import RecordPayment from "./pages/RecordPayment";
import AddFee from "./pages/AddFee";
import AddParent from "./pages/AddParent";
import Fees from "./pages/Fees";
import Search from "./pages/Search";
import NotFound from "./pages/NotFound";
import Signup from './pages/Signup'

const queryClient = new QueryClient();

const App = () => {
  return (
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>
        <TooltipProvider>
          <Toaster />
          <Sonner />
          <Routes>
            <Route path="/" element={<Navigate to="/login" replace />} />
            <Route path="/login" element={<Login />} />
            <Route path="login/signup" element={<Signup />} />
            <Route 
              path="/dashboard" 
              element={
                <ProtectedRoute>
                  <Dashboard />
                </ProtectedRoute>
              } 
            />
            
            <Route 
              path="/students" 
              element={
                <ProtectedRoute>
                  <Students />
                </ProtectedRoute>
              } 
            />
            
            <Route 
              path="/students/:id" 
              element={
                <ProtectedRoute>
                  <StudentDetail />
                </ProtectedRoute>
              } 
            />
            
            <Route 
              path="/students/:id/edit" 
              element={
                <ProtectedRoute>
                  <EditStudent />
                </ProtectedRoute>
              } 
            />
            
            <Route 
              path="/students/:id/record-payment" 
              element={
                <ProtectedRoute>
                  <RecordPayment />
                </ProtectedRoute>
              } 
            />
            
            <Route 
              path="/students/:id/add-fee" 
              element={
                <ProtectedRoute>
                  <AddFee />
                </ProtectedRoute>
              } 
            />
            
            <Route 
              path="/students/:id/add-parent" 
              element={
                <ProtectedRoute>
                  <AddParent />
                </ProtectedRoute>
              } 
            />
            
            <Route 
              path="/fees" 
              element={
                <ProtectedRoute>
                  <Fees />
                </ProtectedRoute>
              } 
            />
            
            <Route 
              path="/search" 
              element={
                <ProtectedRoute>
                  <Search />
                </ProtectedRoute>
              } 
            />
            
            <Route path="*" element={<NotFound />} />
          </Routes>
        </TooltipProvider>
      </BrowserRouter>
    </QueryClientProvider>
  );
};

export default App;
