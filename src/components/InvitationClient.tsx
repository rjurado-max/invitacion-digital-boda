"use client";

import { useState } from "react";
import AccessCodeForm from "@/components/AccessCodeForm";
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

type Guest = {
  id: string;
  full_name: string;
  phone: string | null;
  table_number: string | null;
  max_companions: number;
  token: string;
  access_code: string | null;
  invitation_group: string | null;
} | null;

type Props = {
  token: string;
  guest: Guest;
};

export default function InvitationClient({ token, guest }: Props) {
  const [opened, setOpened] = useState(false);
  const [validatedGuest, setValidatedGuest] = useState<Guest>(null);
  const [showRsvpModal, setShowRsvpModal] = useState(false);

  if (!guest) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-[#f7f1e8] px-6 text-center">
        <div className="max-w-md rounded-[2rem] bg-white p-8 shadow-sm">
          <h1 className="font-serif text-4xl">Invitación no encontrada</h1>
          <p className="mt-4 text-neutral-600">
            Verifica que el enlace sea correcto o consulta con los novios.
          </p>
        </div>
      </main>
    );
  }

  if (!validatedGuest) {
    return <AccessCodeForm token={token} onSuccess={setValidatedGuest} />;
  }

  return (
    <main>
      {!opened && <OpeningEnvelope onOpen={() => setOpened(true)} />}

      {opened && (
        <>
          <FloatingHeader />
          <MusicButton />

          <HeroSection
            guestName={validatedGuest.full_name}
            onOpenRsvp={() => setShowRsvpModal(true)}
          />

          <EventSummary />
          <Countdown />
          <StorySection />

          <DetailsSection onOpenRsvp={() => setShowRsvpModal(true)} />

          <AgendaSection />
          <LocationSection />
          <GiftsSection />
          <PhotoUploadSection defaultGuestName={validatedGuest.full_name} />

          <TableFinder
            defaultGuestName={validatedGuest.full_name}
            tableNumber={validatedGuest.table_number}
          />

          <RsvpSection guest={validatedGuest} />
          <Footer />

          {showRsvpModal && (
            <RsvpSection
              guest={validatedGuest}
              isModal
              onClose={() => setShowRsvpModal(false)}
            />
          )}
        </>
      )}
    </main>
  );
}