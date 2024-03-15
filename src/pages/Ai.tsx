import { useState,  useEffect } from "react";
import { useQuery, useMutation } from "convex/react";
import { api } from "../../convex/_generated/api";
import Breadcrumb from '../components/Breadcrumb';
import Sidebar from '../components/Sidebar';
import DoctorSidebar from '../components/DoctorSidebar';
import Header from '../components/Header';
import 'react-toastify/dist/ReactToastify.css'; 
import './ai.css';
export default function Home() {

  const [sidebarOpen, setSidebarOpen] = useState(false);
  const { userType  } = "patient";

  const chats = useQuery(api.chats.list);
  const sendChat = useMutation(api.chats.send);

  const [newChatText, setNewChatText] = useState("");

  useEffect(() => {
    // Make sure scrollTo works on button click in Chrome
    setTimeout(() => {
      window.scrollTo({ top: document.body.scrollHeight, behavior: "smooth" });
    }, 0);
  }, [chats]);


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
                <Breadcrumb pageName="Rapha AI" />   
              </div>
              <div className="flex flex-col gap-10">
              <div className="h-screen rounded-sm border border-stroke bg-white shadow-default dark:border-strokedark dark:bg-boxdark xl:flex">

                <div className="chat">
                    {chats?.map((chat) => (
                        <article
                        key={chat._id}
                        className={chat.author === "Fes" ? "message-mine" : ""}
                        >
                        <div>{chat.author}</div>

                        <p>
                            {chat.body}
                        </p>
                        </article>
                    ))}
                    <form
                        className=""
                        onSubmit={async (e) => {
                        e.preventDefault();
                        await sendChat({ body: newChatText, author: "Fes" });
                        setNewChatText("");
                        }}
                    >
                        <input
                        value={newChatText}
                        onChange={async (e) => {
                            const text = e.target.value;
                            setNewChatText(text);
                        }}
                        placeholder="Write a chat…"
                        />
                        <button type="submit" disabled={!newChatText}>
                        Send
                        </button>
                    </form>
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