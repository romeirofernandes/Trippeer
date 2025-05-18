import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { SidebarProvider } from "./components/Sidebar";
import Landing from "./pages/Landing";
import Dashboard from "./pages/Dashboard";
import Auth from "./pages/Auth";
import Explore from "./pages/Explore";
import Itinerary from "./components/Itinerary";
import TripDetail from "./pages/TripDetail";

function App() {
  return (
    <SidebarProvider>
      <Router>
        <Routes>
          <Route path="/" element={<Landing />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/auth" element={<Auth />} />
          <Route path="/explore" element={<Explore />} />
          <Route path="/itinerary" element={<Itinerary />} />
          <Route path="/trip/:tripId" element={<TripDetail />} />
        </Routes>
      </Router>
    </SidebarProvider>
  );
}

export default App;
