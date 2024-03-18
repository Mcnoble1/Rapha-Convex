import { useState, useEffect } from "react";
import { useQuery, useMutation } from "convex/react";
import { api } from "../../convex/_generated/api";
import Breadcrumb from '../components/Breadcrumb';
import Sidebar from '../components/Sidebar';
import DoctorSidebar from '../components/DoctorSidebar';
import Header from '../components/Header';
import { useNavigate } from 'react-router-dom'; 
import DoctorImage from '../images/user/3.png';
import PatientImage from '../images/user/4.png';
import './ai.css';

export default function Home() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const userType = localStorage.getItem('userType');
  let doctorId: any, patientId: any;
  const navigate = useNavigate();

  const queryString = window.location.search;
  const urlParams = new URLSearchParams(queryString);

  const name = urlParams.get('name')

  if (userType === 'patient') {
    doctorId = urlParams.get('doctorId')
    patientId = localStorage.getItem('userId');
  } else {
    doctorId = localStorage.getItem('userId');
    patientId = urlParams.get('patientId');
  }

  const messages = useQuery(api.messages.list, { patientId: patientId, doctorId: doctorId });
  const sendMessage = useMutation(api.messages.send);

  const [noteValue, setNoteValue] = useState("");
  const [errorMessage, setErrorMessage] = useState('');
  
  useEffect(() => {
    // Make sure scrollTo works on button click in Chrome
    setTimeout(() => {
      window.scrollTo({ top: document.body.scrollHeight, behavior: "smooth" });
    }, 0);
  }, [messages]);

  

  return (
    <div className="dark:bg-boxdark-2 dark:text-bodydark">
      <div className="flex h-screen overflow-hidden">
        {userType === 'patient' ? (
          <Sidebar sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />
        ) : (
          <DoctorSidebar sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />
        )}
        <div className="relative flex flex-1 flex-col overflow-y-auto overflow-x-hidden">
          <Header sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />
          <main>
            <div className="mx-auto max-w-screen-2xl p-4 md:p-6 2xl:p-10">
              <div className="mb-6 flex flex-row gap-3 sm:flex-row sm:items-center sm:justify-between">
                <Breadcrumb pageName="Chat" />
                <div>
                  {userType === 'patient' ? (
                    <button 
                    // className="inline-flex mr-5 items-center justify-center rounded-full bg-primary py-3 px-10 text-center font-medium text-white hover:bg-opacity-90 lg:px-8 xl:px-10"
                    >
                      {/* Share Record */}
                  </button>
                  ) : (
                    <button 
                    onClick={() => navigate('/doctor/patient?patientId=' + patientId)}                      
                    className="inline-flex mr-5 items-center justify-center rounded-full bg-primary py-3 px-10 text-center font-medium text-white hover:bg-opacity-90 lg:px-8 xl:px-10">
                      View Record
                  </button>
                  )}                
                </div>    
              </div>
              <div className="flex flex-col gap-10">
                

              <div className=" rounded-sm border border-stroke bg-white shadow-default dark:border-strokedark dark:bg-boxdark xl:flex">       
                  <div className="flex h-full flex-col border-l border-stroke dark:border-strokedark xl:w-3/4">
                      <div className="sticky flex items-center justify-between border-b border-stroke px-6 py-4.5 dark:border-strokedark">
                        <div className="flex items-center">
                            <div className="mr-4.5 h-13 w-full max-w-13 overflow-hidden rounded-full">
                              {userType === 'patient' ? (
                                <img src={DoctorImage} alt="avatar" className="h-full w-full object-cover object-center"/>
                              ) : (
                                <img src={PatientImage} alt="avatar" className="h-full w-full object-cover object-center"/>
                              )}
                              </div>
                            <div>
                                {userType === 'patient' ? (
                                  <h5 className="font-medium text-black dark:text-white">Dr. {name}</h5>
                                ) : (
                                  <h5 className="font-medium text-black dark:text-white">{name}</h5>
                                )}
                            </div>
                        </div>     
                      </div>


                      <div className=" chat ">
                          {messages?.map((message) => (
                            <article
                            key={message._id}
                            className={message.author === "patient" ? "message-mine" : ""}
                            >
                            <div>{message.author}</div>

                            <p>
                                {message.body}
                            </p>
                            </article>
                        ))}
                        <form
                          className="flex items-center justify-between space-x-4.5"
                          onSubmit={async (e) => {
                            e.preventDefault();
                            if (userType !== null) {
                              await sendMessage({
                                body: noteValue,
                                author: userType,
                                patientId: patientId,
                                doctorId: doctorId,
                              });
                              setNoteValue("");
                            }
                          }}
                        >
                            <div className="relative w-full">
                              <input  
                                type="text" 
                                placeholder="Type something here" 
                                value={noteValue}
                                name="note"
                                id="note"
                                aria-label="Note"
                                onChange={(e) => {
                                setNoteValue(e.target.value);
                                if (e.target.value.trim()) {
                                  setErrorMessage("");
                                }
                              }}
                              onFocus={() => setNoteValue("")}
                                className="h-13 w-full rounded-md border border-stroke bg-gray pl-5 pr-19 text-black placeholder-body outline-none focus:border-primary dark:border-strokedark dark:bg-boxdark-2 dark:text-white"
                              />
                            </div>
                            <button type="submit" disabled={!noteValue} className="flex h-13 w-full max-w-13 items-center justify-center rounded-md bg-primary text-white hover:bg-opacity-90">
                              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                  <path d="M22 2L11 13" stroke="white" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"></path>
                                  <path d="M22 2L15 22L11 13L2 9L22 2Z" stroke="white" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"></path>
                              </svg>
                            </button>
                            <p
                            className="error-message"
                            style={{
                              opacity: errorMessage ? "1" : "0",
                              maxHeight: errorMessage ? "50px" : "0",
                            }}
                          >
                            {errorMessage}
                          </p>
                        </form>
                      </div>

                  </div>
                </div>

              </div>
              </div>
          </main>
        </div>
      </div>
    </div>
  );
}



