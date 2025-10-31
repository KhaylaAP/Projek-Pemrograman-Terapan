import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { API } from "@/App";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Package, TrendingUp, TrendingDown, AlertCircle, Search, Plus, Edit, Trash2 } from "lucide-react";
import { toast } from "sonner";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";

const DashboardPage = ({ onLogout }) => {
  const navigate = useNavigate();
  const [stats, setStats] = useState({
    total_stock: 0,
    received_today: 0,
    shipped_today: 0,
    low_stock_items: 0
  });
  const [inventory, setInventory] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isTransactionDialogOpen, setIsTransactionDialogOpen] = useState(false);
  const [transactionType, setTransactionType] = useState("");
  const [selectedItem, setSelectedItem] = useState(null);
  const [formData, setFormData] = useState({
    sku: "",
    size: "",
    color: "",
    quantity: 0,
    supplier: ""
  });
  const [transactionQuantity, setTransactionQuantity] = useState(0);

  useEffect(() => {
    fetchStats();
    fetchInventory();
  }, []);

  const fetchStats = async () => {
    try {
      const response = await axios.get(`${API}/dashboard/stats`);
      setStats(response.data);
    } catch (error) {
      toast.error("Failed to fetch dashboard stats");
    }
  };

  const fetchInventory = async (search = "") => {
    try {
      const url = search ? `${API}/inventory?search=${search}` : `${API}/inventory`;
      const response = await axios.get(url);
      setInventory(response.data);
    } catch (error) {
      toast.error("Failed to fetch inventory");
    }
  };

  const handleSearch = () => {
    fetchInventory(searchTerm);
  };

  const handleAddItem = async () => {
    try {
      await axios.post(`${API}/inventory`, formData);
      toast.success("Item added successfully");
      setIsAddDialogOpen(false);
      setFormData({ sku: "", size: "", color: "", quantity: 0, supplier: "" });
      fetchInventory(searchTerm);
      fetchStats();
    } catch (error) {
      toast.error("Failed to add item");
    }
  };

  const handleEditItem = async () => {
    try {
      await axios.put(`${API}/inventory/${selectedItem.id}`, formData);
      toast.success("Item updated successfully");
      setIsEditDialogOpen(false);
      setSelectedItem(null);
      setFormData({ sku: "", size: "", color: "", quantity: 0, supplier: "" });
      fetchInventory(searchTerm);
      fetchStats();
    } catch (error) {
      toast.error("Failed to update item");
    }
  };

  const handleDeleteItem = async (id) => {
    if (!window.confirm("Are you sure you want to delete this item?")) return;
    
    try {
      await axios.delete(`${API}/inventory/${id}`);
      toast.success("Item deleted successfully");
      fetchInventory(searchTerm);
      fetchStats();
    } catch (error) {
      toast.error("Failed to delete item");
    }
  };

  const handleTransaction = async () => {
    try {
      const endpoint = transactionType === 'receive' ? 'receive' : 'ship';
      await axios.post(`${API}/inventory/${endpoint}`, {
        inventory_id: selectedItem.id,
        quantity: parseInt(transactionQuantity),
        transaction_type: transactionType
      });
      toast.success(`Stock ${transactionType === 'receive' ? 'received' : 'shipped'} successfully`);
      setIsTransactionDialogOpen(false);
      setSelectedItem(null);
      setTransactionQuantity(0);
      fetchInventory(searchTerm);
      fetchStats();
    } catch (error) {
      const errorMessage = error.response?.data?.detail 
        ? (Array.isArray(error.response.data.detail) 
           ? error.response.data.detail.map(e => e.msg).join(', ')
           : error.response.data.detail)
        : "Transaction failed";
      toast.error(errorMessage);
    }
  };

  const openEditDialog = (item) => {
    setSelectedItem(item);
    setFormData({
      sku: item.sku,
      size: item.size,
      color: item.color,
      quantity: item.quantity,
      supplier: item.supplier
    });
    setIsEditDialogOpen(true);
  };

  const openTransactionDialog = (item, type) => {
    setSelectedItem(item);
    setTransactionType(type);
    setTransactionQuantity(0);
    setIsTransactionDialogOpen(true);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <nav className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-3">
              <Package className="h-8 w-8 text-blue-600" />
              <span className="text-xl font-semibold text-gray-900">Jeans Inventory</span>
            </div>
            <div className="flex items-center space-x-4">
              <Button data-testid="nav-dashboard-btn" variant="ghost" className="text-blue-600">Dashboard</Button>
              <Button data-testid="nav-kategori-btn" variant="ghost" onClick={() => navigate('/kategori')}>Kategori</Button>
              <Button data-testid="nav-produk-btn" variant="ghost" onClick={() => navigate('/produk')}>Produk</Button>
              <Button data-testid="nav-inventory-btn" variant="ghost" onClick={() => navigate('/inventory')}>Inventory</Button>
              <Button data-testid="nav-suppliers-btn" variant="ghost" onClick={() => navigate('/suppliers')}>Suppliers</Button>
              <Button data-testid="nav-logout-btn" variant="outline" onClick={onLogout} className="border-blue-600 text-blue-600 hover:bg-blue-50">Logout</Button>
            </div>
          </div>
        </div>
      </nav>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Dashboard</h1>
          <p className="text-gray-600">Overview of your jeans inventory</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <Card className="border-blue-200 shadow-sm">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-gray-600">Total Stock</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-between">
                <p className="text-3xl font-bold text-gray-900" data-testid="stat-total-stock">{stats.total_stock}</p>
                <Package className="h-8 w-8 text-blue-600" />
              </div>
            </CardContent>
          </Card>

          <Card className="border-green-200 shadow-sm">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-gray-600">Received Today</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-between">
                <p className="text-3xl font-bold text-green-600" data-testid="stat-received-today">{stats.received_today}</p>
                <TrendingUp className="h-8 w-8 text-green-600" />
              </div>
            </CardContent>
          </Card>

          <Card className="border-orange-200 shadow-sm">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-gray-600">Shipped Today</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-between">
                <p className="text-3xl font-bold text-orange-600" data-testid="stat-shipped-today">{stats.shipped_today}</p>
                <TrendingDown className="h-8 w-8 text-orange-600" />
              </div>
            </CardContent>
          </Card>

          <Card className="border-red-200 shadow-sm">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-gray-600">Low Stock Items</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-between">
                <p className="text-3xl font-bold text-red-600" data-testid="stat-low-stock">{stats.low_stock_items}</p>
                <AlertCircle className="h-8 w-8 text-red-600" />
              </div>
            </CardContent>
          </Card>
        </div>

        <Card className="shadow-sm">
          <CardHeader>
            <div className="flex justify-between items-center">
              <CardTitle className="text-xl font-semibold">Inventory Items</CardTitle>
              <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
                <DialogTrigger asChild>
                  <Button data-testid="add-item-btn" className="bg-blue-600 hover:bg-blue-700 text-white">
                    <Plus className="h-4 w-4 mr-2" />
                    Add Item
                  </Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Add New Item</DialogTitle>
                    <DialogDescription>Add a new jeans item to your inventory</DialogDescription>
                  </DialogHeader>
                  <div className="space-y-4 py-4">
                    <div className="space-y-2">
                      <Label>SKU</Label>
                      <Input 
                        data-testid="add-sku-input"
                        value={formData.sku} 
                        onChange={(e) => setFormData({...formData, sku: e.target.value})} 
                      />
                    </div>
                    <div className="space-y-2">
                      <Label>Size</Label>
                      <Input 
                        data-testid="add-size-input"
                        value={formData.size} 
                        onChange={(e) => setFormData({...formData, size: e.target.value})} 
                      />
                    </div>
                    <div className="space-y-2">
                      <Label>Color</Label>
                      <Input 
                        data-testid="add-color-input"
                        value={formData.color} 
                        onChange={(e) => setFormData({...formData, color: e.target.value})} 
                      />
                    </div>
                    <div className="space-y-2">
                      <Label>Quantity</Label>
                      <Input 
                        data-testid="add-quantity-input"
                        type="number" 
                        value={formData.quantity} 
                        onChange={(e) => setFormData({...formData, quantity: parseInt(e.target.value)})} 
                      />
                    </div>
                    <div className="space-y-2">
                      <Label>Supplier</Label>
                      <Input 
                        data-testid="add-supplier-input"
                        value={formData.supplier} 
                        onChange={(e) => setFormData({...formData, supplier: e.target.value})} 
                      />
                    </div>
                  </div>
                  <DialogFooter>
                    <Button data-testid="add-item-submit-btn" onClick={handleAddItem} className="bg-blue-600 hover:bg-blue-700">Add Item</Button>
                  </DialogFooter>
                </DialogContent>
              </Dialog>
            </div>
            <div className="mt-4 flex space-x-2">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <Input
                  data-testid="search-input"
                  placeholder="Search by SKU, color, size, or supplier..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
                  className="pl-10"
                />
              </div>
              <Button data-testid="search-btn" onClick={handleSearch} className="bg-blue-600 hover:bg-blue-700 text-white">
                Search
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b">
                    <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700">SKU</th>
                    <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700">Size</th>
                    <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700">Color</th>
                    <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700">Quantity</th>
                    <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700">Supplier</th>
                    <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {inventory.map((item) => (
                    <tr key={item.id} className="border-b hover:bg-gray-50" data-testid={`inventory-row-${item.id}`}>
                      <td className="py-3 px-4 text-sm text-gray-900">{item.sku}</td>
                      <td className="py-3 px-4 text-sm text-gray-700">{item.size}</td>
                      <td className="py-3 px-4 text-sm text-gray-700">{item.color}</td>
                      <td className="py-3 px-4 text-sm">
                        <span className={`font-semibold ${item.quantity < 10 ? 'text-red-600' : 'text-gray-900'}`}>
                          {item.quantity}
                        </span>
                      </td>
                      <td className="py-3 px-4 text-sm text-gray-700">{item.supplier}</td>
                      <td className="py-3 px-4 text-sm">
                        <div className="flex space-x-2">
                          <Button 
                            data-testid={`receive-btn-${item.id}`}
                            size="sm" 
                            variant="outline" 
                            className="border-green-600 text-green-600 hover:bg-green-50"
                            onClick={() => openTransactionDialog(item, 'receive')}
                          >
                            Receive
                          </Button>
                          <Button 
                            data-testid={`ship-btn-${item.id}`}
                            size="sm" 
                            variant="outline" 
                            className="border-orange-600 text-orange-600 hover:bg-orange-50"
                            onClick={() => openTransactionDialog(item, 'ship')}
                          >
                            Ship
                          </Button>
                          <Button 
                            data-testid={`edit-btn-${item.id}`}
                            size="sm" 
                            variant="ghost"
                            onClick={() => openEditDialog(item)}
                          >
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button 
                            data-testid={`delete-btn-${item.id}`}
                            size="sm" 
                            variant="ghost"
                            onClick={() => handleDeleteItem(item.id)}
                          >
                            <Trash2 className="h-4 w-4 text-red-600" />
                          </Button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
              {inventory.length === 0 && (
                <div className="text-center py-12 text-gray-500">
                  No inventory items found
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Edit Dialog */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit Item</DialogTitle>
            <DialogDescription>Update the details of this inventory item</DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label>SKU</Label>
              <Input 
                data-testid="edit-sku-input"
                value={formData.sku} 
                onChange={(e) => setFormData({...formData, sku: e.target.value})} 
              />
            </div>
            <div className="space-y-2">
              <Label>Size</Label>
              <Input 
                data-testid="edit-size-input"
                value={formData.size} 
                onChange={(e) => setFormData({...formData, size: e.target.value})} 
              />
            </div>
            <div className="space-y-2">
              <Label>Color</Label>
              <Input 
                data-testid="edit-color-input"
                value={formData.color} 
                onChange={(e) => setFormData({...formData, color: e.target.value})} 
              />
            </div>
            <div className="space-y-2">
              <Label>Quantity</Label>
              <Input 
                data-testid="edit-quantity-input"
                type="number" 
                value={formData.quantity} 
                onChange={(e) => setFormData({...formData, quantity: parseInt(e.target.value)})} 
              />
            </div>
            <div className="space-y-2">
              <Label>Supplier</Label>
              <Input 
                data-testid="edit-supplier-input"
                value={formData.supplier} 
                onChange={(e) => setFormData({...formData, supplier: e.target.value})} 
              />
            </div>
          </div>
          <DialogFooter>
            <Button data-testid="edit-item-submit-btn" onClick={handleEditItem} className="bg-blue-600 hover:bg-blue-700">Update Item</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Transaction Dialog */}
      <Dialog open={isTransactionDialogOpen} onOpenChange={setIsTransactionDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{transactionType === 'receive' ? 'Receive Stock' : 'Ship Stock'}</DialogTitle>
            <DialogDescription>
              {transactionType === 'receive' 
                ? 'Add stock to this inventory item' 
                : 'Remove stock from this inventory item'}
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label>Quantity</Label>
              <Input 
                data-testid="transaction-quantity-input"
                type="number" 
                min="1"
                value={transactionQuantity} 
                onChange={(e) => setTransactionQuantity(e.target.value)} 
              />
            </div>
          </div>
          <DialogFooter>
            <Button 
              data-testid="transaction-submit-btn"
              onClick={handleTransaction} 
              className={transactionType === 'receive' ? 'bg-green-600 hover:bg-green-700' : 'bg-orange-600 hover:bg-orange-700'}
            >
              {transactionType === 'receive' ? 'Receive' : 'Ship'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default DashboardPage;