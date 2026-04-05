import { jsPDF } from "jspdf";
import type { CalculationResults } from "./calculateBenefits";
import type { DashboardFormData } from "../types/app";

function filenameTimestamp(d: Date): string {
  return d
    .toISOString()
    .replace(/[:.]/g, "-")
    .replace("T", "_")
    .slice(0, -5);
}

function ensureSpace(
  doc: jsPDF,
  y: number,
  needed: number,
  margin: number,
): number {
  const pageH = doc.internal.pageSize.getHeight();
  if (y + needed > pageH - margin) {
    doc.addPage();
    return margin;
  }
  return y;
}

/**
 * Builds a downloadable PDF of the results screen. Filename:
 * benefits-calculation-YYYY-MM-DD_HH-MM-SS.pdf
 */
export function exportResultsToPdf(
  formData: DashboardFormData,
  results: CalculationResults,
  scenario: { message: string; description: string },
): void {
  const generatedAt = new Date();
  const doc = new jsPDF();
  const margin = 14;
  const pageW = doc.internal.pageSize.getWidth();
  const maxW = pageW - margin * 2;
  let y = margin;

  const writeLines = (
    text: string,
    size: number,
    style: "normal" | "bold" = "normal",
    gapAfter = 3,
  ) => {
    doc.setFont("helvetica", style);
    doc.setFontSize(size);
    const lh = size * 0.48;
    const lines = doc.splitTextToSize(text, maxW);
    for (const line of lines) {
      y = ensureSpace(doc, y, lh + 2, margin);
      doc.text(line, margin, y);
      y += lh;
    }
    y += gapAfter;
  };

  doc.setTextColor(0);
  writeLines("Benefits Bridge — Your Results", 16, "bold", 2);
  doc.setTextColor(80);
  writeLines(
    `Generated: ${generatedAt.toLocaleString(undefined, {
      dateStyle: "long",
      timeStyle: "short",
    })}`,
    9,
    "normal",
    4,
  );
  doc.setTextColor(0);

  writeLines(`ZIP code: ${formData.zip}`, 11, "normal", 6);

  writeLines(scenario.message, 13, "bold", 2);
  writeLines(scenario.description, 11, "normal", 8);

  writeLines("Monthly comparison", 12, "bold", 2);
  writeLines(
    `Without job — Monthly benefits: $${results.totalBenefitsWithoutJob.toFixed(2)}; total monthly resources: $${results.totalResourcesWithoutJob.toFixed(2)}.`,
    11,
  );
  writeLines(
    `With job — Job income: $${results.monthlyIncome.toFixed(2)}; remaining benefits: $${results.totalBenefitsWithJob.toFixed(2)}; total monthly resources: $${results.totalResourcesWithJob.toFixed(2)}.`,
    11,
    'normal',
  );

  writeLines("Annual outlook (12 months)", 12, "bold", 2);
  writeLines(
    `Benefits only: $${results.yearSummary.benefitsOnlyAnnual.toFixed(2)}`,
    11,
  );
  writeLines(
    `Job + benefits: $${results.yearSummary.jobPlusBenefitsAnnual.toFixed(2)}`,
    11,
  );
  if (results.yearSummary.yearlyIncrease > 0) {
    writeLines(
      `Potential yearly increase: +$${results.yearSummary.yearlyIncrease.toFixed(2)}`,
      11,
      "bold",
      8,
    );
  } else {
    y += 5;
  }

  if (results.benefitsKept.length > 0) {
    writeLines("Benefits you may keep", 12, "bold", 2);
    for (const b of results.benefitsKept) {
      writeLines(
        `${b.name} — original $${b.originalAmount}/mo; estimated with job $${b.reducedAmount.toFixed(2)}/mo.`,
        11,
      );
    }
    y += 4;
  }

  if (results.benefitsLost.length > 0) {
    writeLines("Benefits you may lose", 12, "bold", 2);
    for (const b of results.benefitsLost) {
      writeLines(
        `${b.name} — would have received about $${b.originalAmount}/mo.`,
        11,
      );
    }
    y += 4;
  }

  writeLines("Your job details", 12, "bold", 2);
  writeLines(
    `Type: ${formData.jobDetails.employment.trim()}; hours/week: ${formData.jobDetails.hours}; pay type: ${formData.jobDetails.payType.trim()}; pay frequency: ${formData.jobDetails.payRate.trim()}; hourly wage or salary figure: $${formData.jobDetails.hourlyWage}`,
    11,
    'normal',
  );

  writeLines(
    "These numbers are simplified estimates for planning. They are not official eligibility decisions from any agency.",
    9,
    "normal",
    0,
  );

  doc.save(`benefits-calculation-${filenameTimestamp(generatedAt)}.pdf`);
}
