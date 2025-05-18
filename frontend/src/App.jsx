import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { SidebarProvider } from "./components/Sidebar";
import { TravelProvider } from "./context/TravelContext";
import Landing from "./pages/Landing";
import Dashboard from "./pages/Dashboard";
import ReverseTravelPlanner from "./pages/ReverseTravelPlanner";
import Auth from "./pages/Auth";
import Plan from "./pages/Plan";
import TripDetail from "./pages/TripDetail";

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
          <Route path="/plan" element={<Plan />} />
          <Route path="/trip/:id" element={<TripDetail />} />
        </Routes>
      </Router>
    </SidebarProvider>
  );
}

export default App;
