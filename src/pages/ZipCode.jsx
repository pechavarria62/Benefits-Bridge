import React, { useState, useEffect } from 'react';
import benefitsData from "../lib/benefits.json";

function ZipCode() {
 const [formData, setFormData] = useState({
  zip: "",
  showForm: false,
  selectedBenefits: [],
  jobDetails: {
    employment: "Full-time ",
    hours: 40,
    payType: "Hourly ",
    payRate: "Weekly ",
  },
});
const [benefits, setBenefits] = useState([]);

// Load benefits data when component mounts
  useEffect(() => {
    setBenefits(benefitsData.benefits);
  }, []);

  // Called when the user clicks "Continue" after entering ZIP
  const handleContinue = () => {
    if (formData.zip.trim()) {
      setFormData((prev) => ({ ...prev, showForm: true }));
    }
  };

  // Toggle a benefit on/off in selectedBenefits
  const toggleBenefit = (id) => {
    setFormData((prev) => ({
      ...prev,
      selectedBenefits: prev.selectedBenefits.includes(id)
        ? prev.selectedBenefits.filter((b) => b !== id)
        : [...prev.selectedBenefits, id],
    }));
  };

  // Update jobDetails fields when user changes inputs
 const handleJobChange = (field, value) => {
    setFormData((prev) => ({
      ...prev,
      jobDetails: { ...prev.jobDetails, [field]: value },
    }));
  };
  return (
     <div className="zipcode-container">
      {!formData.showForm ? (
        <>
          <h1 className="welcome-title">Welcome to Job</h1>
          <p className="zipcode-subtext">
            Understand how taking a new job can affect your government benefits.
            Enter your ZIP code to get started.
          </p>

          <div className="zipcode-form">
            <input
              type="text"
              placeholder="Enter ZIP Code"
              value={formData.zip}
              onChange={(e) =>
                setFormData((prev) => ({ ...prev, zip: e.target.value })) // Update ZIP in state
              }
              className="zipcode-input"
            />
            <button onClick={handleContinue} className="zipcode-button">
              Continue
            </button>
          </div>
        </>
      ) : (
        <>
          <h2 className="zipcode-title">Select Benefits</h2>
          <ul className="benefits-list">
            {benefits.map((benefit) => (
              <li key={benefit.id} className="benefit-item">
                <label>
                  <input
                    type="checkbox"
                    checked={formData.selectedBenefits.includes(benefit.id)}
                    onChange={() => toggleBenefit(benefit.id)}
                  />
                  <span className="benefit-icon">{benefit.icon} </span>
                  <span className="benefit-name">{benefit.name} </span>
                  <span className="benefit-amount">
                    ${benefit.amount} / {benefit.unit}
                  </span>
                </label>
              </li>
            ))}
          </ul>

          <h2 className="zipcode-title">Job Details</h2>
          <div className="job-form">
            <label>
              Employment
              <select className="job-form-select"
                value={formData.jobDetails.employment}
                onChange={(e) =>
                  handleJobChange("employment ", e.target.value)
                }
              >
                <option>Full-time</option>
                <option>Part-time</option>
                <option>Contract</option>
              </select>
            </label>

            <label>
              Hours per Week  
              <select className="job-form-select"
                value={ formData.jobDetails.hours}
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
              <select className="job-form-select"
                value={formData.jobDetails.payType}
                onChange={(e) => handleJobChange("payType", e.target.value)}
              >
                <option>Hourly</option>
                <option>Salary</option>
              </select>
            </label>

            <label>
              Pay Rate
              <select className="job-form-select"
                value={formData.jobDetails.payRate}
                onChange={(e) => handleJobChange("payRate", e.target.value)}
              >
                <option>Weekly</option>
                <option>Bi-Weekly</option>
                <option>Monthly</option>
              </select>
            </label>
          </div>

          <button
            className="zipcode-button"
            onClick={() => console.log(formData)}
          >
            Continue
          </button>
        </>
      )}
    </div>
  );
}

export default ZipCode;