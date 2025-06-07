import React from 'react';
import { CheckCircle, XCircle, Sparkles, TrendingUp, Users, Crown } from 'lucide-react';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';

interface RightSidebarProps {
  className?: string;
}

interface PredictionEvaluation {
  id: number;
  match: string;
  prediction: string;
  result: boolean;
  odds: number;
}

interface Model {
  id: number;
  name: string;
  predictions: PredictionEvaluation[];
}

export default function RightSidebar({ className = '' }: RightSidebarProps) {
  // Mock data for 5 models with last 10 predictions each
  const models: Model[] = [
    {
      id: 1,
      name: 'DeepStats AI',
      predictions: [
        { id: 1, match: 'GS - FB', prediction: 'MS 1', result: true, odds: 2.45 },
        { id: 2, match: 'RM - BAR', prediction: 'Üst 2.5', result: true, odds: 1.85 },
        { id: 3, match: 'LIV - MCI', prediction: 'KG Var', result: false, odds: 1.72 },
        { id: 4, match: 'BJK - TS', prediction: 'MS X', result: true, odds: 3.20 },
        { id: 5, match: 'MUN - CHE', prediction: 'Alt 2.5', result: false, odds: 2.10 },
        { id: 6, match: 'BAY - DOR', prediction: 'MS 2', result: true, odds: 3.45 },
        { id: 7, match: 'JUV - MIL', prediction: 'KG Yok', result: true, odds: 1.95 },
        { id: 8, match: 'PSG - LYO', prediction: 'MS 1', result: true, odds: 1.65 },
        { id: 9, match: 'ATM - SEV', prediction: 'Üst 1.5', result: false, odds: 1.55 },
        { id: 10, match: 'ARS - TOT', prediction: 'MS 1', result: true, odds: 2.20 },
      ]
    },
    {
      id: 2,
      name: 'Neural Predictor',
      predictions: [
        { id: 11, match: 'FB - GS', prediction: 'MS 2', result: false, odds: 2.80 },
        { id: 12, match: 'BAR - RM', prediction: 'KG Var', result: true, odds: 1.68 },
        { id: 13, match: 'MCI - LIV', prediction: 'Üst 3.5', result: true, odds: 2.35 },
        { id: 14, match: 'TS - BJK', prediction: 'MS 1', result: false, odds: 2.95 },
        { id: 15, match: 'CHE - MUN', prediction: 'MS X', result: true, odds: 3.10 },
        { id: 16, match: 'DOR - BAY', prediction: 'Alt 3.5', result: true, odds: 1.90 },
        { id: 17, match: 'MIL - JUV', prediction: 'MS 2', result: false, odds: 2.55 },
        { id: 18, match: 'LYO - PSG', prediction: 'KG Var', result: true, odds: 1.75 },
        { id: 19, match: 'SEV - ATM', prediction: 'MS 2', result: true, odds: 2.40 },
        { id: 20, match: 'TOT - ARS', prediction: 'Üst 2.5', result: false, odds: 1.80 },
      ]
    },
    {
      id: 3,
      name: 'Quantum Odds',
      predictions: [
        { id: 21, match: 'GS - TS', prediction: 'MS 1', result: true, odds: 1.75 },
        { id: 22, match: 'RM - ATM', prediction: 'Alt 2.5', result: true, odds: 2.15 },
        { id: 23, match: 'LIV - ARS', prediction: 'MS 1', result: true, odds: 1.85 },
        { id: 24, match: 'BJK - FB', prediction: 'KG Var', result: false, odds: 1.70 },
        { id: 25, match: 'MUN - TOT', prediction: 'Üst 2.5', result: true, odds: 1.95 },
        { id: 26, match: 'BAY - JUV', prediction: 'MS 1', result: false, odds: 1.80 },
        { id: 27, match: 'MIL - PSG', prediction: 'MS 2', result: true, odds: 2.65 },
        { id: 28, match: 'BAR - SEV', prediction: 'MS 1', result: true, odds: 1.45 },
        { id: 29, match: 'CHE - MCI', prediction: 'Alt 3.5', result: false, odds: 1.75 },
        { id: 30, match: 'DOR - LYO', prediction: 'Üst 1.5', result: true, odds: 1.50 },
      ]
    },
    {
      id: 4,
      name: 'BetMaster Pro',
      predictions: [
        { id: 31, match: 'FB - TS', prediction: 'MS 1', result: false, odds: 2.10 },
        { id: 32, match: 'ATM - RM', prediction: 'MS X', result: true, odds: 3.25 },
        { id: 33, match: 'ARS - LIV', prediction: 'KG Var', result: true, odds: 1.65 },
        { id: 34, match: 'GS - BJK', prediction: 'Üst 2.5', result: true, odds: 1.88 },
        { id: 35, match: 'TOT - MUN', prediction: 'MS 2', result: false, odds: 2.50 },
        { id: 36, match: 'JUV - BAY', prediction: 'Alt 2.5', result: true, odds: 2.20 },
        { id: 37, match: 'PSG - MIL', prediction: 'MS 1', result: true, odds: 1.60 },
        { id: 38, match: 'SEV - BAR', prediction: 'KG Yok', result: false, odds: 2.00 },
        { id: 39, match: 'MCI - CHE', prediction: 'MS 1', result: true, odds: 1.90 },
        { id: 40, match: 'LYO - DOR', prediction: 'MS X', result: true, odds: 3.40 },
      ]
    },
    {
      id: 5,
      name: 'SmartBet AI',
      predictions: [
        { id: 41, match: 'TS - GS', prediction: 'MS 2', result: true, odds: 2.25 },
        { id: 42, match: 'RM - BAR', prediction: 'Üst 3.5', result: false, odds: 2.40 },
        { id: 43, match: 'LIV - MCI', prediction: 'MS X', result: false, odds: 3.15 },
        { id: 44, match: 'FB - BJK', prediction: 'Alt 2.5', result: true, odds: 2.05 },
        { id: 45, match: 'MUN - ARS', prediction: 'KG Var', result: true, odds: 1.72 },
        { id: 46, match: 'BAY - PSG', prediction: 'Üst 2.5', result: true, odds: 1.78 },
        { id: 47, match: 'JUV - SEV', prediction: 'MS 1', result: false, odds: 1.95 },
        { id: 48, match: 'MIL - BAR', prediction: 'MS 2', result: true, odds: 2.85 },
        { id: 49, match: 'CHE - TOT', prediction: 'KG Yok', result: true, odds: 1.98 },
        { id: 50, match: 'DOR - ATM', prediction: 'MS 1', result: true, odds: 2.30 },
      ]
    }
  ];

  // Featured sidebar content - Sports nutrition store ad
  const renderFeaturedPromotion = () => (
    <div className="relative overflow-hidden bg-gradient-to-br from-orange-600 via-orange-700 to-orange-800 dark:from-orange-800 dark:via-orange-900 dark:to-orange-950 rounded-lg p-4 border border-orange-500 dark:border-orange-600 shadow-lg">
      {/* Background decoration */}
      <div className="absolute inset-0 opacity-20">
        <div className="absolute top-2 right-2 w-16 h-16 bg-yellow-300 rounded-full blur-xl"></div>
        <div className="absolute bottom-2 left-2 w-12 h-12 bg-white rounded-full blur-lg"></div>
      </div>
      
      <div className="relative z-10">
        {/* Sponsor badge */}
        <div className="inline-flex items-center gap-1 bg-yellow-400 text-orange-800 text-xs font-bold px-2 py-1 rounded-full mb-3">
          <Crown className="w-3 h-3" />
          REKLAM
        </div>
        
        <h3 className="text-white font-bold text-sm mb-2">
          Protein Dünyası 💪
        </h3>
        
        <p className="text-orange-100 text-xs mb-3 leading-relaxed">
          Spor beslenmesi ve takviye ürünlerinde %40&apos;a varan indirimler
        </p>
        
        {/* Features */}
        <div className="space-y-1.5 mb-4">
          <div className="flex items-center gap-2 text-xs">
            <Sparkles className="w-3 h-3 text-yellow-400" />
            <span className="text-white">Premium Protein</span>
          </div>
          <div className="flex items-center gap-2 text-xs">
            <TrendingUp className="w-3 h-3 text-yellow-400" />
            <span className="text-white">Performans Artırıcı</span>
          </div>
          <div className="flex items-center gap-2 text-xs">
            <Users className="w-3 h-3 text-yellow-400" />
            <span className="text-white">Uzman Desteği</span>
          </div>
        </div>
        
        {/* CTA Section */}
        <div className="text-center">
          <Badge color="yellow" size="sm" className="mb-2 animate-pulse">
            💊 %40 İNDİRİM
          </Badge>
          <a href="https://proteindunyasi.com" target="_blank" rel="noopener noreferrer" className="block w-full">
            <Button 
              size="sm"
              className="w-full bg-white text-orange-700 hover:bg-orange-50 font-bold text-xs py-2 rounded-lg shadow-md hover:shadow-lg transition-all"
            >
              Alışveriş Yap
            </Button>
          </a>
          <p className="text-orange-200 text-xs mt-1">
            Kaliteli ve güvenli
          </p>
        </div>
      </div>
    </div>
  );

  return (
    <aside className={`sidebar-right p-4 bg-white dark:bg-gray-900 border-l border-gray-200 dark:border-gray-800 h-screen overflow-y-auto sticky top-0 ${className}`}>
      <h2 className="text-xl font-bold mb-4">Model Tahminleri</h2>
      
      <div className="space-y-4">
        {models.map((model) => {
          const successCount = model.predictions.filter(p => p.result).length;
          const successRate = (successCount / model.predictions.length * 100).toFixed(0);
          
          return (
            <Card key={model.id} className="p-3">
              <div className="mb-2 flex justify-between items-center">
                <h3 className="font-semibold text-sm">{model.name}</h3>
                <span className="text-xs text-gray-600 dark:text-gray-400">
                  %{successRate} başarı
                </span>
              </div>
              
              <div className="grid grid-cols-5 gap-1">
                {model.predictions.map((pred) => (
                  <div key={pred.id} className="flex justify-center">
                    {pred.result ? (
                      <CheckCircle className="h-4 w-4 text-green-500" />
                    ) : (
                      <XCircle className="h-4 w-4 text-red-500" />
                    )}
                  </div>
                ))}
              </div>
            </Card>
          );
        })}
      </div>
      
      {/* Spacer between sections */}
      <div className="my-8"></div>
      
      {/* Featured promotion component */}
      {renderFeaturedPromotion()}
      
      {/* Additional info section */}
      <div className="mt-6 p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
        <h3 className="text-sm font-semibold text-gray-900 dark:text-white mb-2">
          Model Performansı
        </h3>
        <div className="space-y-2 text-xs text-gray-600 dark:text-gray-400">
          <div className="flex justify-between">
            <span>Ortalama Başarı:</span>
            <span className="font-semibold">%68.4</span>
          </div>
          <div className="flex justify-between">
            <span>En İyi Model:</span>
            <span className="font-semibold">Quantum Odds</span>
          </div>
          <div className="flex justify-between">
            <span>Toplam Tahmin:</span>
            <span className="font-semibold">50</span>
          </div>
        </div>
      </div>
    </aside>
  );
}