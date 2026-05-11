import { useState } from "react";
import { useTranslation } from "react-i18next";
import { useQuery } from "@tanstack/react-query";
import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { ImagePlus, Search, XIcon } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import PageSection from "../ui/PageSection";

interface Photo {
  id: number;
  url: string;
  title: string;
}

export default function GallerySection() {
  const { t } = useTranslation();
  const { data: photos, isLoading } = useQuery<Photo[]>({
    queryKey: ["/api/photos"],
  });
  const [selectedPhoto, setSelectedPhoto] = useState<Photo | null>(null);

  return (
    <PageSection
      id="gallery"
      title={t("gallery.title")}
      subtitle={t("gallery.subtitle")}
      bgColor="bg-stone"
    >
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {isLoading
          ? Array(8)
              .fill(0)
              .map((_, index) => (
                <Skeleton key={index} className="w-full h-40 md:h-52 rounded-lg" />
              ))
          : photos?.map((photo) => (
              <button
                key={photo.id}
                type="button"
                onClick={() => setSelectedPhoto(photo)}
                aria-label={photo.title}
                className="relative group overflow-hidden rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2"
              >
                <img
                  src={photo.url}
                  alt={photo.title}
                  className="w-full h-40 md:h-52 object-cover transition-transform duration-500 group-hover:scale-110"
                />
                <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-60 transition-opacity duration-300 flex items-center justify-center">
                  <Search className="text-white h-8 w-8 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                </div>
              </button>
            ))}
      </div>

      <div className="text-center mt-10">
        <Link href="/gallery">
          <Button className="inline-flex items-center px-6 py-3 bg-primary text-white font-semibold rounded hover:bg-opacity-90 transition-all">
            <ImagePlus className="mr-2 h-5 w-5" />
            {t("gallery.viewAll")}
          </Button>
        </Link>
      </div>

      {selectedPhoto && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-90"
          onClick={() => setSelectedPhoto(null)}
          role="dialog"
          aria-modal="true"
        >
          <button
            className="absolute top-6 right-6 text-white p-2 rounded-full hover:bg-white/10"
            onClick={() => setSelectedPhoto(null)}
            aria-label="Close"
          >
            <XIcon size={24} />
          </button>
          <div className="max-w-4xl max-h-[90vh] px-4" onClick={(e) => e.stopPropagation()}>
            <img
              src={selectedPhoto.url}
              alt={selectedPhoto.title}
              className="max-w-full max-h-[80vh] mx-auto object-contain"
            />
            <div className="text-white text-center mt-4">
              <h2 className="text-xl font-cormorant">{selectedPhoto.title}</h2>
            </div>
          </div>
        </div>
      )}
    </PageSection>
  );
}
