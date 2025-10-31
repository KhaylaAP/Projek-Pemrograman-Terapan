import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Package } from "lucide-react";

const HomePage = ({ isAuthenticated, onLogout }) => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-white">
      <nav className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-3">
              <Package className="h-8 w-8 text-blue-600" />
              <span className="text-xl font-semibold text-gray-900">Jeans Inventory</span>
            </div>
            <div className="flex items-center space-x-4">
              {isAuthenticated ? (
                <>
                  <Button 
                    data-testid="nav-dashboard-btn"
                    variant="ghost" 
                    onClick={() => navigate('/dashboard')}
                  >
                    Dashboard
                  </Button>
                  <Button 
                    data-testid="nav-suppliers-btn"
                    variant="ghost" 
                    onClick={() => navigate('/suppliers')}
                  >
                    Suppliers
                  </Button>
                  <Button 
                    data-testid="nav-logout-btn"
                    variant="outline" 
                    onClick={onLogout}
                    className="border-blue-600 text-blue-600 hover:bg-blue-50"
                  >
                    Logout
                  </Button>
                </>
              ) : (
                <Button 
                  data-testid="nav-login-btn"
                  onClick={() => navigate('/login')}
                  className="bg-blue-600 hover:bg-blue-700 text-white"
                >
                  Login
                </Button>
              )}
            </div>
          </div>
        </div>
      </nav>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="text-center">
          <div className="flex justify-center mb-8">
            <div className="bg-blue-100 p-6 rounded-full">
              <Package className="h-20 w-20 text-blue-600" />
            </div>
          </div>
          <h1 className="text-5xl font-bold text-gray-900 mb-6">
            Jeans Inventory Management
          </h1>
          <p className="text-xl text-gray-600 mb-12 max-w-2xl mx-auto">
            Manage your jeans inventory efficiently with our minimalist and easy-to-use interface. 
            Track stock, suppliers, and daily transactions all in one place.
          </p>
          <div className="flex justify-center space-x-4">
            {isAuthenticated ? (
              <Button 
                data-testid="home-dashboard-btn"
                size="lg" 
                onClick={() => navigate('/dashboard')}
                className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-6 text-lg"
              >
                Go to Dashboard
              </Button>
            ) : (
              <Button 
                data-testid="home-getstarted-btn"
                size="lg" 
                onClick={() => navigate('/login')}
                className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-6 text-lg"
              >
                Get Started
              </Button>
            )}
          </div>
        </div>

        <div className="mt-24 grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="bg-white p-8 rounded-lg shadow-sm border border-gray-200">
            <div className="bg-blue-100 w-12 h-12 rounded-lg flex items-center justify-center mb-4">
              <span className="text-2xl">📊</span>
            </div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">Track Stock</h3>
            <p className="text-gray-600">Monitor your jeans inventory in real-time with detailed stock information.</p>
          </div>
          <div className="bg-white p-8 rounded-lg shadow-sm border border-gray-200">
            <div className="bg-blue-100 w-12 h-12 rounded-lg flex items-center justify-center mb-4">
              <span className="text-2xl">🤝</span>
            </div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">Manage Suppliers</h3>
            <p className="text-gray-600">Keep track of all your jeans suppliers with contact and payment details.</p>
          </div>
          <div className="bg-white p-8 rounded-lg shadow-sm border border-gray-200">
            <div className="bg-blue-100 w-12 h-12 rounded-lg flex items-center justify-center mb-4">
              <span className="text-2xl">📦</span>
            </div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">Daily Reports</h3>
            <p className="text-gray-600">View daily received and shipped items to stay on top of operations.</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HomePage;