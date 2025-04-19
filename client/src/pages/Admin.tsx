import { useState } from "react";
import { useTranslation } from "react-i18next";
import { useQuery, useMutation } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Textarea } from "@/components/ui/textarea";
import { queryClient, apiRequest } from "@/lib/queryClient";
import { toast } from "@/hooks/use-toast";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { formatDate, formatTime } from "@/lib/utils";
import { useLanguage } from "@/context/LanguageContext";
import { CalendarIcon, Trash2 } from "lucide-react";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { cn } from "@/lib/utils";

// Schema for event form
const eventSchema = z.object({
  title: z.string().min(3, { message: "Le titre doit comporter au moins 3 caractères" }),
  date: z.date({ required_error: "Veuillez sélectionner une date" }),
  time: z.string().min(1, { message: "L'heure est requise" }),
  description: z.string().min(10, { message: "La description doit comporter au moins 10 caractères" }),
  imageUrl: z.string().url({ message: "Veuillez entrer une URL valide" }),
});

// Schema for photo form
const photoSchema = z.object({
  title: z.string().min(3, { message: "Le titre doit comporter au moins 3 caractères" }),
  url: z.string().url({ message: "Veuillez entrer une URL valide" }),
});

type EventFormValues = z.infer<typeof eventSchema>;
type PhotoFormValues = z.infer<typeof photoSchema>;

