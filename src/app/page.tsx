"use client";

import { useState } from "react";
import OpeningEnvelope from "@/components/OpeningEnvelope";
import FloatingHeader from "@/components/FloatingHeader";
import MusicButton from "@/components/MusicButton";
import HeroSection from "@/components/HeroSection";
import EventSummary from "@/components/EventSummary";
import Countdown from "@/components/Countdown";
import StorySection from "@/components/StorySection";
import DetailsSection from "@/components/DetailsSection";
import AgendaSection from "@/components/AgendaSection";
import LocationSection from "@/components/LocationSection";
import GiftsSection from "@/components/GiftsSection";
import PhotoUploadSection from "@/components/PhotoUploadSection";
import TableFinder from "@/components/TableFinder";
import RsvpSection from "@/components/RsvpSection";
import Footer from "@/components/Footer";

export default function Home() {
  const [opened, setOpened] = useState(false);

  return (
    <main>
      {!opened && (
        <OpeningEnvelope onOpen={() => setOpened(true)} />
      )}

      {opened && (
        <>
          <FloatingHeader />
          <MusicButton />
          <HeroSection />
          <EventSummary />
          <Countdown />
          <StorySection />
          <DetailsSection />
          <AgendaSection />
          <LocationSection />
          <GiftsSection />
          <PhotoUploadSection />
          <TableFinder />
          <RsvpSection />
          <Footer />
        </>
      )}
    </main>
  );
}