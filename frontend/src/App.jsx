import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { SidebarProvider } from "./components/Sidebar";
import { TravelProvider } from "./context/TravelContext";
import Landing from "./pages/Landing";
import Dashboard from "./pages/Dashboard";
import ReverseTravelPlanner from "./pages/ReverseTravelPlanner";
import Auth from "./pages/Auth";
import Plan from "./pages/Plan";
import TripDetail from "./pages/TripDetail";
import TripHistoryPage from "./pages/TripHistoryPage";
import TravelAssistant from "./pages/TravelAssistant";
import { TripCollection } from "./components/TripCollection";
import MumbaiDrift from "./components/MumbaiDrift";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';



function App() {
  return (
    <>
    <ToastContainer 
      position="top-right"
      autoClose={3000}
      hideProgressBar={false}
      newestOnTop={true}
      closeOnClick
      rtl={false}
      pauseOnFocusLoss
      draggable
      pauseOnHover
      theme="dark"
      style={{ zIndex: 9999 }}
      toastStyle={{ backgroundColor: "#ff4757" }}
      toastClassName={(context) => 
        context?.type === 'error' ? 
        'bg-red-600 text-white font-bold rounded shadow-lg py-3 px-4 border-l-4 border-red-800' : 
        'bg-gray-800 text-white rounded shadow-lg'
      }
      bodyClassName={() => "text-white font-medium"}
    />
    <SidebarProvider>
      <Router>
        <Routes>
          <Route path="/" element={<Landing />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/auth" element={<Auth />} />
          <Route
            path="/explore"
            element={
              <TravelProvider>
                <ReverseTravelPlanner />
              </TravelProvider>
            }
          />
          <Route path="/plan" element={<Plan />} />
          <Route path="/trip/:tripId" element={<TripDetail />} />
          <Route path="/itinerary" element={<Plan />} />
          <Route path="/trip-history" element={<TripHistoryPage />} />
          <Route path="/trips" element={<TripCollection />} />
          <Route path="/mumbai-drift" element={<MumbaiDrift />} />
          <Route path="/travel-assistant" element={<TravelAssistant />} />
        </Routes>
      </Router>
    </SidebarProvider>
    </>
  );
}

export default App;
