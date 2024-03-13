import React, { useEffect, useRef, useState, ChangeEvent, FormEvent } from 'react';
import { useNavigate } from 'react-router-dom'; 
import { useQuery, useMutation } from "convex/react";
import { api } from "../../../convex/_generated/api";
import Header from '../../components/Header';
import Sidebar from '../../components/Sidebar';
import Breadcrumb from '../../components/Breadcrumb';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Image from '../../images/user/3.png';
import '../signin.css';

const Doctors: React.FC = () => {
  const navigate = useNavigate();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [loading, setLoading] = useState(false);

  const [doctorsDetails, setDoctorsDetails] = useState<Id<"doctors"> | null>(null);
  const [selectedDoctor, setSelectedDoctor] = useState<Doctor | null>(null);
  const [sortDropdownVisible, setSortDropdownVisible] = useState(false);
  const [filterDropdownVisible, setFilterDropdownVisible] = useState(false);
  const [sortOption, setSortOption] = useState<string>(''); 
  const [filterOption, setFilterOption] = useState<string>(''); 
  const [search, setSearch] = useState('');
  const [popupOpenMap, setPopupOpenMap] = useState<{ [key: number]: boolean }>({});

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

  useEffect(() => {
    // fetchDoctors();
  }, []);


  const doctors = useQuery(api.doctors.getDoctors);
    // setDoctorsDetails(doctors);
    // console.log('DoctorList:', doctors);

//   const fetchDoctors = () => {
//   try {
//     const doctors = useQuery(api.doctors.getDoctors);
//     setDoctorsDetails(doctors);
//     console.log('DoctorList:', doctors);
//     toast.success('Doctors fetched successfully.', {
//       position: toast.POSITION.TOP_RIGHT,
//       autoClose: 5000,
//     });
//   } catch (err) {
//     console.error('Error in fetchDoctorDetails:', err);
//     toast.error('Error in fetchDoctorDetails. Please try again later.', {
//       position: toast.POSITION.TOP_RIGHT,
//       autoClose: 5000,
//     });
//   };
// };
  

  return (
    <div className="dark:bg-boxdark-2 dark:text-bodydark">
      <div className="flex h-screen overflow-hidden">
        <Sidebar sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />
        <div className="relative flex flex-1 flex-col overflow-y-auto overflow-x-hidden">
          <Header sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />
          <main>
            <div className="mx-auto max-w-screen-2xl p-4 md:p-6 2xl:p-10">
              <div className="mb-6 flex flex-row gap-0 lg:gap-3 sm:flex-row sm:items-center sm:justify-between">
                <Breadcrumb pageName="All Doctors" />
                <div>
                  <button 
                    ref={trigger}
                    // onClick={() => setPatientPopupOpen(!categoryPopupOpen)}
                    className="ml-2 mr-2 inline-flex lg:mr-5 items-center justify-center rounded-full bg-primary py-3 px-10 text-center font-medium text-white hover:bg-opacity-90 lg:px-8 xl:px-10">
                      Sort
                  </button>

                  <button
                  ref={trigger}
                  // onClick={() => setServicePopupOpen(!servicePopupOpen)}
                  className="inline-flex items-center justify-center rounded-full bg-primary py-3 px-10 text-center font-medium text-white hover:bg-opacity-90 lg:px-8 xl:px-10">
                    Filter
                  </button>
                </div>   
              </div>

              <div className="flex flex-row gap-10 ">
                    {doctors?.map((doctor: any, index: any) => (
                      <div className=" lg:w-2/5 rounded-2xl bg-white px-5 shadow-default dark:border-strokedark dark:bg-boxdark ">
                        <div className="" key={index}>
                        <div className='flex flex-row mb-1 gap-20 p-5 w-full'>
                          <div className="flex">
                            <div className="flex-shrink-0 ">
                              <img
                                src={Image}
                                alt={doctor.name}
                                className="h-30 w-30 rounded-full" 
                              />
                            </div>
                          </div>
                          <div className=''>
                              <div className='mb-2 flex' >
                                <p className="text-2xl font-bold text-black dark:text-white">
                                  {doctor.name} 
                                </p>
                                <button className={` ${doctor.status === 'Verified' ? 'bg-success' : 'bg-warning'} p-1 text-white rounded-xl ml-5`}>{doctor.status}</button>
                              </div>

                              <div className='flex flex-row gap-x-5 gap-y-2 flex-wrap'>

                                <div className='' >
                                  <p className="text-lg font-medium text-black dark:text-white">
                                    {doctor.hospital }
                                  </p>
                                </div>

                                <div className='' >
                                  <p className="text-lg font-medium text-black dark:text-white">
                                    {doctor.gender }
                                  </p>
                                </div>

                                <div className='' >
                                  <p className="text-lg font-medium text-black dark:text-white">
                                    {doctor.specialty }
                                  </p>
                                </div>

                                <div className='' >
                                  <p className="text-lg font-medium text-black dark:text-white">
                                    {doctor.yearsOfExperience } 
                                  </p>
                                </div>

                                <div className='mb-5' >
                                  <p className="text-lg font-medium text-black dark:text-white">
                                    { doctor.country }
                                  </p>
                                </div>
                              </div>      
                              <div className="relative">

                        {doctor.status === 'Verified' ? (
                          <button
                            // onClick={() =>  togglePop(doctor.recordId)}  
                            onClick={() => {
                              // fetchPatientProfile(doctor.sender);
                              navigate(`/chat?did=${doctor.sender}&name=${doctor.name}`)}}                   
                            className="inline-flex items-center justify-center rounded-full bg-primary py-3 px-10 text-center font-medium text-white hover:bg-opacity-90 lg:px-8 xl:px-10"
                            >
                            Consult
                          </button>
                        ) : null }
                          
                          </div>                    
                          </div> 
                      </div>
                      </div>
                      </div>

                    ))}
              </div>

              </div>
          </main>
        </div>
      </div>
    </div>
  );
};

export default Doctors;
