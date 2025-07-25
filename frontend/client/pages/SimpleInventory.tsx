import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ArrowLeft, Search, Package } from "lucide-react";
import { Link } from "react-router-dom";

// Mock data for simple inventory
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

export default function SimpleInventory() {
  const [searchTerm, setSearchTerm] = useState("");

  const filteredItems = mockInventory.filter((item) =>
    item.name.toLowerCase().includes(searchTerm.toLowerCase()),
  );

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
            <Package className="h-6 w-6 text-primary mr-3" />
            <h1 className="text-xl font-semibold text-gray-900">
              Your Inventory
            </h1>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Search */}
        <Card className="mb-6">
          <CardContent className="pt-6">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
              <Input
                placeholder="Search your items..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 text-lg py-6"
              />
            </div>
          </CardContent>
        </Card>

        {/* Inventory List */}
        <div className="space-y-4">
          {filteredItems.length === 0 ? (
            <Card>
              <CardContent className="text-center py-12">
                <Package className="h-16 w-16 text-gray-400 mx-auto mb-4" />
                <h3 className="text-xl font-medium text-gray-900 mb-2">
                  {searchTerm ? "No items found" : "No items in inventory"}
                </h3>
                <p className="text-gray-600 mb-6">
                  {searchTerm
                    ? "Try searching with different terms"
                    : "Start by adding your first item to the inventory"}
                </p>
                <Button asChild>
                  <Link to="/add-item">Add Your First Item</Link>
                </Button>
              </CardContent>
            </Card>
          ) : (
            filteredItems.map((item) => (
              <Card key={item.id} className="hover:shadow-md transition-shadow">
                <CardContent className="p-6">
                  <div className="flex gap-4">
                    {/* Item Image */}
                    <div className="flex-shrink-0">
                      <img
                        src={item.image}
                        alt={item.name}
                        className="w-20 h-20 object-cover rounded-lg border"
                        onError={(e) => {
                          const target = e.target as HTMLImageElement;
                          target.src =
                            "https://images.unsplash.com/photo-1580169980114-ccd0babfa840?w=200&h=200&fit=crop";
                        }}
                      />
                    </div>

                    {/* Item Details */}
                    <div className="flex-1">
                      <div className="flex justify-between items-start mb-3">
                        <div>
                          <h3 className="text-xl font-semibold text-gray-900">
                            {item.name}
                          </h3>
                          <div className="flex items-center gap-4 text-sm text-gray-600 mt-1">
                            <span>
                              <strong>Type:</strong> {item.type}
                            </span>
                            <span>
                              <strong>SKU:</strong> {item.sku}
                            </span>
                          </div>
                        </div>
                        <Button variant="outline" asChild>
                          <Link to={`/update-quantity?item=${item.id}`}>
                            Update Quantity
                          </Link>
                        </Button>
                      </div>

                      {item.desc && (
                        <p className="text-gray-600 text-sm mb-3">
                          {item.desc}
                        </p>
                      )}

                      <div className="grid grid-cols-3 gap-4 text-center bg-gray-50 rounded-lg p-3">
                        <div>
                          <div className="font-medium text-lg">{item.qnt}</div>
                          <div className="text-sm text-gray-600">Quantity</div>
                        </div>
                        <div>
                          <div className="font-medium text-lg">
                            ${item.price}
                          </div>
                          <div className="text-sm text-gray-600">Price</div>
                        </div>
                        <div>
                          <div className="font-medium text-lg text-green-600">
                            ${(item.qnt * item.price).toFixed(2)}
                          </div>
                          <div className="text-sm text-gray-600">
                            Total Value
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))
          )}
        </div>

        {/* Summary */}
        {filteredItems.length > 0 && (
          <Card className="mt-8 bg-primary/5 border-primary/20">
            <CardHeader>
              <CardTitle className="text-center">Inventory Summary</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-center">
                <div>
                  <div className="text-2xl font-bold text-primary">
                    {filteredItems.length}
                  </div>
                  <div className="text-gray-600">Items Found</div>
                </div>
                <div>
                  <div className="text-2xl font-bold text-primary">
                    {filteredItems.reduce((sum, item) => sum + item.qnt, 0)}
                  </div>
                  <div className="text-gray-600">Total Quantity</div>
                </div>
                <div>
                  <div className="text-2xl font-bold text-primary">
                    $
                    {filteredItems
                      .reduce((sum, item) => sum + item.qnt * item.price, 0)
                      .toFixed(2)}
                  </div>
                  <div className="text-gray-600">Total Value</div>
                </div>
              </div>
            </CardContent>
          </Card>
        )}
      </main>
    </div>
  );
}
