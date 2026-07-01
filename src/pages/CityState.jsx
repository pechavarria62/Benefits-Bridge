import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { LiaInfoSolid } from "react-icons/lia";
import benefitsData from "../lib/benefits.json";
import Iconz from "../components/IconMapper";

function CityState() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    city: "",
    state: "",
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
  const [benefits, setBenefits] = useState([]);
  const [showInfoModal, setShowInfoModal] = useState(false);
  const [selectedBenefitId, setSelectedBenefitId] = useState(null);

  useEffect(() => {
    setBenefits(benefitsData.benefits);
  }, []);

  useEffect(() => {
    document.title = formData.showForm
      ? "Benefits Bridge - Select Benefits"
      : "Benefits Bridge - Welcome";
  }, [formData.showForm]);

  const handleContinue = () => {
    const city = formData.city.trim();
    const state = formData.state.trim();

    if (!city || !state) {
      alert("Please enter both city and state to continue.");
      return;
    }

    if (city.length < 2) {
      alert("Please enter a valid city name.");
      return;
    }

    if (state.length < 2) {
      alert("Please enter a valid state name or abbreviation.");
      return;
    }

    setFormData((prev) => ({ ...prev, showForm: true }));
  };

  const handleLocationKeyPress = (e) => {
    if (e.key === "Enter") {
      handleContinue();
    }
  };

  const handleFormKeyPress = (e) => {
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

  const toggleBenefit = (id) => {
    setFormData((prev) => ({
      ...prev,
      selectedBenefits: prev.selectedBenefits.includes(id)
        ? prev.selectedBenefits.filter((b) => b !== id)
        : [...prev.selectedBenefits, id],
    }));
  };

  const handleJobChange = (field, value) => {
    setFormData((prev) => ({
      ...prev,
      jobDetails: { ...prev.jobDetails, [field]: value },
    }));
  };

  const handleBenefitAmountChange = (benefitId, amount) => {
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
            Welcome to Benefits Bridge
          </h1>
          <p className="text-gray-700 max-w-lg mb-4 leading-normal">
            Understand how taking a new job can affect your government benefits.
            Enter your city and state to get started.
          </p>

          <div className="flex flex-col justify-center items-center gap-3 w-full max-w-sm">
            <input
              type="text"
              placeholder="Enter City"
              value={formData.city}
              onChange={(e) =>
                setFormData((prev) => ({ ...prev, city: e.target.value }))
              }
              onKeyDown={handleLocationKeyPress}
              className="
                text-base w-full p-2
                rounded-md border-[#5664f5]
                border-solid border focus:border-purple-500
                focus:outline-none
                focus:text-[#5664f5]"
            />
            <input
              type="text"
              placeholder="Enter State"
              value={formData.state}
              onChange={(e) =>
                setFormData((prev) => ({ ...prev, state: e.target.value }))
              }
              onKeyDown={handleLocationKeyPress}
              className="
                text-base w-full p-2
                rounded-md border-[#5664f5]
                border-solid border focus:border-purple-500
                focus:outline-none
                focus:text-[#5664f5]"
            />
            <button
              onClick={handleContinue}
              className="bg-[#5664f5] text-white
                border-none rounded-md
                py-2 px-4 text-base font-semibold cursor-pointer
                hover:bg-purple-600 focus:outline-none w-full"
            >
              Continue
            </button>
          </div>
        </>
      ) : (
        <>
          <h2 className="text-4xl font-bold text-black mb-2 flex flex-row items-center gap-2">
            Select Benefits
            <button
              onClick={() => {
                setSelectedBenefitId(null);
                setShowInfoModal(true);
              }}
              className="text-[#5664f5] hover:text-purple-600 focus:outline-none text-3xl"
              title="View all benefits information"
            >
              <LiaInfoSolid />
            </button>
          </h2>
          <div
            className="rounded-lg p-4 w-96 max-h-96 overflow-y-auto bg-white hide-scrollbar"
            style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
          >
            <ul className="text-[#5664f5] w-full">
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
                      <Iconz name={benefit.icon} />
                    </span>
                    <span className="text-black flex-shrink-0">
                      <span className="w-20">{benefit.name}</span>
                    </span>
                    <input
                      type="number"
                      step="0.01"
                      min="0"
                      placeholder={`$${benefit.amount}`}
                      value={formData.benefitAmounts[benefit.id] || ""}
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
          </div>

          <h2 className="text-4xl font-bold text-black mb-2 flex flex-col mt-4">
            Job Details
          </h2>
          <div className="flex flex-col items-center align-center">
            <div className="flex flex-col items-right align-center gap-0 w-full max-w-sm">
              <label>
                Employment
                <select
                  className="text-[13px] text-[#5664f5] mx-19 lg:mx-17 py-0 px-2
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
                  className="text-[13px] text-[#5664f5] mx-12 lg:mx-11 py-0 px-2
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
                  className="text-[13px] text-[#5664f5] mx-24 lg:mx-11 py-0 px-2
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
                  className="text-[13px] text-[#5664f5] mx-24 lg:mx-11 py-0 px-2
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
                  className="text-[13px] text-[#5664f5] mx-10 py-0 px-2
                  border border-solid bg-white
                  rounded-lg border-[#5664f5]
                  focus:outline-none 
                  focus:text-purple-800 w-20"
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
            className="bg-[#5664f5] text-white
                border-none rounded-md
                py-2 px-4 mt-4 text-base font-semibold cursor-pointer
                hover:bg-purple-600 focus:outline-none "
            onClick={handleFormSubmit}
          >
            Continue
          </button>

          {/* Info Modal */}
          {showInfoModal && (
            <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
              <div className="bg-white rounded-lg p-6 max-w-2xl max-h-96 overflow-y-auto w-full">
                <div className="flex justify-between items-center mb-4">
                  <h3 className="text-2xl font-bold text-black">
                    {selectedBenefitId
                      ? `${benefits.find((b) => b.id === selectedBenefitId)?.name}`
                      : "All Benefits"}
                  </h3>
                  <button
                    onClick={() => setShowInfoModal(false)}
                    className="text-gray-600 hover:text-gray-900 text-2xl font-bold"
                  >
                    ✕
                  </button>
                </div>

                {selectedBenefitId ? (
                  // Single benefit view
                  (() => {
                    const benefit = benefits.find(
                      (b) => b.id === selectedBenefitId,
                    );
                    return benefit ? (
                      <div className="border-l-4 border-[#5664f5] pl-4">
                        <p className="text-gray-700 mb-2">
                          <strong>ID:</strong> {benefit.id}
                        </p>
                        <p className="text-gray-700 mb-2">
                          <strong>Name:</strong> {benefit.name}
                        </p>
                        <p className="text-gray-700 mb-2">
                          <strong>Description:</strong> {benefit.description}
                        </p>
                        <p className="text-gray-700">
                          <strong>Amount:</strong> ${benefit.amount} per{" "}
                          {benefit.unit}
                        </p>
                      </div>
                    ) : null;
                  })()
                ) : (
                  // All benefits view
                  <div className="space-y-4">
                    {benefits.map((benefit) => (
                      <div
                        key={benefit.id}
                        className="border-l-4 border-[#5664f5] pl-4 pb-4"
                      >
                        <p className="text-sm text-gray-600">
                          <strong>ID:</strong> {benefit.id}
                        </p>
                        <p className="text-lg font-semibold text-[#5664f5] mb-1">
                          {benefit.name}
                        </p>
                        <p className="text-gray-700 mb-1 text-sm">
                          {benefit.description}
                        </p>
                        <p className="text-gray-600 text-sm">
                          <strong>Amount:</strong> ${benefit.amount} per{" "}
                          {benefit.unit}
                        </p>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
}

export default CityState;
