import { BrowserRouter, Route, Routes } from "react-router-dom";
import Landing from "./pages/Landing";
import Itinerary from "./components/Itinerary";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Landing />} />
        <Route path="/itenirary" element={<Itinerary />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
