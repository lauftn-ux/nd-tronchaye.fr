import { useState } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { useTranslation } from "react-i18next";
import { CalendarIcon, Edit, Trash2, LogOut, Plus } from "lucide-react";
import { format } from "date-fns";
import { fr } from "date-fns/locale";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogClose,
} from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/hooks/use-auth";
import { apiRequest, queryClient } from "@/lib/queryClient";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";

// Schéma de formulaire pour les événements
const eventFormSchema = z.object({
  title: z.string().min(2, "Le titre doit contenir au moins 2 caractères"),
  description: z.string().min(10, "La description doit contenir au moins 10 caractères"),
  date: z.date({
    required_error: "Veuillez sélectionner une date",
  }),
  time: z.string().min(1, "Veuillez spécifier l'heure"),
  imageUrl: z.string().url("Veuillez entrer une URL valide"),
  type: z.string().min(1, "Veuillez sélectionner un type"),
  featured: z.boolean().default(false),
});

// Schéma de formulaire pour les événements spéciaux
const specialEventFormSchema = z.object({
  title: z.string().min(2, "Le titre doit contenir au moins 2 caractères"),
  date: z.string().min(2, "La date doit être au format texte (ex: 25 décembre 2023)"),
  time: z.string().min(1, "Veuillez spécifier l'heure"),
});

type EventFormValues = z.infer<typeof eventFormSchema>;
type SpecialEventFormValues = z.infer<typeof specialEventFormSchema>;

