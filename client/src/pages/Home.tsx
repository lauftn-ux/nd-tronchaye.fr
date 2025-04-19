import Hero from "@/components/home/Hero";
import Welcome from "@/components/home/Welcome";
import HistorySection from "@/components/history/HistorySection";
import ScheduleSection from "@/components/schedule/ScheduleSection";
import SacramentsSection from "@/components/sacraments/SacramentsSection";
import EventsSection from "@/components/events/EventsSection";
import GallerySection from "@/components/gallery/GallerySection";
import ContactSection from "@/components/contact/ContactSection";
import CalendarSection from "@/components/calendar/CalendarSection";
import { useEffect } from "react";
import { useLocation } from "wouter";

export default function Home() {
  const [location] = useLocation();

  // Handle smooth scrolling for hash links
  useEffect(() => {
    // Check if there's a hash in the URL
    const hash = window.location.hash;
    if (hash) {
      // A bit of delay to ensure components are rendered
      setTimeout(() => {
        const element = document.querySelector(hash);
        if (element) {
          // Scroll to the element with a slight offset for the fixed header
          window.scrollTo({
            top: element.getBoundingClientRect().top + window.pageYOffset - 70,
            behavior: "smooth"
          });
        }
      }, 100);
    } else {
      // If no hash, scroll to top
      window.scrollTo(0, 0);
    }
  }, [location]);

  return (
    <>
      <Hero />
      <Welcome />
      <HistorySection />
      <ScheduleSection />
      <SacramentsSection />
      <EventsSection />
      <GallerySection />
      <ContactSection />
      <CalendarSection />
    </>
  );
}
