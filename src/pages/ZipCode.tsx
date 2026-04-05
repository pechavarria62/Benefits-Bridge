import { useState, useEffect } from "react";
import type { KeyboardEvent } from "react";
import { useNavigate } from "react-router-dom";
import benefitsData from "../lib/benefits.json";
import type { Benefit, DashboardFormData } from "../types/app";
import IconMapper from "../components/IconMapper";

function ZipCode() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState<DashboardFormData>({
    zip: "",
    showForm: false,
    selectedBenefits: [],
    benefitAmounts: {}, // Track custom benefit amounts
    jobDetails: {
      employment: "Full-time",
      hours: 40,
      payType: "Hourly",
      payRate: "Weekly",
      hourlyWage: "",
    },
  });
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
      setFormData((prev) => ({ ...prev, showForm: true }));
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
    navigate("/results", {
      state: {
        formData,
      },
    });
  };

  const toggleBenefit = (id: string) => {
    setFormData((prev) => ({
      ...prev,
      selectedBenefits: prev.selectedBenefits.includes(id)
        ? prev.selectedBenefits.filter((b) => b !== id)
        : [...prev.selectedBenefits, id],
    }));
  };

  const handleJobChange = <K extends keyof DashboardFormData["jobDetails"]>(
    field: K,
    value: DashboardFormData["jobDetails"][K],
  ) => {
    setFormData((prev) => ({
      ...prev,
      jobDetails: { ...prev.jobDetails, [field]: value },
    }));
  };

  const handleBenefitAmountChange = (benefitId: string, amount: string) => {
    setFormData((prev) => ({
      ...prev,
      benefitAmounts: { ...prev.benefitAmounts, [benefitId]: amount },
    }));
  };
  return (
    <div className="flex flex-col items-center justify-center h-screen min-h-screen p-4">
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
              onChange={(e) =>
                setFormData((prev) => ({ ...prev, zip: e.target.value }))
              }
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
        <>
          <h2 className="text-5xl font-bold text-black mb-2 flex flex-col">
            Select Benefits
          </h2>
          <ul className=" text-[#5664f5] px-2 w-72 ">
            {benefits.map((benefit) => (
              <li key={benefit.id} className="w-full">
                <label className="flex items-center gap-4 mb-2 cursor-pointer">
                  <input
                    type="checkbox"
                    className="flex-shrink-0"
                    checked={formData.selectedBenefits.includes(benefit.id)}
                    onChange={() => toggleBenefit(benefit.id)}
                  />
                  <span className="flex-shrink-0 text-[#5664f5] text-2xl">
                    <IconMapper name={benefit.icon} />
                  </span>
                  <span className="text-black flex-shrink-0 w-20">
                    {benefit.name}{" "}
                  </span>
                  <input
                    type="number"
                    step="0.01"
                    min="0"
                    placeholder={`$${benefit.amount}`}
                    value={formData.benefitAmounts[benefit.id] ?? ""}
                    onChange={(e) =>
                      handleBenefitAmountChange(benefit.id, e.target.value)
                    }
                    className="bg-white text-[#5664f5] border border-solid
                      border-[#5664f5] rounded-lg py-0 px-2 w-24"
                  />
                </label>
              </li>
            ))}
          </ul>

          <h2 className="text-5xl font-bold text-black mb-2 flex flex-col mt-4">
            Job Details
          </h2>
          <div className="flex flex-col items-center align-center">
            <div className="flex flex-col items-right align-center gap-0 w-full max-w-sm">
              <label>
                Employment
                <select
                  className="text-[13px] text-[#5664f5] mx-3 py-0 px-2
                  border border-solid bg-white
                  rounded-lg border-[#5664f5]
                  font-lexendDeca leading-[35.333335876464844px]
                  focus:outline-none
                  focus:text-purple-800 cursor-pointer"
                  value={formData.jobDetails.employment}
                  onChange={(e) =>
                    handleJobChange("employment", e.target.value)
                  }
                >
                  <option>Full-time</option>
                  <option>Part-time</option>
                  <option>Contract</option>
                </select>
              </label>
              <label>
                Hours per Week
                <select
                  className="text-[13px] text-[#5664f5] mx-3 py-0 px-2
                  border border-solid bg-white
                  rounded-lg border-[#5664f5]
                  font-lexendDeca leading-[35.333335876464844px]
                  focus:outline-none
                  focus:text-purple-800 cursor-pointer"
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
              </label>
              <label>
                Pay Type
                <select
                  className="text-[13px] text-[#5664f5] mx-3 py-0 px-2
                  border border-solid bg-white
                  rounded-lg border-[#5664f5]
                  font-lexendDeca leading-[35.333335876464844px]
                  focus:outline-none
                  focus:text-purple-800 cursor-pointer"
                  value={formData.jobDetails.payType}
                  onChange={(e) => handleJobChange("payType", e.target.value)}
                >
                  <option>Hourly</option>
                  <option>Salary</option>
                </select>
              </label>

              <label>
                Pay Rate
                <select
                  className="text-[13px] text-[#5664f5] mx-3 py-0 px-2
                  border border-solid bg-white
                  rounded-lg border-[#5664f5]
                  font-lexendDeca leading-[35.333335876464844px]
                  focus:outline-none
                  focus:text-purple-800 cursor-pointer"
                  value={formData.jobDetails.payRate}
                  onChange={(e) => handleJobChange("payRate", e.target.value)}
                >
                  <option>Weekly</option>
                  <option>Bi-Weekly</option>
                  <option>Monthly</option>
                </select>
              </label>
              <label>
                Hourly Wage ($)
                <input
                  type="number"
                  step="0.01"
                  min="0"
                  placeholder="15.00"
                  className="text-[13px] text-[#5664f5] mx-3 py-2 px-2
                  border border-solid bg-white
                  rounded-lg border-[#5664f5]
                  focus:outline-none
                  focus:text-purple-800 w-full"
                  value={formData.jobDetails.hourlyWage}
                  onChange={(e) =>
                    handleJobChange("hourlyWage", e.target.value)
                  }
                  onKeyDown={handleFormKeyPress}
                />
              </label>
            </div>
          </div>

          <button
            type="button"
            className="bg-[#5664f5] text-white
                border-none rounded-md
                py-2 px-4 mt-4 text-base font-semibold cursor-pointer
                hover:bg-purple-600 focus:outline-none "
            onClick={handleFormSubmit}
          >
            Continue
          </button>
        </>
      )}
    </div>
  );
}

export default ZipCode;
