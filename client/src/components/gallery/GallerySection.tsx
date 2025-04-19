import { useTranslation } from "react-i18next";
import PageSection from "../ui/PageSection";
import ImageUpload from "./ImageUpload";
import { useQuery } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { ImagePlus } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";

interface Photo {
  id: number;
  url: string;
  title: string;
}

export default function GallerySection() {
  const { t } = useTranslation();
  const { data: photos, isLoading } = useQuery({
    queryKey: ['/api/photos'],
  });

  return (
    <PageSection
      id="gallery"
      title={t('gallery.title')}
      subtitle={t('gallery.subtitle')}
      bgColor="bg-stone"
    >
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {isLoading ? (
          // Skeleton loading state
          Array(8).fill(0).map((_, index) => (
            <Skeleton key={index} className="w-full h-40 md:h-52 rounded-lg" />
          ))
        ) : (
          photos?.map((photo: Photo) => (
            <div key={photo.id} className="relative group overflow-hidden rounded-lg">
              <img 
                src={photo.url} 
                alt={photo.title} 
                className="w-full h-40 md:h-52 object-cover transition-transform duration-500 group-hover:scale-110" 
              />
              <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-60 transition-opacity duration-300 flex items-center justify-center">
                <button className="text-white opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                  </svg>
                </button>
              </div>
            </div>
          ))
        )}
      </div>
      
      <div className="text-center mt-10">
        <Button className="inline-flex items-center px-6 py-3 bg-primary text-white font-semibold rounded hover:bg-opacity-90 transition-all">
          <ImagePlus className="mr-2 h-5 w-5" />
          {t('gallery.viewAll')}
        </Button>
      </div>
      
      {/* Photo upload section for administrators */}
      <ImageUpload />
    </PageSection>
  );
}
