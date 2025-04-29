import { useTranslation } from "react-i18next";

export default function Welcome() {
  const { t } = useTranslation();

  return (
    <section className="py-16 px-4">
      <div className="container mx-auto max-w-5xl">
        <div className="flex flex-col md:flex-row items-center gap-8">
          <div className="md:w-1/2">
            <h2 className="font-cormorant text-3xl md:text-4xl text-primary font-semibold mb-4">
              {t('home.welcome.title')}
            </h2>
            <p className="text-lg mb-4">
              {t('home.welcome.paragraph1')}
            </p>
            <p className="mb-4">
              {t('home.welcome.paragraph2')}
            </p>
            <div className="flex items-center mt-6">
              <div className="h-px bg-accent flex-grow mr-4"></div>
              <span className="text-secondary italic">« {t('home.welcome.quote')} »</span>
            </div>
          </div>
          <div className="md:w-1/2">
            <img 
              src="https://images.unsplash.com/photo-1438804339143-a0d6e5123871?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=600&q=80" 
              alt="Intérieur du sanctuaire" 
              className="rounded-lg shadow-lg w-full h-auto" 
            />
          </div>
        </div>
      </div>
    </section>
  );
}
