"use client";

import MainContentHeader from "@/components/layout/MainContentHeader";
import { Events, mockEvents } from "@/components/events";
import { useRouter } from "next/navigation";

// Force dynamic rendering to avoid SSR serialization issues
export const dynamic = 'force-dynamic';

export default function EventsPage() {
  const router = useRouter();

  return (
    <div className="min-h-screen bg-white dark:bg-gray-900">
      <MainContentHeader title="Tüm Etkinlikler" showSearchBar={false} />

      <div className="p-4">
        <Events
          events={mockEvents}
          fetchFromAPI={false} // Set to true when ready to use real API
          showFilters={true}
          showOdds={true}
          showPredictions={true}
          showLeague={true}
          showTime={true}
          variant="grid"
          onEventClick={(event) => router.push(`/events/${event.id}`)}
          onOddsClick={(event, market) => console.log('Bet on', event.id, market)}
        />
      </div>
    </div>
  );
}