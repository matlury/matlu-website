"use client";

import React, { useState } from "react";
import { Dialog, DialogTrigger } from "@/components/ui/dialog";
import CalendarEvents from "./CalendarEvents";
import EventRequestForm from "./EventRequestForm";
import { Language } from "../utils";
import type { LocationSuggestion, TitleSuggestion } from "../lib/cms-data";

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
      <CalendarEvents
        language={lang}
        showAll
        headerAction={
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
              {lang === "fi" ? "Lisää tapahtuma" : "Add event"}
            </button>
          </DialogTrigger>
        }
      />

      <EventRequestForm
        lang={lang}
        initialLocationSuggestions={locationSuggestions}
        initialTitleSuggestions={titleSuggestions}
      />
    </Dialog>
  );
}
