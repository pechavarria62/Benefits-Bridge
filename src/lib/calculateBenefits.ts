import type { Benefit } from "../types/app";

export interface BenefitKept extends Benefit {
  originalAmount: number;
  reducedAmount: number;
}

export interface BenefitLost extends Benefit {
  originalAmount: number;
}

export interface YearSummary {
  benefitsOnlyAnnual: number;
  jobOnlyAnnual: number;
  jobPlusBenefitsAnnual: number;
  yearlyIncrease: number;
}

export interface CalculationResults {
  monthlyIncome: number;
  selectedBenefits: Benefit[];
  totalBenefitsWithoutJob: number;
  totalBenefitsWithJob: number;
  totalResourcesWithoutJob: number;
  totalResourcesWithJob: number;
  benefitsLost: BenefitLost[];
  benefitsKept: BenefitKept[];
  yearSummary: YearSummary;
}

type BenefitsMap = Record<string, Benefit | undefined>;

/**
 * Calculate monthly income from job based on hours, pay type, and frequency
 * @param {string} payType - "Hourly" or "Salary"
 * @param {number} hours - Hours per week
 * @param {string} payFrequency - "Weekly", "Bi-Weekly", or "Monthly"
 * @param {number} hourlyRate - Hourly wage (if payType is "Hourly")
 * @returns {number} Monthly income in dollars
 */
export const calculateMonthlyIncome = (
  payType: string,
  hours: number,
  payFrequency: string,
  hourlyRate: number,
): number => {
  if (!hourlyRate || hourlyRate <= 0) return 0;

  let weeklyIncome = 0;

  if (payType === "Hourly") {
    weeklyIncome = hours * hourlyRate;
  } else if (payType === "Salary") {
    // For salary, treat hourlyRate as annual salary
    // Annual / 52 weeks
    weeklyIncome = hourlyRate / 52;
  }

  let monthlyIncome = 0;

  if (payFrequency === "Weekly") {
    monthlyIncome = weeklyIncome * 4.33; // Average weeks per month
  } else if (payFrequency === "Bi-Weekly") {
    monthlyIncome = weeklyIncome * 2 * 2.165; // 26 bi-weekly periods / 12 months
  } else if (payFrequency === "Monthly") {
    monthlyIncome = weeklyIncome; // Treat as monthly amount already
  }

  return Math.round(monthlyIncome * 100) / 100;
};

/**
 * Calculate benefit status after taking a job
 * Applies standard benefit phase-out rules:
 * - Income above 30% of poverty line (~$300/month) reduces SNAP by $0.30 per $1 earned
 * - Income above $200/month reduces most benefits significantly
 *
 * @param {Array} selectedBenefits - Array of benefit IDs selected
 * @param {Object} benefitsMap - Map of benefit ID to benefit data
 * @param {number} monthlyIncome - Monthly job income
 * @param {Object} customAmounts - Custom benefit amounts entered by user (optional)
 * @returns {Object} Calculation results
 */
export const calculateBenefitStatus = (
  selectedBenefits: string[],
  benefitsMap: BenefitsMap,
  monthlyIncome: number,
  customAmounts: Record<string, string> = {},
): CalculationResults => {
  const results: CalculationResults = {
    monthlyIncome,
    selectedBenefits: [],
    totalBenefitsWithoutJob: 0,
    totalBenefitsWithJob: 0,
    totalResourcesWithoutJob: 0,
    totalResourcesWithJob: 0,
    benefitsLost: [],
    benefitsKept: [],
    yearSummary: {
      benefitsOnlyAnnual: 0,
      jobOnlyAnnual: 0,
      jobPlusBenefitsAnnual: 0,
      yearlyIncrease: 0,
    },
  };

  // Standard benefit phase-out thresholds
  const GENERAL_THRESHOLD = 200; // Income threshold for benefit eligibility
  const SNAP_EARNED_INCOME_DEDUCTION = 0.3; // 30% reduction for SNAP

  selectedBenefits.forEach((benefitId) => {
    const benefit = benefitsMap[benefitId];
    if (!benefit) return;

    // Use custom amount if provided, otherwise use default from benefits.json
    let monthlyBenefit = benefit.amount; // Default to benefit.amount

    const rawCustom = customAmounts[benefitId];
    if (rawCustom !== undefined && rawCustom !== "") {
      const customAmount = parseFloat(rawCustom);
      if (!Number.isNaN(customAmount) && customAmount >= 0) {
        monthlyBenefit = customAmount;
      }
    }
    results.totalBenefitsWithoutJob += monthlyBenefit;
    results.selectedBenefits.push(benefit);

    // Determine remaining benefit amount based on income
    let remainingBenefit = monthlyBenefit;

    if (monthlyIncome > GENERAL_THRESHOLD) {
      // Income exceeds threshold - apply phase-out
      if (benefitId === "snap") {
        // SNAP has 30% earned income deduction after $180 standard deduction
        const earnedIncomeAfterDeduction = Math.max(0, monthlyIncome - 180);
        const reduction =
          earnedIncomeAfterDeduction * SNAP_EARNED_INCOME_DEDUCTION;
        remainingBenefit = Math.max(0, monthlyBenefit - reduction);
      } else {
        // Other benefits phase out completely above threshold
        remainingBenefit = 0;
      }
    } else if (monthlyIncome > 100) {
      // Partial phase-out for lower income
      const incomePercentage = monthlyIncome / GENERAL_THRESHOLD;
      remainingBenefit =
        monthlyBenefit * Math.max(0, 1 - incomePercentage * 0.5);
    }

    results.totalBenefitsWithJob += remainingBenefit;

    if (remainingBenefit === 0) {
      results.benefitsLost.push({ ...benefit, originalAmount: monthlyBenefit });
    } else if (remainingBenefit < monthlyBenefit) {
      results.benefitsKept.push({
        ...benefit,
        originalAmount: monthlyBenefit,
        reducedAmount: Math.round(remainingBenefit * 100) / 100,
      });
    } else {
      results.benefitsKept.push({
        ...benefit,
        originalAmount: monthlyBenefit,
        reducedAmount: remainingBenefit,
      });
    }
  });

  // Calculate year-long summary
  results.totalResourcesWithoutJob = results.totalBenefitsWithoutJob;
  results.totalResourcesWithJob = monthlyIncome + results.totalBenefitsWithJob;

  results.yearSummary = {
    benefitsOnlyAnnual: results.totalBenefitsWithoutJob * 12,
    jobOnlyAnnual: monthlyIncome * 12,
    jobPlusBenefitsAnnual: results.totalResourcesWithJob * 12,
    yearlyIncrease:
      (results.totalResourcesWithJob - results.totalBenefitsWithoutJob) * 12,
  };

  return results;
};
