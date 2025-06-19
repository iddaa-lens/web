"use client";

import { useRouter } from "next/navigation";
import { Brain, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { AIPredictions, AIPrediction } from "@/components/ai-predictions";

interface AIPredictionsSectionProps {
  predictions: AIPrediction[];
  maxItems?: number;
}

export function AIPredictionsSection({ 
  predictions,
  maxItems = 5 
}: AIPredictionsSectionProps) {
  const router = useRouter();

  return (
    <div>
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-base sm:text-lg font-semibold text-gray-900 dark:text-white flex items-center gap-1.5">
          <Brain className="w-4 h-4 text-purple-500" />
          AI Tahminleri
        </h2>
        <Button
          onClick={() => router.push("/predictions")}
          variant="link"
          size="xs"
          rightIcon={<ArrowRight className="w-3 h-3" />}
          className="text-xs sm:text-sm text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white p-0 h-auto"
        >
          Tümünü gör
        </Button>
      </div>

      <AIPredictions
        predictions={predictions}
        onPredictionClick={(prediction) => router.push(`/predictions/${prediction.slug}`)}
        maxItems={maxItems}
      />
    </div>
  );
}