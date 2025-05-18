import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { SidebarProvider } from "./components/Sidebar";
import { TravelProvider } from "./context/TravelContext";
import Landing from "./pages/Landing";
import Dashboard from "./pages/Dashboard";
import ReverseTravelPlanner from "./pages/ReverseTravelPlanner";
import Auth from "./pages/Auth";
import Itinerary from "./components/Itinerary";
import TripDetail from "./pages/TripDetail";
import { TripCollection } from "./components/TripCollection";

function App() {
  return (
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
          <Route path="/plan" element={<Itinerary />} />
          <Route path="/trip/:tripId" element={<TripDetail />} />
          <Route path="/trips" element={<TripCollection />} />
        </Routes>
      </Router>
    </SidebarProvider>
  );
}

export default App;
