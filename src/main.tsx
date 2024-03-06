import React from 'react'; // Import React
import ReactDOM from 'react-dom/client';
import { BrowserRouter as Router } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { ConvexProvider, ConvexReactClient } from "convex/react";
import App from './App';
import './index.css';
import './satoshi.css';

const convex = new ConvexReactClient(import.meta.env.VITE_CONVEX_URL);

ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(
  <React.StrictMode>
    <ConvexProvider client={convex}>
      <Router>
        <ToastContainer />
        <App />
      </Router>
    </ConvexProvider>
  </React.StrictMode>
);
