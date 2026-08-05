import Navbar from "@/components/layout/Navbar";
import Hero from "@/components/sections/Hero";
import AIPreview from "@/components/sections/AIPreview";
import Features from "@/components/sections/Features";
import HowItWorks from "@/components/sections/HowItWorks";
import WhyChoose from "@/components/sections/WhyChoose";
import CTA from "@/components/sections/CTA";
import Footer from "@/components/layout/Footer";

export default function Home() {
  return (
    <main className="min-h-screen bg-slate-950">
      <Navbar />
      <Hero />
      <AIPreview />
      <Features />
      <HowItWorks />
      <WhyChoose />
      <CTA />
      <Footer />
    </main>
  );
}
