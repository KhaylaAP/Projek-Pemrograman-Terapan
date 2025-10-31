import { useState, useEffect } from "react";
import "@/App.css";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import axios from "axios";
import LoginPage from "@/pages/LoginPage";
import DashboardPage from "@/pages/DashboardPage";
import SuppliersPage from "@/pages/SuppliersPage";
import KategoriPage from "@/pages/KategoriPage";
import ProdukPage from "@/pages/ProdukPage";
import InventoryPage from "@/pages/InventoryPage";
import { Toaster } from "@/components/ui/sonner";

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;
export const API = `${BACKEND_URL}/api`;

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    const auth = localStorage.getItem('isAuthenticated');
    if (auth === 'true') {
      setIsAuthenticated(true);
    }
  }, []);

  const handleLogin = () => {
    localStorage.setItem('isAuthenticated', 'true');
    setIsAuthenticated(true);
  };

  const handleLogout = () => {
    localStorage.removeItem('isAuthenticated');
    setIsAuthenticated(false);
  };

  return (
    <div className="App">
      <BrowserRouter>
        <Routes>
          <Route 
            path="/" 
            element={isAuthenticated ? <Navigate to="/dashboard" /> : <Navigate to="/login" />} 
          />
          <Route 
            path="/login" 
            element={
              isAuthenticated ? <Navigate to="/dashboard" /> : <LoginPage onLogin={handleLogin} />
            } 
          />
          <Route 
            path="/dashboard" 
            element={
              isAuthenticated ? <DashboardPage onLogout={handleLogout} /> : <Navigate to="/login" />
            } 
          />
          <Route 
            path="/suppliers" 
            element={
              isAuthenticated ? <SuppliersPage onLogout={handleLogout} /> : <Navigate to="/login" />
            } 
          />
          <Route 
            path="/kategori" 
            element={
              isAuthenticated ? <KategoriPage onLogout={handleLogout} /> : <Navigate to="/login" />
            } 
          />
          <Route 
            path="/produk" 
            element={
              isAuthenticated ? <ProdukPage onLogout={handleLogout} /> : <Navigate to="/login" />
            } 
          />
          <Route 
            path="/inventory" 
            element={
              isAuthenticated ? <InventoryPage onLogout={handleLogout} /> : <Navigate to="/login" />
            } 
          />
        </Routes>
      </BrowserRouter>
      <Toaster position="top-right" />
    </div>
  );
}

export default App;