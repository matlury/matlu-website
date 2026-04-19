"use client";

import React, { useState } from "react";
import { Dialog, DialogTrigger, DialogContent } from "@/components/ui/dialog";
import CalendarEvents from "./CalendarEvents";
import EventRequestForm from "./EventRequestForm";
import { Language } from "../utils";
import { LocationSuggestion, TitleSuggestion } from "../app/[page]/page";

interface EventsPageContentProps {
  lang: Language;
  locationSuggestions: LocationSuggestion[];
  titleSuggestions: TitleSuggestion[];
}

export default function EventsPageContent({
  lang,
  locationSuggestions,
  titleSuggestions,
}: EventsPageContentProps) {
  const [open, setOpen] = useState(false);

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <div style={{ display: "flex", alignItems: "center", gap: "0.75rem", flexWrap: "wrap" }}>
        <h1 style={{ margin: 0 }}>Tulevat tapahtumat</h1>
        <DialogTrigger asChild>
          <button
            type="button"
            style={{
              borderRadius: "999px",
              padding: "0.5rem 1rem",
              fontSize: "0.875rem",
              fontWeight: 700,
              background: "#0149bc",
              color: "#ffffff",
              border: "none",
              cursor: "pointer",
            }}
          >
            {lang === "fi" ? "Lisää tapahtuma" : "Add an event"}
          </button>
        </DialogTrigger>
      </div>

      <CalendarEvents language={lang} showAll />

      <EventRequestForm
        lang={lang}
        initialLocationSuggestions={locationSuggestions}
        initialTitleSuggestions={titleSuggestions}
      />
    </Dialog>
  );
}
