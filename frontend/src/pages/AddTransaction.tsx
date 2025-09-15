import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { useToast } from "@/components/ui/use-toast";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { cn } from "@/lib/utils";
import { format } from "date-fns";
import { Calendar as CalendarIcon, X, Plus, Save, ArrowLeft, Trash2, Calculator, ShoppingCart, TrendingDown } from "lucide-react";
import { transactionApi, partyApi, productApi } from "@/lib/api";

interface TransactionProduct {
  productId: string;
  productName?: string;
  quantity: number;
  price: number;
}

interface Product {
  _id: string;
  name: string;
  price: number;
  quantity: number;
  sku?: string;
}

interface Party {
  _id: string;
  name: string;
  type: string;
}

export default function AddTransaction() {
  const navigate = useNavigate();
  const { toast } = useToast();
  
  const [isLoading, setIsLoading] = useState(false);
  const [isLoadingData, setIsLoadingData] = useState(true);
  
  // Form state
  const [transactionType, setTransactionType] = useState<'sell' | 'buy'>('sell');
  const [selectedPartyId, setSelectedPartyId] = useState("");
  const [products, setProducts] = useState<TransactionProduct[]>([]);
  const [status, setStatus] = useState<'pending' | 'completed'>('pending');
  const [notes, setNotes] = useState("");
  const [invoice, setInvoice] = useState("");
  const [date, setDate] = useState<Date | undefined>(new Date());
  
  // New product item state
  const [newProduct, setNewProduct] = useState({
    productId: "",
    quantity: 1,
    price: 0
  });
  
  // Data from API
  const [parties, setParties] = useState<Party[]>([]);
  const [availableProducts, setAvailableProducts] = useState<Product[]>([]);
  
  useEffect(() => {
    const fetchData = async () => {
      setIsLoadingData(true);
      try {
        const [partiesRes, productsRes] = await Promise.all([
          partyApi.getAll(),
          productApi.getAll()
        ]);
        
  // Process the data
  const partiesData = Array.isArray(partiesRes.data.parties) ? partiesRes.data.parties : [];
  const productsData = Array.isArray(productsRes.data.data) ? productsRes.data.data : [];

  setParties(partiesData);
  setAvailableProducts(productsData);
      } catch (error) {
        console.error("Error fetching data:", error);
        toast({
          title: "Error",
          description: "Failed to load parties and products. Please refresh and try again.",
          variant: "destructive"
        });
      } finally {
        setIsLoadingData(false);
      }
    };
    
    fetchData();
  }, [toast]);
  
  // Calculate totals
  const totalAmount = products.reduce((sum, p) => sum + (p.price * p.quantity), 0);
  
  // Handle adding a product to the transaction
  const handleAddProduct = () => {
    if (!newProduct.productId || newProduct.quantity <= 0 || newProduct.price <= 0) {
      toast({
        title: "Invalid product",
        description: "Please select a product and specify a valid quantity and price.",
        variant: "destructive"
      });
      return;
    }
    
    // Find product details
    const productDetails = availableProducts.find(p => p._id === newProduct.productId);
    if (!productDetails) return;
    
    // Add product to the list
    setProducts([...products, {
      productId: newProduct.productId,
      productName: productDetails.name,
      quantity: newProduct.quantity,
      price: newProduct.price
    }]);
    
    // Reset new product form
    setNewProduct({
      productId: "",
      quantity: 1,
      price: 0
    });
  };
  
  // Handle removing a product from the transaction
  const handleRemoveProduct = (index: number) => {
    const updatedProducts = [...products];
    updatedProducts.splice(index, 1);
    setProducts(updatedProducts);
  };
  
  // Handle product selection change
  const handleProductSelect = (productId: string) => {
    const product = availableProducts.find(p => p._id === productId);
    setNewProduct({
      productId,
      quantity: 1,
      price: product ? product.price : 0
    });
  };
  
  // Handle creating the transaction
  const handleCreateTransaction = async () => {
    // Validate form
    if (!selectedPartyId) {
      toast({
        title: "Missing party",
        description: "Please select a customer or supplier.",
        variant: "destructive"
      });
      return;
    }
    if (!invoice) {
      toast({
        title: "Missing invoice",
        description: "Invoice number is required.",
        variant: "destructive"
      });
      return;
    }
    if (products.length === 0) {
      toast({
        title: "No products",
        description: "Please add at least one product to the transaction.",
        variant: "destructive"
      });
      return;
    }
    // Prepare items array for backend
    const items = products.map(p => ({
      listing: p.productId,
      quantity: p.quantity,
      amount: p.price
    }));
    // Prepare transaction data for backend
    const transactionData = {
      party: selectedPartyId,
      items,
      paymentStatus: status,
      totalAmount: totalAmount,
      type: transactionType,
      invoice,
      date: date || new Date(),
      remarks: notes || undefined
    };
    
    console.log("Sending transaction data:", transactionData);
    
    setIsLoading(true);
    try {
      const response = await transactionApi.create(transactionData);
      console.log("Transaction response:", response);
      
      toast({
        title: "Transaction created",
        description: "Transaction has been successfully created.",
      });
      navigate("/transactions");
    } catch (error: any) {
      console.error("Error creating transaction:", error);
      console.error("Error response:", error.response?.data);
      
      const errorMessage = error.response?.data?.message || "Failed to create transaction. Please try again.";
      
      toast({
        title: "Error",
        description: errorMessage,
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };
  
  // Format currency
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(amount);
  };
  
  // Filter parties based on transaction type
  const filteredParties = parties.filter(party => {
    if (transactionType === 'sell') return party.type === 'customer';
    return party.type === 'seller' || party.type === 'supplier';
  });

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground">New Transaction</h1>
          <p className="text-muted-foreground">
            Create a new sale or purchase transaction
          </p>
        </div>
        
        <div className="flex space-x-2">
          <Button variant="outline" onClick={() => navigate("/transactions")}>
            <ArrowLeft className="h-4 w-4 mr-2" />
            Cancel
          </Button>
          <Button 
            onClick={handleCreateTransaction} 
            disabled={isLoading || isLoadingData}
            className="bg-gradient-primary"
          >
            <Save className="h-4 w-4 mr-2" />
            {isLoading ? "Saving..." : "Save Transaction"}
          </Button>
        </div>
      </div>
      
      {isLoadingData ? (
        <div className="flex justify-center py-12">
          <div className="flex flex-col items-center">
            <div className="animate-spin h-8 w-8 border-4 border-primary border-t-transparent rounded-full mb-4"></div>
            <p className="text-muted-foreground">Loading data...</p>
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Transaction Details Form */}
          <div className="lg:col-span-1 space-y-6">
            <Card className="shadow-custom">
              <CardHeader>
                <CardTitle>Transaction Details</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="type">Transaction Type*</Label>
                  <Select value={transactionType} onValueChange={(value) => setTransactionType(value as 'sell' | 'buy')}>
                    <SelectTrigger id="type">
                      <SelectValue placeholder="Select transaction type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="sell">
                        <div className="flex items-center">
                          <ShoppingCart className="h-4 w-4 mr-2 text-success" />
                          <span>Sale</span>
                        </div>
                      </SelectItem>
                      <SelectItem value="buy">
                        <div className="flex items-center">
                          <TrendingDown className="h-4 w-4 mr-2 text-accent" />
                          <span>Purchase</span>
                        </div>
                      </SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="party">
                    {transactionType === 'sell' ? 'Customer*' : 'Supplier*'}
                  </Label>
                  <Select value={selectedPartyId} onValueChange={setSelectedPartyId}>
                    <SelectTrigger id="party">
                      <SelectValue placeholder={
                        transactionType === 'sell' 
                          ? "Select customer" 
                          : "Select supplier"
                      } />
                    </SelectTrigger>
                    <SelectContent>
                      {filteredParties.length === 0 ? (
                        <SelectItem value="none" disabled>
                          No {transactionType === 'sell' ? 'customers' : 'suppliers'} available
                        </SelectItem>
                      ) : (
                        filteredParties.map(party => (
                          <SelectItem key={party._id} value={party._id}>
                            {party.name}
                          </SelectItem>
                        ))
                      )}
                    </SelectContent>
                  </Select>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="status">Status*</Label>
                  <Select value={status} onValueChange={(value) => setStatus(value as 'pending' | 'completed')}>
                    <SelectTrigger id="status">
                      <SelectValue placeholder="Select status" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="pending">Pending</SelectItem>
                      <SelectItem value="completed">Completed</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="invoice">Invoice Number*</Label>
                  <Input
                    id="invoice"
                    placeholder="Enter invoice number"
                    value={invoice}
                    onChange={(e) => setInvoice(e.target.value)}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="date">Transaction Date</Label>
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button
                        variant={"outline"}
                        className={cn(
                          "w-full justify-start text-left font-normal",
                          !date && "text-muted-foreground"
                        )}
                      >
                        <CalendarIcon className="mr-2 h-4 w-4" />
                        {date ? format(date, "PPP") : <span>Pick a date</span>}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0">
                      <Calendar
                        mode="single"
                        selected={date}
                        onSelect={setDate}
                        initialFocus
                      />
                    </PopoverContent>
                  </Popover>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="notes">Notes</Label>
                  <Input
                    id="notes"
                    placeholder="Add notes (optional)"
                    value={notes}
                    onChange={(e) => setNotes(e.target.value)}
                  />
                </div>
              </CardContent>
            </Card>
            
            <Card className="shadow-custom">
              <CardHeader>
                <CardTitle>Summary</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between text-sm">
                  <span>Products</span>
                  <span>{products.length}</span>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span>Total Items</span>
                  <span>{products.reduce((sum, p) => sum + p.quantity, 0)}</span>
                </div>
                <Separator />
                <div className="flex items-center justify-between">
                  <span className="font-medium">Total Amount</span>
                  <span className="text-xl font-bold">{formatCurrency(totalAmount)}</span>
                </div>
              </CardContent>
            </Card>
          </div>
          
          {/* Products Section */}
          <div className="lg:col-span-2 space-y-6">
            {/* Add Product Form */}
            <Card className="shadow-custom">
              <CardHeader>
                <CardTitle>Add Products</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-12 gap-4">
                  <div className="col-span-12 md:col-span-5">
                    <Label htmlFor="product" className="mb-2 block">Product*</Label>
                    <Select value={newProduct.productId} onValueChange={handleProductSelect}>
                      <SelectTrigger id="product">
                        <SelectValue placeholder="Select product" />
                      </SelectTrigger>
                      <SelectContent>
                        {availableProducts.length === 0 ? (
                          <SelectItem value="none" disabled>
                            No products available
                          </SelectItem>
                        ) : (
                          availableProducts.map(product => (
                            <SelectItem key={product._id} value={product._id}>
                              {product.name} {product.sku ? `(${product.sku})` : ''}
                            </SelectItem>
                          ))
                        )}
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <div className="col-span-4 md:col-span-2">
                    <Label htmlFor="quantity" className="mb-2 block">Quantity*</Label>
                    <Input
                      id="quantity"
                      type="number"
                      min="1"
                      placeholder="Qty"
                      value={newProduct.quantity}
                      onChange={(e) => setNewProduct({...newProduct, quantity: parseInt(e.target.value) || 0})}
                    />
                  </div>
                  
                  <div className="col-span-4 md:col-span-3">
                    <Label htmlFor="price" className="mb-2 block">Price*</Label>
                    <Input
                      id="price"
                      type="number"
                      min="0.01"
                      step="0.01"
                      placeholder="Price"
                      value={newProduct.price}
                      onChange={(e) => setNewProduct({...newProduct, price: parseFloat(e.target.value) || 0})}
                    />
                  </div>
                  
                  <div className="col-span-4 md:col-span-2 flex items-end">
                    <Button 
                      onClick={handleAddProduct} 
                      className="w-full"
                      disabled={!newProduct.productId || newProduct.quantity <= 0 || newProduct.price <= 0}
                    >
                      <Plus className="h-4 w-4 mr-1" /> Add
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
            
            {/* Products Table */}
            <Card className="shadow-custom">
              <CardHeader>
                <CardTitle>Products in Transaction</CardTitle>
              </CardHeader>
              <CardContent>
                {products.length === 0 ? (
                  <div className="text-center py-12 text-muted-foreground">
                    <ShoppingCart className="h-12 w-12 mx-auto mb-2 opacity-20" />
                    <p>No products added to this transaction yet.</p>
                    <p className="text-sm">Use the form above to add products.</p>
                  </div>
                ) : (
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Product</TableHead>
                        <TableHead className="text-right">Quantity</TableHead>
                        <TableHead className="text-right">Unit Price</TableHead>
                        <TableHead className="text-right">Total</TableHead>
                        <TableHead className="text-right">Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {products.map((product, index) => (
                        <TableRow key={index}>
                          <TableCell className="font-medium">
                            {product.productName || 'Unknown Product'}
                          </TableCell>
                          <TableCell className="text-right">
                            {product.quantity}
                          </TableCell>
                          <TableCell className="text-right">
                            {formatCurrency(product.price)}
                          </TableCell>
                          <TableCell className="text-right">
                            {formatCurrency(product.price * product.quantity)}
                          </TableCell>
                          <TableCell className="text-right">
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => handleRemoveProduct(index)}
                            >
                              <Trash2 className="h-4 w-4 text-destructive" />
                            </Button>
                          </TableCell>
                        </TableRow>
                      ))}
                      <TableRow>
                        <TableCell colSpan={3} className="text-right font-bold">
                          Total Amount
                        </TableCell>
                        <TableCell className="text-right font-bold">
                          {formatCurrency(totalAmount)}
                        </TableCell>
                        <TableCell></TableCell>
                      </TableRow>
                    </TableBody>
                  </Table>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      )}
    </div>
  );
}
