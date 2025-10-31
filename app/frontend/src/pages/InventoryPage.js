import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { API } from "@/App";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Package, Plus, Edit, Trash2, TrendingUp, TrendingDown, Search } from "lucide-react";
import { toast } from "sonner";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger, DialogFooter } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

const InventoryPage = ({ onLogout }) => {
  const navigate = useNavigate();
  const [inventory, setInventory] = useState([]);
  const [products, setProducts] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isTransactionDialogOpen, setIsTransactionDialogOpen] = useState(false);
  const [transactionType, setTransactionType] = useState("");
  const [selectedItem, setSelectedItem] = useState(null);
  const [formData, setFormData] = useState({
    id_produk: "",
    tipe_jeans: "",
    ukuran: "",
    quantitas: 0
  });
  const [transactionQuantity, setTransactionQuantity] = useState(0);

  useEffect(() => {
    fetchInventory();
    fetchProducts();
  }, []);

  const fetchInventory = async (search = "") => {
    try {
      const url = search ? `${API}/inventory?search=${search}` : `${API}/inventory`;
      const response = await axios.get(url);
      setInventory(response.data);
    } catch (error) {
      toast.error("Failed to fetch inventory");
    }
  };

  const fetchProducts = async () => {
    try {
      const response = await axios.get(`${API}/produk`);
      setProducts(response.data);
    } catch (error) {
      toast.error("Failed to fetch products");
    }
  };

  const handleSearch = () => {
    fetchInventory(searchTerm);
  };

  const handleAddItem = async () => {
    try {
      await axios.post(`${API}/inventory`, formData);
      toast.success("Inventory item added successfully");
      setIsAddDialogOpen(false);
      setFormData({ id_produk: "", tipe_jeans: "", ukuran: "", quantitas: 0 });
      fetchInventory(searchTerm);
    } catch (error) {
      toast.error("Failed to add inventory item");
    }
  };

  const handleEditItem = async () => {
    try {
      await axios.put(`${API}/inventory/${selectedItem.id_inventory}`, formData);
      toast.success("Inventory item updated successfully");
      setIsEditDialogOpen(false);
      setSelectedItem(null);
      setFormData({ id_produk: "", tipe_jeans: "", ukuran: "", quantitas: 0 });
      fetchInventory(searchTerm);
    } catch (error) {
      toast.error("Failed to update inventory item");
    }
  };

  const handleDeleteItem = async (id) => {
    if (!window.confirm("Are you sure you want to delete this inventory item?")) return;
    try {
      await axios.delete(`${API}/inventory/${id}`);
      toast.success("Inventory item deleted successfully");
      fetchInventory(searchTerm);
    } catch (error) {
      toast.error("Failed to delete inventory item");
    }
  };

  const handleTransaction = async () => {
    try {
      const endpoint = transactionType === 'receive' ? 'receive' : 'ship';
      await axios.post(`${API}/inventory/${endpoint}`, {
        inventory_id: selectedItem.id_inventory,
        quantity: parseInt(transactionQuantity),
        transaction_type: transactionType
      });
      toast.success(`Stock ${transactionType === 'receive' ? 'received' : 'shipped'} successfully`);
      setIsTransactionDialogOpen(false);
      setSelectedItem(null);
      setTransactionQuantity(0);
      fetchInventory(searchTerm);
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
      id_produk: item.id_produk,
      tipe_jeans: item.tipe_jeans,
      ukuran: item.ukuran,
      quantitas: item.quantitas
    });
    setIsEditDialogOpen(true);
  };

  const openTransactionDialog = (item, type) => {
    setSelectedItem(item);
    setTransactionType(type);
    setTransactionQuantity(0);
    setIsTransactionDialogOpen(true);
  };

  const getProductInfo = (id) => {
    const product = products.find(p => p.id_produk === id);
    return product ? `${product.merk} - ${product.model}` : id;
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
              <Button data-testid="nav-dashboard-btn" variant="ghost" onClick={() => navigate('/dashboard')}>Dashboard</Button>
              <Button data-testid="nav-kategori-btn" variant="ghost" onClick={() => navigate('/kategori')}>Kategori</Button>
              <Button data-testid="nav-produk-btn" variant="ghost" onClick={() => navigate('/produk')}>Produk</Button>
              <Button data-testid="nav-inventory-btn" variant="ghost" className="text-blue-600">Inventory</Button>
              <Button data-testid="nav-suppliers-btn" variant="ghost" onClick={() => navigate('/suppliers')}>Suppliers</Button>
              <Button data-testid="nav-logout-btn" variant="outline" onClick={onLogout} className="border-blue-600 text-blue-600 hover:bg-blue-50">Logout</Button>
            </div>
          </div>
        </div>
      </nav>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Inventory</h1>
          <p className="text-gray-600">Track jeans inventory items</p>
        </div>

        <Card className="shadow-sm">
          <CardHeader>
            <div className="flex justify-between items-center">
              <CardTitle className="text-xl font-semibold">Inventory Items</CardTitle>
              <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
                <DialogTrigger asChild>
                  <Button data-testid="add-inventory-btn" className="bg-blue-600 hover:bg-blue-700 text-white">
                    <Plus className="h-4 w-4 mr-2" />
                    Add Inventory
                  </Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Add New Inventory Item</DialogTitle>
                    <DialogDescription>Add a new jeans inventory item</DialogDescription>
                  </DialogHeader>
                  <div className="space-y-4 py-4">
                    <div className="space-y-2">
                      <Label>Product</Label>
                      <Select value={formData.id_produk} onValueChange={(val) => setFormData({...formData, id_produk: val})}>
                        <SelectTrigger data-testid="add-produk-select">
                          <SelectValue placeholder="Select product" />
                        </SelectTrigger>
                        <SelectContent>
                          {products.map(prod => <SelectItem key={prod.id_produk} value={prod.id_produk}>{prod.merk} - {prod.model} ({prod.kode_produk})</SelectItem>)}
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-2">
                      <Label>Jeans Type</Label>
                      <Input data-testid="add-tipe-input" placeholder="e.g., Slim Fit, Straight, Bootcut" value={formData.tipe_jeans} onChange={(e) => setFormData({...formData, tipe_jeans: e.target.value})} />
                    </div>
                    <div className="space-y-2">
                      <Label>Size</Label>
                      <Input data-testid="add-ukuran-input" placeholder="e.g., 28, 30, 32, 34" value={formData.ukuran} onChange={(e) => setFormData({...formData, ukuran: e.target.value})} />
                    </div>
                    <div className="space-y-2">
                      <Label>Quantity</Label>
                      <Input data-testid="add-quantitas-input" type="number" value={formData.quantitas} onChange={(e) => setFormData({...formData, quantitas: parseInt(e.target.value)})} />
                    </div>
                  </div>
                  <DialogFooter>
                    <Button data-testid="add-inventory-submit-btn" onClick={handleAddItem} className="bg-blue-600 hover:bg-blue-700">Add Item</Button>
                  </DialogFooter>
                </DialogContent>
              </Dialog>
            </div>
            <div className="mt-4 flex space-x-2">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <Input data-testid="search-input" placeholder="Search by jeans type or size..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} onKeyPress={(e) => e.key === 'Enter' && handleSearch()} className="pl-10" />
              </div>
              <Button data-testid="search-btn" onClick={handleSearch} className="bg-blue-600 hover:bg-blue-700 text-white">Search</Button>
            </div>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b">
                    <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700">Product</th>
                    <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700">Jeans Type</th>
                    <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700">Size</th>
                    <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700">Quantity</th>
                    <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {inventory.map((item) => (
                    <tr key={item.id_inventory} className="border-b hover:bg-gray-50" data-testid={`inventory-row-${item.id_inventory}`}>
                      <td className="py-3 px-4 text-sm text-gray-900">{getProductInfo(item.id_produk)}</td>
                      <td className="py-3 px-4 text-sm text-gray-700">{item.tipe_jeans}</td>
                      <td className="py-3 px-4 text-sm text-gray-700">{item.ukuran}</td>
                      <td className="py-3 px-4 text-sm">
                        <span className={`font-semibold ${item.quantitas < 10 ? 'text-red-600' : 'text-gray-900'}`}>
                          {item.quantitas}
                        </span>
                      </td>
                      <td className="py-3 px-4 text-sm">
                        <div className="flex space-x-2">
                          <Button data-testid={`receive-btn-${item.id_inventory}`} size="sm" variant="outline" className="border-green-600 text-green-600 hover:bg-green-50" onClick={() => openTransactionDialog(item, 'receive')}>
                            <TrendingUp className="h-4 w-4 mr-1" />
                            Receive
                          </Button>
                          <Button data-testid={`ship-btn-${item.id_inventory}`} size="sm" variant="outline" className="border-orange-600 text-orange-600 hover:bg-orange-50" onClick={() => openTransactionDialog(item, 'ship')}>
                            <TrendingDown className="h-4 w-4 mr-1" />
                            Ship
                          </Button>
                          <Button data-testid={`edit-btn-${item.id_inventory}`} size="sm" variant="ghost" onClick={() => openEditDialog(item)}>
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button data-testid={`delete-btn-${item.id_inventory}`} size="sm" variant="ghost" onClick={() => handleDeleteItem(item.id_inventory)}>
                            <Trash2 className="h-4 w-4 text-red-600" />
                          </Button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
              {inventory.length === 0 && <div className="text-center py-12 text-gray-500">No inventory items found</div>}
            </div>
          </CardContent>
        </Card>
      </div>

      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit Inventory Item</DialogTitle>
            <DialogDescription>Update inventory item details</DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label>Product</Label>
              <Select value={formData.id_produk} onValueChange={(val) => setFormData({...formData, id_produk: val})}>
                <SelectTrigger data-testid="edit-produk-select">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {products.map(prod => <SelectItem key={prod.id_produk} value={prod.id_produk}>{prod.merk} - {prod.model} ({prod.kode_produk})</SelectItem>)}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label>Jeans Type</Label>
              <Input data-testid="edit-tipe-input" value={formData.tipe_jeans} onChange={(e) => setFormData({...formData, tipe_jeans: e.target.value})} />
            </div>
            <div className="space-y-2">
              <Label>Size</Label>
              <Input data-testid="edit-ukuran-input" value={formData.ukuran} onChange={(e) => setFormData({...formData, ukuran: e.target.value})} />
            </div>
            <div className="space-y-2">
              <Label>Quantity</Label>
              <Input data-testid="edit-quantitas-input" type="number" value={formData.quantitas} onChange={(e) => setFormData({...formData, quantitas: parseInt(e.target.value)})} />
            </div>
          </div>
          <DialogFooter>
            <Button data-testid="edit-inventory-submit-btn" onClick={handleEditItem} className="bg-blue-600 hover:bg-blue-700">Update Item</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={isTransactionDialogOpen} onOpenChange={setIsTransactionDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{transactionType === 'receive' ? 'Receive Stock' : 'Ship Stock'}</DialogTitle>
            <DialogDescription>
              {transactionType === 'receive' ? 'Add stock to this inventory item' : 'Remove stock from this inventory item'}
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label>Quantity</Label>
              <Input data-testid="transaction-quantity-input" type="number" min="1" value={transactionQuantity} onChange={(e) => setTransactionQuantity(e.target.value)} />
            </div>
          </div>
          <DialogFooter>
            <Button data-testid="transaction-submit-btn" onClick={handleTransaction} className={transactionType === 'receive' ? 'bg-green-600 hover:bg-green-700' : 'bg-orange-600 hover:bg-orange-700'}>
              {transactionType === 'receive' ? 'Receive' : 'Ship'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default InventoryPage;