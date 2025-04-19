import { useState, useRef } from "react";
import { useTranslation } from "react-i18next";
import { Button } from "@/components/ui/button";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { Upload } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

export default function ImageUpload() {
  const { t } = useTranslation();
  const [isDragging, setIsDragging] = useState(false);
  const [files, setFiles] = useState<File[]>([]);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const queryClient = useQueryClient();
  const { toast } = useToast();

  const uploadMutation = useMutation({
    mutationFn: async (formData: FormData) => {
      return apiRequest('POST', '/api/photos/upload', formData);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/photos'] });
      setFiles([]);
      toast({
        title: "Success",
        description: "Photos uploaded successfully",
      });
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: `Failed to upload photos: ${error.message}`,
        variant: "destructive",
      });
    },
  });

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    
    if (e.dataTransfer.files) {
      const newFiles = Array.from(e.dataTransfer.files).filter(
        file => file.type.startsWith('image/')
      );
      setFiles(prev => [...prev, ...newFiles]);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const newFiles = Array.from(e.target.files).filter(
        file => file.type.startsWith('image/')
      );
      setFiles(prev => [...prev, ...newFiles]);
    }
  };

  const handleBrowseClick = () => {
    fileInputRef.current?.click();
  };

  const handleUpload = async () => {
    if (files.length === 0) return;

    const formData = new FormData();
    files.forEach(file => {
      formData.append('photos', file);
    });

    uploadMutation.mutate(formData);
  };

  return (
    <div className="mt-16 p-6 bg-white rounded-lg shadow-md">
      <h3 className="font-cormorant text-2xl text-primary font-semibold mb-4">
        {t('gallery.uploadSection.title')}
      </h3>
      <p className="mb-6 text-sm">{t('gallery.uploadSection.subtitle')}</p>
      
      <div 
        className={`border-2 border-dashed rounded-lg p-6 text-center ${
          isDragging ? 'border-accent bg-accent/10' : 'border-gray-300'
        }`}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
      >
        <Upload className="h-10 w-10 text-gray-400 mb-3 mx-auto" />
        <p className="text-sm text-gray-500 mb-4">{t('gallery.uploadSection.dragAndDrop')}</p>
        
        {files.length > 0 && (
          <div className="mb-4">
            <p className="text-sm font-medium mb-2">{files.length} file(s) selected</p>
            <div className="flex flex-wrap gap-2 justify-center">
              {files.map((file, index) => (
                <div key={index} className="text-xs bg-stone px-2 py-1 rounded">
                  {file.name}
                </div>
              ))}
            </div>
          </div>
        )}
        
        <div className="flex justify-center gap-3">
          <Button 
            type="button" 
            onClick={handleBrowseClick}
            className="px-4 py-2 bg-primary text-white rounded hover:bg-opacity-90 transition-all text-sm"
          >
            {t('gallery.uploadSection.browse')}
          </Button>
          
          {files.length > 0 && (
            <Button 
              type="button" 
              onClick={handleUpload}
              className="px-4 py-2 bg-accent text-primary rounded hover:bg-opacity-90 transition-all text-sm"
              disabled={uploadMutation.isPending}
            >
              {uploadMutation.isPending ? "Uploading..." : "Upload"}
            </Button>
          )}
        </div>
        
        <input 
          type="file" 
          ref={fileInputRef}
          className="hidden" 
          accept="image/*" 
          multiple
          onChange={handleFileChange}
        />
      </div>
    </div>
  );
}
