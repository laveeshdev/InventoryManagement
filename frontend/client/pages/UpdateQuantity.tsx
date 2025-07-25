import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { ArrowLeft, Edit, CheckCircle, Package } from "lucide-react";
import { Link, useSearchParams } from "react-router-dom";

// Mock data - same as inventory
const mockInventory = [
  {
    id: 1,
    name: 'MacBook Pro 16"',
    type: "Electronics",
    sku: "APPLE-MBP16-001",
    image:
      "https://images.unsplash.com/photo-1541807084-5c52b6b3adef?w=200&h=200&fit=crop",
    desc: "High-performance laptop with M3 chip",
    qnt: 5,
    price: 2499.99,
  },
  {
    id: 2,
    name: "iPhone 15 Pro",
    type: "Electronics",
    sku: "APPLE-IP15-PRO",
    image:
      "https://images.unsplash.com/photo-1592750475338-74b7b21085ab?w=200&h=200&fit=crop",
    desc: "Latest iPhone with Pro camera system",
    qnt: 12,
    price: 999.99,
  },
  {
    id: 3,
    name: "Wireless Mouse",
    type: "Accessories",
    sku: "LOGI-WM-001",
    image:
      "https://images.unsplash.com/photo-1527864550417-7fd91fc51a46?w=200&h=200&fit=crop",
    desc: "Ergonomic wireless mouse with precision tracking",
    qnt: 25,
    price: 79.99,
  },
  {
    id: 4,
    name: "USB-C Cable",
    type: "Cables",
    sku: "CABLE-USBC-002",
    image:
      "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=200&h=200&fit=crop",
    desc: "High-speed USB-C charging and data cable",
    qnt: 50,
    price: 29.99,
  },
  {
    id: 5,
    name: 'Dell Monitor 27"',
    type: "Electronics",
    sku: "DELL-MON27-001",
    image:
      "https://images.unsplash.com/photo-1527443224154-c4a3942d3acf?w=200&h=200&fit=crop",
    desc: "4K monitor with excellent color accuracy",
    qnt: 8,
    price: 299.99,
  },
];

