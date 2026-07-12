import { notFound } from "next/navigation";
import countriesData from "@/data/countries.json";
import { Country } from "@/country";
import CountryHero from "@/components/country/CountryHero";
import InfoGrid from "@/components/country/InfoGrid";
import LandmarkCarousel from "@/components/country/LandmarkCarousel";
import ImageGallery from "@/components/country/ImageGallery";
import FunFactsSection from "@/components/country/FunFactsSection";
import TravelCostCalculator from "@/components/TravelCostCalculator";
import LanguagePhrasesSection from "@/components/country/LanguagePhrasesSection";

const countries = countriesData as Country[];

interface PageProps {
  params: Promise<{ country: string }>;
}

export default async function CountryPage({ params }: PageProps) {
  const { country: countryId } = await params;
  const country = countries.find((c) => c.id === countryId);

  if (!country) {
    notFound();
  }

  return (
    <div>
      <CountryHero country={country} />
      <InfoGrid country={country} />
      <LandmarkCarousel landmarks={country.landmarks} />
      <ImageGallery images={country.gallery} countryName={country.name} />
      <FunFactsSection
        facts={country.funFacts}
        nationalAnimal={country.nationalAnimal}
        food={country.food}
      />
      {country.commonPhrases && (
        <LanguagePhrasesSection phrases={country.commonPhrases} />
      )}
      {country.travelCosts && (
        <section className="max-w-4xl mx-auto px-6 py-16">
         <TravelCostCalculator countryName={country.name} travelCosts={country.travelCosts} />
        </section>
)}
    </div>
  );
}