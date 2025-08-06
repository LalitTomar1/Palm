import { IStorage } from "./storage.js";

interface PalmReadingResult {
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
}

// Seeded random number generator for consistent results
class SeededRandom {
  private seed: number;

  constructor(seed: string) {
    this.seed = this.hashCode(seed);
  }

  private hashCode(str: string): number {
    let hash = 0;
    for (let i = 0; i < str.length; i++) {
      const char = str.charCodeAt(i);
      hash = ((hash << 5) - hash) + char;
      hash = hash & hash; // Convert to 32-bit integer
    }
    return Math.abs(hash);
  }

  next(): number {
    this.seed = (this.seed * 9301 + 49297) % 233280;
    return this.seed / 233280;
  }

  choice<T>(array: T[]): T {
    return array[Math.floor(this.next() * array.length)];
  }

  choices<T>(array: T[], count: number): T[] {
    const result: T[] = [];
    const available = [...array];
    
    for (let i = 0; i < Math.min(count, available.length); i++) {
      const index = Math.floor(this.next() * available.length);
      result.push(available.splice(index, 1)[0]);
    }
    
    return result;
  }
}

function generatePalmReading(imageData: string): PalmReadingResult {
  const rng = new SeededRandom(imageData);

  // Life line variations
  const lifeLineStrengths = ['Strong', 'Moderate', 'Delicate', 'Bold', 'Faint'];
  const lifeLineLengths = ['Long', 'Medium', 'Short', 'Extended', 'Curved'];
  const lifeLineInterpretations = [
    'Your life line suggests a vibrant and energetic approach to life, with strong vitality flowing through your years.',
    'This line indicates a balanced life path with steady energy and good health prospects.',
    'Your life line reveals a thoughtful, careful approach to life with attention to well-being.',
    'This formation suggests resilience and the ability to overcome challenges with grace.',
    'Your life line indicates a rich inner life and deep connection to your spiritual journey.'
  ];

  // Heart line variations
  const heartLineDepths = ['Deep', 'Moderate', 'Light', 'Pronounced', 'Subtle'];
  const heartLineCurves = ['Curved', 'Straight', 'Wavy', 'Arched', 'Gentle'];
  const heartLineInterpretations = [
    'Your heart line reveals a passionate and emotionally rich nature, with deep capacity for love.',
    'This line suggests balanced emotions and the ability to form meaningful relationships.',
    'Your heart line indicates sensitivity and intuitive understanding of others\' feelings.',
    'This formation shows loyalty and dedication in relationships, with strong emotional bonds.',
    'Your heart line reveals creativity and artistic sensibility in matters of the heart.'
  ];

  // Head line variations
  const headLineClarities = ['Clear', 'Distinct', 'Faint', 'Bold', 'Refined'];
  const headLineDirections = ['Straight', 'Sloping', 'Curved', 'Angled', 'Flowing'];
  const headLineInterpretations = [
    'Your head line indicates sharp analytical thinking and excellent problem-solving abilities.',
    'This line suggests creative intelligence and the ability to think outside conventional boundaries.',
    'Your head line reveals practical wisdom and grounded decision-making skills.',
    'This formation indicates intuitive intelligence and the ability to grasp complex concepts quickly.',
    'Your head line shows balanced thinking, combining logic with creative insight.'
  ];

  // Fate line variations
  const fateLinePresences = ['Present', 'Strong', 'Faint', 'Broken', 'Multiple'];
  const fateLineDirections = ['Straight', 'Curved', 'Branched', 'Wavy', 'Ascending'];
  const fateLineInterpretations = [
    'Your fate line suggests a clear sense of purpose and direction in your career and life path.',
    'This line indicates adaptability and the ability to create your own destiny through choices.',
    'Your fate line reveals multiple talents and the potential for diverse career paths.',
    'This formation suggests independence and the strength to forge your own unique path.',
    'Your fate line indicates strong intuition about your life\'s purpose and calling.'
  ];

  // Special features
  const specialFeatures = [
    { name: 'Mount of Venus', meaning: 'Enhanced capacity for love and artistic appreciation' },
    { name: 'Mount of Jupiter', meaning: 'Natural leadership abilities and ambition' },
    { name: 'Mount of Saturn', meaning: 'Wisdom, patience, and deep thinking' },
    { name: 'Mount of Apollo', meaning: 'Creative talents and potential for recognition' },
    { name: 'Mount of Mercury', meaning: 'Communication skills and business acumen' },
    { name: 'Mount of Mars', meaning: 'Courage, determination, and fighting spirit' },
    { name: 'Mount of Luna', meaning: 'Imagination, intuition, and psychic abilities' },
    { name: 'Star Formation', meaning: 'Exceptional talent or significant life event' },
    { name: 'Triangle Pattern', meaning: 'Intellectual gifts and analytical abilities' },
    { name: 'Square Formation', meaning: 'Protection and ability to overcome obstacles' }
  ];

  // Personality traits
  const personalityTraits = [
    'Intuitive', 'Creative', 'Analytical', 'Compassionate', 'Ambitious',
    'Artistic', 'Practical', 'Spiritual', 'Independent', 'Loyal',
    'Adventurous', 'Wise', 'Charismatic', 'Determined', 'Empathetic',
    'Innovative', 'Reliable', 'Passionate', 'Thoughtful', 'Resilient'
  ];

  // Overall interpretations
  const overallInterpretations = [
    'Your palm reveals a soul destined for great things, with the wisdom to navigate life\'s complexities and the strength to achieve your dreams. The lines speak of a journey filled with meaningful connections and personal growth.',
    'The ancient art of palmistry shows a person of remarkable depth and potential. Your palm tells a story of someone who will touch many lives and leave a lasting positive impact on the world.',
    'Your hand carries the markings of someone blessed with both practical wisdom and spiritual insight. The lines suggest a life path that balances material success with emotional fulfillment.',
    'The mystical patterns in your palm indicate a person of great sensitivity and intuition. Your journey will be one of continuous learning and sharing your gifts with others.',
    'Your palm reveals the characteristics of a natural healer and guide. The lines suggest you have the ability to inspire others and help them find their own paths to happiness.'
  ];

  return {
    overall_interpretation: rng.choice(overallInterpretations),
    life_line: {
      strength: rng.choice(lifeLineStrengths),
      length: rng.choice(lifeLineLengths),
      interpretation: rng.choice(lifeLineInterpretations)
    },
    heart_line: {
      depth: rng.choice(heartLineDepths),
      curve: rng.choice(heartLineCurves),
      interpretation: rng.choice(heartLineInterpretations)
    },
    head_line: {
      clarity: rng.choice(headLineClarities),
      direction: rng.choice(headLineDirections),
      interpretation: rng.choice(headLineInterpretations)
    },
    fate_line: {
      presence: rng.choice(fateLinePresences),
      direction: rng.choice(fateLineDirections),
      interpretation: rng.choice(fateLineInterpretations)
    },
    special_features: rng.choices(specialFeatures, 2 + Math.floor(rng.next() * 3)),
    personality_traits: rng.choices(personalityTraits, 5 + Math.floor(rng.next() * 5))
  };
}

export async function generatePalmReading(
  analysisId: string,
  imageData: string,
  storage: IStorage
): Promise<void> {
  try {
    // Simulate processing stages with realistic timing
    const stages = [
      { progress: 25, delay: 1000 },
      { progress: 50, delay: 1500 },
      { progress: 75, delay: 2000 },
      { progress: 100, delay: 1000 }
    ];

    for (const stage of stages) {
      await new Promise(resolve => setTimeout(resolve, stage.delay));
      await storage.updatePalmAnalysis(analysisId, {
        progress: stage.progress
      });
    }

    // Generate the actual reading
    const result = generatePalmReading(imageData);

    // Update with completed analysis
    await storage.updatePalmAnalysis(analysisId, {
      status: 'completed',
      progress: 100,
      result
    });

  } catch (error) {
    console.error('Palm analysis error:', error);
    await storage.updatePalmAnalysis(analysisId, {
      status: 'error',
      progress: 0
    });
  }
}