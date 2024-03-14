import { useState, useRef, ChangeEvent, FormEvent, useEffect } from 'react';
import { toast } from 'react-toastify'; 
import { useQuery, useMutation } from "convex/react";
import { api } from "../../convex/_generated/api";
import 'react-toastify/dist/ReactToastify.css'; 
import AllergyDetails from './AllergyDetails.tsx';
import CardiologyDetails from './CardiologyDetails.tsx';
import DiagnosisDetails from './DiagnosisDetails.tsx';
import ImmunizationDetails from './ImmunizationDetails.tsx';
import LabTestDetails from './LabTestDetails.tsx';
import MedicalHistoryDetails from './MedicalHistoryDetails.tsx';
import SurgeryDetails from './SurgeryDetails.tsx';
import VitalSignsDetails from './VitalSignsDetails.tsx';
import PhysicalDetails from './PhysicalDetails.tsx';


const HealthDetails = () => {

  const [showDetails, setShowDetails] = useState(false);
  const trigger = useRef<HTMLButtonElement | null>(null);
  const popup = useRef<HTMLDivElement | null>(null); 
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const toggleDetails = () => {
    setShowDetails((prevShowDetails) => !prevShowDetails);
  };

  const userId = localStorage.getItem("userId");

  const patient = useQuery(api.patients.getPatient, { _id: userId });
  

  return (
    <div className="lg:mx-5 flex flex-col rounded-lg border break-words border-stroke bg-white p-10 shadow-default dark:border-strokedark dark:bg-boxdark">
     <div className="flex flex-row mb-5 items-center gap-4 justify-end">
      
      <div className="relative">
        <button
          onClick={toggleDetails}
          className="inline-flex items-center justify-center rounded-full bg-primary py-3 px-5 text-center font-medium text-white hover:bg-opacity-90 lg:px-8 xl:px-10"
        >
          {showDetails ? 'Hide Details' : 'Show Details'}
        </button>
      </div>
    </div>
    {patient != null && patient?.length > 0 ? (
      <div className="flex flex-row flex-wrap justify-evenly gap-2">
      {patient.map((user, index) => (
      <div className="" key={index}>
        <div className='flex mb-10 p-5 flex-wrap w-full shadow-2xl rounded-lg'>
        <div className='w-full mb-5 font-medium text-black text-xl'>Identification Information</div>
        <div className='w-1/3 mb-5' >
          <span className="text-xl">Name</span>
          <h4 className="text-xl mt-1 font-medium text-black dark:text-white">
            {showDetails ? user.name : '********'}
          </h4>
        </div>

        <div className='w-1/3 mb-5' >
          <span className="text-xl">Date of Birth</span>
          <h4 className="text-xl mt-1 font-medium text-black dark:text-white">
            {showDetails ? user.dateOfBirth : '********'}
          </h4>
        </div>

        <div className='w-1/3 mb-5' >
          <span className="text-xl">Gender</span>
          <h4 className="text-xl mt-1 font-medium text-black dark:text-white">
            {showDetails ? user.gender : '********'}
          </h4>
        </div>

        <div className='w-1/3 mb-5' >
          <span className="text-xl">Marital Status</span>
          <h4 className="text-xl mt-1 font-medium text-black dark:text-white">
            {showDetails ? user.maritalStatus : '********'}
          </h4>
        </div>

        <div className='w-1/3 mb-5' >
          <span className="text-xl">Email Address</span>
          <h4 className="text-xl mt-1 font-medium text-black dark:text-white">
            {showDetails ? user.email : '********'}
          </h4>
        </div>

        <div className='w-1/3 mb-5' >
          <span className="text-xl">Phone Number</span>
          <h4 className="text-xl mt-1 font-medium text-black dark:text-white">
            {showDetails ? user.phone : '********'}
          </h4>
        </div>
      </div> 

      <div className='flex flex-wrap  mb-10 p-5 w-full shadow-2xl rounded-lg'>
        <AllergyDetails/>
      </div>
      <div className='flex flex-wrap  mb-10 p-5 w-full shadow-2xl rounded-lg'>
        <CardiologyDetails/>
      </div>
      <div className='flex flex-wrap  mb-10 p-5 w-full shadow-2xl rounded-lg'>
        <DiagnosisDetails/>
      </div>
      <div className='flex flex-wrap  mb-10 p-5 w-full shadow-2xl rounded-lg'>
        <ImmunizationDetails/>
      </div>
      <div className='flex flex-wrap  mb-10 p-5 w-full shadow-2xl rounded-lg'>
        <LabTestDetails/>
      </div>
      <div className='flex flex-wrap  mb-10 p-5 w-full shadow-2xl rounded-lg'>
        <MedicalHistoryDetails/>
      </div>
      <div className='flex flex-wrap  mb-10 p-5 w-full shadow-2xl rounded-lg'>
        <SurgeryDetails/>
      </div>
      <div className='flex flex-wrap  mb-10 p-5 w-full shadow-2xl rounded-lg'>
        <VitalSignsDetails/>
      </div>
      <div className='flex flex-wrap  mb-10 p-5 w-full shadow-2xl rounded-lg'>
        <PhysicalDetails/>
      </div>
      </div>
      ))}
      </div>
      ) : (
        <div className="flex items-center justify-center h-48">
          <div className="text-md font-medium text-gray-500 dark:text-gray-400">
            No Details yet
          </div>
        </div>
      )}
    </div>

  );
};

export default HealthDetails;
