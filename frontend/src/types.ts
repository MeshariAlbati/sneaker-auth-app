export interface PredictionResult {
  prediction: 'real' | 'fake';
  confidence: number;
  fake_probability: number;
  real_probability: number;
}

export interface ApiError {
  error: string;
}
