export interface Benefit {
  id: string;
  name: string;
  amount: number;
  unit: string;
  icon: string;
}

export interface JobDetails {
  employment: string;
  hours: number;
  payType: string;
  payRate: string;
  hourlyWage: string;
}

export interface DashboardFormData {
  zip: string;
  showForm: boolean;
  selectedBenefits: string[];
  benefitAmounts: Record<string, string>;
  jobDetails: JobDetails;
}

export interface BenefitsJson {
  benefits: Benefit[];
}

export interface ResultsLocationState {
  formData: DashboardFormData;
}
