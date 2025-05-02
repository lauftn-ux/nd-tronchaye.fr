import { useTranslation } from "react-i18next";
import PageSection from "../ui/PageSection";
import { Link } from "wouter";
import {
  Droplet,
  Wheat,
  Egg,
  HandHelping,
  BellRing,
  Cross,
} from "lucide-react";

interface SacramentCardProps {
  icon: React.ReactNode;
  title: string;
  description: string;
  action: string;
  link: string;
  image: string;
}

function SacramentCard({
  icon,
  title,
  description,
  action,
  link,
  image,
}: SacramentCardProps) {
  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden transform transition hover:-translate-y-1">
      <div
        className="h-48 bg-cover bg-center"
        style={{ backgroundImage: `url(${image})` }}
      ></div>
      <div className="p-6">
        <div className="flex items-center mb-3">
          <span className="text-secondary text-xl mr-3">{icon}</span>
          <h3 className="font-cormorant text-xl text-primary">{title}</h3>
        </div>
        <p className="text-sm mb-4">{description}</p>
        <div
          className="text-secondary hover:text-primary transition-colors text-sm font-semibold flex items-center cursor-pointer"
          onClick={() => (window.location.href = link)}
        >
          {action} <span className="ml-1">→</span>
        </div>
      </div>
    </div>
  );
}

export default function SacramentsSection() {
  const { t } = useTranslation();

  const sacraments = [
    {
      icon: <Droplet />,
      title: t("sacraments.baptism.title"),
      description: t("sacraments.baptism.description"),
      action: t("sacraments.baptism.action"),
      link: "/#contact",
      image:
        "https://images.unsplash.com/photo-1566516171511-1c411a59c8ba",
    },
    {
      icon: <Egg />,
      title: t("sacraments.confirmation.title"),
      description: t("sacraments.confirmation.description"),
      action: t("sacraments.confirmation.action"),
      link: "/#contact",
      image: "/NdT  - 1.webp",
    },
    {
      icon: <Wheat />,
      title: t("sacraments.eucharist.title"),
      description: t("sacraments.eucharist.description"),
      action: t("sacraments.eucharist.action"),
      link: "/#schedule",
      image:
        "https://images.unsplash.com/photo-1633556569778-d562f0633a07?q=80&w=2075&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    },

    {
      icon: <HandHelping />,
      title: t("sacraments.reconciliation.title"),
      description: t("sacraments.reconciliation.description"),
      action: t("sacraments.reconciliation.action"),
      link: "/#schedule",
      image:
        "https://images.unsplash.com/photo-1549485455-ce6f0a9da36d?q=80&w=2531&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    },
    {
      icon: <BellRing />,
      title: t("sacraments.marriage.title"),
      description: t("sacraments.marriage.description"),
      action: t("sacraments.marriage.action"),
      link: "/#contact",
      image:
        "https://images.unsplash.com/photo-1606800052052-a08af7148866?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&h=350&q=80",
    },
    {
      icon: <Cross />,
      title: t("sacraments.anointing.title"),
      description: t("sacraments.anointing.description"),
      action: t("sacraments.anointing.action"),
      link: "/#contact",
      image:
        "https://images.unsplash.com/photo-1544365558-35aa4afcf11f?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&h=350&q=80",
    },
  ];

  return (
    <PageSection
      id="sacraments"
      title={t("sacraments.title")}
      subtitle={t("sacraments.subtitle")}
      bgColor="bg-stone"
    >
      <div className="grid md:grid-cols-3 gap-6">
        {sacraments.map((sacrament, index) => (
          <SacramentCard
            key={index}
            icon={sacrament.icon}
            title={sacrament.title}
            description={sacrament.description}
            action={sacrament.action}
            link={sacrament.link}
            image={sacrament.image}
          />
        ))}
      </div>
    </PageSection>
  );
}
