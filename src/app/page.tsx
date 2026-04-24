import { Nav } from "@/components/nav/Nav";
import { Footer } from "@/components/footer/Footer";
import { Hero } from "@/components/landing/Hero";
import { Mission } from "@/components/landing/Mission/Mission";
import { Flow } from "@/components/landing/Flow/Flow";
import { UseCases } from "@/components/landing/UseCases/UseCases";
import { ControlNow } from "@/components/landing/ControlNow/ControlNow";
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
        <Mission />
        <Flow />
        <UseCases />
        <ControlNow />
        <Closer />
        <ViewSource />
      </main>
      <SessionLog />
      <Footer />
    </>
  );
}
