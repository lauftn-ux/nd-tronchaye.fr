import { useTranslation } from "react-i18next";
import PageSection from "../components/ui/PageSection";
import { Wrench, Clock, Book } from "lucide-react";
import { Helmet } from "react-helmet";

export default function History() {
  const { t } = useTranslation();

  return (
    <>
      <Helmet>
        <title>{t("history.pageTitle")} | Notre Dame de la Tronchaye</title>
        <meta name="description" content={t("history.metaDescription")} />
      </Helmet>

      <div className="container mx-auto px-4 py-12">
        <h1 className="font-cormorant text-4xl md:text-5xl text-secondary mb-8 text-center">
          {t("history.pageHeading")}
        </h1>

        <div className="max-w-4xl mx-auto">
          <section className="mb-16">
            <h2 className="font-cormorant text-3xl text-primary mb-6">
              {t("history.origins.title")}
            </h2>
            <div className="bg-white rounded-lg shadow-md p-6 mb-8">
              <div className="flex flex-col md:flex-row gap-8">
                <div className="md:w-2/3">
                  <p className="mb-4">{t("history.origins.paragraph1")}</p>
                  <p className="mb-4">{t("history.origins.paragraph2")}</p>
                  <p>{t("history.origins.paragraph3")}</p>
                </div>
                <div className="md:w-1/3">
                  <img
                    src="/IMG_9298.webp"
                    alt="Notre Dame de la Tronchaye"
                    className="w-full h-auto rounded-lg shadow-md"
                  />
                </div>
              </div>
            </div>

            <div className="bg-stone-100 rounded-lg p-6">
              <h3 className="font-cormorant text-2xl text-secondary mb-4 flex items-center">
                <Clock className="mr-2" />
                {t("history.timeline.title")}
              </h3>
              <ul className="space-y-6 relative border-l border-primary pl-6 ml-3 mt-6">
                <li className="relative">
                  <div className="absolute w-4 h-4 bg-primary rounded-full -left-8 top-0"></div>
                  <time className="text-sm font-semibold text-primary">XIIe siècle</time>
                  <h4 className="text-lg font-semibold">{t("history.timeline.discovery")}</h4>
                  <p>{t("history.timeline.discoveryText")}</p>
                </li>
                <li className="relative">
                  <div className="absolute w-4 h-4 bg-primary rounded-full -left-8 top-0"></div>
                  <time className="text-sm font-semibold text-primary">XIIIe siècle</time>
                  <h4 className="text-lg font-semibold">{t("history.timeline.construction")}</h4>
                  <p>{t("history.timeline.constructionText")}</p>
                </li>
                <li className="relative">
                  <div className="absolute w-4 h-4 bg-primary rounded-full -left-8 top-0"></div>
                  <time className="text-sm font-semibold text-primary">1793</time>
                  <h4 className="text-lg font-semibold">{t("history.timeline.revolution")}</h4>
                  <p>{t("history.timeline.revolutionText")}</p>
                </li>
                <li className="relative">
                  <div className="absolute w-4 h-4 bg-primary rounded-full -left-8 top-0"></div>
                  <time className="text-sm font-semibold text-primary">1860-1865</time>
                  <h4 className="text-lg font-semibold">{t("history.timeline.restoration1")}</h4>
                  <p>{t("history.timeline.restoration1Text")}</p>
                </li>
                <li className="relative">
                  <div className="absolute w-4 h-4 bg-primary rounded-full -left-8 top-0"></div>
                  <time className="text-sm font-semibold text-primary">1925</time>
                  <h4 className="text-lg font-semibold">{t("history.timeline.coronation")}</h4>
                  <p>{t("history.timeline.coronationText")}</p>
                </li>
              </ul>
            </div>
          </section>

          <section className="mb-16" id="architecture">
            <h2 className="font-cormorant text-3xl text-primary mb-6">
              {t("history.architecture.title")}
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
              <div>
                <img
                  src="/IMG_9303.webp"
                  alt="Architecture du sanctuaire"
                  className="w-full h-auto rounded-lg shadow-md mb-4"
                />
                <p className="text-sm text-center italic">{t("history.architecture.imageCaption")}</p>
              </div>
              <div>
                <p className="mb-4">{t("history.architecture.paragraph1")}</p>
                <ul className="list-disc ml-5 mb-4 space-y-2">
                  <li>{t("history.architecture.choirAndApse")}</li>
                  <li>{t("history.architecture.nave")}</li>
                  <li>{t("history.architecture.southPorch")}</li>
                  <li>{t("history.architecture.statue")}</li>
                </ul>
                <p>{t("history.architecture.paragraph2")}</p>
              </div>
            </div>

            <div className="bg-white p-6 rounded-lg shadow-md">
              <h3 className="font-cormorant text-2xl text-secondary mb-4 flex items-center">
                <Wrench className="mr-2" />
                {t("history.architecture.restorations")}
              </h3>
              <ul className="space-y-4">
                <li className="flex items-start">
                  <span className="text-accent mr-2">
                    <Wrench size={16} />
                  </span>
                  <span>
                    <strong>1860-1865</strong> : {t("history.architecture.restoration1")}
                  </span>
                </li>
                <li className="flex items-start">
                  <span className="text-accent mr-2">
                    <Wrench size={16} />
                  </span>
                  <span>
                    <strong>1950-1952</strong> : {t("history.architecture.restoration2")}
                  </span>
                </li>
                <li className="flex items-start">
                  <span className="text-accent mr-2">
                    <Wrench size={16} />
                  </span>
                  <span>
                    <strong>2005-2008</strong> : {t("history.architecture.restoration3")}
                  </span>
                </li>
                <li className="flex items-start">
                  <span className="text-accent mr-2">
                    <Wrench size={16} />
                  </span>
                  <span>
                    <strong>2019-2021</strong> : {t("history.architecture.restoration4")}
                  </span>
                </li>
              </ul>
            </div>
          </section>

          <section>
            <h2 className="font-cormorant text-3xl text-primary mb-6">
              {t("history.spiritualSignificance.title")}
            </h2>
            <div className="bg-stone-100 rounded-lg p-6">
              <div className="flex flex-col md:flex-row gap-8">
                <div className="md:w-2/3">
                  <p className="mb-4">{t("history.spiritualSignificance.paragraph1")}</p>
                  <p className="mb-4">{t("history.spiritualSignificance.paragraph2")}</p>
                  <div className="flex items-center mt-6">
                    <Book className="text-secondary mr-3" />
                    <blockquote className="italic border-l-4 border-secondary pl-4">
                      {t("history.spiritualSignificance.quote")}
                    </blockquote>
                  </div>
                </div>
                <div className="md:w-1/3">
                  <img
                    src="/IMG_9305.webp"
                    alt="Vitrail marial"
                    className="w-full h-auto rounded-lg shadow-md"
                  />
                </div>
              </div>
            </div>
          </section>
        </div>
      </div>
    </>
  );
}
