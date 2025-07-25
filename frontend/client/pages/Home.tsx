import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Package, Plus, Edit, LogOut } from "lucide-react";
import { Link } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";

export default function Home() {
  const { user, logout } = useAuth();

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center gap-3">
              <Package className="h-8 w-8 text-primary" />
              <h1 className="text-2xl font-bold text-gray-900">InventoryPro</h1>
            </div>
            <div className="flex items-center gap-4">
              <span className="text-gray-600">Welcome, {user?.name}</span>
              <Button variant="outline" onClick={logout}>
                <LogOut className="h-4 w-4 mr-2" />
                Logout
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold text-gray-900 mb-4">
            Manage Your Inventory
          </h2>
          <p className="text-xl text-gray-600">
            What would you like to do today?
          </p>
        </div>

        {/* Action Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Show Inventory */}
          <Card className="hover:shadow-lg transition-shadow cursor-pointer group">
            <Link to="/inventory">
              <CardHeader className="text-center pb-4">
                <div className="mx-auto bg-blue-100 rounded-full p-6 w-20 h-20 flex items-center justify-center group-hover:bg-blue-200 transition-colors">
                  <Package className="h-10 w-10 text-blue-600" />
                </div>
                <CardTitle className="text-2xl mt-4">View Inventory</CardTitle>
              </CardHeader>
              <CardContent className="text-center">
                <p className="text-gray-600 mb-6">
                  View all your items, search, and manage your inventory
                </p>
                <Button className="w-full" size="lg">
                  Show Inventory
                </Button>
              </CardContent>
            </Link>
          </Card>

          {/* Add New Item */}
          <Card className="hover:shadow-lg transition-shadow cursor-pointer group">
            <Link to="/add-item">
              <CardHeader className="text-center pb-4">
                <div className="mx-auto bg-green-100 rounded-full p-6 w-20 h-20 flex items-center justify-center group-hover:bg-green-200 transition-colors">
                  <Plus className="h-10 w-10 text-green-600" />
                </div>
                <CardTitle className="text-2xl mt-4">Add New Item</CardTitle>
              </CardHeader>
              <CardContent className="text-center">
                <p className="text-gray-600 mb-6">
                  Add a new item to your inventory with all the details
                </p>
                <Button className="w-full" size="lg" variant="outline">
                  Add Item
                </Button>
              </CardContent>
            </Link>
          </Card>

          {/* Update Quantity */}
          <Card className="hover:shadow-lg transition-shadow cursor-pointer group">
            <Link to="/update-quantity">
              <CardHeader className="text-center pb-4">
                <div className="mx-auto bg-orange-100 rounded-full p-6 w-20 h-20 flex items-center justify-center group-hover:bg-orange-200 transition-colors">
                  <Edit className="h-10 w-10 text-orange-600" />
                </div>
                <CardTitle className="text-2xl mt-4">Update Quantity</CardTitle>
              </CardHeader>
              <CardContent className="text-center">
                <p className="text-gray-600 mb-6">
                  Update the quantity of existing items in your inventory
                </p>
                <Button className="w-full" size="lg" variant="outline">
                  Update Quantity
                </Button>
              </CardContent>
            </Link>
          </Card>
        </div>

        {/* Quick Stats */}
        <div className="mt-16 bg-white rounded-lg shadow p-8">
          <h3 className="text-xl font-semibold text-gray-900 mb-6 text-center">
            Quick Overview
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-center">
            <div>
              <div className="text-3xl font-bold text-blue-600">0</div>
              <div className="text-gray-600">Total Items</div>
            </div>
            <div>
              <div className="text-3xl font-bold text-green-600">$0</div>
              <div className="text-gray-600">Total Value</div>
            </div>
            <div>
              <div className="text-3xl font-bold text-orange-600">0</div>
              <div className="text-gray-600">Categories</div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
