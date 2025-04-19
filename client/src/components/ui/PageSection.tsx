import { cn } from "@/lib/utils";
import { ReactNode } from "react";

interface PageSectionProps {
  id: string;
  title: string;
  subtitle?: string;
  children: ReactNode;
  bgColor?: string;
  centered?: boolean;
}

export default function PageSection({
  id,
  title,
  subtitle,
  children,
  bgColor = "bg-white",
  centered = true,
}: PageSectionProps) {
  return (
    <section id={id} className={cn("py-16 px-4", bgColor)}>
      <div className="container mx-auto max-w-5xl">
        <div className={cn("mb-12", centered && "text-center")}>
          <h2 className="font-cormorant text-3xl md:text-4xl text-primary font-semibold mb-3">
            {title}
          </h2>
          <div className={cn("w-20 h-1 bg-accent mb-4", centered ? "mx-auto" : "ml-0")}></div>
          {subtitle && <p className={cn("max-w-2xl", centered && "mx-auto")}>{subtitle}</p>}
        </div>
        {children}
      </div>
    </section>
  );
}
