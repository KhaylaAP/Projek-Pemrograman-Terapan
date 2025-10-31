import { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { API } from "@/App";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Package } from "lucide-react";
import { toast } from "sonner";

const LoginPage = ({ onLogin }) => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await axios.post(`${API}/login`, {
        username,
        password
      });

      if (response.data.success) {
        toast.success("Login successful!");
        onLogin();
        navigate("/dashboard");
      }
    } catch (error) {
      const errorMessage = error.response?.data?.detail 
        ? (Array.isArray(error.response.data.detail) 
           ? error.response.data.detail.map(e => e.msg).join(', ')
           : error.response.data.detail)
        : "Login failed. Please try again.";
      toast.error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-white flex items-center justify-center p-4">
      <Card className="w-full max-w-md shadow-lg border-gray-200">
        <CardHeader className="text-center space-y-4">
          <div className="flex justify-center">
            <div className="bg-blue-100 p-4 rounded-full">
              <Package className="h-12 w-12 text-blue-600" />
            </div>
          </div>
          <CardTitle className="text-2xl font-bold text-gray-900">Welcome Back</CardTitle>
          <CardDescription className="text-gray-600">
            Login to access your inventory management system
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4" data-testid="login-form">
            <div className="space-y-2">
              <Label htmlFor="username" className="text-gray-700">Username</Label>
              <Input
                id="username"
                data-testid="login-username-input"
                type="text"
                placeholder="Enter your username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                required
                className="border-gray-300 focus:border-blue-600 focus:ring-blue-600"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="password" className="text-gray-700">Password</Label>
              <Input
                id="password"
                data-testid="login-password-input"
                type="password"
                placeholder="Enter your password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="border-gray-300 focus:border-blue-600 focus:ring-blue-600"
              />
            </div>
            <Button 
              data-testid="login-submit-btn"
              type="submit" 
              className="w-full bg-blue-600 hover:bg-blue-700 text-white"
              disabled={loading}
            >
              {loading ? "Logging in..." : "Login"}
            </Button>
          </form>
          <div className="mt-4 text-center text-sm text-gray-600">
            <p>Demo credentials: admin / admin123</p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default LoginPage;