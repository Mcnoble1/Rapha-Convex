import { useState, useRef, ChangeEvent, FormEvent } from 'react';
import { toast } from 'react-toastify'; 
import { useQuery, useMutation } from "convex/react";
import { api } from "../../convex/_generated/api";
import 'react-toastify/dist/ReactToastify.css'; 
import '../pages/signin.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPlus, faShare, faAngleDown } from '@fortawesome/free-solid-svg-icons';

const MedicalHistoryDetails = (props) => {
  
  const [isCardOpen, setCardOpen] = useState(false);
  const [popupOpen, setPopupOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [sharePopupOpen, setSharePopupOpen] = useState(false);
  const [userToDeleteId, setUserToDeleteId] = useState<number | null>(null);
  const [isDeleteConfirmationVisible, setDeleteConfirmationVisible] = useState(false);
  const trigger = useRef<HTMLButtonElement | null>(null);
  const popup = useRef<HTMLDivElement | null>(null);
  const [selectedFileName, setSelectedFileName] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const [medicalHistoryData, setMedicalHistoryData] = useState<{ medication: string; medicalCondition: string; patientId: string; status: string; }>({
    medication: '',
    patientId: '',
    status: '',
    medicalCondition: '',
  }); 

  const userType = localStorage.getItem("userType");

  const patientId = props.patientId;

  const getMedicalHistory = useQuery(api.healthRecord.getMedicalHistory, { patientId: patientId });
  const createMedicalHistory = useMutation(api.healthRecord.createMedicalHistory);
  // const updateMedicalHistory = useMutation(api.healthRecord.updateMedicalHistory);
  const deleteMedicalHistory = useMutation(api.healthRecord.deleteMedicalHistory);

  const showDeleteConfirmation = (patientId: string) => {
    setUserToDeleteId(patientId);
    setDeleteConfirmationVisible(true);
  };

  const hideDeleteConfirmation = () => {
    setUserToDeleteId(null);
    setDeleteConfirmationVisible(false);
  };

  const handleInputChange = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
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
  
    setMedicalHistoryData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleAddProfile = async (e: FormEvent) => {
    e.preventDefault();
  
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

    const medicalHistorydata = new FormData();
    medicalHistorydata.append('medication', medicalHistoryData.medication);
    medicalHistorydata.append('medicalCondition', medicalHistoryData.medicalCondition);
    medicalHistorydata.append('status', medicalHistoryData.status);
  
    try {
     await createMedicalHistory({ ...medicalHistoryData, patientId: patientId })
      setMedicalHistoryData({
        medication: '',
        medicalCondition: '',
        status: '',
        patientId: '',
      })
  
      setPopupOpen(false);
      toast.success('Successfully created medicalHistory record', {
        position: toast.POSITION.TOP_RIGHT,
        autoClose: 3000, 
      });

    } catch (err) {
        console.error('Error in handleCreateCause:', err);
        toast.error('Error in handleAddProfile. Please try again later.', {
          position: toast.POSITION.TOP_RIGHT,
          autoClose: 5000, // Adjust the duration as needed
        });
      } 
  };

  const deleteMedicalHistoryDetails = async (patientId: any) => {
    try {
      await deleteMedicalHistory({ id: patientId});
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
          MedicalHistory Information
        </div>
        <div className="flex flex-row mb-5 items-center gap-10 justify-end">
        {userType === 'doctor' && (
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
                      <h2 className="text-xl px-6.5 pt-6.5 font-semibold mb-4">MedicalHistory Details</h2>
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
                          Medication
                        </label>
                        <div className={`relative ${medicalHistoryData.medication ? 'bg-light-blue' : ''}`}>
                        <input
                          type="text"
                          name="medication"
                          required
                          value={medicalHistoryData.medication}
                          onChange={handleInputChange}
                          placeholder="John Doe"
                          className="w-full rounded-lg border-[1.5px] border-stroke bg-transparent py-2 px-5 font-medium outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:focus-border-primary"/>
                        </div>
                      </div>

                      <div className="w-full xl:w-1/2">
                        <label className="mb-2.5 block text-black dark:text-white">
                          Medical Condition
                        </label>
                        <div className={`relative ${medicalHistoryData.medicalCondition ? 'bg-light-blue' : ''}`}>
                        <input
                           type="text" 
                          name="medicalCondition"
                          required
                          value={medicalHistoryData.medicalCondition}
                          placeholder='Severity'
                          onChange={handleInputChange}
                          className="w-full rounded-lg border-[1.5px] border-stroke bg-transparent py-2 px-5 font-medium outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:focus-border-primary"/>
                        </div>
                      </div> 

                      <div className="w-full xl:w-3/5">
                        <label className="mb-2.5 block text-black dark:text-white">
                          Status
                        </label>
                        <div className={`relative ${medicalHistoryData.status ? 'bg-light-blue' : ''}`}>
                        <input
                            type='text'
                              name="status"
                              value={medicalHistoryData.status}
                              onChange={handleInputChange}
                              required
                              placeholder='Reaction'
                              className="w-full rounded-lg border-[1.5px] border-stroke bg-transparent py-2 px-5 font-medium outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:focus-border-primary"/>
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
            {getMedicalHistory != null && getMedicalHistory?.length > 0 ? (
            <>
            {getMedicalHistory?.map((user, index) => (
          <div className="flex w-full" key={index}>
            <div className='w-1/3 mb-5'>
              <span className="text-xl">Medication</span>
              <h4 className="text-xl mt-1 font-medium text-black dark:text-white">
                {user.medication}
              </h4>
            </div>

            <div className='w-1/3 mb-5'>
              <span className="text-xl">Medical Condition</span>
              <h4 className="text-xl mt-1 font-medium text-black dark:text-white">
                {user.medicalCondition}
              </h4>
            </div>

            <div className='w-1/3 mb-5'>
              <span className="text-xl">Status</span>
              <h4 className="text-xl mt-1 font-medium text-black dark:text-white">
                {user.status}
              </h4>
            </div>

            <div className='w-1/3 mb-5'>
              <span className="text-xl">Timestamp</span>
              <h4 className="text-xl mt-1 font-medium text-black dark:text-white">
                {formatDateTime(user._creationTime)}
              </h4>
            </div>

            {userType === 'doctor' && (
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
                          deleteMedicalHistoryDetails(user._id);
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
                  No MedicalHistory Information
                </p>
              </div>
            </div>
          )}
        </>
      )}
    </>
  );

};

export default MedicalHistoryDetails;
