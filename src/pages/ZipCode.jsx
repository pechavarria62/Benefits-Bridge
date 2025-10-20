import React, { useState, useEffect } from 'react';
import benefitsData from "../lib/benefits.json";
import Iconz from '../components/IconMapper';

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
     <div className="flex flex-col items-center justify-center h-screen min-h-screen p-4">
      {!formData.showForm ? (
        <>
          <h1 className="text-4xl font-bold text-[#5664f5] mb-2">Welcome to Job</h1>
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
                setFormData((prev) => ({ ...prev, zip: e.target.value })) // Update ZIP in state
              }
              className="
                text-base flex-1 p-2
                rounded-md border-[#5664f5]
                border-solid border focus:border-purple-500
                focus:outline-none
                focus:text-[#5664f5]"
              />
              <button onClick={handleContinue} className="bg-[#5664f5] text-white
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
          <h2 className="text-5xl font-bold text-black mb-2 flex flex-col">Select Benefits</h2>
          <ul className=" text-[#5664f5] px-4 w-72 ">
            {benefits.map((benefit) => (
              <li key={benefit.id} className="w-full">
                <label className="flex items-center space-x-4 mb-2 cursor-pointer">
                  <input
                    type="checkbox"
                    className=''
                    checked={formData.selectedBenefits.includes(benefit.id)}
                    onChange={() => toggleBenefit(benefit.id)}
                  />
                  <span className="text-[#5664f5] text-2xl"><Iconz name={benefit.icon} /></span>
                  <span className="text-black">{benefit.name} </span>
                  <input
                    type="text"
                    placeholder={`$${benefit.amount}`}
                    className='bg-white text-[#5664f5] border border-solid
                      border-[#5664f5] rounded-lg py-0 px-2 w-full'
                  />
                  {/* <span className="benefit-amount">
                    ${benefit.amount} / {benefit.unit}
                  </span> */}
                </label>
              </li>
            ))}
          </ul>

          <h2 className="text-5xl font-bold text-black mb-2 flex flex-col mt-4">Job Details</h2>
          <div className="flex flex-col items-center align-center gap-2 w-full max-w-sm">
            <label>
              Employment
              <select className="text-[13px] text-[#5664f5] mx-3 py-0 px-2
                  border border-solid bg-white
                  rounded-lg border-[#5664f5]
                  font-lexendDeca leading-[35.333335876464844px]
                  focus:outline-none 
                  focus:text-purple-800 cursor-pointer"
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
              <select className="text-[13px] text-[#5664f5] mx-3 py-0 px-2
                  border border-solid bg-white
                  rounded-lg border-[#5664f5]
                  font-lexendDeca leading-[35.333335876464844px]
                  focus:outline-none 
                  focus:text-purple-800 cursor-pointer"
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
              <select className="text-[13px] text-[#5664f5] mx-3 py-0 px-2
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
              <select className="text-[13px] text-[#5664f5] mx-3 py-0 px-2
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
          </div>

          <button
            className="bg-[#5664f5] text-white
                border-none rounded-md
                py-2 px-4 mt-4 text-base font-semibold cursor-pointer
                hover:bg-purple-600 focus:outline-none "
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