export default function Admin() {
  const { t } = useTranslation();
  const { language } = useLanguage();
  const [activeTab, setActiveTab] = useState("events");
  
  const eventForm = useForm<EventFormValues>({
    resolver: zodResolver(eventSchema),
    defaultValues: {
      title: "",
      description: "",
      imageUrl: "",
      time: "",
    },
  });
  
  const photoForm = useForm<PhotoFormValues>({
    resolver: zodResolver(photoSchema),
    defaultValues: {
      title: "",
      url: "",
    },
  });
  
  // Query to get events
  const { data: events, isLoading: isLoadingEvents } = useQuery({
    queryKey: ['/api/events'],
  });
  
  // Query to get photos
  const { data: photos, isLoading: isLoadingPhotos } = useQuery({
    queryKey: ['/api/photos'],
  });
  
  // Mutation to add an event
  const addEventMutation = useMutation({
    mutationFn: async (data: EventFormValues) => {
      return apiRequest('/api/events', {
        method: 'POST',
        body: JSON.stringify({
          ...data,
          date: data.date.toISOString().split('T')[0], // Format date
          featured: false,
        }),
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/events'] });
      eventForm.reset();
      toast({
        title: "Succès",
        description: "L'événement a été ajouté avec succès",
      });
    },
    onError: (error) => {
      toast({
        title: "Erreur",
        description: "Une erreur est survenue lors de l'ajout de l'événement",
        variant: "destructive",
      });
    },
  });
  
  // Mutation to add a photo
  const addPhotoMutation = useMutation({
    mutationFn: async (data: PhotoFormValues) => {
      return apiRequest('/api/photos', {
        method: 'POST',
        body: JSON.stringify(data),
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/photos'] });
      photoForm.reset();
      toast({
        title: "Succès",
        description: "La photo a été ajoutée avec succès",
      });
    },
    onError: (error) => {
      toast({
        title: "Erreur",
        description: "Une erreur est survenue lors de l'ajout de la photo",
        variant: "destructive",
      });
    },
  });
  
  // Mutation to delete an event
  const deleteEventMutation = useMutation({
    mutationFn: async (id: number) => {
      return apiRequest(`/api/events/${id}`, {
        method: 'DELETE',
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/events'] });
      toast({
        title: "Succès",
        description: "L'événement a été supprimé avec succès",
      });
    },
    onError: (error) => {
      toast({
        title: "Erreur",
        description: "Une erreur est survenue lors de la suppression de l'événement",
        variant: "destructive",
      });
    },
  });
  
  // Mutation to delete a photo
  const deletePhotoMutation = useMutation({
    mutationFn: async (id: number) => {
      return apiRequest(`/api/photos/${id}`, {
        method: 'DELETE',
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/photos'] });
      toast({
        title: "Succès",
        description: "La photo a été supprimée avec succès",
      });
    },
    onError: (error) => {
      toast({
        title: "Erreur",
        description: "Une erreur est survenue lors de la suppression de la photo",
        variant: "destructive",
      });
    },
  });
  
  const onEventSubmit = (data: EventFormValues) => {
    addEventMutation.mutate(data);
  };
  
  const onPhotoSubmit = (data: PhotoFormValues) => {
    addPhotoMutation.mutate(data);
  };
  
  return (
    <div className="container mx-auto px-4 py-16 mt-20 mb-12">
      <h1 className="font-cormorant text-3xl md:text-4xl font-semibold text-primary mb-4">
        Administration
      </h1>
      <p className="text-muted-foreground mb-8">
        Interface d'administration pour gérer le contenu du site.
      </p>
      
      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
        <TabsList className="w-full md:w-auto">
          <TabsTrigger value="events">Gestion des événements</TabsTrigger>
          <TabsTrigger value="photos">Gestion des photos</TabsTrigger>
        </TabsList>
        
        <TabsContent value="events" className="space-y-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="bg-white p-6 rounded-lg shadow-md">
              <h2 className="font-cormorant text-xl font-semibold text-primary mb-4">
                Ajouter un événement
              </h2>
              
              <Form {...eventForm}>
                <form onSubmit={eventForm.handleSubmit(onEventSubmit)} className="space-y-4">
                  <FormField
                    control={eventForm.control}
                    name="title"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Titre</FormLabel>
                        <FormControl>
                          <Input placeholder="Titre de l'événement" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <div className="grid grid-cols-2 gap-4">
                    <FormField
                      control={eventForm.control}
                      name="date"
                      render={({ field }) => (
                        <FormItem className="flex flex-col">
                          <FormLabel>Date</FormLabel>
                          <Popover>
                            <PopoverTrigger asChild>
                              <FormControl>
                                <Button
                                  variant={"outline"}
                                  className={cn(
                                    "pl-3 text-left font-normal",
                                    !field.value && "text-muted-foreground"
                                  )}
                                >
                                  {field.value ? (
                                    formatDate(field.value, language)
                                  ) : (
                                    <span>Sélectionner la date</span>
                                  )}
                                  <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                                </Button>
                              </FormControl>
                            </PopoverTrigger>
                            <PopoverContent className="w-auto p-0" align="start">
                              <Calendar
                                mode="single"
                                selected={field.value}
                                onSelect={field.onChange}
                                initialFocus
                              />
                            </PopoverContent>
                          </Popover>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
                    <FormField
                      control={eventForm.control}
                      name="time"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Heure</FormLabel>
                          <FormControl>
                            <Input type="time" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                  
                  <FormField
                    control={eventForm.control}
                    name="description"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Description</FormLabel>
                        <FormControl>
                          <Textarea placeholder="Description de l'événement" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={eventForm.control}
                    name="imageUrl"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>URL de l'image</FormLabel>
                        <FormControl>
                          <Input placeholder="https://example.com/image.jpg" {...field} />
                        </FormControl>
                        <FormDescription>
                          Entrez l'URL d'une image pour représenter cet événement
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <Button 
                    type="submit" 
                    className="w-full"
                    disabled={addEventMutation.isPending}
                  >
                    {addEventMutation.isPending ? "Ajout en cours..." : "Ajouter l'événement"}
                  </Button>
                </form>
              </Form>
            </div>
            
            <div>
              <h2 className="font-cormorant text-xl font-semibold text-primary mb-4">
                Événements existants
              </h2>
              
              {isLoadingEvents ? (
                <div className="space-y-4">
                  {Array(3).fill(0).map((_, i) => (
                    <div key={i} className="bg-white p-4 rounded-lg shadow-md animate-pulse">
                      <div className="h-6 bg-gray-200 rounded w-3/4 mb-2"></div>
                      <div className="h-4 bg-gray-200 rounded w-1/2 mb-4"></div>
                      <div className="h-4 bg-gray-200 rounded w-full"></div>
                    </div>
                  ))}
                </div>
              ) : events?.length === 0 ? (
                <div className="bg-white p-6 rounded-lg shadow-md text-center">
                  <p className="text-gray-500">Aucun événement trouvé</p>
                </div>
              ) : (
                <div className="space-y-4 max-h-[600px] overflow-y-auto pr-2">
                  {events?.map((event: any) => (
                    <div key={event.id} className="bg-white p-4 rounded-lg shadow-md relative">
                      <Button
                        variant="ghost"
                        size="icon"
                        className="absolute top-2 right-2 text-red-500 hover:text-red-700"
                        onClick={() => deleteEventMutation.mutate(event.id)}
                      >
                        <Trash2 size={16} />
                      </Button>
                      
                      <h3 className="font-medium text-primary mb-1">{event.title}</h3>
                      <div className="flex items-center text-sm text-gray-600 mb-2">
                        <span>{formatDate(new Date(event.date), language)}</span>
                        <span className="mx-2">•</span>
                        <span>{formatTime(event.time, language)}</span>
                      </div>
                      <p className="text-sm text-gray-700 line-clamp-2">
                        {event.description}
                      </p>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </TabsContent>
        
        <TabsContent value="photos" className="space-y-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="bg-white p-6 rounded-lg shadow-md">
              <h2 className="font-cormorant text-xl font-semibold text-primary mb-4">
                Ajouter une photo
              </h2>
              
              <Form {...photoForm}>
                <form onSubmit={photoForm.handleSubmit(onPhotoSubmit)} className="space-y-4">
                  <FormField
                    control={photoForm.control}
                    name="title"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Titre</FormLabel>
                        <FormControl>
                          <Input placeholder="Titre de la photo" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={photoForm.control}
                    name="url"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>URL de l'image</FormLabel>
                        <FormControl>
                          <Input placeholder="https://example.com/image.jpg" {...field} />
                        </FormControl>
                        <FormDescription>
                          Entrez l'URL de la photo à ajouter à la galerie
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <Button 
                    type="submit" 
                    className="w-full"
                    disabled={addPhotoMutation.isPending}
                  >
                    {addPhotoMutation.isPending ? "Ajout en cours..." : "Ajouter la photo"}
                  </Button>
                </form>
              </Form>
            </div>
            
            <div>
              <h2 className="font-cormorant text-xl font-semibold text-primary mb-4">
                Photos existantes
              </h2>
              
              {isLoadingPhotos ? (
                <div className="grid grid-cols-2 gap-4">
                  {Array(4).fill(0).map((_, i) => (
                    <div key={i} className="bg-white p-2 rounded-lg shadow-md animate-pulse">
                      <div className="h-32 bg-gray-200 rounded mb-2"></div>
                      <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                    </div>
                  ))}
                </div>
              ) : photos?.length === 0 ? (
                <div className="bg-white p-6 rounded-lg shadow-md text-center">
                  <p className="text-gray-500">Aucune photo trouvée</p>
                </div>
              ) : (
                <div className="grid grid-cols-2 gap-4 max-h-[600px] overflow-y-auto pr-2">
                  {photos?.map((photo: any) => (
                    <div key={photo.id} className="bg-white p-2 rounded-lg shadow-md relative group">
                      <Button
                        variant="ghost"
                        size="icon"
                        className="absolute top-2 right-2 text-red-500 hover:text-red-700 opacity-0 group-hover:opacity-100 transition-opacity"
                        onClick={() => deletePhotoMutation.mutate(photo.id)}
                      >
                        <Trash2 size={16} />
                      </Button>
                      
                      <img 
                        src={photo.url} 
                        alt={photo.title} 
                        className="w-full h-32 object-cover rounded mb-2" 
                      />
                      <p className="text-sm font-medium truncate">{photo.title}</p>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}