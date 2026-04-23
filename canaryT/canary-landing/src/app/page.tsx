import { Nav } from "@/components/nav/Nav";
import { Footer } from "@/components/footer/Footer";
import { Hero } from "@/components/landing/Hero";
import { EcosystemBar } from "@/components/landing/EcosystemBar";
import { Flow } from "@/components/landing/Flow/Flow";
import { UseCases } from "@/components/landing/UseCases/UseCases";
import { Closer } from "@/components/landing/Closer";
import { ViewSource } from "@/components/landing/ViewSource/ViewSource";
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
        <EcosystemBar />
        <Flow />
        <UseCases />
        <Closer />
        <ViewSource />
      </main>
      <SessionLog />
      <Footer />
    </>
  );
}
