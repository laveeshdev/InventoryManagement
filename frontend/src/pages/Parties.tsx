import { useState, useEffect } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { partyService, seedData } from "@/lib/storage";
import { Party } from "@/types/schemas";
import { useToast } from "@/hooks/use-toast";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Plus, Search, Filter, Edit3, Users, Building } from "lucide-react";

// Mock data
const mockParties = [
  {
    id: 1,
    name: "ABC Corporation",
    type: "customer",
    email: "contact@abc-corp.com",
    phone: "(555) 123-4567",
    address: "123 Business Ave, City, ST 12345",
    totalTransactions: 15,
    totalAmount: 25000,
    status: "active",
  },
  {
    id: 2,
    name: "XYZ Suppliers",
    type: "supplier",
    email: "sales@xyzsuppliers.com",
    phone: "(555) 987-6543",
    address: "456 Industrial Blvd, City, ST 67890",
    totalTransactions: 8,
    totalAmount: 18500,
    status: "active",
  },
  {
    id: 3,
    name: "DEF Industries",
    type: "customer",
    email: "procurement@def.com",
    phone: "(555) 456-7890",
    address: "789 Corporate Dr, City, ST 54321",
    totalTransactions: 22,
    totalAmount: 45000,
    status: "active",
  },
];

export default function Parties() {
  const [parties, setParties] = useState(mockParties);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterType, setFilterType] = useState("all");
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);

  const filteredParties = parties.filter((party) => {
    const matchesSearch = 
      party.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      party.email.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesType = filterType === "all" || party.type === filterType;
    return matchesSearch && matchesType;
  });

  const getTypeBadge = (type: string) => {
    if (type === "customer") {
      return <Badge className="bg-primary text-primary-foreground">Customer</Badge>;
    }
    return <Badge className="bg-accent text-accent-foreground">Supplier</Badge>;
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(amount);
  };

  const customerCount = parties.filter(p => p.type === "customer").length;
  const supplierCount = parties.filter(p => p.type === "supplier").length;

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Parties Management</h1>
          <p className="text-muted-foreground">
            Manage your customers and suppliers
          </p>
        </div>
        
        <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
          <DialogTrigger asChild>
            <Button className="bg-gradient-primary">
              <Plus className="h-4 w-4 mr-2" />
              Add Party
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[425px]">
            <DialogHeader>
              <DialogTitle>Add New Party</DialogTitle>
              <DialogDescription>
                Add a new customer or supplier to your system.
              </DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid gap-2">
                <Label htmlFor="party-name">Name</Label>
                <Input id="party-name" placeholder="Enter party name" />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="party-type">Type</Label>
                <Select>
                  <SelectTrigger>
                    <SelectValue placeholder="Select party type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="customer">Customer</SelectItem>
                    <SelectItem value="supplier">Supplier</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="grid gap-2">
                <Label htmlFor="party-email">Email</Label>
                <Input id="party-email" type="email" placeholder="Enter email" />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="party-phone">Phone</Label>
                <Input id="party-phone" placeholder="Enter phone number" />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="party-address">Address</Label>
                <Input id="party-address" placeholder="Enter address" />
              </div>
            </div>
            <div className="flex justify-end space-x-2">
              <Button variant="outline" onClick={() => setIsAddDialogOpen(false)}>
                Cancel
              </Button>
              <Button onClick={() => setIsAddDialogOpen(false)}>
                Add Party
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {/* Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="shadow-custom">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Parties</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-primary">{parties.length}</div>
            <p className="text-xs text-muted-foreground">
              Active business relationships
            </p>
          </CardContent>
        </Card>

        <Card className="shadow-custom">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Customers</CardTitle>
            <Users className="h-4 w-4 text-primary" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-primary">{customerCount}</div>
            <p className="text-xs text-muted-foreground">
              Revenue sources
            </p>
          </CardContent>
        </Card>

        <Card className="shadow-custom">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Suppliers</CardTitle>
            <Building className="h-4 w-4 text-accent" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-accent">{supplierCount}</div>
            <p className="text-xs text-muted-foreground">
              Supply chain partners
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Parties Table */}
      <Card className="shadow-custom">
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>Parties</CardTitle>
            <div className="flex items-center space-x-2">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
                <Input
                  placeholder="Search parties..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 w-80"
                />
              </div>
              <Select value={filterType} onValueChange={setFilterType}>
                <SelectTrigger className="w-32">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Types</SelectItem>
                  <SelectItem value="customer">Customers</SelectItem>
                  <SelectItem value="supplier">Suppliers</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Name</TableHead>
                <TableHead>Type</TableHead>
                <TableHead>Contact</TableHead>
                <TableHead>Transactions</TableHead>
                <TableHead>Total Amount</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredParties.map((party) => (
                <TableRow key={party.id} className="hover:bg-muted/50">
                  <TableCell>
                    <div>
                      <div className="font-medium">{party.name}</div>
                      <div className="text-sm text-muted-foreground">{party.address}</div>
                    </div>
                  </TableCell>
                  <TableCell>
                    {getTypeBadge(party.type)}
                  </TableCell>
                  <TableCell>
                    <div>
                      <div className="text-sm">{party.email}</div>
                      <div className="text-sm text-muted-foreground">{party.phone}</div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <span className="font-medium">{party.totalTransactions}</span>
                  </TableCell>
                  <TableCell>
                    <span className="font-medium">{formatCurrency(party.totalAmount)}</span>
                  </TableCell>
                  <TableCell>
                    <Button variant="ghost" size="sm">
                      <Edit3 className="h-4 w-4" />
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}