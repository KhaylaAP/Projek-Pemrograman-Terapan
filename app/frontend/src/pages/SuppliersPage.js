import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { API } from "@/App";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
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

const SuppliersPage = ({ onLogout }) => {
  const navigate = useNavigate();
  const [suppliers, setSuppliers] = useState([]);
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [selectedSupplier, setSelectedSupplier] = useState(null);
  const [formData, setFormData] = useState({
    namaSupplier: "",
    email: "",
    no_telp: "",
    notes: ""
  });

  useEffect(() => {
    fetchSuppliers();
  }, []);

  const fetchSuppliers = async () => {
    try {
      const response = await axios.get(`${API}/suppliers`);
      setSuppliers(response.data);
    } catch (error) {
      toast.error("Failed to fetch suppliers");
    }
  };

  const handleAddSupplier = async () => {
    try {
      await axios.post(`${API}/suppliers`, formData);
      toast.success("Supplier added successfully");
      setIsAddDialogOpen(false);
      setFormData({ namaSupplier: "", email: "", no_telp: "", notes: "" });
      fetchSuppliers();
    } catch (error) {
      toast.error("Failed to add supplier");
    }
  };

  const handleEditSupplier = async () => {
    try {
      await axios.put(`${API}/suppliers/${selectedSupplier.id_supplier}`, formData);
      toast.success("Supplier updated successfully");
      setIsEditDialogOpen(false);
      setSelectedSupplier(null);
      setFormData({ namaSupplier: "", email: "", no_telp: "", notes: "" });
      fetchSuppliers();
    } catch (error) {
      toast.error("Failed to update supplier");
    }
  };

  const openEditDialog = (supplier) => {
    setSelectedSupplier(supplier);
    setFormData({
      namaSupplier: supplier.namaSupplier,
      email: supplier.email,
      no_telp: supplier.no_telp,
      notes: supplier.notes
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
              <Button data-testid="nav-kategori-btn" variant="ghost" onClick={() => navigate('/kategori')}>Kategori</Button>
              <Button data-testid="nav-produk-btn" variant="ghost" onClick={() => navigate('/produk')}>Produk</Button>
              <Button data-testid="nav-inventory-btn" variant="ghost" onClick={() => navigate('/inventory')}>Inventory</Button>
              <Button data-testid="nav-suppliers-btn" variant="ghost" className="text-blue-600">Suppliers</Button>
              <Button data-testid="nav-logout-btn" variant="outline" onClick={onLogout} className="border-blue-600 text-blue-600 hover:bg-blue-50">Logout</Button>
            </div>
          </div>
        </div>
      </nav>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Suppliers</h1>
          <p className="text-gray-600">Manage your jeans suppliers</p>
        </div>

        <Card className="shadow-sm">
          <CardHeader>
            <div className="flex justify-between items-center">
              <CardTitle className="text-xl font-semibold">Supplier List</CardTitle>
              <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
                <DialogTrigger asChild>
                  <Button data-testid="add-supplier-btn" className="bg-blue-600 hover:bg-blue-700 text-white">
                    <Plus className="h-4 w-4 mr-2" />
                    Add Supplier
                  </Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Add New Supplier</DialogTitle>
                    <DialogDescription>Add a new supplier to your list</DialogDescription>
                  </DialogHeader>
                  <div className="space-y-4 py-4">
                    <div className="space-y-2">
                      <Label>Nama Supplier</Label>
                      <Input 
                        data-testid="add-name-input"
                        value={formData.namaSupplier} 
                        onChange={(e) => setFormData({...formData, namaSupplier: e.target.value})} 
                      />
                    </div>
                    <div className="space-y-2">
                      <Label>Email</Label>
                      <Input 
                        data-testid="add-contact-input"
                        value={formData.email} 
                        onChange={(e) => setFormData({...formData, email: e.target.value})} 
                      />
                    </div>
                    <div className="space-y-2">
                      <Label>No Telp</Label>
                      <Input 
                        data-testid="add-address-input"
                        value={formData.no_telp} 
                        onChange={(e) => setFormData({...formData, no_telp: e.target.value})} 
                      />
                    </div>
                    <div className="space-y-2">
                      <Label>Notes</Label>
                      <Input 
                        data-testid="add-payment-input"
                        value={formData.notes} 
                        onChange={(e) => setFormData({...formData, notes: e.target.value})} 
                      />
                    </div>
                  </div>
                  <DialogFooter>
                    <Button data-testid="add-supplier-submit-btn" onClick={handleAddSupplier} className="bg-blue-600 hover:bg-blue-700">Add Supplier</Button>
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
                    <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700">Nama Supplier</th>
                    <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700">Email</th>
                    <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700">No Telp</th>
                    <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700">Notes</th>
                    <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {suppliers.map((supplier) => (
                    <tr key={supplier.id_supplier} className="border-b hover:bg-gray-50" data-testid={`supplier-row-${supplier.id_supplier}`}>
                      <td className="py-3 px-4 text-sm font-medium text-gray-900">{supplier.namaSupplier}</td>
                      <td className="py-3 px-4 text-sm text-gray-700">{supplier.email}</td>
                      <td className="py-3 px-4 text-sm text-gray-700">{supplier.no_telp}</td>
                      <td className="py-3 px-4 text-sm text-gray-700">{supplier.notes}</td>
                      <td className="py-3 px-4 text-sm">
                        <Button 
                          data-testid={`edit-supplier-btn-${supplier.id_supplier}`}
                          size="sm" 
                          variant="ghost"
                          onClick={() => openEditDialog(supplier)}
                        >
                          <Edit className="h-4 w-4" />
                        </Button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
              {suppliers.length === 0 && (
                <div className="text-center py-12 text-gray-500">
                  No suppliers found
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
            <DialogTitle>Edit Supplier</DialogTitle>
            <DialogDescription>Update the details of this supplier</DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label>Nama Supplier</Label>
              <Input 
                data-testid="edit-name-input"
                value={formData.namaSupplier} 
                onChange={(e) => setFormData({...formData, namaSupplier: e.target.value})} 
              />
            </div>
            <div className="space-y-2">
              <Label>Email</Label>
              <Input 
                data-testid="edit-contact-input"
                value={formData.email} 
                onChange={(e) => setFormData({...formData, email: e.target.value})} 
              />
            </div>
            <div className="space-y-2">
              <Label>No Telp</Label>
              <Input 
                data-testid="edit-address-input"
                value={formData.no_telp} 
                onChange={(e) => setFormData({...formData, no_telp: e.target.value})} 
              />
            </div>
            <div className="space-y-2">
              <Label>Notes</Label>
              <Input 
                data-testid="edit-payment-input"
                value={formData.notes} 
                onChange={(e) => setFormData({...formData, notes: e.target.value})} 
              />
            </div>
          </div>
          <DialogFooter>
            <Button data-testid="edit-supplier-submit-btn" onClick={handleEditSupplier} className="bg-blue-600 hover:bg-blue-700">Update Supplier</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default SuppliersPage;