"use client";

import { Calendar, Search, RefreshCw } from 'lucide-react';
import { Button } from '../ui/Button';

interface EventsEmptyProps {
  message?: string;
  showSearch?: boolean;
  showRefresh?: boolean;
  onRefresh?: () => void;
  onSearch?: () => void;
  className?: string;
}

export function EventsEmpty({
  message = 'Maç bulunamadı',
  showSearch = false,
  showRefresh = false,
  onRefresh,
  onSearch,
  className = '',
}: EventsEmptyProps) {
  return (
    <div className={`flex flex-col items-center justify-center py-12 text-center ${className}`}>
      <Calendar className="w-12 h-12 text-gray-400 dark:text-gray-600 mb-4" />
      <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
        {message}
      </h3>
      <p className="text-sm text-gray-600 dark:text-gray-400 mb-6 max-w-md">
        Seçtiğiniz kriterlere uygun maç bulunamadı. Filtreleri değiştirerek tekrar deneyebilirsiniz.
      </p>
      
      <div className="flex gap-3">
        {showSearch && onSearch && (
          <Button
            onClick={onSearch}
            variant="secondary"
            size="sm"
            leftIcon={<Search className="w-4 h-4" />}
          >
            Arama Yap
          </Button>
        )}
        {showRefresh && onRefresh && (
          <Button
            onClick={onRefresh}
            variant="secondary"
            size="sm"
            leftIcon={<RefreshCw className="w-4 h-4" />}
          >
            Yenile
          </Button>
        )}
      </div>
    </div>
  );
}