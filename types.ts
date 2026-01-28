
export interface QuizData {
  projectType: string;
  occupancyStatus: string;
  surfaceArea: string;
  houseAge: string;
  heatingType: string;
  professionalSituation: string;
  timeline: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  postcode: string;
  [key: string]: string;
}

export interface AssessmentResult {
  score: number;
  summary: string;
  potentialCauses: string[];
  recommendation: string;
}