export default function AdminEvents() {
  const { t } = useTranslation();
  const { toast } = useToast();
  const { logoutMutation } = useAuth();
  const [showAddDialog, setShowAddDialog] = useState(false);
  const [showAddSpecialDialog, setShowAddSpecialDialog] = useState(false);
  const [editingEvent, setEditingEvent] = useState<any | null>(null);
  const [editingSpecialEvent, setEditingSpecialEvent] = useState<any | null>(null);

  // Récupérer les événements
  const { data: events, isLoading: eventsLoading } = useQuery({
    queryKey: ['/api/admin/events'],
  });

  // Récupérer les événements spéciaux
  const { data: specialEvents, isLoading: specialEventsLoading } = useQuery({
    queryKey: ['/api/admin/events/special'],
  });

  // Formulaire pour les événements
  const eventForm = useForm<EventFormValues>({
    resolver: zodResolver(eventFormSchema),
    defaultValues: {
      title: "",
      description: "",
      date: new Date(),
      time: "",
      imageUrl: "",
      type: "general",
      featured: false,
    },
  });

  // Formulaire pour les événements spéciaux
  const specialEventForm = useForm<SpecialEventFormValues>({
    resolver: zodResolver(specialEventFormSchema),
    defaultValues: {
      title: "",
      date: "",
      time: "",
    },
  });

  // Mutations pour les événements
  const createEventMutation = useMutation({
    mutationFn: async (data: EventFormValues) => {
      // Convertir la date en format ISO
      const formattedData = {
        ...data,
        date: format(data.date, 'yyyy-MM-dd'),
      };
      const res = await apiRequest("POST", "/api/admin/events", formattedData);
      return await res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/admin/events'] });
      queryClient.invalidateQueries({ queryKey: ['/api/events'] });
      setShowAddDialog(false);
      eventForm.reset();
      toast({
        title: "Succès",
        description: "L'événement a été créé avec succès",
      });
    },
    onError: (error) => {
      toast({
        title: "Erreur",
        description: "Une erreur est survenue lors de la création de l'événement",
        variant: "destructive",
      });
    },
  });

  const updateEventMutation = useMutation({
    mutationFn: async (data: { id: number; data: Partial<EventFormValues> }) => {
      // Convertir la date en format ISO si elle existe
      const formattedData = {
        ...data.data,
        date: data.data.date ? format(data.data.date, 'yyyy-MM-dd') : undefined,
      };
      const res = await apiRequest("PUT", `/api/admin/events/${data.id}`, formattedData);
      return await res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/admin/events'] });
      queryClient.invalidateQueries({ queryKey: ['/api/events'] });
      setEditingEvent(null);
      eventForm.reset();
      toast({
        title: "Succès",
        description: "L'événement a été mis à jour avec succès",
      });
    },
    onError: (error) => {
      toast({
        title: "Erreur",
        description: "Une erreur est survenue lors de la mise à jour de l'événement",
        variant: "destructive",
      });
    },
  });

  const deleteEventMutation = useMutation({
    mutationFn: async (id: number) => {
      await apiRequest("DELETE", `/api/admin/events/${id}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/admin/events'] });
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

  // Mutations pour les événements spéciaux
  const createSpecialEventMutation = useMutation({
    mutationFn: async (data: SpecialEventFormValues) => {
      const res = await apiRequest("POST", "/api/admin/events/special", data);
      return await res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/admin/events/special'] });
      queryClient.invalidateQueries({ queryKey: ['/api/events/special'] });
      setShowAddSpecialDialog(false);
      specialEventForm.reset();
      toast({
        title: "Succès",
        description: "L'événement spécial a été créé avec succès",
      });
    },
    onError: (error) => {
      toast({
        title: "Erreur",
        description: "Une erreur est survenue lors de la création de l'événement spécial",
        variant: "destructive",
      });
    },
  });

  const updateSpecialEventMutation = useMutation({
    mutationFn: async (data: { id: number; data: Partial<SpecialEventFormValues> }) => {
      const res = await apiRequest("PUT", `/api/admin/events/special/${data.id}`, data.data);
      return await res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/admin/events/special'] });
      queryClient.invalidateQueries({ queryKey: ['/api/events/special'] });
      setEditingSpecialEvent(null);
      specialEventForm.reset();
      toast({
        title: "Succès",
        description: "L'événement spécial a été mis à jour avec succès",
      });
    },
    onError: (error) => {
      toast({
        title: "Erreur",
        description: "Une erreur est survenue lors de la mise à jour de l'événement spécial",
        variant: "destructive",
      });
    },
  });

  const deleteSpecialEventMutation = useMutation({
    mutationFn: async (id: number) => {
      await apiRequest("DELETE", `/api/admin/events/special/${id}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/admin/events/special'] });
      queryClient.invalidateQueries({ queryKey: ['/api/events/special'] });
      toast({
        title: "Succès",
        description: "L'événement spécial a été supprimé avec succès",
      });
    },
    onError: (error) => {
      toast({
        title: "Erreur",
        description: "Une erreur est survenue lors de la suppression de l'événement spécial",
        variant: "destructive",
      });
    },
  });

  // Soumission du formulaire d'événement
  const onSubmitEvent = (data: EventFormValues) => {
    if (editingEvent) {
      updateEventMutation.mutate({ id: editingEvent.id, data });
    } else {
      createEventMutation.mutate(data);
    }
  };

  // Soumission du formulaire d'événement spécial
  const onSubmitSpecialEvent = (data: SpecialEventFormValues) => {
    if (editingSpecialEvent) {
      updateSpecialEventMutation.mutate({ id: editingSpecialEvent.id, data });
    } else {
      createSpecialEventMutation.mutate(data);
    }
  };

  // Éditer un événement
  const handleEditEvent = (event: any) => {
    setEditingEvent(event);
    eventForm.reset({
      title: event.title,
      description: event.description,
      date: new Date(event.date),
      time: event.time,
      imageUrl: event.imageUrl,
      type: event.type || "general",
      featured: event.featured || false,
    });
  };

  // Éditer un événement spécial
  const handleEditSpecialEvent = (event: any) => {
    setEditingSpecialEvent(event);
    specialEventForm.reset({
      title: event.title,
      date: event.date,
      time: event.time,
    });
  };

  // Se déconnecter
  const handleLogout = () => {
    logoutMutation.mutate();
  };

  return (
    <div className="container mx-auto py-10 space-y-8">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">Administration des Événements</h1>
        <Button variant="outline" onClick={handleLogout}>
          <LogOut className="mr-2 h-4 w-4" />
          Se déconnecter
        </Button>
      </div>

      <Tabs defaultValue="events">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="events">Événements</TabsTrigger>
          <TabsTrigger value="special">Événements Spéciaux</TabsTrigger>
        </TabsList>

        {/* Onglet des événements */}
        <TabsContent value="events" className="space-y-4">
          <div className="flex justify-between items-center">
            <h2 className="text-xl font-semibold">Liste des événements</h2>
            <Dialog open={showAddDialog || !!editingEvent} onOpenChange={(open) => {
              setShowAddDialog(open);
              if (!open) {
                setEditingEvent(null);
                eventForm.reset();
              }
            }}>
              <DialogTrigger asChild>
                <Button onClick={() => setShowAddDialog(true)}>
                  <Plus className="mr-2 h-4 w-4" />
                  Ajouter un événement
                </Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-[500px]">
                <DialogHeader>
                  <DialogTitle>{editingEvent ? "Modifier l'événement" : "Ajouter un événement"}</DialogTitle>
                  <DialogDescription>
                    Remplissez le formulaire ci-dessous pour {editingEvent ? "modifier" : "ajouter"} un événement.
                  </DialogDescription>
                </DialogHeader>
                <Form {...eventForm}>
                  <form onSubmit={eventForm.handleSubmit(onSubmitEvent)} className="space-y-6">
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
                                    variant="outline"
                                    className={
                                      "w-full pl-3 text-left font-normal"
                                    }
                                  >
                                    {field.value ? (
                                      format(field.value, "PPP", { locale: fr })
                                    ) : (
                                      <span>Sélectionner une date</span>
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
                              <Input placeholder="ex: 14h30 - 16h00" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>
                    <FormField
                      control={eventForm.control}
                      name="imageUrl"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>URL de l'image</FormLabel>
                          <FormControl>
                            <Input placeholder="https://exemple.com/image.jpg" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <div className="grid grid-cols-2 gap-4">
                      <FormField
                        control={eventForm.control}
                        name="type"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Type</FormLabel>
                            <Select
                              onValueChange={field.onChange}
                              defaultValue={field.value}
                            >
                              <FormControl>
                                <SelectTrigger>
                                  <SelectValue placeholder="Sélectionner un type" />
                                </SelectTrigger>
                              </FormControl>
                              <SelectContent>
                                <SelectItem value="general">Général</SelectItem>
                                <SelectItem value="pilgrimage">Pèlerinage</SelectItem>
                                <SelectItem value="feast">Fête religieuse</SelectItem>
                                <SelectItem value="concert">Concert</SelectItem>
                                <SelectItem value="workshop">Atelier</SelectItem>
                              </SelectContent>
                            </Select>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={eventForm.control}
                        name="featured"
                        render={({ field }) => (
                          <FormItem className="flex flex-row items-end space-x-3 space-y-0 rounded-md">
                            <FormControl>
                              <Switch
                                checked={field.value}
                                onCheckedChange={field.onChange}
                              />
                            </FormControl>
                            <FormLabel>Mettre en avant</FormLabel>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>
                    <DialogFooter>
                      <Button type="submit" disabled={eventForm.formState.isSubmitting}>
                        {editingEvent ? "Mettre à jour" : "Ajouter"} l'événement
                      </Button>
                    </DialogFooter>
                  </form>
                </Form>
              </DialogContent>
            </Dialog>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {eventsLoading ? (
              <p>Chargement des événements...</p>
            ) : (
              events?.map((event: any) => (
                <Card key={event.id} className="overflow-hidden">
                  <CardHeader className="p-0">
                    <img
                      src={event.imageUrl}
                      alt={event.title}
                      className="w-full h-48 object-cover"
                    />
                  </CardHeader>
                  <CardContent className="p-4">
                    <div className="flex justify-between items-start">
                      <div>
                        <h3 className="text-lg font-semibold">{event.title}</h3>
                        <p className="text-sm text-gray-500">
                          {new Date(event.date).toLocaleDateString()} • {event.time}
                        </p>
                      </div>
                      <div className="flex space-x-2">
                        <Button variant="outline" size="sm" onClick={() => handleEditEvent(event)}>
                          <Edit className="h-4 w-4" />
                        </Button>
                        <AlertDialog>
                          <AlertDialogTrigger asChild>
                            <Button variant="outline" size="sm">
                              <Trash2 className="h-4 w-4 text-destructive" />
                            </Button>
                          </AlertDialogTrigger>
                          <AlertDialogContent>
                            <AlertDialogHeader>
                              <AlertDialogTitle>Êtes-vous sûr ?</AlertDialogTitle>
                              <AlertDialogDescription>
                                Cette action ne peut pas être annulée. Cela supprimera définitivement l'événement.
                              </AlertDialogDescription>
                            </AlertDialogHeader>
                            <AlertDialogFooter>
                              <AlertDialogCancel>Annuler</AlertDialogCancel>
                              <AlertDialogAction 
                                onClick={() => deleteEventMutation.mutate(event.id)}
                                className="bg-destructive text-destructive-foreground"
                              >
                                Supprimer
                              </AlertDialogAction>
                            </AlertDialogFooter>
                          </AlertDialogContent>
                        </AlertDialog>
                      </div>
                    </div>
                    <p className="mt-2 text-sm line-clamp-3">{event.description}</p>
                    {event.featured && (
                      <span className="mt-2 inline-block bg-primary/10 text-primary text-xs px-2 py-1 rounded">
                        Mis en avant
                      </span>
                    )}
                  </CardContent>
                </Card>
              ))
            )}
          </div>
        </TabsContent>

        {/* Onglet des événements spéciaux */}
        <TabsContent value="special" className="space-y-4">
          <div className="flex justify-between items-center">
            <h2 className="text-xl font-semibold">Événements spéciaux pour le calendrier</h2>
            <Dialog open={showAddSpecialDialog || !!editingSpecialEvent} onOpenChange={(open) => {
              setShowAddSpecialDialog(open);
              if (!open) {
                setEditingSpecialEvent(null);
                specialEventForm.reset();
              }
            }}>
              <DialogTrigger asChild>
                <Button onClick={() => setShowAddSpecialDialog(true)}>
                  <Plus className="mr-2 h-4 w-4" />
                  Ajouter un événement spécial
                </Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-[500px]">
                <DialogHeader>
                  <DialogTitle>{editingSpecialEvent ? "Modifier l'événement spécial" : "Ajouter un événement spécial"}</DialogTitle>
                  <DialogDescription>
                    Ces événements spéciaux apparaîtront dans le calendrier principal.
                  </DialogDescription>
                </DialogHeader>
                <Form {...specialEventForm}>
                  <form onSubmit={specialEventForm.handleSubmit(onSubmitSpecialEvent)} className="space-y-6">
                    <FormField
                      control={specialEventForm.control}
                      name="title"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Titre</FormLabel>
                          <FormControl>
                            <Input placeholder="ex: Assomption de la Vierge Marie" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={specialEventForm.control}
                      name="date"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Date (format texte)</FormLabel>
                          <FormControl>
                            <Input placeholder="ex: 15 août 2023" {...field} />
                          </FormControl>
                          <FormDescription>
                            Format recommandé: "jour mois année" (ex: 15 août 2023)
                          </FormDescription>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={specialEventForm.control}
                      name="time"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Horaires</FormLabel>
                          <FormControl>
                            <Input placeholder="ex: Messes à 9h00 et 11h00" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <DialogFooter>
                      <Button type="submit" disabled={specialEventForm.formState.isSubmitting}>
                        {editingSpecialEvent ? "Mettre à jour" : "Ajouter"} l'événement spécial
                      </Button>
                    </DialogFooter>
                  </form>
                </Form>
              </DialogContent>
            </Dialog>
          </div>

          <div className="space-y-4">
            {specialEventsLoading ? (
              <p>Chargement des événements spéciaux...</p>
            ) : (
              specialEvents?.map((event: any) => (
                <Card key={event.id}>
                  <CardContent className="p-4 flex justify-between items-center">
                    <div>
                      <h3 className="text-lg font-semibold">{event.title}</h3>
                      <p className="text-sm text-gray-500">
                        {event.date} • {event.time}
                      </p>
                    </div>
                    <div className="flex space-x-2">
                      <Button variant="outline" size="sm" onClick={() => handleEditSpecialEvent(event)}>
                        <Edit className="h-4 w-4" />
                      </Button>
                      <AlertDialog>
                        <AlertDialogTrigger asChild>
                          <Button variant="outline" size="sm">
                            <Trash2 className="h-4 w-4 text-destructive" />
                          </Button>
                        </AlertDialogTrigger>
                        <AlertDialogContent>
                          <AlertDialogHeader>
                            <AlertDialogTitle>Êtes-vous sûr ?</AlertDialogTitle>
                            <AlertDialogDescription>
                              Cette action ne peut pas être annulée. Cela supprimera définitivement l'événement spécial.
                            </AlertDialogDescription>
                          </AlertDialogHeader>
                          <AlertDialogFooter>
                            <AlertDialogCancel>Annuler</AlertDialogCancel>
                            <AlertDialogAction 
                              onClick={() => deleteSpecialEventMutation.mutate(event.id)}
                              className="bg-destructive text-destructive-foreground"
                            >
                              Supprimer
                            </AlertDialogAction>
                          </AlertDialogFooter>
                        </AlertDialogContent>
                      </AlertDialog>
                    </div>
                  </CardContent>
                </Card>
              ))
            )}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}