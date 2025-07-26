import "./global.css";

import { Toaster } from "@/components/ui/toaster";
import { createRoot } from "react-dom/client";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider } from "./src/contexts/AuthContext";
import AdminIndex from "./pages/admin/Index";
import AdminAiCharacters from "./pages/admin/AiCharacters";
import AdminApiSettings from "./pages/admin/ApiSettings";
import AdminCategories from "./pages/admin/Categories";
import AdminCharacters from "./pages/admin/Characters";
import AdminImages from "./pages/admin/Images";
import AdminNotFound from "./pages/admin/NotFound";
import AdminPosts from "./pages/admin/Posts";
import AdminTokenSettings from "./pages/admin/TokenSettings";
import AdminVideos from "./pages/admin/Videos";

import AuthIndex from "./pages/auth/Index";
import AuthLogin from "./pages/auth/Login";
import AuthNotFound from "./pages/auth/NotFound";
import AuthCallback from "./pages/auth/Callback";

import ChatIndex from "./pages/chat/Index";
import ChatNotFound from "./pages/chat/NotFound";

import GeneralAIImageGeneration from "./pages/general/AIImageGeneration";
import GeneralAIVideoGeneration from "./pages/general/AIVideoGeneration";
import GeneralDashboard from "./pages/general/Dashboard";
import GeneralImageDetails from "./pages/general/ImageDetails";
import GeneralIndex from "./pages/general/Index";
import GeneralNotFound from "./pages/general/NotFound";

import ProtectedRoute from "./components/ProtectedRoute";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <AuthProvider>
          <Routes>
          <Route path="/" element={<AuthIndex />} />
          <Route path="/login" element={<AuthLogin />} />
          <Route path="/register" element={<AuthIndex />} />
          <Route path="/auth/callback" element={<AuthCallback />} />

          {/* Admin Panel Routes */}
          <Route path="/admin" element={<AdminIndex />} />
          <Route path="/admin/ai-characters" element={<AdminAiCharacters />} />
          <Route path="/admin/apisettings" element={<AdminApiSettings />} />
          <Route path="/admin/categories" element={<AdminCategories />} />
          <Route path="/admin/characters" element={<AdminCharacters />} />
          <Route path="/admin/images" element={<AdminImages />} />
          <Route path="/admin/posts" element={<AdminPosts />} />
          <Route path="/admin/token-settings" element={<AdminTokenSettings />} />
          <Route path="/admin/videos" element={<AdminVideos />} />
          <Route path="/admin/*" element={<AdminNotFound />} />

          {/* Chat Routes */}
          <Route path="/chat" element={<ChatIndex />} />
          <Route path="/chat/*" element={<ChatNotFound />} />

          {/* General Pages */}
          <Route
            path="/dashboard"
            element={
              <ProtectedRoute>
                <GeneralDashboard />
              </ProtectedRoute>
            }
          />
          <Route path="/aiimagegeneration" element={<GeneralAIImageGeneration />} />
          <Route path="/aivideogeneration" element={<GeneralAIVideoGeneration />} />
          <Route path="/imagedetails" element={<GeneralImageDetails />} />
          <Route path="/general" element={<GeneralIndex />} />
          <Route path="/general/*" element={<GeneralNotFound />} />

          {/* Catch-all NotFound */}
          <Route path="*" element={<AuthNotFound />} />
        </Routes>
          </AuthProvider>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

createRoot(document.getElementById("root")!).render(<App />);
