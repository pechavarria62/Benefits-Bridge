import { useState, useEffect } from "react";
import type { KeyboardEvent } from "react";
import { useNavigate } from "react-router-dom";
import benefitsData from "../lib/benefits.json";
import type { Benefit, DashboardFormData } from "../types/app";
import IconMapper from "../components/IconMapper";
import { useAppDispatch, useAppSelector } from "../store/hooks";
import {
  setZip,
  setShowForm,
  toggleBenefit,
  setJobDetail,
  setBenefitAmount,
} from "../store/formSlice";

function ZipCode() {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const formData = useAppSelector((s) => s.form);
  const [benefits, setBenefits] = useState<Benefit[]>([]);

  useEffect(() => {
    setBenefits(benefitsData.benefits);
  }, []);

  useEffect(() => {
    document.title = formData.showForm
      ? "Benefits Bridge - Select Benefits"
      : "Benefits Bridge - Welcome";
  }, [formData.showForm]);

  const handleContinue = () => {
    const zip = formData.zip.trim();
    const correctZip = /^\d{5}$/.test(zip);

    if (correctZip) {
      dispatch(setShowForm(true));
    } else {
      alert("Zip code has to be numbers and 5 digits only please.");
    }
  };

  const handleZipKeyPress = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      handleContinue();
    }
  };

  const handleFormKeyPress = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      handleFormSubmit();
    }
  };

  const handleFormSubmit = () => {
    if (formData.selectedBenefits.length === 0) {
      alert("Please select at least one benefit to continue.");
      return;
    }
    if (!formData.jobDetails.hourlyWage) {
      alert("Please enter your hourly wage to continue.");
      return;
    }
    navigate("/results");
  };

  const onToggleBenefit = (id: string) => {
    dispatch(toggleBenefit(id));
  };

  const handleJobChange = <K extends keyof DashboardFormData["jobDetails"]>(
    field: K,
    value: DashboardFormData["jobDetails"][K],
  ) => {
    dispatch(setJobDetail({ field, value }));
  };

  const handleBenefitAmountChange = (benefitId: string, amount: string) => {
    dispatch(setBenefitAmount({ benefitId, amount }));
  };

  return (
    <div
      className={
        formData.showForm
          ? "min-h-screen w-full"
          : "flex min-h-screen flex-col items-center justify-center p-4"
      }
    >
      {!formData.showForm ? (
        <>
          <h1 className="text-4xl font-bold text-[#5664f5] mb-2">
            Welcome to Job
          </h1>
          <p className="text-gray-700 max-w-lg mb-4 leading-normal">
            Understand how taking a new job can affect your government benefits.
            Enter your ZIP code to get started.
          </p>

          <div className="flex justify-center items-center align-center gap-2 w-full max-w-sm">
            <input
              type="text"
              placeholder="Enter ZIP Code"
              value={formData.zip}
              onChange={(e) => dispatch(setZip(e.target.value))}
              onKeyDown={handleZipKeyPress}
              className="
                text-base flex-1 p-2
                rounded-md border-[#5664f5]
                border-solid border focus:border-purple-500
                focus:outline-none
                focus:text-[#5664f5]"
            />
            <button
              type="button"
              onClick={handleContinue}
              className="bg-[#5664f5] text-white
                border-none rounded-md
                py-2 px-4 text-base font-semibold cursor-pointer
                hover:bg-purple-600 focus:outline-none "
            >
              Continue
            </button>
          </div>
        </>
      ) : (
        <div className="min-h-screen w-full overflow-y-auto bg-gradient-to-b from-slate-50 to-white py-8 px-4 pb-12">
          <div className="mx-auto flex w-full max-w-2xl flex-col gap-8">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <button
                type="button"
                onClick={() => dispatch(setShowForm(false))}
                className="text-sm font-medium text-[#5664f5] underline-offset-4 hover:underline focus:outline-none focus:ring-2 focus:ring-[#5664f5]/30 rounded"
              >
                ← Change ZIP ({formData.zip})
              </button>
            </div>
            <section
              className="rounded-2xl border border-indigo-100 bg-white p-5 shadow-sm sm:p-6"
              aria-labelledby="benefits-heading"
            >
              <header className="mb-5 border-b border-slate-100 pb-4">
                <h2
                  id="benefits-heading"
                  className="text-2xl font-bold tracking-tight text-gray-900 sm:text-3xl"
                >
                  Select benefits
                </h2>
                <p className="mt-2 text-sm leading-relaxed text-gray-600">
                  Check each program you currently receive. Enter your actual
                  benefit amount if it differs from the suggested default.
                </p>
              </header>
              <ul className="flex flex-col gap-3">
                {benefits.map((benefit) => {
                  const selected = formData.selectedBenefits.includes(
                    benefit.id,
                  );
                  return (
                    <li key={benefit.id}>
                      <div
                        className={`rounded-xl border-2 p-4 transition-colors ${
                          selected
                            ? "border-[#5664f5] bg-indigo-50/50 shadow-sm"
                            : "border-slate-200 bg-slate-50/40 hover:border-slate-300"
                        }`}
                      >
                        <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
                          <label className="flex min-w-0 flex-1 cursor-pointer items-start gap-3 sm:items-center">
                            <input
                              type="checkbox"
                              className="mt-1 h-4 w-4 shrink-0 rounded border-gray-300 text-[#5664f5] focus:ring-2 focus:ring-[#5664f5]/30"
                              checked={selected}
                              onChange={() => onToggleBenefit(benefit.id)}
                              aria-describedby={`${benefit.id}-hint`}
                            />
                            <span
                              className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-indigo-100 text-xl text-[#5664f5]"
                              aria-hidden
                            >
                              <IconMapper name={benefit.icon} />
                            </span>
                            <span className="min-w-0 flex-1">
                              <span className="block font-semibold text-gray-900">
                                {benefit.name}
                              </span>
                              <span
                                id={`${benefit.id}-hint`}
                                className="mt-0.5 block text-xs text-gray-500"
                              >
                                Suggested: ${benefit.amount} / {benefit.unit}
                              </span>
                            </span>
                          </label>
                          <div className="sm:w-36 sm:shrink-0">
                            <label
                              htmlFor={`amount-${benefit.id}`}
                              className="mb-1 block text-xs font-medium text-gray-600 sm:text-right"
                            >
                              Amount ($)
                            </label>
                            <input
                              id={`amount-${benefit.id}`}
                              type="number"
                              step="0.01"
                              min="0"
                              inputMode="decimal"
                              placeholder={String(benefit.amount)}
                              value={formData.benefitAmounts[benefit.id] ?? ""}
                              onChange={(e) =>
                                handleBenefitAmountChange(
                                  benefit.id,
                                  e.target.value,
                                )
                              }
                              className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2.5 text-sm text-gray-900 tabular-nums placeholder:text-gray-400 focus:border-[#5664f5] focus:outline-none focus:ring-2 focus:ring-[#5664f5]/20"
                              aria-label={`${benefit.name} monthly amount in dollars`}
                            />
                          </div>
                        </div>
                      </div>
                    </li>
                  );
                })}
              </ul>
            </section>

            <section
              className="rounded-2xl border border-indigo-100 bg-white p-5 shadow-sm sm:p-6"
              aria-labelledby="job-heading"
            >
              <header className="mb-5 border-b border-slate-100 pb-4">
                <h2
                  id="job-heading"
                  className="text-2xl font-bold tracking-tight text-gray-900 sm:text-3xl"
                >
                  Job details
                </h2>
                <p className="mt-2 text-sm leading-relaxed text-gray-600">
                  Describe the position you are comparing so estimates match
                  your pay schedule and hours.
                </p>
              </header>
              <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
                <div>
                  <label
                    htmlFor="employment"
                    className="block text-sm font-medium text-gray-700"
                  >
                    Employment type
                  </label>
                  <select
                    id="employment"
                    className="mt-1.5 w-full cursor-pointer rounded-lg border border-slate-300 bg-white px-3 py-2.5 text-sm text-gray-900 focus:border-[#5664f5] focus:outline-none focus:ring-2 focus:ring-[#5664f5]/20"
                    value={formData.jobDetails.employment}
                    onChange={(e) =>
                      handleJobChange("employment", e.target.value)
                    }
                  >
                    <option>Full-time</option>
                    <option>Part-time</option>
                    <option>Contract</option>
                  </select>
                </div>
                <div>
                  <label
                    htmlFor="hours"
                    className="block text-sm font-medium text-gray-700"
                  >
                    Hours per week
                  </label>
                  <select
                    id="hours"
                    className="mt-1.5 w-full cursor-pointer rounded-lg border border-slate-300 bg-white px-3 py-2.5 text-sm text-gray-900 focus:border-[#5664f5] focus:outline-none focus:ring-2 focus:ring-[#5664f5]/20"
                    value={formData.jobDetails.hours}
                    onChange={(e) =>
                      handleJobChange("hours", Number(e.target.value))
                    }
                  >
                    {[10, 20, 30, 40].map((h) => (
                      <option key={h} value={h}>
                        {h}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label
                    htmlFor="pay-type"
                    className="block text-sm font-medium text-gray-700"
                  >
                    Pay type
                  </label>
                  <select
                    id="pay-type"
                    className="mt-1.5 w-full cursor-pointer rounded-lg border border-slate-300 bg-white px-3 py-2.5 text-sm text-gray-900 focus:border-[#5664f5] focus:outline-none focus:ring-2 focus:ring-[#5664f5]/20"
                    value={formData.jobDetails.payType}
                    onChange={(e) =>
                      handleJobChange("payType", e.target.value)
                    }
                  >
                    <option>Hourly</option>
                    <option>Salary</option>
                  </select>
                </div>
                <div>
                  <label
                    htmlFor="pay-rate"
                    className="block text-sm font-medium text-gray-700"
                  >
                    Pay frequency
                  </label>
                  <select
                    id="pay-rate"
                    className="mt-1.5 w-full cursor-pointer rounded-lg border border-slate-300 bg-white px-3 py-2.5 text-sm text-gray-900 focus:border-[#5664f5] focus:outline-none focus:ring-2 focus:ring-[#5664f5]/20"
                    value={formData.jobDetails.payRate}
                    onChange={(e) =>
                      handleJobChange("payRate", e.target.value)
                    }
                  >
                    <option>Weekly</option>
                    <option>Bi-Weekly</option>
                    <option>Monthly</option>
                  </select>
                </div>
                <div className="sm:col-span-2">
                  <label
                    htmlFor="hourly-wage"
                    className="block text-sm font-medium text-gray-700"
                  >
                    {formData.jobDetails.payType === "Salary"
                      ? "Annual salary (before taxes, $)"
                      : "Base rate ($ / hour)"}
                  </label>
                  <input
                    id="hourly-wage"
                    type="number"
                    step="0.01"
                    min="0"
                    inputMode="decimal"
                    placeholder={
                      formData.jobDetails.payType === "Salary"
                        ? "52000"
                        : "15.00"
                    }
                    className="mt-1.5 w-full rounded-lg border border-slate-300 bg-white px-3 py-2.5 text-sm text-gray-900 tabular-nums placeholder:text-gray-400 focus:border-[#5664f5] focus:outline-none focus:ring-2 focus:ring-[#5664f5]/20"
                    value={formData.jobDetails.hourlyWage}
                    onChange={(e) =>
                      handleJobChange("hourlyWage", e.target.value)
                    }
                    onKeyDown={handleFormKeyPress}
                  />
                </div>
              </div>
            </section>

            <button
              type="button"
              className="w-full rounded-xl bg-[#5664f5] px-4 py-3 text-base font-semibold text-white shadow-md transition hover:bg-[#4554d9] focus:outline-none focus:ring-2 focus:ring-[#5664f5] focus:ring-offset-2 sm:w-auto sm:self-end sm:px-8"
              onClick={handleFormSubmit}
            >
              Continue to results
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export default ZipCode;
