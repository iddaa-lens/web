"use client";

import { useRouter } from "next/navigation";
import { Activity, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Events, Event } from "@/components/events";

interface EventsSectionProps {
  events: Event[];
  selectedSports: string[];
  maxItems?: number;
}

export function EventsSection({ 
  events, 
  selectedSports,
  maxItems = 6 
}: EventsSectionProps) {
  const router = useRouter();

  return (
    <div>
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-base sm:text-lg font-semibold text-gray-900 dark:text-white flex items-center gap-1.5">
          <Activity className="w-4 h-4 text-red-500" />
          Maçlar
        </h2>
        <Button
          onClick={() => router.push("/events")}
          variant="link"
          size="xs"
          rightIcon={<ArrowRight className="w-3 h-3" />}
          className="text-xs sm:text-sm text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white p-0 h-auto"
        >
          Tümünü gör
        </Button>
      </div>

      <Events
        events={events}
        selectedSports={selectedSports}
        onEventClick={(event) => router.push(`/events/${event.id}`)}
        onOddsClick={(event, market) => console.log('Bet on', event.id, market)}
        showPredictions={true}
        showOdds={true}
        showLeague={true}
        showTime={true}
        variant="list"
        spacing="tight"
        maxItems={maxItems}
      />
    </div>
  );
}