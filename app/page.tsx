import Hero from "@/app/sections/Hero";
import About from "@/app/sections/About";
import Craft from "@/app/sections/Craft";
import Hunts from "@/app/sections/Hunts";
import Cosmos from "@/app/sections/Cosmos";
import Contact from "@/app/sections/Contact";
import FairyCompanion from "@/app/components/layout/FairyCompanion";

export default function Home() {
  return (
    <main>
      <Hero />
      <About />
      <Craft />
      <Hunts />
      <Cosmos />
      <Contact />
      <FairyCompanion />
    </main>
  );
}
