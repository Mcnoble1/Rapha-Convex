import React, { useState, useRef, useEffect, ChangeEvent } from 'react';
import { useQuery, useMutation } from "convex/react";
import { api } from "../../convex/_generated/api";
import { toast } from 'react-toastify'; 
import 'react-toastify/dist/ReactToastify.css'; 
import DoctorImage from '../images/user/3.png';

const DoctorsTable: React.FC = () => {

  const [doctorsDetails, setDoctorsDetails] = useState<Doctor[]>([]);
  const [selectedDoctor, setSelectedDoctor] = useState<Doctor | null>(null);
  const [isRevokeConfirmationVisible, setRevokeConfirmationVisible] = useState(false);
  const [doctorToRevokeId, setDoctorToRevokeId] = useState<number | null>(null);
  const [sortDropdownVisible, setSortDropdownVisible] = useState(false);
  const [filterDropdownVisible, setFilterDropdownVisible] = useState(false);
  const [sortOption, setSortOption] = useState<string>(''); 
  const [updateLoading, setUpdateLoading] = useState(false);
  const [fetchDetailsLoading, setFetchDetailsLoading] = useState(false);
  const [filterOption, setFilterOption] = useState<string>(''); 
  const [loading, setLoading] = useState(false);
  const [popupOpenMap, setPopupOpenMap] = useState<{ [key: number]: boolean }>({});
  const [issueVCOpenMap, setIssueVCOpenMap] = useState<{ [key: number]: boolean }>({});
  const [vcData, setVcData] = useState<{ status: string }>({
    status: "",
  });

  const trigger = useRef<HTMLButtonElement | null>(null);
  const popup = useRef<HTMLDivElement | null>(null); 

  const togglePopup = (doctorId: string) => {
    setPopupOpenMap((prevMap) => ({
      ...prevMap,
      [doctorId]: !prevMap[doctorId],
    }));
  };
  
const closePopup = (doctorId: string) => {
  setPopupOpenMap((prevMap) => ({
    ...prevMap,
    [doctorId]: false,
  }));
};

const togglePop = (doctorId: string) => {
  setIssueVCOpenMap((prevMap) => ({
    ...prevMap,
    [doctorId]: !prevMap[doctorId],
  }));
};

const closePop = (doctorId: string) => {
setIssueVCOpenMap((prevMap) => ({
  ...prevMap,
  [doctorId]: false,
}));
};


const doctors = useQuery(api.doctors.getDoctors);
const updateDoctor = useMutation(api.doctors.updateDoctor, { doctorId, ...data, licenseStatus });


const handleInputChange = (e: ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
  const { name, value } = e.target;

  //  if (name === 'name' || name === 'nationality' ) {
  //   // Use a regular expression to allow only letters and spaces
  //   const letterRegex = /^[A-Za-z\s]+$/;
  //   if (!value.match(letterRegex) && value !== '') {
  //     // If the input value doesn't match the regex and it's not an empty string, do not update the state
  //     return;
  //   }
  // }

  setVcData((prevFormData) => ({
    ...prevFormData,
    [name]: value,
  }));
};

// const doctorDid = doctorsDetails.map((doctor) => doctor.sender);
// console.log(doctorDid);

const verifyDoctor = async (recordId: any) => {

    setVcData({
      status: "",
    });

    console.log(doctors);

    doctors.filter((doctor) => doctor._id === recordId)[0].status = 'Verified';

    console.log(doctors)

    updateDoctor(recordId, {});

};

const showRevokeConfirmation = (doctorId: string) => {
    setDoctorToRevokeId(doctorId);
    setRevokeConfirmationVisible(true);
  };

  const hideRevokeConfirmation = () => {
    setDoctorToRevokeId(null);
    setRevokeConfirmationVisible(false);
  };

  const toggleSortDropdown = () => {
    setSortDropdownVisible(!sortDropdownVisible);
  };

  const handleSort = (option: string) => {
    let sortedData = [...doctorsDetails];
    if (option === 'Verified') {
      sortedData.filter((doctor) => doctor.status === 'Verified');
    } else if (option === 'Unverified') {
      sortedData.filter((doctor) => doctor.status === 'Unverified');
    } 
    setDoctorsDetails(sortedData);
    setSortOption(option);
    setSortDropdownVisible(false);
  };

  const formatDateTime = (date: any) => {
    const d = new Date(date);
    return d.toLocaleString();
  }

  return (
    <div className="rounded-sm border border-stroke bg-white px-5 pt-6 pb-2.5 shadow-default dark:border-strokedark dark:bg-boxdark sm:px-7.5 xl:pb-1">
       <div className="flex flex-row justify-between">
      <h4 className="text-title-sm mb-4 font-semibold text-black dark:text-white">
        Doctors
     </h4>
     <div className="hidden sm:block flex flex-row justify-center">
        </div>
      <div className="flex gap-2">
        <div className="relative">
          <button
            onClick={toggleSortDropdown}
            className="inline-flex items-center justify-center rounded-full bg-primary py-3 px-10 text-center font-medium text-white hover:bg-opacity-90 lg:px-8 xl:px-10"
          >
            Filter
          </button>
          {sortDropdownVisible && (
            <div className="absolute top-12 left-0 bg-white border border-stroke rounded-b-sm shadow-lg dark:bg-boxdark">
              <ul className="py-2">
                <li
                  onClick={() => handleSort('Verified')}
                  className={`cursor-pointer px-4 py-2 ${
                    sortOption === 'Verified' ? 'bg-primary text-white' : ''
                  }`}
                >
                  Verified
                </li>
                <li
                  onClick={() => handleSort('Unverified')}
                  className={`cursor-pointer px-4 py-2 ${
                    sortOption === 'Unverified' ? 'bg-primary text-white' : ''
                  }`}
                >
                  Unverified
                </li>
              </ul>
            </div>
          )}
        </div>
      </div>
      </div>
      <div className="flex flex-col overflow-x-auto">
        <table className="min-w-full">
          <thead>
            <tr className="border-b border-stroke dark:bg-meta-4">
              {/* Header cells */}
              <th className="p-2.5 xl:p-5 text-sm font-medium text-left uppercase">Doctors Image</th>
              <th className="p-2.5 xl:p-5 text-sm font-medium text-left uppercase">Doctor Name</th>
              <th className="p-2.5 xl:p-5 text-sm font-medium text-left uppercase">Specialization</th>
              <th className="p-2.5 xl:p-5 text-sm font-medium text-left uppercase">Gender</th>
              <th className="p-2.5 xl:p-5 text-sm font-medium text-left uppercase">Status</th>
              <th className="p-2.5 xl:p-5 text-sm font-medium text left uppercase">Joined On</th>
              <th className="p-2.5 xl:p-5 text-sm font-medium text-left uppercase">Actions</th>
            </tr>
          </thead>
          <tbody>
            {/* Table body */}
            {doctors?.map((doctor, index) => (
              <tr key={doctor._id} className={`border-b border-stroke dark:border-strokedark ${index === 0 ? 'rounded-t-sm' : ''}`}>
                <td className="p-2.5 xl:p-5">
                  <div className="flex gap-3">
                    <div className="flex-shrink-0 ">
                      <img
                        src={DoctorImage}
                        alt={doctor.name}
                        className="h-12 w-12 rounded-full" // Add a class to control the image size
                      />
                    </div>
                  </div>
                </td>                
                <td className="p-2.5 xl:p-5 ">{doctor.name}</td>                
                <td className="p-2.5 xl:p-5 ">{doctor.specialty}</td>
                <td className="p-2.5 xl:p-5 ">{doctor.gender}</td>
                <td className="p-2.5 xl:p-5"><span className={` ${doctor.status === 'Verified' ? 'bg-success' : 'bg-warning'} p-2 text-white rounded-xl`}>{doctor.status}</span></td>
                <td className="p-2.5 xl:p-5 ">{formatDateTime(doctor._creationTime)}</td>
                <td className="p-2.5 xl:p-5 ">
                  <div className="flex flex-row gap-4">

                  {doctor.status === 'Verified' ? (
                    <button 
                        onClick={() => showRevokeConfirmation(doctor._id)}                      
                        className="rounded bg-danger py-2 px-3 text-white hover:bg-opacity-90">
                      Revoke
                    </button>
                    ) : (
                    <button 
                        onClick={() => togglePopup(doctor._id)}                      
                        className="rounded bg-primary py-2 px-3 text-white hover:bg-opacity-90">
                      Verify
                    </button>
                    )}
                    <button 
                        onClick={() => deleteHealthDetails(doctor._id)}                      
                        className="rounded bg-danger py-2 px-3 text-white hover:bg-opacity-90">
                      Delete
                    </button>
                     {isRevokeConfirmationVisible && (
                      <div className="fixed inset-0 flex items-center justify-center z-50 bg-black bg-opacity-20">
                        <div className="bg-white p-5 rounded-lg shadow-md">
                          <p>Are you sure you want to revoke the credential?</p>
                          <div className="mt-4 flex justify-end">
                            <button
                              onClick={hideRevokeConfirmation}
                              className="mr-4 rounded bg-primary py-2 px-3 text-white hover:bg-opacity-90"
                            >
                              Cancel
                            </button>
                            <button
                              onClick={() => {
                                hideRevokeConfirmation();
                                // deleteHealthDetails(doctor._id);
                              }}
                              className="rounded bg-danger py-2 px-3 text-white hover:bg-opacity-90"
                            >
                              Confirm
                            </button>
                          </div>
                        </div>
                      </div>
                    )}

                    {popupOpenMap[doctor._id] && (
                            <div
                              ref={popup}
                              className="fixed inset-0 flex items-center justify-center z-50 bg-black bg-opacity-50"
                            >
                              <div
                                  className="bg-white lg:mt-15 lg:w-[70%] rounded-lg pt-3 px-4 shadow-md"
                                  style={{ maxHeight: 'calc(100vh - 200px)', overflowY: 'scroll' }}
                                >              
                                    <div className="flex flex-row justify-between">
                                    <h2 className="text-xl text-black font-semibold mb-4">Doctor Details</h2>
                                    <div className="flex justify-end">
                                      <button
                                        onClick={() => closePopup(doctor._id)}
                                        className="text-blue-500 hover:text-gray-700 focus:outline-none"
                                      >
                                        <svg
                                          xmlns="http://www.w3.org/2000/svg"
                                          className="h-5 w-5 fill-current bg-primary rounded-full p-1 hover:bg-opacity-90"
                                          fill="none"
                                          viewBox="0 0 24 24"
                                          stroke="white"
                                        >
                                          <path
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                            strokeWidth="2"
                                            d="M6 18L18 6M6 6l12 12"
                                          />
                                        </svg>
                                      </button>
                                    </div>
                                  </div>
                                  <div className="" key={index}>
                                    <div className='flex mb-10 p-5 flex-wrap w-full rounded-lg'>
                                      <div className='w-1/3 mb-5' >
                                        <span className="text-xl">Name</span>
                                        <h4 className="text-xl mt-1 font-medium text-black dark:text-white">
                                          {doctor.name }
                                        </h4>
                                      </div>

                                      <div className='w-1/3 mb-5' >
                                        <span className="text-xl">Date of Birth</span>
                                        <h4 className="text-xl mt-1 font-medium text-black dark:text-white">
                                          {doctor.dateOfBirth }
                                        </h4>
                                      </div>

                                      <div className='w-1/3 mb-5' >
                                        <span className="text-xl">Gender</span>
                                        <h4 className="text-xl mt-1 font-medium text-black dark:text-white">
                                          {doctor.gender }
                                        </h4>
                                      </div>

                                      <div className='w-1/3 mb-5' >
                                        <span className="text-xl">Hospital</span>
                                        <h4 className="text-xl mt-1 font-medium text-black dark:text-white">
                                          {doctor.hospital }
                                        </h4>
                                      </div>

                                      <div className='w-1/3 mb-5' >
                                        <span className="text-xl">Specialty</span>
                                        <h4 className="text-xl mt-1 font-medium text-black dark:text-white">
                                          {doctor.specialty }
                                        </h4>
                                      </div>

                                      <div className='w-1/3 mb-5' >
                                        <span className="text-xl">License Number</span>
                                        <h4 className="text-xl mt-1 font-medium text-black dark:text-white">
                                          {doctor.registrationNumber }
                                        </h4>
                                      </div>

                                      <div className='w-1/3 mb-5' >
                                        <span className="text-xl">Identification Number</span>
                                        <h4 className="text-xl mt-1 font-medium text-black dark:text-white">
                                          {doctor.identificationNumber }
                                        </h4>
                                      </div>

                                      <div className='w-1/3 mb-5' >
                                        <span className="text-xl">Years of Experience</span>
                                        <h4 className="text-xl mt-1 font-medium text-black dark:text-white">
                                          {doctor.yearsOfExperience }
                                        </h4>
                                      </div>

                                      <div className='w-1/3 mb-5' >
                                        <span className="text-xl">Email Address</span>
                                        <h4 className="text-xl mt-1 font-medium text-black dark:text-white">
                                          {doctor.email }
                                        </h4>
                                      </div>

                                      <div className='w-1/3 mb-5' >
                                        <span className="text-xl">Phone Number</span>
                                        <h4 className="text-xl mt-1 font-medium text-black dark:text-white">
                                          {doctor.phone }
                                        </h4>
                                      </div>

                                      <div className='w-1/3 mb-5' >
                                        <span className="text-xl">Home Address</span>
                                        <h4 className="text-xl mt-1 font-medium text-black dark:text-white">
                                          {doctor.homeAddress }
                                        </h4>
                                      </div>

                                      <div className='w-1/3 mb-5' >
                                        <span className="text-xl">City</span>
                                        <h4 className="text-xl mt-1 font-medium text-black dark:text-white">
                                          {doctor.city }
                                        </h4>
                                      </div>

                                      <div className='w-1/3 mb-5' >
                                        <span className="text-xl">State</span>
                                        <h4 className="text-xl mt-1 font-medium text-black dark:text-white">
                                          {doctor.state }
                                        </h4>
                                      </div>

                                      <div className='w-1/3 mb-5' >
                                        <span className="text-xl">Country</span>
                                        <h4 className="text-xl mt-1 font-medium text-black dark:text-white">
                                          { doctor.country }
                                        </h4>
                                      </div>
                                  </div>

                                  <div className="relative">
                                    <button
                                      onClick={() =>  togglePop(doctor._id)}                      
                                      className="inline-flex mb-5 items-center justify-center rounded-full bg-primary py-3 px-10 text-center font-medium text-white hover:bg-opacity-90 lg:px-8 xl:px-10"
                                      >
                                      Verify
                                    </button>
                                      {issueVCOpenMap[doctor._id] && (
                                            <div
                                              ref={popup}
                                              className="fixed inset-0 flex items-center justify-center z-50 bg-black bg-opacity-90"
                                            >
                                              <div
                                                  className="bg-white lg:mt-15 lg:w-1/2 rounded-lg pt-3 px-4 shadow-md"
                                                  style={{ maxHeight: 'calc(100vh - 200px)', overflowY: 'scroll' }}
                                                >              
                                                    <div className="flex flex-row justify-between">
                                                    <h2 className="text-xl font-semibold mb-4">Certify Doctor</h2>
                                                    <div className="flex justify-end">
                                                      <button
                                                        onClick={() => closePop(doctor._id)}
                                                        className="text-blue-500 hover:text-gray-700 focus:outline-none"
                                                      >
                                                        <svg
                                                          xmlns="http://www.w3.org/2000/svg"
                                                          className="h-5 w-5 fill-current bg-primary rounded-full p-1 hover:bg-opacity-90"
                                                          fill="none"
                                                          viewBox="0 0 24 24"
                                                          stroke="white"
                                                        >
                                                          <path
                                                            strokeLinecap="round"
                                                            strokeLinejoin="round"
                                                            strokeWidth="2"
                                                            d="M6 18L18 6M6 6l12 12"
                                                          />
                                                        </svg>
                                                      </button>
                                                    </div>
                                                  </div>
                                                  <form>
                                                  <div className= "rounded-sm px-6.5 bg-white dark:border-strokedark dark:bg-boxdark">
                                                  <div className="mb-4.5 flex flex-col gap-6 xl:flex-row">
                                                  <div className="w-full xl:w-3/5">
                                                      <label className="mb-2.5 block text-black dark:text-white">
                                                        License Status
                                                      </label>
                                                      <div className={`relative ${vcData.specialty ? 'bg-light-blue' : ''}`}>
                                                      <select
                                                          name="specialty"
                                                          value={vcData.specialty}
                                                          onChange={handleInputChange}
                                                          required
                                                          className="w-full rounded-lg border-[1.5px] border-stroke bg-transparent py-2 px-5 font-medium outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:focus-border-primary">
                                                          <option value="">Set Status</option>                        
                                                          <option value="Verified">Verified</option>
                                                          <option value="Unverified">Unverified</option>
                                                        </select> 
                                                      </div>
                                                    </div>

                                                   
                                                   </div>    
                                                  </div>
                                                  </form>
                                                <button
                                                  type="button"
                                                  onClick={() => verifyDoctor(doctor._id)}
                                                  disabled={updateLoading}
                                                  className={`mr-5 mb-5 inline-flex items-center justify-center gap-2.5 rounded-full bg-primary py-4 px-10 text-center font-medium text-white hover:bg-opacity-90 lg:px-8 xl:px-10 ${updateLoading ? 'opacity-50 cursor-not-allowed' : ''}`}
                                                >
                                                  {updateLoading ? (
                                                    <div className="flex items-center">
                                                      <div className="spinner"></div>
                                                      <span className="pl-1">Verifying...</span>
                                                    </div>
                                                  ) : (
                                                    <>Verify</>
                                                  )}
                                                </button>
                                                </div>
                                            </div>
                                          )}
                                  </div>
                                  </div>
                                </div>
                            </div>
                          )}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default DoctorsTable;
