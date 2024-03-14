import { useState, useRef, ChangeEvent, FormEvent } from 'react';
import { useQuery, useMutation } from "convex/react";
import { api } from "../../convex/_generated/api";
import { toast } from 'react-toastify'; 
import 'react-toastify/dist/ReactToastify.css'; 
import '../pages/signin.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPlus, faShare, faAngleDown } from '@fortawesome/free-solid-svg-icons';

const PhysicalDetails = () => {
  
  const [isCardOpen, setCardOpen] = useState(false);
  const [popupOpen, setPopupOpen] = useState(false);
  const [sharePopupOpen, setSharePopupOpen] = useState(false);
  const [userToDeleteId, setUserToDeleteId] = useState<number | null>(null);
  const [isDeleteConfirmationVisible, setDeleteConfirmationVisible] = useState(false);
  const trigger = useRef<HTMLButtonElement | null>(null);
  const popup = useRef<HTMLDivElement | null>(null);
  const [loading, setLoading] = useState(false);
  const [selectedFileName, setSelectedFileName] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const [physicalData, setPhysicalData] = useState<{ patientId: string, height: string; weight: string; bmi: string; genotype: string; bloodGroup: string; rhesusFactor: string; }>({
    height: '',
    weight: '',
    bmi: '',
    genotype: '',
    bloodGroup: '',
    rhesusFactor: '',
    patientId: '',
  }); 

  const userId = localStorage.getItem("userId");
  const userType = localStorage.getItem("userType");

  const getPhysical = useQuery(api.healthRecord.getPhysicalDetails, { patientId: userId });
  const createPhysical = useMutation(api.healthRecord.createPhysicalDetails);
  // const updatePhysical = useMutation(api.healthRecord.updatePhysicalDetails);
  const deletePhysical = useMutation(api.healthRecord.deletePhysicalDetails);

  const showDeleteConfirmation = (userId: string) => {
    setUserToDeleteId(userId);
    setDeleteConfirmationVisible(true);
  };

  const hideDeleteConfirmation = () => {
    setUserToDeleteId(null);
    setDeleteConfirmationVisible(false);
  };

  const handleInputChange = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
  
    const file = e.target.files?.[0];
  
      if (file) {
        setSelectedFileName(file.name);
      }
  
      if (name === 'phone' ) {
        const phoneRegex = /^[+]?[0-9\b]+$/;
          
        if (!value.match(phoneRegex) && value !== '') {
          return;
        }
      } else if (name === 'name' || name === 'nationality' || name === 'language') {
        const letterRegex = /^[A-Za-z\s]+$/;
        if (!value.match(letterRegex) && value !== '') {
          return;
        }
      }
  
    setPhysicalData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleAddProfile = async (e: FormEvent) => {
    e.preventDefault();
    setLoading(true); 
  
    // const requiredFields = ['name', 'gender', 'phone', 'nationality', 'language', 'address'];
    // const emptyFields = requiredFields.filter((field) => !formData[field]);
  
    // if (emptyFields.length > 0) {
    //   toast.error('Please fill in all required fields.', {
    //     position: toast.POSITION.TOP_RIGHT,
    //     autoClose: 3000, 
    //   });
    //   requiredFields.forEach((field) => {
    //     if (!formData[field]) {
    //       const inputElement = document.querySelector(`[name="${field}"]`);
    //       if (inputElement) {
    //         inputElement.parentElement?.classList.add('error-outline');
    //       }
    //     }
    //   });
    //   setLoading(false);
    //   return; 
    // }

    const physicaldata = new FormData();
    physicaldata.append('height', physicalData.height);
    physicaldata.append('weight', physicalData.weight);
    physicaldata.append('bmi', physicalData.bmi);
    physicaldata.append('genotype', physicalData.genotype);
    physicaldata.append('bloodGroup', physicalData.bloodGroup);
    physicaldata.append('rhesusFactor', physicalData.rhesusFactor);

  
    try {
      await createPhysical({ ...physicalData, patientId: userId });

      setPhysicalData({
        height: '',
        weight: '',
        bmi: '',
        genotype: '',
        bloodGroup: '',
        rhesusFactor: '',
        patientId: '',
      })
  
      setPopupOpen(false);
      toast.success('Successfully created physical record', {
        position: toast.POSITION.TOP_RIGHT,
        autoClose: 3000, 
      });
  
      setLoading(false);
    } catch (err) {
        console.error('Error in handleCreateCause:', err);
        toast.error('Error in handleAddProfile. Please try again later.', {
          position: toast.POSITION.TOP_RIGHT,
          autoClose: 3000,
        });
        setLoading(false);
      } 
  };

  const deletePhysicalDetails = async (userId: any) => {
    try {
      await deletePhysical({ id: userId});
      toast.success('Successfully deleted record', {
        position: toast.POSITION.TOP_RIGHT,
        autoClose: 3000, 
      });
      hideDeleteConfirmation();
    } catch (error) {
      console.error('Error in deleting record:', error);
      toast.error('Error in deleting record:', {
        position: toast.POSITION.TOP_RIGHT,
        autoClose: 3000, 
      });
    }
  };

  const formatDateTime = (date: any) => {
    const d = new Date(date);
    return d.toLocaleString();
  }

   return (
    <>
      <div className="flex flex-row gap-10 w-full bg-white dark:border-strokedark dark:bg-boxdark">
        <div className='w-full mb-5 font-medium text-black text-xl'>
          Physical Information
        </div>
        <div className="flex flex-row mb-5 items-center gap-10 justify-end">
        {userType === 'patient' && (
            <>
          <button
            ref={trigger}
            onClick={() => setPopupOpen(!popupOpen)}
            className=""
          >
            <FontAwesomeIcon icon={faPlus} />
          </button>
          {popupOpen && (
                <div
                  ref={popup}
                  className="fixed inset-0 flex items-center justify-center z-50 bg-black bg-opacity-50"
                >
                  <div
                    className="bg-white lg:mt-15 lg:w-1/2 rounded-lg pt-3 px-4 shadow-md"
                    style={{ maxHeight: 'calc(100vh - 200px)', overflowY: 'scroll' }}
                  >
                    <div className="flex flex-row justify-between">
                      <h2 className="text-xl px-6.5 pt-6.5 font-semibold mb-4">Physical Details</h2>
                      <div className="flex justify-end">
                        <button
                          onClick={() => setPopupOpen(false)} 
                          className="text-blue-500 hover:text-gray-700 focus:outline-none"
                        >
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            className="h-5 w-5 fill-current bg-primary rounded-full p-1 hover:bg-opacity-90"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="white"
                          >
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                          </svg>
                        </button>
                      </div>
                    </div>
                    <form>
                    <div className= "rounded-sm px-6.5 bg-white dark:border-strokedark dark:bg-boxdark">
                      <h3 className="mb-2.5 block font-semibold dark:text-white"></h3>
                    <div className="mb-4.5 flex flex-col gap-6 xl:flex-row">
                    <div className="w-full xl:w-3/5">
                        <label className="mb-2.5 block text-black dark:text-white">
                          Height (CM)
                        </label>
                        <div className={`relative ${physicalData.height ? 'bg-light-blue' : ''}`}>
                        <input
                          type="number"
                          name="height"
                          required
                          value={physicalData.height}
                          onChange={handleInputChange}
                          placeholder="150"
                          className="w-full rounded-lg border-[1.5px] border-stroke bg-transparent py-2 px-5 font-medium outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:focus-border-primary"/>
                        </div>
                      </div>

                      <div className="w-full xl:w-1/2">
                        <label className="mb-2.5 block text-black dark:text-white">
                          Weight (KG)
                        </label>
                        <div className={`relative ${physicalData.weight ? 'bg-light-blue' : ''}`}>
                        <input
                           type="text" 
                          name="number"
                          required
                          value={physicalData.weight}
                          placeholder='75'
                          onChange={handleInputChange}
                          className="w-full rounded-lg border-[1.5px] border-stroke bg-transparent py-2 px-5 font-medium outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:focus-border-primary"/>
                        </div>
                      </div> 

                      <div className="w-full xl:w-3/5">
                        <label className="mb-2.5 block text-black dark:text-white">
                          BMI
                        </label>
                        <div className={`relative ${physicalData.bmi ? 'bg-light-blue' : ''}`}>
                        <input
                            type='text'
                              name="bmi"
                              value={physicalData.bmi}
                              onChange={handleInputChange}
                              required
                              placeholder='40'
                              className="w-full rounded-lg border-[1.5px] border-stroke bg-transparent py-2 px-5 font-medium outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:focus-border-primary"/>
                          </div>
                      </div>
                    </div>

                    <div className="mb-4.5 flex flex-col gap-6 xl:flex-row">
                                           
                      <div className="w-full xl:w-2/5">
                        <label className="mb-2.5 block text-black dark:text-white">
                          Genotype
                        </label>
                        <div className={`relative ${physicalData.genotype ? 'bg-light-blue' : ''}`}>
                        <select
                          type="text"
                          name="genotype"
                          value={physicalData.genotype}
                          required
                          onChange={handleInputChange}
                          placeholder="Notes"
                          className="w-full rounded-lg border-[1.5px] border-stroke bg-transparent py-2 px-5 font-medium outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:focus-border-primary">
                          <option value="">Select Genotype</option>
                          <option value="AA">AA</option>
                          <option value="AS">AS</option>
                          <option value="SS">SS</option>
                          <option value="SC">SC</option>
                          <option value="AC">AC</option>
                        </select>
                        </div>
                      </div>
                    </div>                     
                    </div>

                    </form>
                      <button
                        type="button"
                        onClick={handleAddProfile}
                        disabled={loading}
                        className={`mr-5 mb-5 inline-flex items-center justify-center gap-2.5 rounded-full bg-primary py-4 px-10 text-center font-medium text-white hover:bg-opacity-90 lg:px-8 xl:px-10 ${loading ? 'opacity-50 cursor-not-allowed' : ''}`}
                      >
                        {loading ? (
                          <div className="flex items-center">
                            <div className="spinner"></div>
                            <span className="pl-1">Creating...</span>
                          </div>
                        ) : (
                          <>Add Details</>
                        )}
                      </button>
                  </div>
                </div>
              )}
          </>
          )}

          <button
            onClick={() => setCardOpen(!isCardOpen)}
            className=""
          >
            <FontAwesomeIcon icon={faAngleDown} />
          </button>
        </div>
      </div>

      {isCardOpen && (
        <>
            {getPhysical != null && getPhysical?.length > 0 ? (
            <>
            {getPhysical?.map((user, index) => (
          <div className="flex w-full" key={index}>
            <div className='w-1/3 mb-5'>
              <span className="text-xl">Height</span>
              <h4 className="text-xl mt-1 font-medium text-black dark:text-white">
                {user.height}
              </h4>
            </div>

            <div className='w-1/3 mb-5'>
              <span className="text-xl">Weight</span>
              <h4 className="text-xl mt-1 font-medium text-black dark:text-white">
                {user.weight}
              </h4>
            </div>

            <div className='w-1/3 mb-5'>
              <span className="text-xl">BMI</span>
              <h4 className="text-xl mt-1 font-medium text-black dark:text-white">
                {user.bmi}
              </h4>
            </div>

            <div className='w-1/3 mb-5'>
              <span className="text-xl">Genotype</span>
              <h4 className="text-xl mt-1 font-medium text-black dark:text-white">
                {user.genotype}
              </h4>
            </div>

            <div className='w-1/3 mb-5'>
              <span className="text-xl">Blood Group</span>
              <h4 className="text-xl mt-1 font-medium text-black dark:text-white">
                {user.bloodGroup}
              </h4>
            </div>

            <div className='w-1/3 mb-5'>
              <span className="text-xl">Rhesus Factor</span>
              <h4 className="text-xl mt-1 font-medium text-black dark:text-white">
                {user.rhesusFactor}
              </h4>
            </div>

            <div className='w-1/3 mb-5'>
              <span className="text-xl">Timestamp</span>
              <h4 className="text-xl mt-1 font-medium text-black dark:text-white">
                {formatDateTime(user._creationTime)}
              </h4>
            </div>

            {userType === 'patient' && (
            <>
            <button
                onClick={() => showDeleteConfirmation(user._id)}
                className="rounded-lg bg-danger py-0 px-3 h-10 text-center font-medium text-white hover-bg-opacity-90"
              >
                Delete
              </button>
              {isDeleteConfirmationVisible && (
                <div className="fixed inset-0 flex items-center justify-center z-50 bg-black bg-opacity-20">
                  <div className="bg-white p-5 rounded-lg shadow-md">
                    <p>Are you sure you want to delete your record?</p>
                    <div className="mt-4 flex justify-end">
                      <button
                        onClick={hideDeleteConfirmation}
                        className="mr-4 rounded bg-primary py-2 px-3 text-white hover:bg-opacity-90"
                      >
                        Cancel
                      </button>
                      <button
                        onClick={() => {
                          hideDeleteConfirmation();
                          deletePhysicalDetails(user._id);
                        }}
                        className="rounded bg-danger py-2 px-3 text-white hover:bg-opacity-90"
                      >
                        Confirm
                      </button>
                    </div>
                  </div>
                </div>
              )}
               </>
            )}

          </div>
           ))}
            </>
          ) : (
            <div className="flex flex-row justify-center items-center w-full h-full">
              <div className="flex p-10 flex-col justify-center items-center">
                <p className="text-md font-medium text-black dark:text-white">
                  No Physical Information
                </p>
              </div>
            </div>
          )}
        </>
      )}
    </>
  );

};

export default PhysicalDetails;
