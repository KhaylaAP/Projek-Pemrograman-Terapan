import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { API } from "@/App";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Package, Plus, Edit } from "lucide-react";
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

const KategoriPage = ({ onLogout }) => {
  const navigate = useNavigate();
  const [categories, setCategories] = useState([]);
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [formData, setFormData] = useState({
    nama_kategori: "",
    deskripsi: ""
  });

  useEffect(() => {
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    try {
      const response = await axios.get(`${API}/kategori`);
      setCategories(response.data);
    } catch (error) {
      toast.error("Failed to fetch categories");
    }
  };

  const handleAddCategory = async () => {
    try {
      await axios.post(`${API}/kategori`, formData);
      toast.success("Category added successfully");
      setIsAddDialogOpen(false);
      setFormData({ nama_kategori: "", deskripsi: "" });
      fetchCategories();
    } catch (error) {
      toast.error("Failed to add category");
    }
  };

  const handleEditCategory = async () => {
    try {
      await axios.put(`${API}/kategori/${selectedCategory.id_kategori}`, formData);
      toast.success("Category updated successfully");
      setIsEditDialogOpen(false);
      setSelectedCategory(null);
      setFormData({ nama_kategori: "", deskripsi: "" });
      fetchCategories();
    } catch (error) {
      toast.error("Failed to update category");
    }
  };

  const openEditDialog = (category) => {
    setSelectedCategory(category);
    setFormData({
      nama_kategori: category.nama_kategori,
      deskripsi: category.deskripsi
    });
    setIsEditDialogOpen(true);
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
              <Button data-testid="nav-kategori-btn" variant="ghost" className="text-blue-600">Kategori</Button>
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
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Kategori</h1>
          <p className="text-gray-600">Manage product categories</p>
        </div>

        <Card className="shadow-sm">
          <CardHeader>
            <div className="flex justify-between items-center">
              <CardTitle className="text-xl font-semibold">Category List</CardTitle>
              <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
                <DialogTrigger asChild>
                  <Button data-testid="add-category-btn" className="bg-blue-600 hover:bg-blue-700 text-white">
                    <Plus className="h-4 w-4 mr-2" />
                    Add Category
                  </Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Add New Category</DialogTitle>
                    <DialogDescription>Add a new product category</DialogDescription>
                  </DialogHeader>
                  <div className="space-y-4 py-4">
                    <div className="space-y-2">
                      <Label>Category Name</Label>
                      <Input data-testid="add-name-input" value={formData.nama_kategori} onChange={(e) => setFormData({...formData, nama_kategori: e.target.value})} />
                    </div>
                    <div className="space-y-2">
                      <Label>Description</Label>
                      <Textarea data-testid="add-desc-input" value={formData.deskripsi} onChange={(e) => setFormData({...formData, deskripsi: e.target.value})} />
                    </div>
                  </div>
                  <DialogFooter>
                    <Button data-testid="add-category-submit-btn" onClick={handleAddCategory} className="bg-blue-600 hover:bg-blue-700">Add Category</Button>
                  </DialogFooter>
                </DialogContent>
              </Dialog>
            </div>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b">
                    <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700">Category Name</th>
                    <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700">Description</th>
                    <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {categories.map((category) => (
                    <tr key={category.id_kategori} className="border-b hover:bg-gray-50" data-testid={`category-row-${category.id_kategori}`}>
                      <td className="py-3 px-4 text-sm font-medium text-gray-900">{category.nama_kategori}</td>
                      <td className="py-3 px-4 text-sm text-gray-700">{category.deskripsi}</td>
                      <td className="py-3 px-4 text-sm">
                        <Button data-testid={`edit-category-btn-${category.id_kategori}`} size="sm" variant="ghost" onClick={() => openEditDialog(category)}>
                          <Edit className="h-4 w-4" />
                        </Button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
              {categories.length === 0 && <div className="text-center py-12 text-gray-500">No categories found</div>}
            </div>
          </CardContent>
        </Card>
      </div>

      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit Category</DialogTitle>
            <DialogDescription>Update category details</DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label>Category Name</Label>
              <Input data-testid="edit-name-input" value={formData.nama_kategori} onChange={(e) => setFormData({...formData, nama_kategori: e.target.value})} />
            </div>
            <div className="space-y-2">
              <Label>Description</Label>
              <Textarea data-testid="edit-desc-input" value={formData.deskripsi} onChange={(e) => setFormData({...formData, deskripsi: e.target.value})} />
            </div>
          </div>
          <DialogFooter>
            <Button data-testid="edit-category-submit-btn" onClick={handleEditCategory} className="bg-blue-600 hover:bg-blue-700">Update Category</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default KategoriPage;