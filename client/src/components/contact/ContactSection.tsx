import { useTranslation } from "react-i18next";
import PageSection from "../ui/PageSection";
import { useForm } from "react-hook-form";
import { 
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { Button } from "@/components/ui/button";
import { useMutation } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { MapPin, Phone, Mail } from "lucide-react";

const contactFormSchema = z.object({
  name: z.string().min(2, { message: "Name must be at least 2 characters" }),
  email: z.string().email({ message: "Invalid email address" }),
  subject: z.string().min(1, { message: "Please select a subject" }),
  message: z.string().min(10, { message: "Message must be at least 10 characters" }),
  consent: z.boolean().refine(val => val === true, { message: "You must accept the terms" })
});

type ContactFormValues = z.infer<typeof contactFormSchema>;

export default function ContactSection() {
  const { t } = useTranslation();
  const { toast } = useToast();

  const form = useForm<ContactFormValues>({
    resolver: zodResolver(contactFormSchema),
    defaultValues: {
      name: "",
      email: "",
      subject: "",
      message: "",
      consent: false
    }
  });

  const contactMutation = useMutation({
    mutationFn: async (data: ContactFormValues) => {
      return apiRequest('POST', '/api/contact', data);
    },
    onSuccess: () => {
      toast({
        title: "Success",
        description: "Your message has been sent. We'll get back to you soon.",
      });
      form.reset();
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: `Failed to send message: ${error.message}`,
        variant: "destructive",
      });
    },
  });

  function onSubmit(data: ContactFormValues) {
    contactMutation.mutate(data);
  }

  return (
    <PageSection
      id="contact"
      title={t('contact.title')}
      subtitle={t('contact.subtitle')}
    >
      <div className="flex flex-col md:flex-row gap-8">
        <div className="md:w-1/2">
          <div className="bg-white rounded-lg shadow-md p-6 h-full">
            <h3 className="font-cormorant text-2xl text-primary font-semibold mb-4">
              {t('contact.contactInfo.title')}
            </h3>
            
            <div className="space-y-4 mb-6">
              <div className="flex items-start">
                <MapPin className="text-secondary mt-1 mr-3 h-5 w-5" />
                <div>
                  <h4 className="font-semibold">{t('contact.contactInfo.address')}</h4>
                  <p className="text-sm">
                    Sanctuaire Notre Dame de la Tronchaye<br />
                    Place Notre Dame<br />
                    56220 Rochefort-en-Terre<br />
                    France
                  </p>
                </div>
              </div>
              
              <div className="flex items-start">
                <Phone className="text-secondary mt-1 mr-3 h-5 w-5" />
                <div>
                  <h4 className="font-semibold">{t('contact.contactInfo.phone')}</h4>
                  <p className="text-sm">+33 (0)2 97 43 33 37</p>
                </div>
              </div>
              
              <div className="flex items-start">
                <Mail className="text-secondary mt-1 mr-3 h-5 w-5" />
                <div>
                  <h4 className="font-semibold">{t('contact.contactInfo.email')}</h4>
                  <p className="text-sm">sanctuaire@nd-tronchaye.fr</p>
                </div>
              </div>
            </div>
            
            <div className="space-y-4">
              <h3 className="font-cormorant text-xl text-primary font-semibold">
                {t('contact.contactInfo.openingHours')}
              </h3>
              <div className="flex justify-between items-center pb-2 border-b border-gray-200">
                <span>{t('contact.contactInfo.mondayToSaturday')}</span>
                <span className="text-sm">9h00 - 18h00</span>
              </div>
              <div className="flex justify-between items-center">
                <span>{t('contact.contactInfo.sunday')}</span>
                <span className="text-sm">8h00 - 19h00</span>
              </div>
            </div>
            
            <div className="mt-8">
              <div className="flex space-x-4">
                <a href="#" className="w-10 h-10 bg-primary text-white flex items-center justify-center rounded-full hover:bg-opacity-90 transition-all">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 320 512">
                    <path fill="currentColor" d="M279.14 288l14.22-92.66h-88.91v-60.13c0-25.35 12.42-50.06 52.24-50.06h40.42V6.26S260.43 0 225.36 0c-73.22 0-121.08 44.38-121.08 124.72v70.62H22.89V288h81.39v224h100.17V288z" />
                  </svg>
                </a>
                <a href="#" className="w-10 h-10 bg-primary text-white flex items-center justify-center rounded-full hover:bg-opacity-90 transition-all">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 448 512">
                    <path fill="currentColor" d="M224.1 141c-63.6 0-114.9 51.3-114.9 114.9s51.3 114.9 114.9 114.9S339 319.5 339 255.9 287.7 141 224.1 141zm0 189.6c-41.1 0-74.7-33.5-74.7-74.7s33.5-74.7 74.7-74.7 74.7 33.5 74.7 74.7-33.6 74.7-74.7 74.7zm146.4-194.3c0 14.9-12 26.8-26.8 26.8-14.9 0-26.8-12-26.8-26.8s12-26.8 26.8-26.8 26.8 12 26.8 26.8zm76.1 27.2c-1.7-35.9-9.9-67.7-36.2-93.9-26.2-26.2-58-34.4-93.9-36.2-37-2.1-147.9-2.1-184.9 0-35.8 1.7-67.6 9.9-93.9 36.1s-34.4 58-36.2 93.9c-2.1 37-2.1 147.9 0 184.9 1.7 35.9 9.9 67.7 36.2 93.9s58 34.4 93.9 36.2c37 2.1 147.9 2.1 184.9 0 35.9-1.7 67.7-9.9 93.9-36.2 26.2-26.2 34.4-58 36.2-93.9 2.1-37 2.1-147.8 0-184.8zM398.8 388c-7.8 19.6-22.9 34.7-42.6 42.6-29.5 11.7-99.5 9-132.1 9s-102.7 2.6-132.1-9c-19.6-7.8-34.7-22.9-42.6-42.6-11.7-29.5-9-99.5-9-132.1s-2.6-102.7 9-132.1c7.8-19.6 22.9-34.7 42.6-42.6 29.5-11.7 99.5-9 132.1-9s102.7-2.6 132.1 9c19.6 7.8 34.7 22.9 42.6 42.6 11.7 29.5 9 99.5 9 132.1s2.7 102.7-9 132.1z" />
                  </svg>
                </a>
                <a href="#" className="w-10 h-10 bg-primary text-white flex items-center justify-center rounded-full hover:bg-opacity-90 transition-all">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 576 512">
                    <path fill="currentColor" d="M549.655 124.083c-6.281-23.65-24.787-42.276-48.284-48.597C458.781 64 288 64 288 64S117.22 64 74.629 75.486c-23.497 6.322-42.003 24.947-48.284 48.597-11.412 42.867-11.412 132.305-11.412 132.305s0 89.438 11.412 132.305c6.281 23.65 24.787 41.5 48.284 47.821C117.22 448 288 448 288 448s170.78 0 213.371-11.486c23.497-6.321 42.003-24.171 48.284-47.821 11.412-42.867 11.412-132.305 11.412-132.305s0-89.438-11.412-132.305zm-317.51 213.508V175.185l142.739 81.205-142.739 81.201z" />
                  </svg>
                </a>
              </div>
            </div>
          </div>
        </div>
        
        <div className="md:w-1/2">
          <div className="bg-white rounded-lg shadow-md p-6">
            <h3 className="font-cormorant text-2xl text-primary font-semibold mb-4">
              {t('contact.form.title')}
            </h3>
            
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                <FormField
                  control={form.control}
                  name="name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>{t('contact.form.name')}</FormLabel>
                      <FormControl>
                        <Input {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="email"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>{t('contact.form.email')}</FormLabel>
                      <FormControl>
                        <Input type="email" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="subject"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>{t('contact.form.subject')}</FormLabel>
                      <Select 
                        onValueChange={field.onChange} 
                        defaultValue={field.value}
                      >
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select a subject" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="information">{t('contact.form.subjectOptions.information')}</SelectItem>
                          <SelectItem value="baptism">{t('contact.form.subjectOptions.baptism')}</SelectItem>
                          <SelectItem value="marriage">{t('contact.form.subjectOptions.marriage')}</SelectItem>
                          <SelectItem value="mass">{t('contact.form.subjectOptions.mass')}</SelectItem>
                          <SelectItem value="visit">{t('contact.form.subjectOptions.visit')}</SelectItem>
                          <SelectItem value="other">{t('contact.form.subjectOptions.other')}</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="message"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>{t('contact.form.message')}</FormLabel>
                      <FormControl>
                        <Textarea rows={5} {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="consent"
                  render={({ field }) => (
                    <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                      <FormControl>
                        <Checkbox
                          checked={field.value}
                          onCheckedChange={field.onChange}
                        />
                      </FormControl>
                      <div className="space-y-1 leading-none">
                        <FormLabel className="text-xs">
                          {t('contact.form.consent')}
                        </FormLabel>
                        <FormMessage />
                      </div>
                    </FormItem>
                  )}
                />
                
                <Button 
                  type="submit" 
                  className="w-full px-4 py-2 bg-primary text-white rounded hover:bg-opacity-90 transition-all"
                  disabled={contactMutation.isPending}
                >
                  {contactMutation.isPending ? "Sending..." : t('contact.form.send')}
                </Button>
              </form>
            </Form>
          </div>
        </div>
      </div>
      
      <div className="mt-12">
        <div className="bg-white rounded-lg shadow-md overflow-hidden">
          <iframe 
            src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d2687.5292735753344!2d-2.334944684393189!3d47.68001397918853!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x480fccd15f4f404f%3A0x7d959c91587db2ae!2sRochefort-en-Terre%2C%20France!5e0!3m2!1sfr!2sfr!4v1631546822000!5m2!1sfr!2sfr" 
            width="100%" 
            height="400" 
            style={{ border: 0 }} 
            allowFullScreen={true}
            loading="lazy"
            title="Google Maps - Notre Dame de la Tronchaye"
          ></iframe>
        </div>
      </div>
    </PageSection>
  );
}
