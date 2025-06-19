"use client";

import { Event } from "@/components/events";
import { AIPrediction } from "@/components/ai-predictions";
import { EventsSection } from "./events-section";
import { AIPredictionsSection } from "./ai-predictions-section";

interface ContentSectionsProps {
  events: Event[];
  predictions: AIPrediction[];
  selectedSports: string[];
}

export function ContentSections({ 
  events, 
  predictions, 
  selectedSports 
}: ContentSectionsProps) {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-12">
      <div className="grid lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2">
          <EventsSection 
            events={events}
            selectedSports={selectedSports}
          />
        </div>

        <div>
          <AIPredictionsSection 
            predictions={predictions}
          />
        </div>
      </div>
    </div>
  );
}