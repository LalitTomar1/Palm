import React, { useEffect } from 'react';
import { useLocation, useParams } from 'wouter';
import { useQuery } from '@tanstack/react-query';
import { Loader2, Hand, Sparkles, Eye, Brain } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { getPalmAnalysis } from '@/lib/api';

export default function AnalysisPage() {
  const { id } = useParams<{ id: string }>();
  const [, setLocation] = useLocation();

  const { data: analysis, isLoading, error } = useQuery({
    queryKey: ['palm-analysis', id],
    queryFn: () => getPalmAnalysis(id!),
    enabled: !!id,
    refetchInterval: (data) => data?.status === 'completed' ? false : 2000,
  });

  useEffect(() => {
    if (analysis?.status === 'completed') {
      setTimeout(() => {
        setLocation(`/results/${id}`);
      }, 1000);
    }
  }, [analysis?.status, id, setLocation]);

  if (error) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-2xl mx-auto text-center">
          <Card className="palm-card">
            <CardContent className="pt-6">
              <h1 className="text-2xl font-bold text-white mb-4">Analysis Error</h1>
              <p className="text-purple-200">
                We encountered an issue analyzing your palm. Please try uploading again.
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  const progress = analysis?.progress || 0;
  const stages = [
    { icon: Hand, label: 'Scanning palm structure', threshold: 25 },
    { icon: Eye, label: 'Analyzing palm lines', threshold: 50 },
    { icon: Brain, label: 'Processing mystical insights', threshold: 75 },
    { icon: Sparkles, label: 'Generating your reading', threshold: 100 },
  ];

  const currentStage = stages.findIndex(stage => progress < stage.threshold);
  const activeStageIndex = currentStage === -1 ? stages.length - 1 : Math.max(0, currentStage - 1);

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-2xl mx-auto">
        <Card className="palm-card">
          <CardHeader className="text-center">
            <CardTitle className="text-2xl text-white flex items-center justify-center">
              <Loader2 className="w-6 h-6 mr-2 animate-spin" />
              Analyzing Your Palm
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Progress Bar */}
            <div className="space-y-2">
              <div className="flex justify-between text-sm text-purple-200">
                <span>Progress</span>
                <span>{progress}%</span>
              </div>
              <Progress value={progress} className="h-3" />
            </div>

            {/* Analysis Stages */}
            <div className="space-y-4">
              {stages.map((stage, index) => {
                const Icon = stage.icon;
                const isActive = index === activeStageIndex;
                const isCompleted = progress >= stage.threshold;
                
                return (
                  <div
                    key={index}
                    className={`flex items-center space-x-3 p-3 rounded-lg transition-all ${
                      isActive
                        ? 'bg-purple-600/30 border border-purple-400'
                        : isCompleted
                        ? 'bg-green-600/20 border border-green-400'
                        : 'bg-gray-600/20 border border-gray-600'
                    }`}
                  >
                    <Icon
                      className={`w-6 h-6 ${
                        isActive
                          ? 'text-purple-300 animate-pulse'
                          : isCompleted
                          ? 'text-green-300'
                          : 'text-gray-400'
                      }`}
                    />
                    <span
                      className={`${
                        isActive
                          ? 'text-purple-200 font-medium'
                          : isCompleted
                          ? 'text-green-200'
                          : 'text-gray-400'
                      }`}
                    >
                      {stage.label}
                    </span>
                    {isActive && (
                      <Loader2 className="w-4 h-4 text-purple-300 animate-spin ml-auto" />
                    )}
                    {isCompleted && !isActive && (
                      <div className="w-4 h-4 bg-green-500 rounded-full ml-auto" />
                    )}
                  </div>
                );
              })}
            </div>

            {/* Mystical Message */}
            <div className="text-center p-4 bg-purple-900/30 rounded-lg border border-purple-600">
              <p className="text-purple-200 italic">
                "The lines of your palm hold ancient secrets. Our mystical AI is deciphering the wisdom written in your hand..."
              </p>
            </div>

            {/* Status Message */}
            {analysis?.status === 'completed' && (
              <div className="text-center">
                <p className="text-green-300 font-medium">
                  Analysis complete! Redirecting to your results...
                </p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}