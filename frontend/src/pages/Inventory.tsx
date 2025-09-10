import { useState, useEffect } from "react";
import { productApi } from "@/lib/api";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Plus, Search, Filter, Edit3, Package, Loader2 } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";

interface Product {
  _id: string;
  name: string;
  sku: string;
  quantity: number;
  price: number;
  category?: string;
}

export default function Inventory() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [newProduct, setNewProduct] = useState({
    name: "",
    type: "",
    sku: "",
    image_url: "",
    description: "",
    quantity: "",
    price: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [isEditQuantityDialogOpen, setIsEditQuantityDialogOpen] = useState(false);
  const [newQuantity, setNewQuantity] = useState("");
  const { toast } = useToast();

  const fetchProducts = async () => {
      try {
        const response = await productApi.getAll();
        console.log("API Response:", response.data); // Log the full response
        if (response.data.success) {
          setProducts(response.data.data);
          console.log("Products set in state:", response.data.data); // Log the data being set
        } else {
          toast({
            title: "Error",
            description: "Failed to fetch products.",
            variant: "destructive",
          });
        }
      } catch (error) {
        toast({
          title: "Error",
          description: "An error occurred while fetching products.",
          variant: "destructive",
        });
      } finally {
        setLoading(false);
      }
    };

  useEffect(() => {
    fetchProducts();
  }, []);

  const handleNewProductChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { id, value } = e.target;
    // Correctly map the id 'product-name' to the state key 'name'
    const key = id.replace('product-', '');
    setNewProduct((prev) => ({ ...prev, [key]: value }));
  };

  const handleAddProduct = async () => {
    if (!newProduct.name || !newProduct.sku || !newProduct.quantity || !newProduct.price || !newProduct.type) {
      toast({
        title: "Missing Fields",
        description: "Please fill out all required fields to add a product.",
        variant: "destructive",
      });
      return;
    }
    setIsSubmitting(true);
    try {
      const productData = {
        name: newProduct.name,
        sku: newProduct.sku,
        type: newProduct.type,
        image_url: newProduct.image_url,
        description: newProduct.description,
        quantity: Number(newProduct.quantity),
        price: Number(newProduct.price),
      };
      const response = await productApi.create(productData);
      if (response.data.success) {
        toast({
          title: "Success!",
          description: "New product has been added.",
        });
        setProducts(prev => [...prev, response.data.data]);
        setIsAddDialogOpen(false);
        setNewProduct({ name: "", type: "", sku: "", image_url: "", description: "", quantity: "", price: "" }); // Reset form
      } else {
        toast({
          title: "Error",
          description: response.data.message || "Failed to add product.",
          variant: "destructive",
        });
      }
    } catch (error) {
      toast({
        title: "Request Error",
        description: "An error occurred while adding the product.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleEditClick = (product: Product) => {
    setEditingProduct(product);
    setNewQuantity(product.quantity.toString());
    setIsEditQuantityDialogOpen(true);
  };

  const handleUpdateQuantity = async () => {
    if (!editingProduct) return;
    
    setIsSubmitting(true);
    try {
      const quantity = parseInt(newQuantity);
      if (isNaN(quantity) || quantity < 0) {
        toast({
          title: "Invalid Quantity",
          description: "Please enter a valid non-negative quantity.",
          variant: "destructive",
        });
        return;
      }

      const response = await productApi.updateQuantity(editingProduct._id, quantity);
      if (response.data.success) {
        toast({
          title: "Success!",
          description: "Product quantity has been updated.",
        });
        
        // Update the product in the local state
        setProducts(prevProducts => 
          prevProducts.map(p => 
            p._id === editingProduct._id 
              ? { ...p, quantity: quantity } 
              : p
          )
        );
        
        setIsEditQuantityDialogOpen(false);
        setEditingProduct(null);
      } else {
        toast({
          title: "Error",
          description: response.data.message || "Failed to update product quantity.",
          variant: "destructive",
        });
      }
    } catch (error) {
      toast({
        title: "Request Error",
        description: "An error occurred while updating the product quantity.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const filteredProducts = products.filter(
    (product) =>
      product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      product.sku.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const getStatusBadge = (quantity: number) => {
    if (quantity === 0) {
      return <Badge variant="destructive">Out of Stock</Badge>;
    }
    if (quantity < 20) {
      return <Badge className="bg-yellow-500 text-white">Low Stock</Badge>;
    }
    return <Badge className="bg-green-500 text-white">In Stock</Badge>;
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(amount);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Inventory Management</h1>
          <p className="text-muted-foreground">
            Manage your products, stock levels, and pricing
          </p>
        </div>
        
        <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
          <DialogTrigger asChild>
            <Button className="bg-gradient-primary">
              <Plus className="h-4 w-4 mr-2" />
              Add Product
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[425px]">
            <DialogHeader>
              <DialogTitle>Add New Product</DialogTitle>
              <DialogDescription>
                Add a new product to your inventory system.
              </DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="grid gap-2">
                  <Label htmlFor="product-name">Product Name</Label>
                  <Input id="product-name" placeholder="e.g. T-Shirt" value={newProduct.name} onChange={handleNewProductChange} />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="product-type">Type / Category</Label>
                  <Input id="product-type" placeholder="e.g. Apparel" value={newProduct.type} onChange={handleNewProductChange} />
                </div>
              </div>
              <div className="grid gap-2">
                <Label htmlFor="product-sku">SKU</Label>
                <Input id="product-sku" placeholder="Enter SKU" value={newProduct.sku} onChange={handleNewProductChange} />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="product-description">Description</Label>
                <Textarea id="product-description" placeholder="Enter product description" value={newProduct.description} onChange={handleNewProductChange} />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="product-image_url">Image URL</Label>
                <Input id="product-image_url" placeholder="https://example.com/image.png" value={newProduct.image_url} onChange={handleNewProductChange} />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="grid gap-2">
                  <Label htmlFor="product-quantity">Quantity</Label>
                  <Input id="product-quantity" type="number" placeholder="0" value={newProduct.quantity} onChange={handleNewProductChange} />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="product-price">Price</Label>
                  <Input id="product-price" type="number" step="0.01" placeholder="0.00" value={newProduct.price} onChange={handleNewProductChange} />
                </div>
              </div>
            </div>
            <div className="flex justify-end space-x-2">
              <Button variant="outline" onClick={() => setIsAddDialogOpen(false)} disabled={isSubmitting}>
                Cancel
              </Button>
              <Button onClick={handleAddProduct} disabled={isSubmitting}>
                {isSubmitting ? <Loader2 className="h-4 w-4 animate-spin" /> : "Add Product"}
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {/* Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="shadow-custom">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Products</CardTitle>
            <Package className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-primary">{products.length}</div>
            <p className="text-xs text-muted-foreground">
              Active inventory items
            </p>
          </CardContent>
        </Card>

        <Card className="shadow-custom">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Low Stock Items</CardTitle>
            <Package className="h-4 w-4 text-warning" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-warning">
              {products.filter(p => p.quantity < 20 && p.quantity > 0).length}
            </div>
            <p className="text-xs text-muted-foreground">
              Need restocking
            </p>
          </CardContent>
        </Card>

        <Card className="shadow-custom">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Out of Stock</CardTitle>
            <Package className="h-4 w-4 text-destructive" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-destructive">
              {products.filter(p => p.quantity === 0).length}
            </div>
            <p className="text-xs text-muted-foreground">
              Items unavailable
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Products Table */}
      <Card className="shadow-custom">
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>Products</CardTitle>
            <div className="flex items-center space-x-2">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
                <Input
                  placeholder="Search products..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 w-80"
                />
              </div>
              <Button variant="outline" size="icon">
                <Filter className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Product Name</TableHead>
                <TableHead>SKU</TableHead>
                <TableHead>Quantity</TableHead>
                <TableHead>Price</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredProducts.map((product) => (
                <TableRow key={product._id} className="hover:bg-muted/50">
                  <TableCell className="font-medium">{product.name}</TableCell>
                  <TableCell className="font-mono text-sm">{product.sku}</TableCell>
                  <TableCell>
                    <span className={`font-medium ${
                      product.quantity === 0 ? "text-destructive" : 
                      product.quantity < 20 ? "text-warning" : "text-foreground"
                    }`}>
                      {product.quantity}
                    </span>
                  </TableCell>
                  <TableCell>{formatCurrency(product.price)}</TableCell>
                  <TableCell>
                    {getStatusBadge(product.quantity)}
                  </TableCell>
                  <TableCell>
                    <Button variant="ghost" size="sm" onClick={() => handleEditClick(product)}>
                      <Edit3 className="h-4 w-4" />
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* Edit Quantity Dialog */}
      {editingProduct && (
        <Dialog open={isEditQuantityDialogOpen} onOpenChange={setIsEditQuantityDialogOpen}>
          <DialogContent className="sm:max-w-[425px]">
            <DialogHeader>
              <DialogTitle>Update Quantity</DialogTitle>
              <DialogDescription>
                Update the quantity for {editingProduct.name} (SKU: {editingProduct.sku})
              </DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid gap-2">
                <Label htmlFor="edit-quantity">New Quantity</Label>
                <Input 
                  id="edit-quantity" 
                  type="number" 
                  min="0" 
                  value={newQuantity}
                  onChange={(e) => setNewQuantity(e.target.value)}
                />
              </div>
            </div>
            <div className="flex justify-end space-x-2">
              <Button 
                variant="outline" 
                onClick={() => setIsEditQuantityDialogOpen(false)} 
                disabled={isSubmitting}
              >
                Cancel
              </Button>
              <Button 
                onClick={handleUpdateQuantity} 
                disabled={isSubmitting || newQuantity === editingProduct.quantity.toString()}
              >
                {isSubmitting ? <Loader2 className="h-4 w-4 animate-spin" /> : "Update Quantity"}
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      )}
    </div>
  );
}