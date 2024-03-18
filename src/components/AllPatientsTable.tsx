import React, { useState } from 'react';
import { useQuery, useMutation } from "convex/react";
import { api } from "../../convex/_generated/api";
import { useNavigate } from 'react-router-dom';
import 'react-toastify/dist/ReactToastify.css'; 
import PatientImage from '../images/user/4.png';

const PatientsTable: React.FC = () => {

  let fetchPatient;

  const navigate = useNavigate();

  const [patientsDetails, setPatientsDetails] = useState<Patient[]>([]);
  const [sortDropdownVisible, setSortDropdownVisible] = useState(false);
  const [filterDropdownVisible, setFilterDropdownVisible] = useState(false);
  const [sortOption, setSortOption] = useState<string>(''); 
  const [filterOption, setFilterOption] = useState<string>(''); 

  const userId = localStorage.getItem("userId");



  const fetchPatientsIds = useQuery(api.doctors.getPatientsId);

  console.log(fetchPatientsIds);
  const patientIds = fetchPatientsIds?.map(e => e.patientId);
  console.log(patientIds);
  
  for (let i = 0; i < patientIds?.length; i++) {
    console.log(patientIds[i]);
    fetchPatient = useQuery(api.patients.getPatient, { _id: patientIds[i] });
    console.log(fetchPatient);
   }


  const formatAge = (dateOfBirth) => {
    const today = new Date();
    const birthDate = new Date(dateOfBirth);
    let age = today.getFullYear() - birthDate.getFullYear();
    return age;
  };

  const toggleSortDropdown = () => {
    setSortDropdownVisible(!sortDropdownVisible);
  };

  const toggleFilterDropdown = () => {
    setFilterDropdownVisible(!filterDropdownVisible);
  };

  const handleSort = (option: string) => {
    let sortedData = [...patientsDetails];
    if (option === 'ascending') {
      sortedData.sort((a, b) => a.name.localeCompare(b.name));
    } else if (option === 'descending') {
      sortedData.sort((a, b) => b.name.localeCompare(a.name));
    } else if (option === 'date') {
      sortedData.sort((a, b) => a.createdAt.localeCompare(b.createdAt));
    }
   setPatientsDetails(sortedData);
    setSortOption(option);
    setSortDropdownVisible(false);
  };

  const handleFilter = (option: string) => {
    let filteredData = [...patientsDetails];
    // map over the patientsDetails and filter using the names of the patients
    if (option !== '') {
    filteredData = filteredData.filter((patient) => patient.name === option);
    } else {
      // fetchHealthDetails();
    }

   setPatientsDetails(filteredData);
    setFilterOption(option);
    setFilterDropdownVisible(false);
  };

  return (
    <div className="rounded-sm border border-stroke bg-white px-5 pt-6 pb-2.5 shadow-default dark:border-strokedark dark:bg-boxdark sm:px-7.5 xl:pb-1">
       <div className="flex flex-row justify-between">
      <h4 className="text-title-sm mb-4 font-semibold text-black dark:text-white">
        Patients
     </h4>
      <div className="flex gap-2">
        <div className="relative">
          <button
            onClick={toggleSortDropdown}
            className="inline-flex items-center justify-center rounded-full bg-primary py-3 px-10 text-center font-medium text-white hover:bg-opacity-90 lg:px-8 xl:px-10"
          >
            Sort
          </button>
          {sortDropdownVisible && (
            <div className="absolute top-12 left-0 bg-white border border-stroke rounded-b-sm shadow-lg dark:bg-boxdark">
              <ul className="py-2">
                <li
                  onClick={() => handleSort('ascending')}
                  className={`cursor-pointer px-4 py-2 ${
                    sortOption === 'ascending' ? 'bg-primary text-white' : ''
                  }`}
                >
                  Ascending Order
                </li>
                <li
                  onClick={() => handleSort('descending')}
                  className={`cursor-pointer px-4 py-2 ${
                    sortOption === 'descending' ? 'bg-primary text-white' : ''
                  }`}
                >
                  Descending Order
                </li>
                <li
                  onClick={() => handleSort('date')}
                  className={`cursor-pointer px-4 py-2 ${
                    sortOption === 'date' ? 'bg-primary text-white' : ''
                  }`}
                >
                  Date
                </li>
              </ul>
            </div>
          )}
        </div>

        <div className="relative">
          <button
            onClick={toggleFilterDropdown}
            className="inline-flex items-center justify-center rounded-full bg-primary py-3 px-10 text-center font-medium text-white hover-bg-opacity-90 lg:px-8 xl:px-10"
          >
            Filter
          </button>
          {filterDropdownVisible && (
            <div className="absolute top-12 left-0 bg-white border border-stroke rounded-b-sm shadow-lg dark:bg-boxdark">
              <ul className="py-2">
                {/* map over the patientsDetails and list the patient names as dropdown options */}
                {fetchPatient?.map((patient) => (
                  <li
                    key={patient._id}
                    onClick={() => handleFilter(patient.name)}
                    className={`cursor-pointer px-4 py-2 ${
                      filterOption === patient.name ? 'bg-primary text-white' : ''
                    }`}
                  >
                    {patient.name}
                  </li>
                ))}
                {/* add more options here */}
                  {/* clear filter */}
                <li
                  onClick={() => handleFilter('')}
                  className={`cursor-pointer px-4 py-2 ${
                    filterOption === '' ? 'bg-primary text-white' : ''
                  }`}
                >
                  Clear Filter
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
              <th className="p-2.5 xl:p-5 text-sm font-medium text-left uppercase">Patients Image</th>
              <th className="p-2.5 xl:p-5 text-sm font-medium text-left uppercase">Patient Name</th>
              <th className="p-2.5 xl:p-5 text-sm font-medium text-left uppercase">Age</th>
              <th className="p-2.5 xl:p-5 text-sm font-medium text-left uppercase">Actions</th>
            </tr>
          </thead>
          <tbody>
            {/* Table body */}
            {fetchPatient?.map((patient, index) => (
              <tr key={patient._id} className={`border-b border-stroke dark:border-strokedark ${index === 0 ? 'rounded-t-sm' : ''}`}>
                <td className="p-2.5 xl:p-5">
                  <div className="flex gap-3">
                    <div className="flex-shrink-0 ">
                      <img
                        src={PatientImage}
                        alt={patient.name}
                        className="h-12 w-12 rounded-full" // Add a class to control the image size
                      />
                    </div>
                  </div>
                </td>                
                <td className="p-2.5 xl:p-5 ">{patient.name}</td>              
                <td className="p-2.5 xl:p-5 ">{formatAge(patient.dateOfBirth)}</td>
                <td className="p-2.5 xl:p-5 ">
                  <div className="flex flex-row gap-4">
                  <button 
                        onClick={() =>  navigate(`/chat?patientId=${patient._id}&name=${patient.name}`)}               
                        className="rounded bg-primary py-2 px-3 text-white hover:bg-opacity-90">
                      Chat
                    </button>

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

export default PatientsTable;
