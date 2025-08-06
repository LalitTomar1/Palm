const API_BASE = '/api';

export interface PalmAnalysis {
  id: string;
  status: 'processing' | 'completed' | 'error';
  progress: number;
  result?: {
    overall_interpretation: string;
    life_line: {
      strength: string;
      length: string;
      interpretation: string;
    };
    heart_line: {
      depth: string;
      curve: string;
      interpretation: string;
    };
    head_line: {
      clarity: string;
      direction: string;
      interpretation: string;
    };
    fate_line: {
      presence: string;
      direction: string;
      interpretation: string;
    };
    special_features: Array<{
      name: string;
      meaning: string;
    }>;
    personality_traits: string[];
  };
}

export async function uploadPalmImage(file: File): Promise<{ id: string }> {
  const formData = new FormData();
  formData.append('palm', file);

  const response = await fetch(`${API_BASE}/upload`, {
    method: 'POST',
    body: formData,
  });

  if (!response.ok) {
    throw new Error('Failed to upload image');
  }

  return response.json();
}

export async function getPalmAnalysis(id: string): Promise<PalmAnalysis> {
  const response = await fetch(`${API_BASE}/analysis/${id}`);

  if (!response.ok) {
    throw new Error('Failed to get analysis');
  }

  return response.json();
}