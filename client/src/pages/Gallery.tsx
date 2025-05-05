import { useState } from "react";
import { useTranslation } from "react-i18next";
import { useQuery } from "@tanstack/react-query";
import { ZoomInIcon, XIcon } from "lucide-react";
import { Helmet } from "react-helmet";
import { Skeleton } from "@/components/ui/skeleton";

interface Photo {
  id: number;
  url: string;
  title: string;
}

export default function Gallery() {
  const { t } = useTranslation();
  const { data: photos, isLoading } = useQuery({
    queryKey: ["/api/photos"],
  });

  // State for the lightbox
  const [selectedPhoto, setSelectedPhoto] = useState<Photo | null>(null);

  // Handler for opening the lightbox
  const openLightbox = (photo: Photo) => {
    setSelectedPhoto(photo);
  };

  // Handler for closing the lightbox
  const closeLightbox = () => {
    setSelectedPhoto(null);
  };

  return (
    <>
      <Helmet>
        <title>{t("gallery.pageTitle")} | Notre Dame de la Tronchaye</title>
        <meta name="description" content={t("gallery.metaDescription")} />
      </Helmet>

      <div className="container mx-auto px-4 py-12">
        <h1 className="font-cormorant text-4xl md:text-5xl text-secondary mb-4 text-center">
          {t("gallery.pageHeading")}
        </h1>
        <p className="text-center text-gray-600 max-w-xl mx-auto mb-12">
          {t("gallery.pageDescription")}
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {isLoading
            ? // Skeleton loading state
              Array(12)
                .fill(0)
                .map((_, index) => (
                  <div key={index} className="flex flex-col gap-2">
                    <Skeleton className="w-full aspect-square rounded-lg" />
                    <Skeleton className="h-6 w-3/4" />
                  </div>
                ))
            : photos?.map((photo: Photo) => (
                <div
                  key={photo.id}
                  className="group cursor-pointer"
                  onClick={() => openLightbox(photo)}
                >
                  <div className="aspect-square overflow-hidden rounded-lg bg-gray-200 mb-2 relative">
                    <img
                      src={photo.url}
                      alt={photo.title}
                      className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                    />
                    <div className="absolute inset-0 bg-black opacity-0 group-hover:opacity-40 transition-opacity duration-300 flex items-center justify-center">
                      <ZoomInIcon className="text-white w-10 h-10 opacity-0 group-hover:opacity-100 transition-opacity" />
                    </div>
                  </div>
                  <h3 className="font-medium text-gray-800">{photo.title}</h3>
                </div>
              ))}
        </div>
      </div>

      {/* Lightbox */}
      {selectedPhoto && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-90"
          onClick={closeLightbox}
        >
          <button
            className="absolute top-6 right-6 text-white p-2 rounded-full hover:bg-white/10"
            onClick={closeLightbox}
          >
            <XIcon size={24} />
          </button>
          <div
            className="max-w-4xl max-h-[90vh] px-4"
            onClick={(e) => e.stopPropagation()}
          >
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
    </>
  );
}
