import React, { useState } from 'react';
import { useLocation } from 'wouter';
import { Upload, Hand, Sparkles, Eye } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';
import { uploadPalmImage } from '@/lib/api';

export default function HomePage() {
  const [, setLocation] = useLocation();
  const [isUploading, setIsUploading] = useState(false);
  const { toast } = useToast();

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    // Validate file type
    if (!file.type.startsWith('image/')) {
      toast({
        title: "Invalid file type",
        description: "Please upload an image file.",
        variant: "destructive",
      });
      return;
    }

    // Validate file size (5MB limit)
    if (file.size > 5 * 1024 * 1024) {
      toast({
        title: "File too large",
        description: "Please upload an image smaller than 5MB.",
        variant: "destructive",
      });
      return;
    }

    setIsUploading(true);

    try {
      const result = await uploadPalmImage(file);
      setLocation(`/analysis/${result.id}`);
    } catch (error) {
      toast({
        title: "Upload failed",
        description: "Failed to upload your palm image. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="flex items-center justify-center mb-6">
            <Hand className="w-16 h-16 text-purple-300 mr-4" />
            <h1 className="text-5xl font-bold text-white">PalmWise</h1>
          </div>
          <p className="text-xl text-purple-200 mb-8">
            Discover the secrets hidden in your palm with AI-powered mystical insights
          </p>
        </div>

        {/* Upload Section */}
        <Card className="palm-card mb-12">
          <CardHeader className="text-center">
            <CardTitle className="text-2xl text-white flex items-center justify-center">
              <Upload className="w-6 h-6 mr-2" />
              Upload Your Palm
            </CardTitle>
            <CardDescription className="text-purple-200">
              Take a clear photo of your palm and let the ancient wisdom guide you
            </CardDescription>
          </CardHeader>
          <CardContent className="text-center">
            <div className="border-2 border-dashed border-purple-300 rounded-lg p-8 mb-6 hover:border-purple-200 transition-colors">
              <input
                type="file"
                accept="image/*"
                onChange={handleFileUpload}
                disabled={isUploading}
                className="hidden"
                id="palm-upload"
              />
              <label
                htmlFor="palm-upload"
                className="cursor-pointer block"
              >
                <div className="flex flex-col items-center">
                  <Hand className="w-16 h-16 text-purple-300 mb-4" />
                  <p className="text-white text-lg mb-2">
                    {isUploading ? 'Uploading...' : 'Click to upload your palm image'}
                  </p>
                  <p className="text-purple-300 text-sm">
                    Supports JPG, PNG, WebP (max 5MB)
                  </p>
                </div>
              </label>
            </div>
            <Button
              onClick={() => document.getElementById('palm-upload')?.click()}
              disabled={isUploading}
              className="bg-purple-600 hover:bg-purple-700 text-white px-8 py-3 text-lg"
            >
              {isUploading ? 'Processing...' : 'Choose Image'}
            </Button>
          </CardContent>
        </Card>

        {/* Features */}
        <div className="grid md:grid-cols-3 gap-6 mb-12">
          <Card className="palm-card">
            <CardHeader className="text-center">
              <Eye className="w-12 h-12 text-purple-300 mx-auto mb-4" />
              <CardTitle className="text-white">Deep Analysis</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-purple-200 text-center">
                Our AI examines your palm lines, mounts, and features to provide comprehensive insights
              </p>
            </CardContent>
          </Card>

          <Card className="palm-card">
            <CardHeader className="text-center">
              <Sparkles className="w-12 h-12 text-purple-300 mx-auto mb-4" />
              <CardTitle className="text-white">Mystical Wisdom</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-purple-200 text-center">
                Combining ancient palmistry traditions with modern AI for accurate readings
              </p>
            </CardContent>
          </Card>

          <Card className="palm-card">
            <CardHeader className="text-center">
              <Hand className="w-12 h-12 text-purple-300 mx-auto mb-4" />
              <CardTitle className="text-white">Personal Insights</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-purple-200 text-center">
                Discover your personality traits, relationships, and life path through your palm
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Instructions */}
        <Card className="palm-card">
          <CardHeader>
            <CardTitle className="text-white text-center">How to Take the Perfect Palm Photo</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <h3 className="text-purple-300 font-semibold mb-3">Photography Tips:</h3>
                <ul className="text-purple-200 space-y-2">
                  <li>• Use good lighting (natural light works best)</li>
                  <li>• Keep your hand flat and relaxed</li>
                  <li>• Ensure all palm lines are clearly visible</li>
                  <li>• Avoid shadows and reflections</li>
                </ul>
              </div>
              <div>
                <h3 className="text-purple-300 font-semibold mb-3">What We Analyze:</h3>
                <ul className="text-purple-200 space-y-2">
                  <li>• Life line - vitality and life path</li>
                  <li>• Heart line - emotions and relationships</li>
                  <li>• Head line - intellect and thinking</li>
                  <li>• Fate line - career and destiny</li>
                </ul>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}