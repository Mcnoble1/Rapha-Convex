import { useState, useRef, ChangeEvent, useContext, FormEvent, useEffect } from 'react';
import Sidebar from '../../components/DoctorSidebar.tsx';
import Header from '../../components/Header.tsx';
import CoverOne from '../../images/entertainment.png';
import userSix from '../../images/user/1.png';
import { toast } from 'react-toastify'; 
import 'react-toastify/dist/ReactToastify.css'; 


const Profile = () => {

  const [sidebarOpen, setSidebarOpen] = useState(false);
  // const { web5, myDid, profileProtocolDefinition } = useContext( Web5Context);

  const [usersDetails, setUsersDetails] = useState<User[]>([]);
  const [signedVcJwt, setSignedVcJwt] = useState("");
  const [loading, setLoading] = useState(false);
  const [popupOpen, setPopupOpen] = useState(false);
  const [recipientDid, setRecipientDid] = useState("");
  const [sharePopupOpen, setSharePopupOpen] = useState(false);
  const [shareLoading, setShareLoading] = useState(false);
  const [updateLoading, setUpdateLoading] = useState(false);
  const [userToDeleteId, setUserToDeleteId] = useState<number | null>(null);
  const [isDeleteConfirmationVisible, setDeleteConfirmationVisible] = useState(false);
  const [selectedFileName, setSelectedFileName] = useState<string | null>(null);
  const [fetchDetailsLoading, setFetchDetailsLoading] = useState(false);
  const [popupOpenMap, setPopupOpenMap] = useState<{ [key: number]: boolean }>({});
  const [personalData, setPersonalData] = useState<{ name: string; yearsOfExperience: string; status: string; dateOfBirth: string; phone: string; hospital: string; specialty: string; identificationNumber: string; registrationNumber: string; gender: string; homeAddress: string; email: string; city: string; state: string; country: string; image: File | null }>({
    name: '',
    dateOfBirth: '',
    hospital: '',
    specialty: '',
    registrationNumber: '',
    identificationNumber: '',
    yearsOfExperience: '',
    gender: '',
    homeAddress: '',
    email: '',
    status: 'Unverified',
    city: '',
    state: '',
    country: '',
    phone: '',
    image: null
  }); 
  const parentId = localStorage.getItem('recordId');
  const contextId = localStorage.getItem('contextId');

  const [imageURL, setImageURL] = useState("");


  const trigger = useRef<HTMLButtonElement | null>(null);
  const popup = useRef<HTMLDivElement | null>(null); 
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  useEffect(() => {
   
    fetchHealthDetails();
    fetchPictureDetails();
    vcJWT();
   
  }, []);

  const togglePopup = (userId: string) => {
    usersDetails.map((user) => { 
      if (user.recordId === userId) {
        setPersonalData({
          name: user.name,
          dateOfBirth: user.dateOfBirth,
          gender: user.gender,
          hospital: user.hospital,
          specialty: user.specialty,
          registrationNumber: user.registrationNumber,
          yearsOfExperience: user.yearsOfExperience,
          identificationNumber: user.identificationNumber,
          homeAddress: user.homeAddress,
          email: user.email,
          city: user.city,
          state: user.state,
          country: user.country,
          phone: user.phone,
          image: user.image, 
          status: user.status,
        });
      }
    });
    setPopupOpenMap((prevMap) => ({
      ...prevMap,
      [userId]: !prevMap[userId],
    }));
  };

  const handleImageChange = (e: ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
  
    const file = e.target.files?.[0];
  
      if (file) {
        setSelectedFileName(file.name);
      }
  
    setPersonalData((prevData) => ({
      ...prevData,
      [name]: value,
    }));

    handleAddPicture(e);
  };

  const handleInputChange = (e: ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
  
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
  
    setPersonalData((prevData) => ({
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

    const personaldata = new FormData();
    personaldata.append("name", personalData.name);
    personaldata.append("dateOfBirth", personalData.dateOfBirth);
    personaldata.append("identificationNumber", personalData.identificationNumber);
    personaldata.append("hospital", personalData.hospital);
    personaldata.append("specialty", personalData.specialty);
    personaldata.append("yearsOfExperience", personalData.yearsOfExperience);
    personaldata.append("registrationNumber", personalData.registrationNumber);
    personaldata.append("gender", personalData.gender);
    personaldata.append("homeAddress", personalData.homeAddress);
    personaldata.append("email", personalData.email);
    personaldata.append("city", personalData.city);
    personaldata.append("state", personalData.state);
    personaldata.append("country", personalData.country);
    personaldata.append("phone", personalData.phone);
    personaldata.append("status", personalData.status);
  
    try {
      let record;
      // console.log(personalData);
      record = await writeProfileToDwn(personalData);
  
      if (record) {    
        console.log(record);    
        console.log(adminDid);
        const DIDs = [myDid, adminDid];
        await Promise.all(
        DIDs.map(async (did) => {
          const { status } = await record.send(did);
        })
      );
      } else {
        toast.error('Failed to create health record', {
          position: toast.POSITION.TOP_RIGHT,
          autoClose: 3000, 
          });
          setLoading(false);
        throw new Error('Failed to create health record');       
      }
  
      setPersonalData({
        name: '',
        dateOfBirth: '',
        identificationNumber: '',
        hospital: '',
        specialty: '',
        yearsOfExperience: '',
        registrationNumber: '',
        gender: '',
        homeAddress: '',
        email: '',
        status: 'Unverified',
        city: '',
        state: '',
        country: '',
        phone: '',
        image: null
      })
      fetchHealthDetails();
      setPopupOpen(false);
      toast.success('Successfully created health record', {
        position: toast.POSITION.TOP_RIGHT,
        autoClose: 3000, 
      });
  
      setLoading(false);
  
    } catch (err) {
        console.error('Error in handleCreateCause:', err);
        toast.error('Error in handleAddProfile. Please try again later.', {
          position: toast.POSITION.TOP_RIGHT,
          autoClose: 5000, // Adjust the duration as needed
        });
        setLoading(false);
      } 
  };

  const writeProfileToDwn = async (profileData) => {

    const currentDate = new Date().toLocaleDateString();
    const timestamp = `${currentDate}`;

    try {
      // console.log(profileData)
      const healthProtocol = profileProtocolDefinition;
      const { record, status } = await web5.dwn.records.write({
        data: {...profileData, timestamp: timestamp, sender: myDid },
        message: {
          protocol: healthProtocol.protocol,
          protocolPath: 'doctorProfile',
          schema: healthProtocol.types.doctorProfile.schema,
          recipient: myDid,
          published: true,
        },
      });
      console.log(record);
      if (status === 200) {
        return { ...profileData, recordId: record.id}
      } 
      // console.log('Successfully wrote doctor details to DWN:', record);
      toast.success('Doctor Profile Details written to DWN', {
        position: toast.POSITION.TOP_RIGHT,
        autoClose: 3000, 
      });
      return record;
    } catch (err) {
      console.error('Failed to write doctor profile details to DWN:', err);
      toast.error('Failed to write doctor profile details to DWN. Please try again later.', {
        position: toast.POSITION.TOP_RIGHT,
        autoClose: 3000,
      });
    }
   }; 

    
const closePopup = (userId: string) => {
  setPopupOpenMap((prevMap) => ({
    ...prevMap,
    [userId]: false,
  }));
};

const fetchHealthDetails = async () => {
  setFetchDetailsLoading(true);
  try {
    const response = await web5.dwn.records.query({
      from: myDid,
      message: {
        filter: {
            protocol: 'https://rapha.com/protocol',
            protocolPath: 'doctorProfile',
        },
      },
    });
    console.log('Health Details:', response);

    if (response.status.code === 200) {
      const healthDetails = await Promise.all(
        response.records.map(async (record) => {
          const data = await record.data.json();
          // console.log(data);
        localStorage.setItem('recordId', record.id);
        localStorage.setItem('contextId', record.contextId);
          return {
            ...data,
            recordId: record.id,
          };
        })
      );
      console.log(healthDetails)
      setUsersDetails(healthDetails);
      // console.log(healthDetails);
      // toast.success('Successfully fetched doctor details', {
      //   position: toast.POSITION.TOP_RIGHT,
      //   autoClose: 3000,
      // });
      setFetchDetailsLoading(false);
    } else {
      console.error('No doctor details found');
      toast.error('Failed to fetch doctor details', {
        position: toast.POSITION.TOP_RIGHT,
        autoClose: 3000,
      });
    }
    setFetchDetailsLoading(false);
  } catch (err) {
    console.error('Error in fetchDOctorDetails:', err);
    toast.error('Error in fetchDOctorDetails. Please try again later.', {
      position: toast.POSITION.TOP_RIGHT,
      autoClose: 5000,
    });
    setFetchDetailsLoading(false);
  };
};


const shareHealthDetails = async (recordId: string) => {
  setShareLoading(true);
  try {
    const response = await web5.dwn.records.query({
      message: {
        filter: {
          recordId: recordId,
        },
      },
    });

    if (response.records && response.records.length > 0) {
      const record = response.records[0];
      const { status } = await record.send(recipientDid);
      console.log('Send record status in shareProfile', status);
      toast.success('Successfully shared doctor record', {
        position: toast.POSITION.TOP_RIGHT,
        autoClose: 3000,
      });
      setShareLoading(false);
      setSharePopupOpen(false);
    } else {
      console.error('No record found with the specified ID');
      toast.error('Failed to share doctor record', {
        position: toast.POSITION.TOP_RIGHT,
        autoClose: 3000,
      });
    }
    setShareLoading(false);
  } catch (err) {
    console.error('Error in shareProfile:', err);
    toast.error('Error in shareProfile. Please try again later.', {
      position: toast.POSITION.TOP_RIGHT,
      autoClose: 5000,
    });
    setShareLoading(false);
  }
};

const showDeleteConfirmation = (userId: string) => {
    setUserToDeleteId(userId);
    setDeleteConfirmationVisible(true);
  };

  const hideDeleteConfirmation = () => {
    setUserToDeleteId(null);
    setDeleteConfirmationVisible(false);
  };

  const updateHealthDetails = async (recordId, data) => {
    setUpdateLoading(true);
  try {
    const response = await web5.dwn.records.query({
      message: {
        filter: {
          recordId: recordId,
        },
      },
    });

    if (response.records && response.records.length > 0) {
      const record = response.records[0];
      const updateResult = await record.update({data: data});
      togglePopup(recordId)
      if (updateResult.status.code === 202) {
        toast.success('Health Details updated successfully.', {
          position: toast.POSITION.TOP_RIGHT,
          autoClose: 3000, 
        });
        setUsersDetails(prevHealthDetails => prevHealthDetails.map(message => message.recordId === recordId ? { ...message, ...data } : message));
        setUpdateLoading(false);
      } else {
        console.error('Error updating message:', updateResult.status);
        toast.error('Error updating campaign', {
          position: toast.POSITION.TOP_RIGHT,
          autoClose: 3000, 
        });
        setUpdateLoading(false);
      }
    } else {
      console.error('No record found with the specified ID');
      toast.error('No record found with the specified ID', {
        position: toast.POSITION.TOP_RIGHT,
        autoClose: 3000, 
      });
    }
  } catch (error) {
    console.error('Error in updateHealthDetail:', error);
    toast.error('Error in updateHealthDetail:', {
      position: toast.POSITION.TOP_RIGHT,
      autoClose: 3000, 
    });
    setUpdateLoading(false);
  }
};


const deleteHealthDetails = async (recordId) => {
  try {
    const response = await web5.dwn.records.query({
      message: {
        filter: {
          recordId: recordId,
        },
      },
    });
    // console.log(response);
    if (response.records && response.records.length > 0) {
      const record = response.records[0];
      // console.log(record)
      const deleteResult = await web5.dwn.records.delete({
        message: {
          recordId: recordId
        },
      });

      const remoteResponse = await web5.dwn.records.delete({
        from: myDid,
        message: {
          recordId: recordId,
        },
      });
      // console.log(remoteResponse);
      
      if (deleteResult.status.code === 202) {
        console.log('Health Details deleted successfully');
        toast.success('Health Details deleted successfully', {
          position: toast.POSITION.TOP_RIGHT,
          autoClose: 3000, 
        });
        setUsersDetails(prevHealthDetails => prevHealthDetails.filter(message => message.recordId !== recordId));
      } else {
        console.error('Error deleting record:', deleteResult.status);
        toast.error('Error deleting record:', {
          position: toast.POSITION.TOP_RIGHT,
          autoClose: 3000, 
        });
      }
    } else {
      // console.error('No record found with the specified ID');
    }
  } catch (error) {
    console.error('Error in deleteHealthDetails:', error);
  }
};

const handleAddPicture = async (e: FormEvent) => {
  e.preventDefault();
  setLoading(true); 
    
  // const formdata = new FormData();
  // formdata.append('image', fileInputRef.current?.files?.[0], fileInputRef.current?.files?.[0].name);

  const blob = new Blob(fileInputRef.current.files, { type: "image/png" });

  try {
    let record;
    console.log(blob);
    record = await writePictureToDwn(blob);
    console.log(record);
    if (record) {
      const { status } = await record.send(myDid);
      // console.log("Send record status in handleAddPicture", status);
    } else {
      toast.error('Failed to create picture record', {
        position: toast.POSITION.TOP_RIGHT,
        autoClose: 3000, 
        });
        setLoading(false);
      throw new Error('Failed to create picture record');       
    }

    setSelectedFileName("Click to add Image")
    fetchPictureDetails();
    setPopupOpen(false);
    // toast.success('Successfully created picture record', {
    //   position: toast.POSITION.TOP_RIGHT,
    //   autoClose: 3000, 
    // });

    setLoading(false);

  } catch (err) {
      console.error('Error in handleAddPicture:', err);
      toast.error('Error in handleAddPicture. Please try again later.', {
        position: toast.POSITION.TOP_RIGHT,
        autoClose: 5000, // Adjust the duration as needed
      });
      setLoading(false);
    } 
};

   const writePictureToDwn = async (pictureData : any) => {
    try {
      console.log(pictureData)
      const pictureProtocol = profileProtocolDefinition;
      const { record, status } = await web5.dwn.records.write({
        data: pictureData,
        message: {
          protocol: pictureProtocol.protocol,
          protocolPath: 'doctorProfile/profileImage',
          schema: pictureProtocol.types.profileImage.schema,
          recipient: myDid,
          dataFormat: "image/png",
          parentId: parentId,
          contextId: contextId,
        },
      });
      console.log(record);

      if (status === 200) {
        return { ...pictureData, recordId: record.id}
      } 
      console.log('Successfully wrote picture details to DWN:', record);
      toast.success('Picture Details written to DWN', {
        position: toast.POSITION.TOP_RIGHT,
        autoClose: 3000, 
      });
      return record;
    } catch (err) {
      console.error('Failed to write picture details to DWN:', err);
      toast.error('Failed to write picture details to DWN. Please try again later.', {
        position: toast.POSITION.TOP_RIGHT,
        autoClose: 3000,
      });
    }
   }; 

   const fetchPictureDetails = async () => {
    setFetchDetailsLoading(true);
    try {
      const response = await web5.dwn.records.query({
        from: myDid,
        message: {
          filter: {
              protocol: 'https://rapha.com/protocol',
              protocolPath: 'doctorProfile/profileImage',
          },
        },
      });
      console.log('Picture Details:', response);
  
    response.records.forEach( async (imageRec) => {
    // console.log('this is the each image record', imageRec);
    // // Get the blob of the image data
    const imageId = imageRec.id
    // console.log(imageId)
     const {record, status }= await web5.dwn.records.read({
      message: {
         filter: {
          recordId: imageId,
         },
      },
      });
    // console.log ({record, status})
  
        const imageresult = await record.data.blob();
        // console.log(imageresult)
        const imageUrl = URL.createObjectURL(imageresult);
        // console.log(imageUrl)
        setImageURL(imageUrl);
      })
      // toast.success('Successfully fetched picture details', {
      //     position: toast.POSITION.TOP_RIGHT,
      //     autoClose: 3000,
      //   });
  
      setFetchDetailsLoading(false);
    } catch (err) {
      console.error('Error in fetchPictureDetails:', err);
      toast.error('Error in fetchPictureDetails. Please try again later.', {
        position: toast.POSITION.TOP_RIGHT,
        autoClose: 5000,
      });
      setFetchDetailsLoading(false);
    };
  };





  const vcJWT = async () => {
    try {
      const response = await web5.dwn.records.query({
        from: myDid,
        message: {
          filter: {
              schema: 'LicenseCredential',
              dataFormat: 'application/vc+jwt',
          },
        },
      });
      console.log('vcJWT:', response);
  
      if (response.status.code === 200) {
        const jwt = await Promise.all(
          response.records.map(async (record) => {
            const data = await record.data.text();
            console.log(data);
            setSignedVcJwt(data);
            return {
              ...data,
              recordId: record.id,
            };
          })
        );        
      } else {
        console.error('No jwt details found');
      }
    } catch (err) {
      console.error('Error in fetching jwt:', err);
    };
  };


// VC Presentation Exchange
if (signedVcJwt !== ""  && signedVcJwt !== undefined) {
const parsedVc = VerifiableCredential.parseJwt({ vcJwt: signedVcJwt });

console.log("ParsedVC:", parsedVc);

const presentationDefinition = {
  'id'                : 'presDefId123',
  'name'              : 'Rapha Medical Practitioner Presentation Definition',
  'purpose'           : 'for proving medical practitioner license',
  'input_descriptors' : [
    {
      'id'          : 'licenseStatus',
      'purpose'     : 'is your license valid?',
      'constraints' : {
        'fields': [
          {
            'path': [
              '$.credentialSubject.licenseStatus',
            ]
          }
        ]
      }
    }
  ]
};

const definitionValidation = PresentationExchange.validateDefinition({ presentationDefinition });
console.log("Definition Validation:", definitionValidation);

// Does VC Satisfy the Presentation Definition

try {
    PresentationExchange.satisfiesPresentationDefinition({vcJwts: [signedVcJwt], presentationDefinition: presentationDefinition});
    console.log('\nVC Verification successful!\n');
    usersDetails.filter((user) => user.status = 'Verified');

    toast.success('You are now a Verified Rapha Doctor', {
      position: toast.POSITION.TOP_RIGHT,
      autoClose: 3000, 
    });
  } catch (err) {
    console.log('\nVC Verification failed: ' + err.message + '\n');
    toast.success('You are not yet verified', {
      position: toast.POSITION.TOP_RIGHT,
      autoClose: 3000, 
    });
  }

  // Create Presentation Result that contains a Verifiable Presentation and Presentation Submission
const presentationResult = PresentationExchange.createPresentationFromCredentials({vcJwts: [signedVcJwt], presentationDefinition: presentationDefinition });
console.log('\nPresentation Result: ' + JSON.stringify(presentationResult));

};

  return (
    <>
      <div className="dark:bg-boxdark-2 dark:text-bodydark">
      <div className="flex h-screen overflow-hidden">
        <Sidebar sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />
        <div className="relative flex flex-1 flex-col overflow-y-auto overflow-x-hidden">
        <Header sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />
        {usersDetails.length > 0 ? (
          <main>
            {usersDetails.map((user, index) => (
            <div className="overflow-hidden rounded-sm border border-stroke bg-white shadow-default dark:border-strokedark dark:bg-boxdark">
            <div className="relative z-20 h-35 md:h-50">
              <img
                src={CoverOne}
                alt="profile cover"
                className="h-full w-full rounded-tl-sm rounded-tr-sm object-cover object-center"
              />
          </div>
          <div className="px-4 pb-6 lg:pb-8 xl:pb-11.5">
            <div className="relative z-30 mx-auto -mt-22 h-30 w-full max-w-30 rounded-full bg-white/20 p-1 backdrop-blur sm:h-44 sm:max-w-44 sm:p-3">
              <div className="relative drop-shadow-2">
                <img src={imageURL || userSix} alt="profile" />
                <label
                  htmlFor="profile"
                  className="absolute bottom-0 right-0 flex h-8.5 w-8.5 cursor-pointer items-center justify-center rounded-full bg-primary text-white hover:bg-opacity-90 sm:bottom-2 sm:right-2"
                >
                  <svg
                    className="fill-current"
                    width="14"
                    height="14"
                    viewBox="0 0 14 14"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      fillRule="evenodd"
                      clipRule="evenodd"
                      d="M4.76464 1.42638C4.87283 1.2641 5.05496 1.16663 5.25 1.16663H8.75C8.94504 1.16663 9.12717 1.2641 9.23536 1.42638L10.2289 2.91663H12.25C12.7141 2.91663 13.1592 3.101 13.4874 3.42919C13.8156 3.75738 14 4.2025 14 4.66663V11.0833C14 11.5474 13.8156 11.9925 13.4874 12.3207C13.1592 12.6489 12.7141 12.8333 12.25 12.8333H1.75C1.28587 12.8333 0.840752 12.6489 0.512563 12.3207C0.184375 11.9925 0 11.5474 0 11.0833V4.66663C0 4.2025 0.184374 3.75738 0.512563 3.42919C0.840752 3.101 1.28587 2.91663 1.75 2.91663H3.77114L4.76464 1.42638ZM5.56219 2.33329L4.5687 3.82353C4.46051 3.98582 4.27837 4.08329 4.08333 4.08329H1.75C1.59529 4.08329 1.44692 4.14475 1.33752 4.25415C1.22812 4.36354 1.16667 4.51192 1.16667 4.66663V11.0833C1.16667 11.238 1.22812 11.3864 1.33752 11.4958C1.44692 11.6052 1.59529 11.6666 1.75 11.6666H12.25C12.4047 11.6666 12.5531 11.6052 12.6625 11.4958C12.7719 11.3864 12.8333 11.238 12.8333 11.0833V4.66663C12.8333 4.51192 12.7719 4.36354 12.6625 4.25415C12.5531 4.14475 12.4047 4.08329 12.25 4.08329H9.91667C9.72163 4.08329 9.53949 3.98582 9.4313 3.82353L8.43781 2.33329H5.56219Z"
                      fill=""
                    />
                    <path
                      fillRule="evenodd"
                      clipRule="evenodd"
                      d="M7.00004 5.83329C6.03354 5.83329 5.25004 6.61679 5.25004 7.58329C5.25004 8.54979 6.03354 9.33329 7.00004 9.33329C7.96654 9.33329 8.75004 8.54979 8.75004 7.58329C8.75004 6.61679 7.96654 5.83329 7.00004 5.83329ZM4.08337 7.58329C4.08337 5.97246 5.38921 4.66663 7.00004 4.66663C8.61087 4.66663 9.91671 5.97246 9.91671 7.58329C9.91671 9.19412 8.61087 10.5 7.00004 10.5C5.38921 10.5 4.08337 9.19412 4.08337 7.58329Z"
                      fill=""
                    />
                  </svg>
                  <input
                    type="file"
                    name="profile"
                    accept="image/*"
                    ref={fileInputRef}
                    onChange={handleImageChange}
                    id="profile"
                    className="sr-only"
                  />
                </label>
              </div>
            </div>
            <div className="mt-4 ">
                <div className="flex flex-row flex-wrap justify-evenly gap-2">
                <div className="" key={index}>
                  <h3 className="mb-1.5 text-center text-2xl font-semibold text-black dark:text-white">
                {user.name}
              </h3>
              <p className="text-center mb-5 font-medium">{user.specialty}</p>
              <span className={` ${user.status === 'Verified' ? 'bg-success' : 'bg-warning'} p-1 text-white text-center mx-[47%] rounded-xl`}>{user.status}</span>

                  <div className='flex mb-10 p-5 flex-wrap w-full rounded-lg'>

                  <div className='w-1/3 mb-5' >
                    <span className="text-xl">Date of Birth</span>
                    <h4 className="text-xl mt-1 break-words font-medium text-black dark:text-white">
                      {user.dateOfBirth}
                    </h4>
                  </div>

                  <div className='w-1/3 mb-5' >
                    <span className="text-xl">Gender</span>
                    <h4 className="text-xl mt-1 break-words font-medium text-black dark:text-white">
                      {user.gender}
                    </h4>
                  </div>

                  <div className='w-1/3 mb-5' >
                    <span className="text-xl">Hospital</span>
                    <h4 className="text-xl mt-1 break-words font-medium text-black dark:text-white">
                      {user.hospital}
                    </h4>
                  </div>

                  <div className='w-1/3 mb-5' >
                    <span className="text-xl">License Number</span>
                    <h4 className="text-xl mt-1 break-words font-medium text-black dark:text-white">
                      {user.registrationNumber}
                    </h4>
                  </div>

                  <div className='w-1/3 mb-5' >
                    <span className="text-xl">Identification Number</span>
                    <h4 className="text-xl mt-1 break-words font-medium text-black dark:text-white">
                      {user.identificationNumber}
                    </h4>
                  </div>

                  <div className='w-1/3 mb-5' >
                    <span className="text-xl">Years of Experience</span>
                    <h4 className="text-xl mt-1 break-words font-medium text-black dark:text-white">
                      {user.yearsOfExperience}
                    </h4>
                  </div>

                  <div className='w-1/3 mb-5' >
                    <span className="text-xl">Email Address</span>
                    <h4 className="text-xl mt-1 break-words font-medium text-black dark:text-white">
                      {user.email}
                    </h4>
                  </div>

                  <div className='w-1/3 mb-5' >
                    <span className="text-xl">Phone Number</span>
                    <h4 className="text-xl mt-1 break-words font-medium text-black dark:text-white">
                      {user.phone}
                    </h4>
                  </div>

                  <div className='w-1/3 mb-5' >
                    <span className="text-xl">Home Address</span>
                    <h4 className="text-xl mt-1 break-words font-medium text-black dark:text-white">
                      {user.homeAddress}
                    </h4>
                  </div>

                  <div className='w-1/3 mb-5' >
                    <span className="text-xl">City</span>
                    <h4 className="text-xl mt-1 break-words font-medium text-black dark:text-white">
                      {user.city}
                    </h4>
                  </div>

                  <div className='w-1/3 mb-5' >
                    <span className="text-xl">State</span>
                    <h4 className="text-xl mt-1 break-words font-medium text-black dark:text-white">
                      {user.state}
                    </h4>
                  </div>

                  <div className='w-1/3 mb-5' >
                    <span className="text-xl">Country</span>
                    <h4 className="text-xl mt-1 break-words font-medium text-black dark:text-white">
                      {user.country}
                    </h4>
                  </div>
                </div>

                  <div className='w-full flex flex-row justify-evenly mb-5'>
                    <div className="relative">
                      <button
                        ref={trigger}
                        onClick={() => setSharePopupOpen(!sharePopupOpen)}
                        className="inline-flex items-center justify-center rounded-full bg-success py-3 px-7 text-center font-medium text-white hover:bg-opacity-90 lg:px-8 xl:px-10"
                      >
                        Share
                      </button>
                      {sharePopupOpen && (
                          <div
                            ref={popup}
                            className="fixed inset-0 flex items-center justify-center z-50 bg-black bg-opacity-50"
                          >
                            <div
                                className="lg:mt-15 lg:w-1/2 rounded-lg bg-white dark:bg-dark pt-3 px-4 shadow-md"
                                style={{ maxHeight: 'calc(100vh - 200px)', overflowY: 'scroll' }}
                              >      
                              <div
                                className="w-full wow fadeInUp mb-12 rounded-lg bg-primary/[5%] py-11 px-8 dark:bg-dark sm:p-[55px] lg:mb-5 lg:px-8 xl:p-[55px]"
                                data-wow-delay=".15s
                                ">        
                                  <div className="flex flex-row justify-between ">
                                    <h2 className="text-xl font-semibold mb-4">Share Health Details</h2>
                                    <div className="flex justify-end">
                                      <button
                                        onClick={() => setSharePopupOpen(false)}
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
                              <div className="-mx-4 flex flex-wrap">
                                <div className="w-full px-4">
                                  <div className="mb-8">
                                    <label
                                      htmlFor="recipientDid"
                                      className="mb-3 block text-sm font-medium text-dark dark:text-white"
                                    >
                                      Recipient DID
                                    </label>
                                    <div>
                                    <input
                                      type="text"
                                      name="recipientDid"
                                      value={recipientDid}
                                      onChange={(e) => setRecipientDid(e.target.value)}
                                      placeholder="Paste Recipient DID"
                                      required
                                      className="w-full rounded-lg border border-transparent py-3 px-6 text-base text-body-color placeholder-body-color shadow-one outline-none focus:border-primary focus-visible:shadow-none dark:bg-[#242B51] dark:shadow-signUp"
                                    />
                                    </div>
                                  </div>
                                </div>
                                
                                
                                <div className="w-full px-4">
                                  <button 
                                    type="button"
                                    onClick={() => shareHealthDetails(user.recordId)}
                                    disabled={shareLoading}
                                    className="rounded-lg bg-primary py-4 px-9 text-base font-medium text-white transition duration-300 ease-in-out hover:bg-opacity-80 hover:shadow-signUp">
                                    {shareLoading ? (
                                      <div className="flex items-center">
                                        <div className="spinner"></div>
                                        <span className="pl-1">Sharing...</span>
                                      </div>
                                    ) : (
                                      <>Share</>
                                    )}
                                  </button>
                                </div>
                              </div>
                                </form>
                                </div>
                              </div>
                          </div>
                        )}
                    </div>

                    <div className="relative">
                      <button
                        onClick={() => togglePopup(user.recordId)}                      
                        className="inline-flex items-center justify-center rounded-full bg-primary py-3 px-10 text-center font-medium text-white hover:bg-opacity-90 lg:px-8 xl:px-10"
                        >
                        Edit
                      </button>
                        {popupOpenMap[user.recordId] && (
                              <div
                                ref={popup}
                                className="fixed inset-0 flex items-center justify-center z-50 bg-black bg-opacity-50"
                              >
                                <div
                                    className="bg-white lg:mt-15 lg:w-1/2 rounded-lg pt-3 px-4 shadow-md"
                                    style={{ maxHeight: 'calc(100vh - 200px)', overflowY: 'scroll' }}
                                  >              
                                      <div className="flex flex-row justify-between">
                                      <h2 className="text-xl font-semibold mb-4">Edit Your Details</h2>
                                      <div className="flex justify-end">
                                        <button
                                          onClick={() => closePopup(user.recordId)}
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
                                    Name
                                  </label>
                                  <div className={`relative ${personalData.name ? 'bg-light-blue' : ''}`}>
                                  <input
                                    type="text"
                                    name="name"
                                    required
                                    value={personalData.name}
                                    onChange={handleInputChange}
                                    placeholder="John Doe"
                                    className="w-full rounded-lg border-[1.5px] border-stroke bg-transparent py-2 px-5 font-medium outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:focus-border-primary"/>
                                  </div>
                                </div>

                                <div className="w-full xl:w-1/2">
                                  <label className="mb-2.5 block text-black dark:text-white">
                                    Date of Birth
                                  </label>
                                  <div className={`relative ${personalData.dateOfBirth ? 'bg-light-blue' : ''}`}>
                                  <input
                                    type="date" 
                                    name="dateOfBirth"
                                    required
                                    value={personalData.dateOfBirth}
                                    onChange={handleInputChange}
                                    className="w-full rounded-lg border-[1.5px] border-stroke bg-transparent py-2 px-5 font-medium outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:focus-border-primary"/>
                                  </div>
                                </div> 

                                <div className="w-full xl:w-3/5">
                                  <label className="mb-2.5 block text-black dark:text-white">
                                    Hospital
                                  </label>
                                  <div className={`relative ${personalData.hospital? 'bg-light-blue' : ''}`}>
                                  <input
                                    type="text"
                                    name="hospital"
                                    required
                                    value={personalData.hospital}
                                    onChange={handleInputChange}
                                    placeholder="John Hopkins"
                                    className="w-full rounded-lg border-[1.5px] border-stroke bg-transparent py-2 px-5 font-medium outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:focus-border-primary"/>
                                  </div>
                                </div>
                              </div>

                              <div className="mb-4.5 flex flex-col gap-6 xl:flex-row">

                              <div className="w-full xl:w-3/5">
                                  <label className="mb-2.5 block text-black dark:text-white">
                                    Specialty
                                  </label>
                                  <div className={`relative ${personalData.specialty? 'bg-light-blue' : ''}`}>
                                    <select
                                  name="specialty"
                                  value={personalData.specialty}
                                  onChange={handleInputChange}
                                  required
                                  className="w-full rounded-lg border-[1.5px] border-stroke bg-transparent py-2 px-5 font-medium outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:focus-border-primary">
                                  <option value="">Select Specialty</option>                        
                                  <option value="Family Medicine">Family Medicine</option>
                                  <option value="General Medicine">General Medicine</option>
                                  <option value="Internal Medicine">Internal Medicine</option>
                                  <option value="Emergency Medicine">Emergency Medicine</option>
                                  <option value="Preventive Medicine">Preventive Medicine</option>
                                  <option value="Occupational Medicine">Occupational Medicine</option>
                                  <option value="Pediatrics">Pediatrics</option>
                                  <option value="Psychiatry">Psychiatry</option>
                                  <option value="Surgery">Surgery</option>
                                  <option value="Obstetrics and Gynecology">Obstetrics and Gynecology</option>
                                  <option value="Neurology">Neurology</option>
                                  <option value="Cardiology">Cardiology</option>
                                  <option value="Dermatology">Dermatology</option>
                                  <option value="Ophthalmology">Ophthalmology</option>
                                  <option value="Orthopedics">Orthopedics</option>
                                  <option value="Otolaryngology">Otolaryngology</option>
                                  <option value="Urology">Urology</option>
                                  <option value="Radiology">Radiology</option>
                                  <option value="Anesthesiology">Anesthesiology</option>
                                  <option value="Pathology">Pathology</option>
                                  <option value="Medical Genetics">Medical Genetics</option>
                                  <option value="Public Health">Public Health</option>
                                  <option value="Nursing">Nursing</option>
                                  <option value="Physiotherapy">Physiotherapy</option>
                                  <option value="Dentistry">Dentistry</option>
                                  <option value="Nutrition">Nutrition</option>
                                  <option value="Veterinary Medicine">Veterinary Medicine</option>
                                  <option value="Other">Other</option>
                                    </select> 
                                  </div>
                                </div>

                                <div className="w-full xl:w-3/5">
                                  <label className="mb-2.5 block text-black dark:text-white">
                                    License Number
                                  </label>
                                  <div className={`relative ${personalData.registrationNumber? 'bg-light-blue' : ''}`}>
                                  <input
                                    type="text"
                                    name="licenseNumber"
                                    required
                                    value={personalData.registrationNumber}
                                    onChange={handleInputChange}
                                    placeholder="SSN123456"
                                    className="w-full rounded-lg border-[1.5px] border-stroke bg-transparent py-2 px-5 font-medium outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:focus-border-primary"/>
                                  </div>
                                </div>
                                                    
                                <div className="w-full xl:w-3/5">
                                  <label className="mb-2.5 block text-black dark:text-white">
                                    Identification Number
                                  </label>
                                  <div className={`relative ${personalData.identificationNumber ? 'bg-light-blue' : ''}`}>
                                  <input
                                    type="text"
                                    name="identificationNumber"
                                    value={personalData.identificationNumber}
                                    required
                                    onChange={handleInputChange}
                                    placeholder="SSN123456"
                                    className="w-full rounded-lg border-[1.5px] border-stroke bg-transparent py-2 px-5 font-medium outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:focus-border-primary"/>
                                  </div>
                                </div>
                              </div>

                              <div className="mb-4.5 flex flex-col gap-6 xl:flex-row">

                              <div className="w-full xl:w-3/5">
                                  <label className="mb-2.5 block text-black dark:text-white">
                                    Years of Experience
                                  </label>
                                  <div className={`relative ${personalData.yearsOfExperience ? 'bg-light-blue' : ''}`}>
                                  <input
                                    type="number"
                                    name="yearsOfExperience"
                                    value={personalData.yearsOfExperience}
                                    required
                                    onChange={handleInputChange}
                                    placeholder="6"
                                    className="w-full rounded-lg border-[1.5px] border-stroke bg-transparent py-2 px-5 font-medium outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:focus-border-primary"/>
                                  </div>
                                </div>

                              <div className="w-full xl:w-3/5">
                                  <label className="mb-2.5 block text-black dark:text-white">
                                    Gender
                                  </label>
                                  <div className={`relative ${personalData.gender ? 'bg-light-blue' : ''}`}>
                                  <select
                                        name="gender"
                                        value={personalData.gender}
                                        onChange={handleInputChange}
                                        required
                                        className="w-full rounded-lg border-[1.5px] border-stroke bg-transparent py-2 px-5 font-medium outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:focus-border-primary">
                                        <option value="">Select Gender</option>                        
                                        <option value="Male">Male</option>
                                        <option value="Female">Female</option>
                                      </select>                        
                                    </div>
                                </div>

                                <div className="w-full xl:w-3/5">
                                  <label className="mb-2.5 block text-black dark:text-white">
                                    Phone Number
                                  </label>
                                  <div className={`relative ${personalData.phone ? 'bg-light-blue' : ''}`}>
                                  <input
                                    type="text"
                                    name="phone"
                                    value={personalData.phone}
                                    required
                                    onChange={handleInputChange}
                                    placeholder="+234 80123456"
                                    className="w-full rounded-lg border-[1.5px] border-stroke bg-transparent py-2 px-5 font-medium outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:focus-border-primary"/>
                                  </div>
                                </div>
                              </div>

                              <div className="mb-4.5 flex flex-col gap-6 xl:flex-row">

                              <div className="w-full xl:w-3/5">
                                  <label className="mb-2.5 block text-black dark:text-white">
                                    Email Address
                                  </label>
                                  <div className={`relative ${personalData.email ? 'bg-light-blue' : ''}`}>
                                  <input
                                    type="text"
                                    name="email"
                                    value={personalData.email}
                                    required
                                    onChange={handleInputChange}
                                    placeholder="xyz@gmail.com"
                                    className="w-full rounded-lg border-[1.5px] border-stroke bg-transparent py-2 px-5 font-medium outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:focus-border-primary"/>
                                  </div>
                                </div>

                                <div className="w-full xl:w-3/5">
                                  <label className="mb-2.5 block text-black dark:text-white">
                                    Home Address
                                  </label>
                                  <div className={`relative ${personalData.homeAddress ? 'bg-light-blue' : ''}`}>
                                  <input
                                    type="text"
                                    name="homeAddress"
                                    value={personalData.homeAddress}
                                    required
                                    onChange={handleInputChange}
                                    placeholder="Phoenix Court, 1st Avenue, Gwarinpa, Abuja"
                                    className="w-full rounded-lg border-[1.5px] border-stroke bg-transparent py-2 px-5 font-medium outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:focus-border-primary"/>
                                  </div>
                                </div>

                                <div className="w-full xl:w-3/5">
                                  <label className="mb-2.5 block text-black dark:text-white">
                                    City
                                  </label>
                                  <div className={`relative ${personalData.city ? 'bg-light-blue' : ''}`}>
                                  <input
                                    type="text"
                                    name="city"
                                    value={personalData.city}
                                    required
                                    onChange={handleInputChange}
                                    placeholder="Milpitas"
                                    className="w-full rounded-lg border-[1.5px] border-stroke bg-transparent py-2 px-5 font-medium outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:focus-border-primary"/>
                                  </div>
                                </div>                   
                              </div>   

                              <div className="mb-4.5 flex flex-col gap-6 xl:flex-row">
                              <div className="w-full xl:w-3/5">
                                  <label className="mb-2.5 block text-black dark:text-white">
                                    State
                                  </label>
                                  <div className={`relative ${personalData.state ? 'bg-light-blue' : ''}`}>
                                  <input
                                    type="text"
                                    name="state"
                                    value={personalData.state}
                                    required
                                    onChange={handleInputChange}
                                    placeholder="US-CA"
                                    className="w-full rounded-lg border-[1.5px] border-stroke bg-transparent py-2 px-5 font-medium outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:focus-border-primary"/>
                                  </div>
                                </div>

                                <div className="w-full xl:w-3/5">
                                  <label className="mb-2.5 block text-black dark:text-white">
                                    Country
                                  </label>
                                  <div className={`relative ${personalData.country ? 'bg-light-blue' : ''}`}>
                                  <input
                                    type="text"
                                    name="country"
                                    value={personalData.country}
                                    required
                                    onChange={handleInputChange}
                                    placeholder="USA"
                                    className="w-full rounded-lg border-[1.5px] border-stroke bg-transparent py-2 px-5 font-medium outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:focus-border-primary"/>
                                  </div>
                                </div>
                              </div>
                  
                              </div>
                                    </form>
                                  <button
                                    type="button"
                                    onClick={() => updateHealthDetails(user.recordId, personalData)}
                                    disabled={updateLoading}
                                    className={`mr-5 mb-5 inline-flex items-center justify-center gap-2.5 rounded-full bg-primary py-4 px-10 text-center font-medium text-white hover:bg-opacity-90 lg:px-8 xl:px-10 ${updateLoading ? 'opacity-50 cursor-not-allowed' : ''}`}
                                  >
                                    {updateLoading ? (
                                      <div className="flex items-center">
                                        <div className="spinner"></div>
                                        <span className="pl-1">Updating...</span>
                                      </div>
                                    ) : (
                                      <>Update Details</>
                                    )}
                                  </button>
                                  </div>
                              </div>
                            )}
                    </div>

                    <div className="relative">
                      <button
                        onClick={() => showDeleteConfirmation(user.recordId)}
                        className="inline-flex items-center justify-center rounded-full bg-danger py-3 px-7 text-center font-medium text-white hover-bg-opacity-90 lg:px-8 xl:px-10"
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
                                  deleteHealthDetails(user.recordId);
                                }}
                                className="rounded bg-danger py-2 px-3 text-white hover:bg-opacity-90"
                              >
                                Confirm
                              </button>
                            </div>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
                </div>
            </div>
          </div>
            </div>
            ))}
          </main>
          ) : (
            <div className="flex items-center flex-col py-[25%] h-48">
              <div className="text-md font-medium text-gray-500 dark:text-gray-400">
                No Details yet
              </div>
              <div>
                <button
                  ref={trigger}
                  onClick={() => setPopupOpen(!popupOpen)}
                  className="inline-flex mt-5 items-center justify-center rounded-full bg-primary py-3 px-10 text-center font-medium text-white hover-bg-opacity-90 lg:px-8 xl:px-10">
                  Add Profile
                </button>
              </div>      
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
                          <h2 className="text-xl px-6.5 pt-6.5 font-semibold mb-4">Personal and Work Details</h2>
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
                        <div className="mb-4.5 flex flex-col gap-6 xl:flex-row">
                        <div className="w-full xl:w-3/5">
                            <label className="mb-2.5 block text-black dark:text-white">
                              Name
                            </label>
                            <div className={`relative ${personalData.name ? 'bg-light-blue' : ''}`}>
                            <input
                              type="text"
                              name="name"
                              required
                              value={personalData.name}
                              onChange={handleInputChange}
                              placeholder="John Doe"
                              className="w-full rounded-lg border-[1.5px] border-stroke bg-transparent py-2 px-5 font-medium outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:focus-border-primary"/>
                            </div>
                          </div>

                          <div className="w-full xl:w-1/2">
                            <label className="mb-2.5 block text-black dark:text-white">
                              Date of Birth
                            </label>
                            <div className={`relative ${personalData.dateOfBirth ? 'bg-light-blue' : ''}`}>
                            <input
                              type="date" 
                              name="dateOfBirth"
                              required
                              value={personalData.dateOfBirth}
                              onChange={handleInputChange}
                              className="w-full rounded-lg border-[1.5px] border-stroke bg-transparent py-2 px-5 font-medium outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:focus-border-primary"/>
                            </div>
                          </div> 

                          <div className="w-full xl:w-3/5">
                            <label className="mb-2.5 block text-black dark:text-white">
                              Hospital
                            </label>
                            <div className={`relative ${personalData.hospital? 'bg-light-blue' : ''}`}>
                            <input
                              type="text"
                              name="hospital"
                              required
                              value={personalData.hospital}
                              onChange={handleInputChange}
                              placeholder="John Hopkins"
                              className="w-full rounded-lg border-[1.5px] border-stroke bg-transparent py-2 px-5 font-medium outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:focus-border-primary"/>
                            </div>
                          </div>
                        </div>

                        <div className="mb-4.5 flex flex-col gap-6 xl:flex-row">

                        <div className="w-full xl:w-3/5">
                            <label className="mb-2.5 block text-black dark:text-white">
                              Specialty
                            </label>
                            <div className={`relative ${personalData.specialty? 'bg-light-blue' : ''}`}>
                              <select
                                name="specialty"
                                value={personalData.specialty}
                                onChange={handleInputChange}
                                required
                                className="w-full rounded-lg border-[1.5px] border-stroke bg-transparent py-2 px-5 font-medium outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:focus-border-primary">
                                <option value="">Select Specialty</option>                        
                                <option value="Family Medicine">Family Medicine</option>
                                <option value="General Medicine">General Medicine</option>
                                <option value="Internal Medicine">Internal Medicine</option>
                                <option value="Emergency Medicine">Emergency Medicine</option>
                                <option value="Preventive Medicine">Preventive Medicine</option>
                                <option value="Occupational Medicine">Occupational Medicine</option>
                                <option value="Pediatrics">Pediatrics</option>
                                <option value="Psychiatry">Psychiatry</option>
                                <option value="Surgery">Surgery</option>
                                <option value="Obstetrics and Gynecology">Obstetrics and Gynecology</option>
                                <option value="Neurology">Neurology</option>
                                <option value="Cardiology">Cardiology</option>
                                <option value="Dermatology">Dermatology</option>
                                <option value="Ophthalmology">Ophthalmology</option>
                                <option value="Orthopedics">Orthopedics</option>
                                <option value="Otolaryngology">Otolaryngology</option>
                                <option value="Urology">Urology</option>
                                <option value="Radiology">Radiology</option>
                                <option value="Anesthesiology">Anesthesiology</option>
                                <option value="Pathology">Pathology</option>
                                <option value="Medical Genetics">Medical Genetics</option>
                                <option value="Public Health">Public Health</option>
                                <option value="Nursing">Nursing</option>
                                <option value="Physiotherapy">Physiotherapy</option>
                                <option value="Dentistry">Dentistry</option>
                                <option value="Nutrition">Nutrition</option>
                                <option value="Veterinary Medicine">Veterinary Medicine</option>
                                <option value="Other">Other</option>
                              </select> 
                            </div>
                          </div>

                          <div className="w-full xl:w-3/5">
                            <label className="mb-2.5 block text-black dark:text-white">
                              License Number
                            </label>
                            <div className={`relative ${personalData.registrationNumber? 'bg-light-blue' : ''}`}>
                            <input
                              type="text"
                              name="registrationNumber"
                              required
                              value={personalData.registrationNumber}
                              onChange={handleInputChange}
                              placeholder="SSN123456"
                              className="w-full rounded-lg border-[1.5px] border-stroke bg-transparent py-2 px-5 font-medium outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:focus-border-primary"/>
                            </div>
                          </div>
                                              
                          <div className="w-full xl:w-3/5">
                            <label className="mb-2.5 block text-black dark:text-white">
                              Identification Number
                            </label>
                            <div className={`relative ${personalData.identificationNumber ? 'bg-light-blue' : ''}`}>
                            <input
                              type="text"
                              name="identificationNumber"
                              value={personalData.identificationNumber}
                              required
                              onChange={handleInputChange}
                              placeholder="SSN123456"
                              className="w-full rounded-lg border-[1.5px] border-stroke bg-transparent py-2 px-5 font-medium outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:focus-border-primary"/>
                            </div>
                          </div>
                        </div>

                        <div className="mb-4.5 flex flex-col gap-6 xl:flex-row">

                        <div className="w-full xl:w-3/5">
                            <label className="mb-2.5 block text-black dark:text-white">
                              Years of Experience
                            </label>
                            <div className={`relative ${personalData.yearsOfExperience ? 'bg-light-blue' : ''}`}>
                            <input
                              type="number"
                              name="yearsOfExperience"
                              value={personalData.yearsOfExperience}
                              required
                              onChange={handleInputChange}
                              placeholder="6"
                              className="w-full rounded-lg border-[1.5px] border-stroke bg-transparent py-2 px-5 font-medium outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:focus-border-primary"/>
                            </div>
                          </div>

                        <div className="w-full xl:w-3/5">
                            <label className="mb-2.5 block text-black dark:text-white">
                              Gender
                            </label>
                            <div className={`relative ${personalData.gender ? 'bg-light-blue' : ''}`}>
                            <select
                                  name="gender"
                                  value={personalData.gender}
                                  onChange={handleInputChange}
                                  required
                                  className="w-full rounded-lg border-[1.5px] border-stroke bg-transparent py-2 px-5 font-medium outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:focus-border-primary">
                                  <option value="">Select Gender</option>                        
                                  <option value="Male">Male</option>
                                  <option value="Female">Female</option>
                                </select>                        
                              </div>
                          </div>

                          <div className="w-full xl:w-3/5">
                            <label className="mb-2.5 block text-black dark:text-white">
                              Phone Number
                            </label>
                            <div className={`relative ${personalData.phone ? 'bg-light-blue' : ''}`}>
                            <input
                              type="text"
                              name="phone"
                              value={personalData.phone}
                              required
                              onChange={handleInputChange}
                              placeholder="+234 80123456"
                              className="w-full rounded-lg border-[1.5px] border-stroke bg-transparent py-2 px-5 font-medium outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:focus-border-primary"/>
                            </div>
                          </div>
                        </div>

                        <div className="mb-4.5 flex flex-col gap-6 xl:flex-row">

                        <div className="w-full xl:w-3/5">
                            <label className="mb-2.5 block text-black dark:text-white">
                              Email Address
                            </label>
                            <div className={`relative ${personalData.email ? 'bg-light-blue' : ''}`}>
                            <input
                              type="text"
                              name="email"
                              value={personalData.email}
                              required
                              onChange={handleInputChange}
                              placeholder="xyz@gmail.com"
                              className="w-full rounded-lg border-[1.5px] border-stroke bg-transparent py-2 px-5 font-medium outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:focus-border-primary"/>
                            </div>
                          </div>

                          <div className="w-full xl:w-3/5">
                            <label className="mb-2.5 block text-black dark:text-white">
                              Home Address
                            </label>
                            <div className={`relative ${personalData.homeAddress ? 'bg-light-blue' : ''}`}>
                            <input
                              type="text"
                              name="homeAddress"
                              value={personalData.homeAddress}
                              required
                              onChange={handleInputChange}
                              placeholder="Phoenix Court, 1st Avenue, Gwarinpa, Abuja"
                              className="w-full rounded-lg border-[1.5px] border-stroke bg-transparent py-2 px-5 font-medium outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:focus-border-primary"/>
                            </div>
                          </div>

                          <div className="w-full xl:w-3/5">
                            <label className="mb-2.5 block text-black dark:text-white">
                              City
                            </label>
                            <div className={`relative ${personalData.city ? 'bg-light-blue' : ''}`}>
                            <input
                              type="text"
                              name="city"
                              value={personalData.city}
                              required
                              onChange={handleInputChange}
                              placeholder="Milpitas"
                              className="w-full rounded-lg border-[1.5px] border-stroke bg-transparent py-2 px-5 font-medium outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:focus-border-primary"/>
                            </div>
                          </div>                   
                        </div>   

                        <div className="mb-4.5 flex flex-col gap-6 xl:flex-row">
                        <div className="w-full xl:w-3/5">
                            <label className="mb-2.5 block text-black dark:text-white">
                              State
                            </label>
                            <div className={`relative ${personalData.state ? 'bg-light-blue' : ''}`}>
                            <input
                              type="text"
                              name="state"
                              value={personalData.state}
                              required
                              onChange={handleInputChange}
                              placeholder="US-CA"
                              className="w-full rounded-lg border-[1.5px] border-stroke bg-transparent py-2 px-5 font-medium outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:focus-border-primary"/>
                            </div>
                          </div>

                          <div className="w-full xl:w-3/5">
                            <label className="mb-2.5 block text-black dark:text-white">
                              Country
                            </label>
                            <div className={`relative ${personalData.country ? 'bg-light-blue' : ''}`}>
                            <input
                              type="text"
                              name="country"
                              value={personalData.country}
                              required
                              onChange={handleInputChange}
                              placeholder="USA"
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
            </div>
          )}
        </div>
      </div>
    </div>
    </>
  );
};

export default Profile;


