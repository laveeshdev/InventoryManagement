import { useState, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Upload, X, Image as ImageIcon } from "lucide-react";
import { cn } from "@/lib/utils";

interface FileUploadProps {
  onFileSelect: (file: File | null) => void;
  currentImage?: string;
  className?: string;
  compact?: boolean;
}

export function FileUpload({
  onFileSelect,
  currentImage,
  className,
  compact = false,
}: FileUploadProps) {
  const [isDragging, setIsDragging] = useState(false);
  const [preview, setPreview] = useState<string | null>(currentImage || null);
  const [error, setError] = useState<string>("");
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFile = (file: File) => {
    setError("");

    // Validate file type
    if (!file.type.startsWith("image/")) {
      setError("Please select an image file");
      return;
    }

    // Validate file size (5MB limit)
    if (file.size > 5 * 1024 * 1024) {
      setError("File size must be less than 5MB");
      return;
    }

    // Create preview
    const reader = new FileReader();
    reader.onload = (e) => {
      const result = e.target?.result as string;
      setPreview(result);
      onFileSelect(file);
    };
    reader.readAsDataURL(file);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);

    const files = Array.from(e.dataTransfer.files);
    if (files.length > 0) {
      handleFile(files[0]);
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    if (files.length > 0) {
      handleFile(files[0]);
    }
  };

  const handleRemove = () => {
    setPreview(null);
    setError("");
    onFileSelect(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const handleClick = () => {
    fileInputRef.current?.click();
  };

  return (
    <div className={cn("space-y-3", className)}>
      {!preview ? (
        <div
          className={cn(
            "border-2 border-dashed rounded-lg text-center cursor-pointer transition-colors",
            compact ? "p-4" : "p-6",
            isDragging
              ? "border-primary bg-primary/5"
              : "border-gray-300 hover:border-gray-400",
            error && "border-red-300 bg-red-50",
          )}
          onDrop={handleDrop}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onClick={handleClick}
        >
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            onChange={handleFileInput}
            className="hidden"
          />

          {compact ? (
            <div className="flex items-center justify-center gap-4">
              <Upload className="h-6 w-6 text-gray-400" />
              <div className="text-left">
                <p className="text-sm font-medium text-gray-900">
                  Upload Image
                </p>
                <p className="text-xs text-gray-500">PNG, JPG, GIF up to 5MB</p>
              </div>
              <Button type="button" variant="outline" size="sm">
                Choose File
              </Button>
            </div>
          ) : (
            <div className="flex flex-col items-center">
              <Upload className="h-12 w-12 text-gray-400 mb-4" />
              <h4 className="text-lg font-medium text-gray-900 mb-2">
                Upload Image
              </h4>
              <p className="text-sm text-gray-600 mb-4">
                Drag and drop your image here, or click to browse
              </p>
              <Button type="button" variant="outline">
                Choose File
              </Button>
              <p className="text-xs text-gray-500 mt-4">
                PNG, JPG, GIF up to 5MB
              </p>
            </div>
          )}
        </div>
      ) : (
        <div
          className={cn(
            "border border-gray-200 rounded-lg bg-white",
            compact ? "p-3" : "p-4",
          )}
        >
          <div className="flex items-start gap-3">
            <div className="flex-shrink-0">
              <img
                src={preview}
                alt="Preview"
                className={cn(
                  "object-cover rounded-lg border",
                  compact ? "w-16 h-16" : "w-24 h-24",
                )}
              />
            </div>
            <div className="flex-1 min-w-0">
              <h4
                className={cn(
                  "font-medium text-gray-900",
                  compact ? "text-sm mb-1" : "text-sm mb-2",
                )}
              >
                Image Selected
              </h4>
              <p
                className={cn(
                  "text-xs text-gray-500",
                  compact ? "mb-2" : "mb-3",
                )}
              >
                Ready to upload
              </p>
              <div className="flex gap-2">
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={handleClick}
                >
                  <ImageIcon className="h-4 w-4 mr-1" />
                  Change
                </Button>
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={handleRemove}
                >
                  <X className="h-4 w-4 mr-1" />
                  Remove
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}

      {error && <p className="text-sm text-red-500">{error}</p>}
    </div>
  );
}