export default function UpdateQuantity() {
  const [searchParams] = useSearchParams();
  const itemId = searchParams.get("item");
  const [selectedItem, setSelectedItem] = useState<any>(null);
  const [newQuantity, setNewQuantity] = useState("");
  const [updateType, setUpdateType] = useState<"set" | "add" | "subtract">(
    "set",
  );
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (itemId) {
      const item = mockInventory.find((item) => item.id === parseInt(itemId));
      if (item) {
        setSelectedItem(item);
        setNewQuantity(item.qnt.toString());
      }
    }
  }, [itemId]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    const quantity = parseInt(newQuantity);
    if (isNaN(quantity) || quantity < 0) {
      setError("Please enter a valid quantity");
      return;
    }

    if (updateType === "subtract" && quantity > selectedItem.qnt) {
      setError("Cannot subtract more than current quantity");
      return;
    }

    setIsSubmitting(true);

    // Simulate API call
    setTimeout(() => {
      console.log("Quantity updated:", {
        item: selectedItem.name,
        newQuantity,
        updateType,
      });
      setIsSubmitting(false);
      setIsSuccess(true);
    }, 1000);
  };

  const calculateNewQuantity = () => {
    const quantity = parseInt(newQuantity) || 0;
    switch (updateType) {
      case "add":
        return selectedItem.qnt + quantity;
      case "subtract":
        return Math.max(0, selectedItem.qnt - quantity);
      default:
        return quantity;
    }
  };

  if (isSuccess) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <Card className="w-full max-w-md">
          <CardContent className="text-center py-12">
            <CheckCircle className="h-16 w-16 text-green-600 mx-auto mb-6" />
            <h2 className="text-2xl font-bold text-gray-900 mb-4">
              Quantity Updated!
            </h2>
            <p className="text-gray-600 mb-8">
              The quantity for "{selectedItem?.name}" has been successfully
              updated.
            </p>
            <div className="space-y-3">
              <Button className="w-full" asChild>
                <Link to="/">Back to Home</Link>
              </Button>
              <Button variant="outline" className="w-full" asChild>
                <Link to="/inventory">View Inventory</Link>
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center h-16">
            <Button variant="ghost" asChild className="mr-4">
              <Link to="/">
                <ArrowLeft className="h-5 w-5 mr-2" />
                Back to Home
              </Link>
            </Button>
            <Edit className="h-6 w-6 text-primary mr-3" />
            <h1 className="text-xl font-semibold text-gray-900">
              Update Quantity
            </h1>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {!selectedItem ? (
          <Card>
            <CardHeader>
              <CardTitle>Select an Item</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {mockInventory.map((item) => (
                  <div
                    key={item.id}
                    className="flex items-center justify-between p-4 border rounded-lg hover:bg-gray-50 cursor-pointer"
                    onClick={() => setSelectedItem(item)}
                  >
                    <div>
                      <h3 className="font-medium">{item.name}</h3>
                      <p className="text-gray-600">
                        Current quantity: {item.qnt}
                      </p>
                    </div>
                    <Badge variant="outline">Select</Badge>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        ) : (
          <Card>
            <CardHeader>
              <CardTitle className="text-2xl text-center">
                Update Item Quantity
              </CardTitle>
              <div className="text-center">
                <h3 className="text-lg font-medium text-gray-900">
                  {selectedItem.name}
                </h3>
                <p className="text-gray-600">
                  Current quantity: <strong>{selectedItem.qnt}</strong>
                </p>
              </div>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-6">
                {/* Update Type */}
                <div className="space-y-3">
                  <Label className="text-lg">Update Type</Label>
                  <div className="grid grid-cols-3 gap-3">
                    <Button
                      type="button"
                      variant={updateType === "set" ? "default" : "outline"}
                      onClick={() => setUpdateType("set")}
                      className="h-12"
                    >
                      Set To
                    </Button>
                    <Button
                      type="button"
                      variant={updateType === "add" ? "default" : "outline"}
                      onClick={() => setUpdateType("add")}
                      className="h-12"
                    >
                      Add
                    </Button>
                    <Button
                      type="button"
                      variant={
                        updateType === "subtract" ? "default" : "outline"
                      }
                      onClick={() => setUpdateType("subtract")}
                      className="h-12"
                    >
                      Subtract
                    </Button>
                  </div>
                </div>

                {/* Quantity Input */}
                <div className="space-y-2">
                  <Label htmlFor="quantity" className="text-lg">
                    {updateType === "set"
                      ? "New Quantity"
                      : updateType === "add"
                        ? "Quantity to Add"
                        : "Quantity to Subtract"}
                  </Label>
                  <Input
                    id="quantity"
                    type="number"
                    min="0"
                    value={newQuantity}
                    onChange={(e) => setNewQuantity(e.target.value)}
                    placeholder="Enter quantity"
                    className="text-lg py-3"
                    disabled={isSubmitting}
                  />
                </div>

                {/* Preview */}
                {newQuantity && (
                  <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                    <h4 className="font-medium text-blue-900 mb-2">Preview:</h4>
                    <div className="text-sm text-blue-800">
                      <p>
                        <strong>Current quantity:</strong> {selectedItem.qnt}
                      </p>
                      <p>
                        <strong>Action:</strong>{" "}
                        {updateType === "set"
                          ? `Set to ${newQuantity}`
                          : updateType === "add"
                            ? `Add ${newQuantity}`
                            : `Subtract ${newQuantity}`}
                      </p>
                      <p>
                        <strong>New quantity:</strong> {calculateNewQuantity()}
                      </p>
                    </div>
                  </div>
                )}

                {/* Error Display */}
                {error && (
                  <Alert className="border-red-200 bg-red-50">
                    <AlertDescription className="text-red-600">
                      {error}
                    </AlertDescription>
                  </Alert>
                )}

                {/* Action Buttons */}
                <div className="flex gap-4">
                  <Button
                    type="button"
                    variant="outline"
                    className="flex-1"
                    onClick={() => setSelectedItem(null)}
                    disabled={isSubmitting}
                  >
                    Change Item
                  </Button>
                  <Button
                    type="submit"
                    className="flex-1"
                    disabled={isSubmitting || !newQuantity}
                  >
                    {isSubmitting ? "Updating..." : "Update Quantity"}
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>
        )}

        {/* Quick Actions */}
        {selectedItem && (
          <Card className="mt-6">
            <CardHeader>
              <CardTitle className="text-lg">Quick Actions</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 gap-3">
                <Button
                  variant="outline"
                  onClick={() => {
                    setUpdateType("add");
                    setNewQuantity("1");
                  }}
                  disabled={isSubmitting}
                >
                  +1
                </Button>
                <Button
                  variant="outline"
                  onClick={() => {
                    setUpdateType("subtract");
                    setNewQuantity("1");
                  }}
                  disabled={isSubmitting}
                >
                  -1
                </Button>
                <Button
                  variant="outline"
                  onClick={() => {
                    setUpdateType("add");
                    setNewQuantity("10");
                  }}
                  disabled={isSubmitting}
                >
                  +10
                </Button>
                <Button
                  variant="outline"
                  onClick={() => {
                    setUpdateType("set");
                    setNewQuantity("0");
                  }}
                  disabled={isSubmitting}
                >
                  Set to 0
                </Button>
              </div>
            </CardContent>
          </Card>
        )}
      </main>
    </div>
  );
}
