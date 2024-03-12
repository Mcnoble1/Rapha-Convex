import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { SignInButton } from "@clerk/clerk-react";
import heroImage from '../images/health.png';
import one from '../images/onee.png';
import two from '../images/two.png';
import three from '../images/three.png';
import four from '../images/four.png';
import five from '../images/five.png';
import six from '../images/six.png';

const Homepage = () => {

  const [userType, setUserType] = useState(null);

  const setUserTypeAndRedirect = (type) => {
    localStorage.setItem("userType", type);
    setUserType(type);
  };

  const navigate = useNavigate();
  
  const [isDeleteConfirmationVisible, setDeleteConfirmationVisible] = useState(false);

  const showDeleteConfirmation = () => {
    setDeleteConfirmationVisible(true);
  };

  const hideDeleteConfirmation = () => {
    setDeleteConfirmationVisible(false);
  };


  return (
    <>
    <div className="rounded-sm bg-primary shadow-default dark:bg-boxdark">
      <div className='p-20 lg:p-0 flex w-full mb-0 flex-col lg:flex-row h-screen'>
        <div className="lg:pl-30 flex lg:w-1/2 flex-col items-center justify-center">
          <div className='text-center mb-7'>
          <p className="mb-5 text-5xl lg:text-6xl font-bold text-white dark:text-white">
            Welcome to Rapha
          </p>
       
          <span className="text-3xl lg:text-4xl font-medium">All Encompassing Decentralized Healthcare Platform</span>
          </div>
          <div className="flex justify-center">
          <button 
            // onClick={() => showDeleteConfirmation()}
            className=" cursor-pointer rounded-lg text-2xl border border-primary bg-success p-4 text-white transition hover:bg-opacity-90"
            >
            <div className="App" onClick={() => showDeleteConfirmation()}>
              <SignInButton mode="modal" />
            </div>
          </button>
          {isDeleteConfirmationVisible && (
              <div className="fixed inset-0 flex items-center justify-center z-50 bg-black bg-opacity-20">
                <div className="bg-white p-5 rounded-lg shadow-md">
                  <p>Choose your Role in the Rapha Ecosystem</p>
                  <div className="mt-4 flex justify-center">
                    <button
                      onClick={() => {
                        hideDeleteConfirmation();
                        setUserTypeAndRedirect("patient");
                        navigate('/patient/dashboard');
                      }}
                      className="mr-4 rounded-xl bg-primary py-2 px-3 text-white hover:bg-opacity-90"
                    >
                      Patient
                    </button>
                    <button
                      onClick={() => {
                        hideDeleteConfirmation();
                        setUserTypeAndRedirect("doctor");
                        navigate('/doctor/dashboard');
                      }}
                      className="rounded-xl bg-primary py-2 px-3 text-white hover:bg-opacity-90"
                    >
                      Doctor
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>  
        </div>
        <div className="flex lg:w-1/2 items-center justify-center">
          <img src={heroImage} alt="hero" />
        </div>
      </div>

      <div className='flex w-full lg:w-[90%] lg:ml-15 pb-10 flex-col'>
        <div className="flex w-full justify-center mb-10 lg:mb-30 text-6xl font-bold text-white dark:text-white">
            What we offer
        </div>
        <div className="flex w-[90%] mx-[5%] flex-col lg:flex-row  flex-wrap">   
          <div className="flex flex-col mb-10 lg:w-1/3">
            <img src={one} alt="one" className="text-white mb-10 dark:text-white"/>
            <p className="text-center text-2xl  font-bold">
            Create and save your Health records in your personal Decentralized Web Node (DWN).
            
            </p>            
          </div>
          <div className="flex flex-col mb-10 lg:w-1/3">
          <img src={two} alt="one" className="text-white mb-10 dark:text-white"/>
            <p className="text-center text-2xl  font-bold">
            Save your files (Documents, Images, Videos) in your personal Decentralized Web Node (DWN).
            
            </p>
          </div>
          <div className="flex flex-col lg:w-1/3">
          <img src={three} alt="one" className="text-white mb-10 dark:text-white"/>
            <p className="text-center text-2xl  font-bold">
            Write Letters into the Future to yourself and others.
            </p>  
          </div>
          <div className="flex flex-col mb-10 lg:w-1/3">
            <img src={four} alt="one" className="text-white mb-10 dark:text-white"/>
            <p className="text-center text-2xl  font-bold">
            Create and save your Health records in your personal Decentralized Web Node (DWN).
            </p>            
          </div>
          <div className="flex flex-col mb-10 lg:w-1/3">
          <img src={five} alt="one" className="text-white mb-10 dark:text-white"/>
            <p className="text-center text-2xl  font-bold">
            Save your files (Documents, Images, Videos) in your personal Decentralized Web Node (DWN).
            </p>
          </div>
          <div className="flex flex-col lg:w-1/3">
          <img src={six} alt="one" className="text-white mb-10 dark:text-white"/>
            <p className="text-center text-2xl  font-bold">
            Write Letters into the Future to yourself and others.
            </p>  
          </div>
        </div>
      </div>
    </div>
  </>
  );
};

export default Homepage;

