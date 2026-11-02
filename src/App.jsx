import { useRef } from "react";
import Navbar from "./components/Navbar";
import Hero from "./components/Hero";
import Marquee from "./components/Marquee";
import Credibility from "./components/Credibility";
import Problem from "./components/Problem";
import Benefits from "./components/Benefits";
import System from "./components/System";
import LinkedInEvidence from "./components/LinkedInEvidence";
import GettingStarted from "./components/GettingStarted";
import FAQ from "./components/FAQ";
import Contact from "./components/Contact";
import Footer from "./components/Footer";
import { useFxInteractions } from "./hooks/useFxInteractions";

export default function App() {
  const rootRef = useRef(null);
  const spotRef = useRef(null);
  const progRef = useRef(null);

  useFxInteractions(rootRef, spotRef, progRef);

  return (
    <div className="fx fx-js" id="fxRoot" ref={rootRef}>
      <div className="fx-light" aria-hidden="true">
        <div className="fx-spot" id="fxSpot" ref={spotRef} />
      </div>
      <div className="fx-prog" aria-hidden="true" id="fxProg" ref={progRef} />
      <div className="fx-body">
        <Navbar />
        <Hero />
        <Marquee />
        <Credibility />
        <Problem />
        <Benefits />
        <System />
        <LinkedInEvidence />
        <GettingStarted />
        <FAQ />
        <Contact />
        <Footer />
      </div>
    </div>
  );
}
