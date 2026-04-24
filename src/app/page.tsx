import { Nav } from "@/components/nav/Nav";
import { Footer } from "@/components/footer/Footer";
import { Hero } from "@/components/landing/Hero";
import { Mission } from "@/components/landing/Mission/Mission";
import { Flow } from "@/components/landing/Flow/Flow";
import { UseCases } from "@/components/landing/UseCases/UseCases";
import { Closer } from "@/components/landing/Closer";
import {
  CanaryMascot,
  SessionLog,
} from "@/components/canary-watch";

export default function Home() {
  return (
    <>
      <Nav />
      <CanaryMascot />
      <main>
        <Hero />
        <Mission />
        <Flow />
        <UseCases />
        <Closer />
      </main>
      <SessionLog />
      <Footer />
    </>
  );
}
