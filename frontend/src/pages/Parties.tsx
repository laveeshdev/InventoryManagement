import { useState, useEffect } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { partyApi } from "@/lib/api";
import { useToast } from "@/components/ui/use-toast";
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
import { Plus, Search, Filter, Edit3, Users, Building, Loader2 } from "lucide-react";

interface Party {
  _id: string;
  name: string;
  type: 'customer' | 'seller';
  email: string;
  phone: number;
  address?: string;
  balance: number;
  owner?: string;
}

export default function Parties() {
  const [parties, setParties] = useState<Party[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterType, setFilterType] = useState("all");
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [newParty, setNewParty] = useState({
    name: "",
    type: "customer",
    email: "",
    phone: "",
    address: "",
    balance: "0"
  });
  const { toast } = useToast();
  
  useEffect(() => {
    const fetchParties = async () => {
      setLoading(true);
      try {
        const response = await partyApi.getAll();
        console.log("Party API response:", response.data);
        // The backend returns an object with a 'parties' array
        if (response.data && Array.isArray(response.data.parties)) {
          setParties(response.data.parties);
          toast({
            title: "Success",
            description: `Loaded ${response.data.parties.length} parties from database`,
          });
        } else {
          toast({
            title: "Error",
            description: "Unexpected response format from server.",
            variant: "destructive",
          });
          console.error("Unexpected response format:", response.data);
        }
      } catch (error) {
        toast({
          title: "Error",
          description: "An error occurred while fetching parties.",
          variant: "destructive",
        });
        console.error("Error fetching parties:", error);
      } finally {
        setLoading(false);
      }
    };
    
    fetchParties();
  }, [toast]);

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
    return <Badge className="bg-accent text-accent-foreground">Seller</Badge>;
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(amount);
  };

  const customerCount = parties.filter(p => p.type === "customer").length;
  const sellerCount = parties.filter(p => p.type === "seller").length;
  
  const handleNewPartyChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { id, value } = e.target;
    const key = id.replace("party-", "");
    setNewParty(prev => ({ ...prev, [key]: value }));
  };
  
  const handlePartyTypeChange = (value: string) => {
    setNewParty(prev => ({ ...prev, type: value as 'customer' | 'seller' }));
  };
  
  const handleAddParty = async () => {
    // Validate the form
    if (!newParty.name || !newParty.email || !newParty.phone) {
      toast({
        title: "Missing Fields",
        description: "Please fill out all required fields.",
        variant: "destructive",
      });
      return;
    }
    
    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(newParty.email)) {
      toast({
        title: "Invalid Email",
        description: "Please enter a valid email address.",
        variant: "destructive",
      });
      return;
    }
    
    setIsSubmitting(true);
    try {
      const partyData = {
        name: newParty.name,
        type: newParty.type as 'customer' | 'supplier',
        email: newParty.email,
        phone: String(newParty.phone),
        address: newParty.address || undefined,
        balance: Number(newParty.balance) || 0
      };
      
      const response = await partyApi.create(partyData);
      
      if (response.data && response.data.party) {
        toast({
          title: "Success",
          description: "New party has been added successfully.",
        });
        
        // Add the new party to the state
        setParties([...parties, response.data.party]);
        
        // Close dialog and reset form
        setIsAddDialogOpen(false);
        setNewParty({
          name: "",
          type: "customer",
          email: "",
          phone: "",
          address: "",
          balance: "0"
        });
      } else {
        toast({
          title: "Error",
          description: response.data.message || "Failed to add party.",
          variant: "destructive",
        });
      }
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.response?.data?.message || "An error occurred while adding the party.",
        variant: "destructive",
      });
      console.error("Error adding party:", error);
    } finally {
      setIsSubmitting(false);
    }
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
          <h1 className="text-3xl font-bold text-foreground">Parties Management</h1>
          <p className="text-muted-foreground">
            Manage your customers and sellers
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
                Add a new customer or seller to your system.
              </DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid gap-2">
                <Label htmlFor="party-name">Name*</Label>
                <Input 
                  id="party-name" 
                  placeholder="Enter party name" 
                  value={newParty.name}
                  onChange={handleNewPartyChange}
                  required
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="party-type">Type*</Label>
                <Select value={newParty.type} onValueChange={handlePartyTypeChange}>
                  <SelectTrigger id="party-type">
                    <SelectValue placeholder="Select party type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="customer">Customer</SelectItem>
                    <SelectItem value="seller">Seller</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="grid gap-2">
                <Label htmlFor="party-email">Email*</Label>
                <Input 
                  id="party-email" 
                  type="email" 
                  placeholder="Enter email"
                  value={newParty.email}
                  onChange={handleNewPartyChange}
                  required
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="party-phone">Phone*</Label>
                <Input 
                  id="party-phone" 
                  type="tel"
                  placeholder="Enter phone number"
                  value={newParty.phone}
                  onChange={handleNewPartyChange}
                  required
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="party-address">Address</Label>
                <Input 
                  id="party-address" 
                  placeholder="Enter address"
                  value={newParty.address}
                  onChange={handleNewPartyChange}
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="party-balance">Initial Balance</Label>
                <Input 
                  id="party-balance" 
                  type="number"
                  placeholder="0"
                  value={newParty.balance}
                  onChange={handleNewPartyChange}
                />
              </div>
            </div>
            <div className="flex justify-end space-x-2">
              <Button 
                variant="outline" 
                onClick={() => setIsAddDialogOpen(false)}
                disabled={isSubmitting}
              >
                Cancel
              </Button>
              <Button 
                onClick={handleAddParty}
                disabled={isSubmitting}
              >
                {isSubmitting ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : null}
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
            <CardTitle className="text-sm font-medium">Sellers</CardTitle>
            <Building className="h-4 w-4 text-accent" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-accent">{sellerCount}</div>
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
                  <SelectItem value="seller">Sellers</SelectItem>
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
                <TableHead>Balance</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredParties.length > 0 ? (
                filteredParties.map((party) => (
                  <TableRow key={party._id} className="hover:bg-muted/50">
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
                      <span className="font-medium">{formatCurrency(party.balance)}</span>
                    </TableCell>
                    <TableCell>
                      <Button variant="ghost" size="sm">
                        <Edit3 className="h-4 w-4" />
                      </Button>
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={5} className="text-center py-6">
                    No parties found. {filterType !== "all" && "Try changing your filter."}
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
