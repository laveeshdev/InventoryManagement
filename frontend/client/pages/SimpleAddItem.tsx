import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { ArrowLeft, Plus, CheckCircle } from "lucide-react";
import { Link } from "react-router-dom";
import { FileUpload } from "@/components/FileUpload";

export default function SimpleAddItem() {
  const [formData, setFormData] = useState({
    name: "",
    type: "",
    sku: "",
    image: "",
    desc: "",
    qnt: "",
    price: "",
  });
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  const handleInputChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: "" }));
    }
  };

  const handleFileSelect = (file: File | null) => {
    setSelectedFile(file);
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        const result = e.target?.result as string;
        setFormData((prev) => ({ ...prev, image: result }));
      };
      reader.readAsDataURL(file);
    } else {
      setFormData((prev) => ({ ...prev, image: "" }));
    }
  };

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.name.trim()) {
      newErrors.name = "Item name is required";
    }

    if (!formData.type.trim()) {
      newErrors.type = "Item type is required";
    }

    if (!formData.sku.trim()) {
      newErrors.sku = "SKU is required";
    }

    if (!formData.qnt || parseInt(formData.qnt) < 0) {
      newErrors.qnt = "Valid quantity is required";
    }

    if (!formData.price || parseFloat(formData.price) < 0) {
      newErrors.price = "Valid price is required";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) return;

    setIsSubmitting(true);

    // Simulate API call
    setTimeout(() => {
      console.log("Item added:", formData);
      setIsSubmitting(false);
      setIsSuccess(true);

      // Reset form after success
      setTimeout(() => {
        setFormData({
          name: "",
          type: "",
          sku: "",
          image: "",
          desc: "",
          qnt: "",
          price: "",
        });
        setSelectedFile(null);
        setIsSuccess(false);
      }, 2000);
    }, 1000);
  };

  if (isSuccess) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <Card className="w-full max-w-md">
          <CardContent className="text-center py-12">
            <CheckCircle className="h-16 w-16 text-green-600 mx-auto mb-6" />
            <h2 className="text-2xl font-bold text-gray-900 mb-4">
              Item Added Successfully!
            </h2>
            <p className="text-gray-600 mb-8">
              Your item "{formData.name}" has been added to the inventory.
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
            <Plus className="h-6 w-6 text-primary mr-3" />
            <h1 className="text-xl font-semibold text-gray-900">
              Add New Item
            </h1>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Card>
          <CardHeader>
            <CardTitle className="text-2xl text-center">
              Add New Item to Inventory
            </CardTitle>
            <p className="text-center text-gray-600">
              Fill in all the information for your new item
            </p>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Basic Information */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Item Name */}
                <div className="space-y-2">
                  <Label htmlFor="name" className="text-base font-medium">
                    Item Name *
                  </Label>
                  <Input
                    id="name"
                    value={formData.name}
                    onChange={(e) => handleInputChange("name", e.target.value)}
                    placeholder="Enter item name"
                    className={`${errors.name ? "border-red-500" : ""}`}
                    disabled={isSubmitting}
                  />
                  {errors.name && (
                    <p className="text-sm text-red-500">{errors.name}</p>
                  )}
                </div>

                {/* Item Type */}
                <div className="space-y-2">
                  <Label htmlFor="type" className="text-base font-medium">
                    Type *
                  </Label>
                  <Input
                    id="type"
                    value={formData.type}
                    onChange={(e) => handleInputChange("type", e.target.value)}
                    placeholder="e.g., Electronics, Clothing, Books"
                    className={`${errors.type ? "border-red-500" : ""}`}
                    disabled={isSubmitting}
                  />
                  {errors.type && (
                    <p className="text-sm text-red-500">{errors.type}</p>
                  )}
                </div>

                {/* SKU */}
                <div className="space-y-2">
                  <Label htmlFor="sku" className="text-base font-medium">
                    SKU *
                  </Label>
                  <Input
                    id="sku"
                    value={formData.sku}
                    onChange={(e) => handleInputChange("sku", e.target.value)}
                    placeholder="Enter unique SKU code"
                    className={`${errors.sku ? "border-red-500" : ""}`}
                    disabled={isSubmitting}
                  />
                  {errors.sku && (
                    <p className="text-sm text-red-500">{errors.sku}</p>
                  )}
                </div>

                {/* Quantity */}
                <div className="space-y-2">
                  <Label htmlFor="qnt" className="text-base font-medium">
                    Quantity *
                  </Label>
                  <Input
                    id="qnt"
                    type="number"
                    min="0"
                    value={formData.qnt}
                    onChange={(e) => handleInputChange("qnt", e.target.value)}
                    placeholder="Enter quantity"
                    className={`${errors.qnt ? "border-red-500" : ""}`}
                    disabled={isSubmitting}
                  />
                  {errors.qnt && (
                    <p className="text-sm text-red-500">{errors.qnt}</p>
                  )}
                </div>

                {/* Price */}
                <div className="space-y-2">
                  <Label htmlFor="price" className="text-base font-medium">
                    Price ($) *
                  </Label>
                  <Input
                    id="price"
                    type="number"
                    min="0"
                    step="0.01"
                    value={formData.price}
                    onChange={(e) => handleInputChange("price", e.target.value)}
                    placeholder="Enter price"
                    className={`${errors.price ? "border-red-500" : ""}`}
                    disabled={isSubmitting}
                  />
                  {errors.price && (
                    <p className="text-sm text-red-500">{errors.price}</p>
                  )}
                </div>
              </div>

              {/* Description */}
              <div className="space-y-2">
                <Label htmlFor="desc" className="text-base font-medium">
                  Description
                </Label>
                <Textarea
                  id="desc"
                  value={formData.desc}
                  onChange={(e) => handleInputChange("desc", e.target.value)}
                  placeholder="Enter item description (optional)"
                  rows={3}
                  disabled={isSubmitting}
                />
              </div>

              {/* Image Upload */}
              <div className="space-y-2">
                <Label className="text-base font-medium">Item Image</Label>
                <FileUpload
                  onFileSelect={handleFileSelect}
                  currentImage={formData.image}
                  compact={true}
                />
              </div>

              {/* Error Display */}
              {Object.keys(errors).length > 0 && (
                <Alert className="border-red-200 bg-red-50">
                  <AlertDescription className="text-red-600">
                    Please fix the errors above before submitting.
                  </AlertDescription>
                </Alert>
              )}

              {/* Preview */}
              {formData.name &&
                formData.type &&
                formData.sku &&
                formData.qnt &&
                formData.price && (
                  <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                    <h4 className="font-medium text-blue-900 mb-3">
                      Item Preview:
                    </h4>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-sm text-blue-800">
                      <div>
                        <strong>Name:</strong> {formData.name}
                      </div>
                      <div>
                        <strong>Type:</strong> {formData.type}
                      </div>
                      <div>
                        <strong>SKU:</strong> {formData.sku}
                      </div>
                      <div>
                        <strong>Quantity:</strong> {formData.qnt}
                      </div>
                      <div>
                        <strong>Price:</strong> ${formData.price}
                      </div>
                      <div>
                        <strong>Total Value:</strong> $
                        {(
                          parseFloat(formData.price) * parseInt(formData.qnt)
                        ).toFixed(2)}
                      </div>
                    </div>
                    {formData.desc && (
                      <div className="mt-3 text-sm text-blue-800">
                        <strong>Description:</strong> {formData.desc}
                      </div>
                    )}
                  </div>
                )}

              {/* Submit Button */}
              <div className="flex gap-4">
                <Button
                  type="button"
                  variant="outline"
                  className="flex-1"
                  asChild
                  disabled={isSubmitting}
                >
                  <Link to="/">Cancel</Link>
                </Button>
                <Button
                  type="submit"
                  className="flex-1"
                  disabled={isSubmitting}
                >
                  {isSubmitting ? "Adding Item..." : "Add Item"}
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </main>
    </div>
  );
}
