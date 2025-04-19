import { useTranslation } from "react-i18next";
import PageSection from "../ui/PageSection";
import { Link } from "wouter";
import { Droplet, Wheat, Egg, HandHelping, BellRing, Cross } from "lucide-react";

interface SacramentCardProps {
  icon: React.ReactNode;
  title: string;
  description: string;
  action: string;
  link: string;
  image: string;
}

function SacramentCard({ icon, title, description, action, link, image }: SacramentCardProps) {
  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden transform transition hover:-translate-y-1">
      <div className="h-48 bg-cover bg-center" style={{ backgroundImage: `url(${image})` }}></div>
      <div className="p-6">
        <div className="flex items-center mb-3">
          <span className="text-secondary text-xl mr-3">{icon}</span>
          <h3 className="font-cormorant text-xl text-primary">{title}</h3>
        </div>
        <p className="text-sm mb-4">
          {description}
        </p>
        <Link href={link}>
          <a className="text-secondary hover:text-primary transition-colors text-sm font-semibold flex items-center">
            {action} <span className="ml-1">→</span>
          </a>
        </Link>
      </div>
    </div>
  );
}

export default function SacramentsSection() {
  const { t } = useTranslation();

  const sacraments = [
    {
      icon: <Droplet />,
      title: t('sacraments.baptism.title'),
      description: t('sacraments.baptism.description'),
      action: t('sacraments.baptism.action'),
      link: "/#contact",
      image: "https://images.unsplash.com/photo-1508847154043-3dad2d404028?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&h=350&q=80"
    },
    {
      icon: <Wheat />,
      title: t('sacraments.eucharist.title'),
      description: t('sacraments.eucharist.description'),
      action: t('sacraments.eucharist.action'),
      link: "/#schedule",
      image: "https://images.unsplash.com/photo-1618038483079-bfe64dcb17f7?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&h=350&q=80"
    },
    {
      icon: <Egg />,
      title: t('sacraments.confirmation.title'),
      description: t('sacraments.confirmation.description'),
      action: t('sacraments.confirmation.action'),
      link: "/#contact",
      image: "https://images.unsplash.com/photo-1469371670807-013ccf25f16a?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&h=350&q=80"
    },
    {
      icon: <HandHelping />,
      title: t('sacraments.reconciliation.title'),
      description: t('sacraments.reconciliation.description'),
      action: t('sacraments.reconciliation.action'),
      link: "/#schedule",
      image: "https://images.unsplash.com/photo-1470645792882-7be11df21Ab4?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&h=350&q=80"
    },
    {
      icon: <BellRing />,
      title: t('sacraments.marriage.title'),
      description: t('sacraments.marriage.description'),
      action: t('sacraments.marriage.action'),
      link: "/#contact",
      image: "https://images.unsplash.com/photo-1606800052052-a08af7148866?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&h=350&q=80"
    },
    {
      icon: <Cross />,
      title: t('sacraments.others.title'),
      description: t('sacraments.others.description'),
      action: t('sacraments.others.action'),
      link: "/#contact",
      image: "https://images.unsplash.com/photo-1544365558-35aa4afcf11f?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&h=350&q=80"
    }
  ];

  return (
    <PageSection
      id="sacraments"
      title={t('sacraments.title')}
      subtitle={t('sacraments.subtitle')}
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
