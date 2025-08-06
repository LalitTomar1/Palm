import React from 'react';
import { useParams, Link } from 'wouter';
import { useQuery } from '@tanstack/react-query';
import { Hand, Heart, Brain, Star, ArrowLeft, Download, Share2 } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { getPalmAnalysis } from '@/lib/api';

export default function ResultsPage() {
  const { id } = useParams<{ id: string }>();

  const { data: analysis, isLoading, error } = useQuery({
    queryKey: ['palm-analysis', id],
    queryFn: () => getPalmAnalysis(id!),
    enabled: !!id,
  });

  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto text-center">
          <Card className="palm-card">
            <CardContent className="pt-6">
              <div className="animate-pulse">
                <div className="h-8 bg-purple-300/20 rounded mb-4"></div>
                <div className="h-4 bg-purple-300/20 rounded mb-2"></div>
                <div className="h-4 bg-purple-300/20 rounded"></div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  if (error || !analysis || analysis.status !== 'completed') {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-2xl mx-auto text-center">
          <Card className="palm-card">
            <CardContent className="pt-6">
              <h1 className="text-2xl font-bold text-white mb-4">Results Not Available</h1>
              <p className="text-purple-200 mb-6">
                We couldn't find your palm reading results. Please try uploading again.
              </p>
              <Link href="/">
                <Button className="bg-purple-600 hover:bg-purple-700">
                  <ArrowLeft className="w-4 h-4 mr-2" />
                  Back to Home
                </Button>
              </Link>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  const { result } = analysis;

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-white mb-4 flex items-center justify-center">
            <Hand className="w-10 h-10 mr-3 text-purple-300" />
            Your Palm Reading
          </h1>
          <p className="text-purple-200 text-lg">
            The ancient wisdom of your palm has been revealed
          </p>
        </div>

        {/* Action Buttons */}
        <div className="flex justify-center space-x-4 mb-8">
          <Link href="/">
            <Button variant="outline" className="border-purple-400 text-purple-300 hover:bg-purple-600/20">
              <ArrowLeft className="w-4 h-4 mr-2" />
              New Reading
            </Button>
          </Link>
          <Button variant="outline" className="border-purple-400 text-purple-300 hover:bg-purple-600/20">
            <Download className="w-4 h-4 mr-2" />
            Save Results
          </Button>
          <Button variant="outline" className="border-purple-400 text-purple-300 hover:bg-purple-600/20">
            <Share2 className="w-4 h-4 mr-2" />
            Share
          </Button>
        </div>

        {/* Overall Summary */}
        <Card className="palm-card mb-8">
          <CardHeader>
            <CardTitle className="text-white text-2xl flex items-center">
              <Star className="w-6 h-6 mr-2 text-yellow-400" />
              Your Palm's Story
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-purple-100 text-lg leading-relaxed">
              {result.overall_interpretation}
            </p>
          </CardContent>
        </Card>

        {/* Palm Lines Analysis */}
        <div className="grid md:grid-cols-2 gap-6 mb-8">
          {/* Life Line */}
          <Card className="palm-card">
            <CardHeader>
              <CardTitle className="text-white flex items-center">
                <Hand className="w-5 h-5 mr-2 text-green-400" />
                Life Line
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex items-center space-x-2">
                <Badge variant="secondary" className="bg-green-600/20 text-green-300">
                  {result.life_line.strength}
                </Badge>
                <Badge variant="secondary" className="bg-blue-600/20 text-blue-300">
                  {result.life_line.length}
                </Badge>
              </div>
              <p className="text-purple-100">{result.life_line.interpretation}</p>
            </CardContent>
          </Card>

          {/* Heart Line */}
          <Card className="palm-card">
            <CardHeader>
              <CardTitle className="text-white flex items-center">
                <Heart className="w-5 h-5 mr-2 text-red-400" />
                Heart Line
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex items-center space-x-2">
                <Badge variant="secondary" className="bg-red-600/20 text-red-300">
                  {result.heart_line.depth}
                </Badge>
                <Badge variant="secondary" className="bg-pink-600/20 text-pink-300">
                  {result.heart_line.curve}
                </Badge>
              </div>
              <p className="text-purple-100">{result.heart_line.interpretation}</p>
            </CardContent>
          </Card>

          {/* Head Line */}
          <Card className="palm-card">
            <CardHeader>
              <CardTitle className="text-white flex items-center">
                <Brain className="w-5 h-5 mr-2 text-blue-400" />
                Head Line
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex items-center space-x-2">
                <Badge variant="secondary" className="bg-blue-600/20 text-blue-300">
                  {result.head_line.clarity}
                </Badge>
                <Badge variant="secondary" className="bg-indigo-600/20 text-indigo-300">
                  {result.head_line.direction}
                </Badge>
              </div>
              <p className="text-purple-100">{result.head_line.interpretation}</p>
            </CardContent>
          </Card>

          {/* Fate Line */}
          <Card className="palm-card">
            <CardHeader>
              <CardTitle className="text-white flex items-center">
                <Star className="w-5 h-5 mr-2 text-yellow-400" />
                Fate Line
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex items-center space-x-2">
                <Badge variant="secondary" className="bg-yellow-600/20 text-yellow-300">
                  {result.fate_line.presence}
                </Badge>
                <Badge variant="secondary" className="bg-orange-600/20 text-orange-300">
                  {result.fate_line.direction}
                </Badge>
              </div>
              <p className="text-purple-100">{result.fate_line.interpretation}</p>
            </CardContent>
          </Card>
        </div>

        {/* Special Features */}
        {result.special_features && result.special_features.length > 0 && (
          <Card className="palm-card mb-8">
            <CardHeader>
              <CardTitle className="text-white">Special Features</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid md:grid-cols-2 gap-4">
                {result.special_features.map((feature, index) => (
                  <div key={index} className="p-3 bg-purple-800/30 rounded-lg border border-purple-600">
                    <h4 className="text-purple-300 font-semibold mb-2">{feature.name}</h4>
                    <p className="text-purple-100 text-sm">{feature.meaning}</p>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        )}

        {/* Personality Traits */}
        <Card className="palm-card mb-8">
          <CardHeader>
            <CardTitle className="text-white">Personality Insights</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-wrap gap-2">
              {result.personality_traits.map((trait, index) => (
                <Badge
                  key={index}
                  variant="secondary"
                  className="bg-purple-600/20 text-purple-300 px-3 py-1"
                >
                  {trait}
                </Badge>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Footer */}
        <div className="text-center text-purple-300 text-sm">
          <Separator className="mb-4 bg-purple-600" />
          <p>
            This reading is generated by AI and should be taken as entertainment.
            The wisdom of palmistry has guided humans for centuries, but your future is in your hands.
          </p>
        </div>
      </div>
    </div>
  );
}