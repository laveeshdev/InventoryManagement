import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Plus, Search, Edit, Trash2, Users } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { partyService, seedData } from "@/lib/storage";
import { Party } from "@/types/schemas";
import { useToast } from "@/hooks/use-toast";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";

const partySchema = z.object({
  name: z.string().min(1, "Name is required"),
  email: z.string().email("Valid email is required"),
  phone: z.string().min(1, "Phone is required"),
  address: z.string().min(1, "Address is required"),
  type: z.enum(["customer", "seller"]),
  balance: z.number().default(0),
});

type PartyFormData = z.infer<typeof partySchema>;

export default function Parties() {
  const { user } = useAuth();
  const { toast } = useToast();
  const [parties, setParties] = useState<Party[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterType, setFilterType] = useState("all");
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [editingParty, setEditingParty] = useState<Party | null>(null);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);

  const form = useForm<PartyFormData>({
    resolver: zodResolver(partySchema),
    defaultValues: {
      name: "",
      email: "",
      phone: "",
      address: "",
      type: "customer",
      balance: 0,
    },
  });

  useEffect(() => {
    if (!user) return;
    
    seedData(user.id);
    const userParties = partyService.getAll(user.id);
    setParties(userParties);
  }, [user]);

  const filteredParties = parties.filter((party) => {
    const matchesSearch = 
      party.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      party.email.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesType = filterType === "all" || party.type === filterType;
    return matchesSearch && matchesType;
  });

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(amount);
  };

  const handleSubmit = async (data: PartyFormData) => {
    if (!user) return;

    try {
      if (editingParty) {
        const updated = partyService.update(editingParty.id, data);
        if (updated) {
          setParties(parties.map(p => p.id === editingParty.id ? updated : p));
          toast({
            title: "Party updated",
            description: "The party has been updated successfully.",
          });
        }
        setIsEditDialogOpen(false);
        setEditingParty(null);
      } else {
        const createData = {
          name: data.name,
          email: data.email,
          phone: data.phone,
          address: data.address,
          type: data.type,
          balance: 0,
        };
        const newParty = partyService.create(createData, user.id);
        setParties([...parties, newParty]);
        toast({
          title: "Party added",
          description: "The new party has been added successfully.",
        });
        setIsAddDialogOpen(false);
      }
      
      form.reset();
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to save party. Please try again.",
        variant: "destructive",
      });
    }
  };

  const handleEdit = (party: Party) => {
    setEditingParty(party);
    form.reset({
      name: party.name,
      email: party.email,
      phone: party.phone,
      address: party.address,
      type: party.type,
      balance: party.balance,
    });
    setIsEditDialogOpen(true);
  };

  const handleDelete = (id: string) => {
    const success = partyService.delete(id);
    if (success) {
      setParties(parties.filter(p => p.id !== id));
      toast({
        title: "Party deleted",
        description: "The party has been removed successfully.",
      });
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Parties</h1>
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
          <DialogContent className="sm:max-w-[500px]">
            <DialogHeader>
              <DialogTitle>Add New Party</DialogTitle>
              <DialogDescription>
                Add a new customer or supplier to your system.
              </DialogDescription>
            </DialogHeader>
            <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="name">Name *</Label>
                <Input
                  id="name"
                  {...form.register("name")}
                  placeholder="Enter party name"
                />
                {form.formState.errors.name && (
                  <p className="text-sm text-destructive">{form.formState.errors.name.message}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="email">Email *</Label>
                <Input
                  id="email"
                  type="email"
                  {...form.register("email")}
                  placeholder="Enter email address"
                />
                {form.formState.errors.email && (
                  <p className="text-sm text-destructive">{form.formState.errors.email.message}</p>
                )}
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="phone">Phone *</Label>
                  <Input
                    id="phone"
                    {...form.register("phone")}
                    placeholder="Enter phone number"
                  />
                  {form.formState.errors.phone && (
                    <p className="text-sm text-destructive">{form.formState.errors.phone.message}</p>
                  )}
                </div>
                <div className="space-y-2">
                  <Label htmlFor="type">Type *</Label>
                  <Select onValueChange={(value) => form.setValue("type", value as "customer" | "seller")}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="customer">Customer</SelectItem>
                      <SelectItem value="seller">Supplier</SelectItem>
                    </SelectContent>
                  </Select>
                  {form.formState.errors.type && (
                    <p className="text-sm text-destructive">{form.formState.errors.type.message}</p>
                  )}
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="address">Address *</Label>
                <Textarea
                  id="address"
                  {...form.register("address")}
                  placeholder="Enter address"
                  rows={3}
                />
                {form.formState.errors.address && (
                  <p className="text-sm text-destructive">{form.formState.errors.address.message}</p>
                )}
              </div>

              <div className="flex justify-end space-x-2 pt-4">
                <Button type="button" variant="outline" onClick={() => setIsAddDialogOpen(false)}>
                  Cancel
                </Button>
                <Button type="submit">Add Party</Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="shadow-custom">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Parties</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-primary">{parties.length}</div>
            <p className="text-xs text-muted-foreground">Active parties</p>
          </CardContent>
        </Card>

        <Card className="shadow-custom">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Customers</CardTitle>
            <Users className="h-4 w-4 text-success" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-success">
              {parties.filter(p => p.type === 'customer').length}
            </div>
            <p className="text-xs text-muted-foreground">Customer accounts</p>
          </CardContent>
        </Card>

        <Card className="shadow-custom">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Suppliers</CardTitle>
            <Users className="h-4 w-4 text-accent" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-accent">
              {parties.filter(p => p.type === 'seller').length}
            </div>
            <p className="text-xs text-muted-foreground">Supplier accounts</p>
          </CardContent>
        </Card>
      </div>

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
                <SelectTrigger className="w-40">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Types</SelectItem>
                  <SelectItem value="customer">Customers</SelectItem>
                  <SelectItem value="seller">Suppliers</SelectItem>
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
                <TableHead>Email</TableHead>
                <TableHead>Phone</TableHead>
                <TableHead>Type</TableHead>
                <TableHead>Balance</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredParties.map((party) => (
                <TableRow key={party.id} className="hover:bg-muted/50">
                  <TableCell className="font-medium">{party.name}</TableCell>
                  <TableCell>{party.email}</TableCell>
                  <TableCell>{party.phone}</TableCell>
                  <TableCell>
                    <Badge
                      variant={party.type === 'customer' ? 'default' : 'secondary'}
                      className={party.type === 'customer' ? 'bg-success text-success-foreground' : ''}
                    >
                      {party.type === 'customer' ? 'Customer' : 'Supplier'}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <span className={`font-medium ${
                      party.balance >= 0 ? 'text-success' : 'text-destructive'
                    }`}>
                      {formatCurrency(party.balance)}
                    </span>
                  </TableCell>
                  <TableCell>
                    <div className="flex space-x-2">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleEdit(party)}
                      >
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleDelete(party.id)}
                        className="text-destructive hover:text-destructive"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
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