import { useState } from "react";
import { useTranslation } from "react-i18next";
import { useAuth } from "@/hooks/use-auth";
import { Label } from "@/components/ui/label";
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
import { CalendarIcon, Trash2, Edit, CheckCircle, XCircle } from "lucide-react";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { 
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle 
} from "@/components/ui/dialog";
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
  const [editingPhoto, setEditingPhoto] = useState<any>(null);
  const [editPhotoDialogOpen, setEditPhotoDialogOpen] = useState(false);
  
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
    queryKey: ["/api/events"],
  });
  
  // Query to get photos
  const { data: photos, isLoading: isLoadingPhotos } = useQuery({
    queryKey: ["/api/photos"],
  });
  
  // Mutation to add an event
  const addEventMutation = useMutation({
    mutationFn: async (data: EventFormValues) => {
      return apiRequest("POST", "/api/events", {
        ...data,
        date: data.date.toISOString().split("T")[0], // Format date
        featured: false,
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/events"] });
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
      return apiRequest("POST", "/api/photos", data);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/photos"] });
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
      return apiRequest("DELETE", `/api/events/${id}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/events"] });
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
      return apiRequest("DELETE", `/api/photos/${id}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/photos"] });
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
  
  // Mutation pour éditer une photo
  const editPhotoMutation = useMutation({
    mutationFn: async ({ id, data }: { id: number, data: Partial<PhotoFormValues> }) => {
      return apiRequest("PUT", `/api/photos/${id}`, data);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/photos"] });
      setEditPhotoDialogOpen(false);
      setEditingPhoto(null);
      toast({
        title: "Succès",
        description: "La photo a été mise à jour avec succès",
      });
    },
    onError: (error) => {
      toast({
        title: "Erreur",
        description: "Une erreur est survenue lors de la mise à jour de la photo",
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
  
  // Gestion de l'édition des photos
  const editPhotoForm = useForm<PhotoFormValues>({
    resolver: zodResolver(photoSchema),
    defaultValues: {
      title: "",
      url: "",
    },
  });
  
  const handleEditPhoto = (photo: any) => {
    setEditingPhoto(photo);
    editPhotoForm.reset({
      title: photo.title,
      url: photo.url,
    });
    setEditPhotoDialogOpen(true);
  };
  
  const onEditPhotoSubmit = (data: PhotoFormValues) => {
    if (editingPhoto) {
      editPhotoMutation.mutate({
        id: editingPhoto.id,
        data,
      });
    }
  };
  
  // Mutation pour se déconnecter
  const { logoutMutation, user } = useAuth();

  const handleLogout = async () => {
    try {
      await logoutMutation.mutateAsync();
      toast({
        title: "Déconnexion réussie",
        description: "Vous êtes maintenant déconnecté"
      });
    } catch (error) {
      toast({
        title: "Erreur",
        description: "Une erreur est survenue lors de la déconnexion",
        variant: "destructive"
      });
    }
  };

  // Gestion de la modification des identifiants admin
  const [isChangingCredentials, setIsChangingCredentials] = useState(false);
  const [newUsername, setNewUsername] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [currentPassword, setCurrentPassword] = useState("");

  const changeCredentialsMutation = useMutation({
    mutationFn: async (data: { newUsername: string; newPassword: string; currentPassword: string }) => {
      return apiRequest("PUT", "/api/admin/credentials", data);
    },
    onSuccess: () => {
      setIsChangingCredentials(false);
      setNewUsername("");
      setNewPassword("");
      setCurrentPassword("");
      toast({
        title: "Succès",
        description: "Vos identifiants ont été mis à jour avec succès. Veuillez vous reconnecter.",
      });
      // Déconnexion après changement des identifiants
      setTimeout(() => logoutMutation.mutate(), 1500);
    },
    onError: (error) => {
      toast({
        title: "Erreur",
        description: "Une erreur est survenue lors de la mise à jour des identifiants",
        variant: "destructive",
      });
    },
  });

  const handleChangeCredentials = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newUsername && !newPassword) {
      toast({
        title: "Erreur",
        description: "Veuillez renseigner au moins un nouveau nom d'utilisateur ou mot de passe",
        variant: "destructive",
      });
      return;
    }
    changeCredentialsMutation.mutate({
      newUsername: newUsername || user?.username || "",
      newPassword,
      currentPassword,
    });
  };

  return (
    <div className="container mx-auto px-4 py-16 mt-20 mb-12">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="font-cormorant text-3xl md:text-4xl font-semibold text-primary mb-2">
            Administration
          </h1>
          <p className="text-muted-foreground">
            Interface d'administration pour gérer le contenu du site.
          </p>
        </div>
        <div className="flex space-x-3">
          <Button 
            variant="outline" 
            onClick={() => setIsChangingCredentials(true)}
          >
            Modifier les identifiants
          </Button>
          <Button 
            variant="destructive" 
            onClick={handleLogout}
            disabled={logoutMutation.isPending}
          >
            {logoutMutation.isPending ? "Déconnexion..." : "Se déconnecter"}
          </Button>
        </div>
      </div>
      
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
                      <div className="absolute top-2 right-2 flex space-x-1 opacity-0 group-hover:opacity-100 transition-opacity">
                        <Button
                          variant="ghost"
                          size="icon"
                          className="text-blue-600 hover:text-blue-800 bg-white/70"
                          onClick={() => handleEditPhoto(photo)}
                        >
                          <Edit size={16} />
                        </Button>
                        
                        <Button
                          variant="ghost"
                          size="icon"
                          className="text-red-500 hover:text-red-700 bg-white/70"
                          onClick={() => deletePhotoMutation.mutate(photo.id)}
                        >
                          <Trash2 size={16} />
                        </Button>
                      </div>
                      
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
      
      {/* Modal d'édition de photo */}
      <Dialog open={editPhotoDialogOpen} onOpenChange={setEditPhotoDialogOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Modifier la photo</DialogTitle>
            <DialogDescription>
              Modifiez les informations de la photo ci-dessous.
            </DialogDescription>
          </DialogHeader>
          
          <Form {...editPhotoForm}>
            <form onSubmit={editPhotoForm.handleSubmit(onEditPhotoSubmit)} className="space-y-4">
              <FormField
                control={editPhotoForm.control}
                name="title"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Titre</FormLabel>
                    <FormControl>
                      <Input {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={editPhotoForm.control}
                name="url"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>URL de l'image</FormLabel>
                    <FormControl>
                      <Input {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <DialogFooter>
                <Button 
                  variant="outline" 
                  onClick={() => setEditPhotoDialogOpen(false)}
                  type="button"
                >
                  Annuler
                </Button>
                <Button 
                  type="submit" 
                  disabled={editPhotoMutation.isPending}
                >
                  {editPhotoMutation.isPending ? "Enregistrement..." : "Enregistrer"}
                </Button>
              </DialogFooter>
            </form>
          </Form>
        </DialogContent>
      </Dialog>

      {/* Modal pour changer les identifiants admin */}
      <Dialog open={isChangingCredentials} onOpenChange={setIsChangingCredentials}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Modifier vos identifiants</DialogTitle>
            <DialogDescription>
              Modifiez votre nom d'utilisateur et/ou mot de passe. Vous devrez vous reconnecter après la modification.
            </DialogDescription>
          </DialogHeader>
          
          <form onSubmit={handleChangeCredentials} className="space-y-4 mt-4">
            <div className="space-y-2">
              <Label htmlFor="currentPassword">Mot de passe actuel</Label>
              <Input 
                id="currentPassword" 
                type="password" 
                value={currentPassword}
                onChange={(e) => setCurrentPassword(e.target.value)}
                required
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="newUsername">Nouveau nom d'utilisateur</Label>
              <Input 
                id="newUsername" 
                value={newUsername}
                onChange={(e) => setNewUsername(e.target.value)}
                placeholder={user?.username}
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="newPassword">Nouveau mot de passe</Label>
              <Input 
                id="newPassword" 
                type="password" 
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
              />
            </div>
            
            <DialogFooter>
              <Button 
                type="button" 
                variant="outline" 
                onClick={() => setIsChangingCredentials(false)}
              >
                Annuler
              </Button>
              <Button 
                type="submit"
                disabled={!currentPassword || changeCredentialsMutation.isPending || (!newUsername && !newPassword)}
              >
                {changeCredentialsMutation.isPending ? "Modification..." : "Enregistrer"}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}