import { createSlice, type PayloadAction } from "@reduxjs/toolkit";
import type { DashboardFormData, JobDetails } from "../types/app";

const defaultJobDetails: JobDetails = {
  employment: "Full-time",
  hours: 40,
  payType: "Hourly",
  payRate: "Weekly",
  hourlyWage: "",
};

const initialState: DashboardFormData = {
  zip: "",
  showForm: false,
  selectedBenefits: [],
  benefitAmounts: {},
  jobDetails: { ...defaultJobDetails },
};

const formSlice = createSlice({
  name: "form",
  initialState,
  reducers: {
    setZip: (state, action: PayloadAction<string>) => {
      state.zip = action.payload;
    },
    setShowForm: (state, action: PayloadAction<boolean>) => {
      state.showForm = action.payload;
    },
    toggleBenefit: (state, action: PayloadAction<string>) => {
      const id = action.payload;
      const list = state.selectedBenefits;
      const i = list.indexOf(id);
      if (i >= 0) {
        list.splice(i, 1);
      } else {
        list.push(id);
      }
    },
    setJobDetail: (
      state,
      action: PayloadAction<{
        field: keyof JobDetails;
        value: JobDetails[keyof JobDetails];
      }>,
    ) => {
      const { field, value } = action.payload;
      const details = state.jobDetails as Record<
        keyof JobDetails,
        JobDetails[keyof JobDetails]
      >;
      details[field] = value;
    },
    setBenefitAmount: (
      state,
      action: PayloadAction<{ benefitId: string; amount: string }>,
    ) => {
      const { benefitId, amount } = action.payload;
      state.benefitAmounts[benefitId] = amount;
    },
  },
});

export const {
  setZip,
  setShowForm,
  toggleBenefit,
  setJobDetail,
  setBenefitAmount,
} = formSlice.actions;

export default formSlice.reducer;
