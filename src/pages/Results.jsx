import React, { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import benefitsData from "../lib/benefits.json";
import {
  calculateMonthlyIncome,
  calculateBenefitStatus,
} from "../lib/calculateBenefits";
import Iconz from "../components/IconMapper";

function Results() {
  const location = useLocation();
  const navigate = useNavigate();
  const [results, setResults] = useState(null);
  const [, setBenefitsMap] = useState({});

  useEffect(() => {
    document.title = "Benefits Bridge - Your Results";
  }, []);

  useEffect(() => {
    const map = {};
    benefitsData.benefits.forEach((benefit) => {
      map[benefit.id] = benefit;
    });
    setBenefitsMap(map);

    const formData = location.state?.formData;

    if (!formData || !formData.selectedBenefits.length) {
      navigate("/dashboard");
      return;
    }

    const hourlyRate = parseFloat(formData.jobDetails.hourlyWage) || 15;
    const monthlyIncome = calculateMonthlyIncome(
      formData.jobDetails.payType.trim(),
      formData.jobDetails.hours,
      formData.jobDetails.payRate.trim(),
      hourlyRate,
    );

    const calculationResults = calculateBenefitStatus(
      formData.selectedBenefits,
      map,
      monthlyIncome,
    );

    setResults(calculationResults);
  }, [location.state, navigate]);

  if (!results) {
    return (
      <div className="flex items-center justify-center h-screen">
        Loading...
      </div>
    );
  }

  const determineScenario = () => {
    if (results.monthlyIncome >= results.totalBenefitsWithoutJob) {
      return {
        type: "sufficient",
        message: "Great news! Your job income exceeds your benefits.",
        description:
          "You could be earning more than your current benefits provide.",
      };
    } else if (results.totalBenefitsWithJob === 0) {
      return {
        type: "lost",
        message: "All benefits may be lost.",
        description:
          "Your income is too high to qualify for benefits. Consider the trade-off carefully.",
      };
    } else {
      return {
        type: "partial",
        message: "You may keep some of your benefits.",
        description:
          "Your income may allows you to keep or partially receive some benefits.",
      };
    }
  };

  const scenario = determineScenario();

  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-4 bg-gray-50">
      <div className="w-full max-w-2xl">
        {/* Header */}
        <h1 className="text-5xl font-bold text-black mb-2 text-center">
          Your Results
        </h1>
        <p className="text-gray-600 text-center mb-8">
          ZIP Code:{" "}
          <span className="font-semibold">{location.state?.formData.zip}</span>
        </p>

        {/* Scenario Card */}
        <div
          className={`p-6 rounded-lg mb-8 border-l-4 ${
            scenario.type === "sufficient"
              ? "bg-green-50 border-green-500"
              : scenario.type === "lost"
                ? "bg-red-50 border-red-500"
                : "bg-yellow-50 border-yellow-500"
          }`}
        >
          <h2 className="text-2xl font-bold text-black mb-2">
            {scenario.message}
          </h2>
          <p className="text-gray-700">{scenario.description}</p>
        </div>

        {/* Monthly Breakdown */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          {/* Without Job */}
          <div className="bg-white p-6 rounded-lg border border-gray-200 shadow-sm">
            <h3 className="text-lg font-bold text-gray-800 mb-4">
              Without Job
            </h3>
            <div className="space-y-2">
              <div className="flex justify-between">
                <span className="text-gray-600">Monthly Benefits:</span>
                <span className="font-semibold text-[#5664f5]">
                  ${results.totalBenefitsWithoutJob.toFixed(2)}
                </span>
              </div>
              <div className="pt-2 border-t border-gray-200">
                <span className="text-gray-600">Total Monthly:</span>
                <span className="font-bold text-lg block text-gray-800 mt-1">
                  ${results.totalResourcesWithoutJob.toFixed(2)}
                </span>
              </div>
            </div>
          </div>

          {/* With Job */}
          <div className="bg-white p-6 rounded-lg border border-[#5664f5] shadow-sm">
            <h3 className="text-lg font-bold text-gray-800 mb-4">With Job</h3>
            <div className="space-y-2">
              <div className="flex justify-between">
                <span className="text-gray-600">Job Income:</span>
                <span className="font-semibold text-green-600">
                  ${results.monthlyIncome.toFixed(2)}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Remaining Benefits:</span>
                <span className="font-semibold text-[#5664f5]">
                  ${results.totalBenefitsWithJob.toFixed(2)}
                </span>
              </div>
              <div className="pt-2 border-t border-gray-200">
                <span className="text-gray-600">Total Monthly:</span>
                <span className="font-bold text-lg block text-gray-800 mt-1">
                  ${results.totalResourcesWithJob.toFixed(2)}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Annual Comparison */}
        <div className="bg-[#5664f5] text-white p-6 rounded-lg mb-8">
          <h3 className="text-xl font-bold mb-4">Annual Outlook (12 months)</h3>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <span className="text-blue-100">Benefits Only:</span>
              <p className="text-2xl font-bold">
                ${results.yearSummary.benefitsOnlyAnnual.toFixed(2)}
              </p>
            </div>
            <div>
              <span className="text-blue-100">Job + Benefits:</span>
              <p className="text-2xl font-bold">
                ${results.yearSummary.jobPlusBenefitsAnnual.toFixed(2)}
              </p>
            </div>
          </div>
          {results.yearSummary.yearlyIncrease > 0 && (
            <div className="mt-4 pt-4 border-t border-blue-400">
              <span className="text-blue-100">Potential Yearly Increase:</span>
              <p className="text-3xl font-bold text-green-300">
                +${results.yearSummary.yearlyIncrease.toFixed(2)}
              </p>
            </div>
          )}
        </div>

        {/* Benefits Details */}
        {results.benefitsKept.length > 0 && (
          <div className="mb-8">
            <h3 className="text-xl font-bold text-green-700 mb-4">
              ✓ Benefits You may Keep
            </h3>
            <div className="space-y-3">
              {results.benefitsKept.map((benefit) => (
                <div
                  key={benefit.id}
                  className="bg-green-50 p-4 rounded-lg border border-green-200"
                >
                  <div className="flex items-center gap-3 mb-2">
                    <span className="text-2xl text-green-600">
                      <Iconz name={benefit.icon} />
                    </span>
                    <h4 className="font-bold text-gray-800">{benefit.name}</h4>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">
                      Original: ${benefit.originalAmount}/month
                    </span>
                    <span className="font-semibold text-green-700">
                      You get: ${benefit.reducedAmount.toFixed(2)}/month
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Benefits Lost */}
        {results.benefitsLost.length > 0 && (
          <div className="mb-8">
            <h3 className="text-xl font-bold text-red-700 mb-4">
              ✕ Benefits You may Lose
            </h3>
            <div className="space-y-3">
              {results.benefitsLost.map((benefit) => (
                <div
                  key={benefit.id}
                  className="bg-red-50 p-4 rounded-lg border border-red-200"
                >
                  <div className="flex items-center gap-3">
                    <span className="text-2xl text-red-600">
                      <Iconz name={benefit.icon} />
                    </span>
                    <div className="flex-1">
                      <h4 className="font-bold text-gray-800">
                        {benefit.name}
                      </h4>
                      <p className="text-sm text-gray-600">
                        Would have received: ${benefit.originalAmount}/month
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Job Details Summary */}
        <div className="bg-gray-100 p-6 rounded-lg mb-8">
          <h3 className="font-bold text-gray-800 mb-3">Your Job Details</h3>
          <div className="grid grid-cols-2 gap-3 text-sm">
            <div>
              <span className="text-gray-600">Type:</span>
              <p className="font-semibold text-gray-800">
                {location.state?.formData.jobDetails.employment.trim()}
              </p>
            </div>
            <div>
              <span className="text-gray-600">Hours/Week:</span>
              <p className="font-semibold text-gray-800">
                {location.state?.formData.jobDetails.hours}
              </p>
            </div>
            <div>
              <span className="text-gray-600">Pay Type:</span>
              <p className="font-semibold text-gray-800">
                {location.state?.formData.jobDetails.payType.trim()}
              </p>
            </div>
            <div>
              <span className="text-gray-600">Pay Frequency:</span>
              <p className="font-semibold text-gray-800">
                {location.state?.formData.jobDetails.payRate.trim()}
              </p>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex gap-4 justify-center">
          <button
            onClick={() => navigate("/dashboard")}
            className="px-6 py-3 bg-gray-300 text-gray-800 font-semibold rounded-md
              hover:bg-gray-400 cursor-pointer"
          >
            Home
          </button>
          <button
            className="px-6 py-3 bg-[#5664f5] text-white font-semibold rounded-md
              hover:bg-purple-600 cursor-pointer"
          >
            Save Results
          </button>
        </div>
      </div>
    </div>
  );
}

export default Results;
