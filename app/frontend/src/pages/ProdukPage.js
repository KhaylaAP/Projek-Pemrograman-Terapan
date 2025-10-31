import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { API } from "@/App";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Package, Plus, Edit, Trash2, Search } from "lucide-react";
import { toast } from "sonner";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger, DialogFooter } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

const ProdukPage = ({ onLogout }) => {
  const navigate = useNavigate();
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [suppliers, setSuppliers] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [formData, setFormData] = useState({
    id_kategori: "",
    id_supplier: "",
    kode_produk: "",
    merk: "",
    model: "",
    ukuran: "",
    harga: 0,
    jumlah_stok: 0
  });

  useEffect(() => {
    fetchProducts();
    fetchCategories();
    fetchSuppliers();
  }, []);

  const fetchProducts = async (search = "") => {
    try {
      const url = search ? `${API}/produk?search=${search}` : `${API}/produk`;
      const response = await axios.get(url);
      setProducts(response.data);
    } catch (error) {
      toast.error("Failed to fetch products");
    }
  };

  const fetchCategories = async () => {
    try {
      const response = await axios.get(`${API}/kategori`);
      setCategories(response.data);
    } catch (error) {
      toast.error("Failed to fetch categories");
    }
  };

  const fetchSuppliers = async () => {
    try {
      const response = await axios.get(`${API}/suppliers`);
      setSuppliers(response.data);
    } catch (error) {
      toast.error("Failed to fetch suppliers");
    }
  };

  const handleSearch = () => {
    fetchProducts(searchTerm);
  };

  const handleAddProduct = async () => {
    try {
      await axios.post(`${API}/produk`, formData);
      toast.success("Product added successfully");
      setIsAddDialogOpen(false);
      setFormData({ id_kategori: "", id_supplier: "", kode_produk: "", merk: "", model: "", ukuran: "", harga: 0, jumlah_stok: 0 });
      fetchProducts(searchTerm);
    } catch (error) {
      toast.error("Failed to add product");
    }
  };

  const handleEditProduct = async () => {
    try {
      await axios.put(`${API}/produk/${selectedProduct.id_produk}`, formData);
      toast.success("Product updated successfully");
      setIsEditDialogOpen(false);
      setSelectedProduct(null);
      setFormData({ id_kategori: "", id_supplier: "", kode_produk: "", merk: "", model: "", ukuran: "", harga: 0, jumlah_stok: 0 });
      fetchProducts(searchTerm);
    } catch (error) {
      toast.error("Failed to update product");
    }
  };

  const handleDeleteProduct = async (id) => {
    if (!window.confirm("Are you sure you want to delete this product?")) return;
    try {
      await axios.delete(`${API}/produk/${id}`);
      toast.success("Product deleted successfully");
      fetchProducts(searchTerm);
    } catch (error) {
      toast.error("Failed to delete product");
    }
  };

  const openEditDialog = (product) => {
    setSelectedProduct(product);
    setFormData({
      id_kategori: product.id_kategori,
      id_supplier: product.id_supplier,
      kode_produk: product.kode_produk,
      merk: product.merk,
      model: product.model,
      ukuran: product.ukuran,
      harga: product.harga,
      jumlah_stok: product.jumlah_stok
    });
    setIsEditDialogOpen(true);
  };

  const getCategoryName = (id) => {
    const cat = categories.find(c => c.id_kategori === id);
    return cat ? cat.nama_kategori : id;
  };

  const getSupplierName = (id) => {
    const sup = suppliers.find(s => s.id_supplier === id);
    return sup ? sup.namaSupplier : id;
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
              <Button data-testid="nav-produk-btn" variant="ghost" className="text-blue-600">Produk</Button>
              <Button data-testid="nav-inventory-btn" variant="ghost" onClick={() => navigate('/inventory')}>Inventory</Button>
              <Button data-testid="nav-suppliers-btn" variant="ghost" onClick={() => navigate('/suppliers')}>Suppliers</Button>
              <Button data-testid="nav-logout-btn" variant="outline" onClick={onLogout} className="border-blue-600 text-blue-600 hover:bg-blue-50">Logout</Button>
            </div>
          </div>
        </div>
      </nav>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Produk</h1>
          <p className="text-gray-600">Manage jeans products</p>
        </div>

        <Card className="shadow-sm">
          <CardHeader>
            <div className="flex justify-between items-center">
              <CardTitle className="text-xl font-semibold">Product List</CardTitle>
              <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
                <DialogTrigger asChild>
                  <Button data-testid="add-product-btn" className="bg-blue-600 hover:bg-blue-700 text-white">
                    <Plus className="h-4 w-4 mr-2" />
                    Add Product
                  </Button>
                </DialogTrigger>
                <DialogContent className="max-w-2xl">
                  <DialogHeader>
                    <DialogTitle>Add New Product</DialogTitle>
                    <DialogDescription>Add a new jeans product</DialogDescription>
                  </DialogHeader>
                  <div className="grid grid-cols-2 gap-4 py-4">
                    <div className="space-y-2">
                      <Label>Product Code</Label>
                      <Input data-testid="add-kode-input" value={formData.kode_produk} onChange={(e) => setFormData({...formData, kode_produk: e.target.value})} />
                    </div>
                    <div className="space-y-2">
                      <Label>Brand (Merk)</Label>
                      <Input data-testid="add-merk-input" value={formData.merk} onChange={(e) => setFormData({...formData, merk: e.target.value})} />
                    </div>
                    <div className="space-y-2">
                      <Label>Model</Label>
                      <Input data-testid="add-model-input" value={formData.model} onChange={(e) => setFormData({...formData, model: e.target.value})} />
                    </div>
                    <div className="space-y-2">
                      <Label>Size (Ukuran)</Label>
                      <Input data-testid="add-ukuran-input" value={formData.ukuran} onChange={(e) => setFormData({...formData, ukuran: e.target.value})} />
                    </div>
                    <div className="space-y-2">
                      <Label>Price (Harga)</Label>
                      <Input data-testid="add-harga-input" type="number" value={formData.harga} onChange={(e) => setFormData({...formData, harga: parseFloat(e.target.value)})} />
                    </div>
                    <div className="space-y-2">
                      <Label>Stock (Jumlah Stok)</Label>
                      <Input data-testid="add-stok-input" type="number" value={formData.jumlah_stok} onChange={(e) => setFormData({...formData, jumlah_stok: parseInt(e.target.value)})} />
                    </div>
                    <div className="space-y-2">
                      <Label>Category</Label>
                      <Select value={formData.id_kategori} onValueChange={(val) => setFormData({...formData, id_kategori: val})}>
                        <SelectTrigger data-testid="add-kategori-select">
                          <SelectValue placeholder="Select category" />
                        </SelectTrigger>
                        <SelectContent>
                          {categories.map(cat => <SelectItem key={cat.id_kategori} value={cat.id_kategori}>{cat.nama_kategori}</SelectItem>)}
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-2">
                      <Label>Supplier</Label>
                      <Select value={formData.id_supplier} onValueChange={(val) => setFormData({...formData, id_supplier: val})}>
                        <SelectTrigger data-testid="add-supplier-select">
                          <SelectValue placeholder="Select supplier" />
                        </SelectTrigger>
                        <SelectContent>
                          {suppliers.map(sup => <SelectItem key={sup.id_supplier} value={sup.id_supplier}>{sup.namaSupplier}</SelectItem>)}
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                  <DialogFooter>
                    <Button data-testid="add-product-submit-btn" onClick={handleAddProduct} className="bg-blue-600 hover:bg-blue-700">Add Product</Button>
                  </DialogFooter>
                </DialogContent>
              </Dialog>
            </div>
            <div className="mt-4 flex space-x-2">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <Input data-testid="search-input" placeholder="Search by product code, brand, or model..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} onKeyPress={(e) => e.key === 'Enter' && handleSearch()} className="pl-10" />
              </div>
              <Button data-testid="search-btn" onClick={handleSearch} className="bg-blue-600 hover:bg-blue-700 text-white">Search</Button>
            </div>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b">
                    <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700">Code</th>
                    <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700">Brand</th>
                    <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700">Model</th>
                    <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700">Size</th>
                    <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700">Price</th>
                    <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700">Stock</th>
                    <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700">Category</th>
                    <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700">Supplier</th>
                    <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {products.map((product) => (
                    <tr key={product.id_produk} className="border-b hover:bg-gray-50" data-testid={`product-row-${product.id_produk}`}>
                      <td className="py-3 px-4 text-sm text-gray-900">{product.kode_produk}</td>
                      <td className="py-3 px-4 text-sm text-gray-700">{product.merk}</td>
                      <td className="py-3 px-4 text-sm text-gray-700">{product.model}</td>
                      <td className="py-3 px-4 text-sm text-gray-700">{product.ukuran}</td>
                      <td className="py-3 px-4 text-sm text-gray-700">Rp {product.harga.toLocaleString()}</td>
                      <td className="py-3 px-4 text-sm text-gray-900 font-semibold">{product.jumlah_stok}</td>
                      <td className="py-3 px-4 text-sm text-gray-700">{getCategoryName(product.id_kategori)}</td>
                      <td className="py-3 px-4 text-sm text-gray-700">{getSupplierName(product.id_supplier)}</td>
                      <td className="py-3 px-4 text-sm">
                        <div className="flex space-x-2">
                          <Button data-testid={`edit-btn-${product.id_produk}`} size="sm" variant="ghost" onClick={() => openEditDialog(product)}>
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button data-testid={`delete-btn-${product.id_produk}`} size="sm" variant="ghost" onClick={() => handleDeleteProduct(product.id_produk)}>
                            <Trash2 className="h-4 w-4 text-red-600" />
                          </Button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
              {products.length === 0 && <div className="text-center py-12 text-gray-500">No products found</div>}
            </div>
          </CardContent>
        </Card>
      </div>

      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Edit Product</DialogTitle>
            <DialogDescription>Update product details</DialogDescription>
          </DialogHeader>
          <div className="grid grid-cols-2 gap-4 py-4">
            <div className="space-y-2">
              <Label>Product Code</Label>
              <Input data-testid="edit-kode-input" value={formData.kode_produk} onChange={(e) => setFormData({...formData, kode_produk: e.target.value})} />
            </div>
            <div className="space-y-2">
              <Label>Brand (Merk)</Label>
              <Input data-testid="edit-merk-input" value={formData.merk} onChange={(e) => setFormData({...formData, merk: e.target.value})} />
            </div>
            <div className="space-y-2">
              <Label>Model</Label>
              <Input data-testid="edit-model-input" value={formData.model} onChange={(e) => setFormData({...formData, model: e.target.value})} />
            </div>
            <div className="space-y-2">
              <Label>Size (Ukuran)</Label>
              <Input data-testid="edit-ukuran-input" value={formData.ukuran} onChange={(e) => setFormData({...formData, ukuran: e.target.value})} />
            </div>
            <div className="space-y-2">
              <Label>Price (Harga)</Label>
              <Input data-testid="edit-harga-input" type="number" value={formData.harga} onChange={(e) => setFormData({...formData, harga: parseFloat(e.target.value)})} />
            </div>
            <div className="space-y-2">
              <Label>Stock (Jumlah Stok)</Label>
              <Input data-testid="edit-stok-input" type="number" value={formData.jumlah_stok} onChange={(e) => setFormData({...formData, jumlah_stok: parseInt(e.target.value)})} />
            </div>
            <div className="space-y-2">
              <Label>Category</Label>
              <Select value={formData.id_kategori} onValueChange={(val) => setFormData({...formData, id_kategori: val})}>
                <SelectTrigger data-testid="edit-kategori-select">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {categories.map(cat => <SelectItem key={cat.id_kategori} value={cat.id_kategori}>{cat.nama_kategori}</SelectItem>)}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label>Supplier</Label>
              <Select value={formData.id_supplier} onValueChange={(val) => setFormData({...formData, id_supplier: val})}>
                <SelectTrigger data-testid="edit-supplier-select">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {suppliers.map(sup => <SelectItem key={sup.id_supplier} value={sup.id_supplier}>{sup.namaSupplier}</SelectItem>)}
                </SelectContent>
              </Select>
            </div>
          </div>
          <DialogFooter>
            <Button data-testid="edit-product-submit-btn" onClick={handleEditProduct} className="bg-blue-600 hover:bg-blue-700">Update Product</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default ProdukPage;