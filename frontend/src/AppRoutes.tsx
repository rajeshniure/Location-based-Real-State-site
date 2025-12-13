import {BrowserRouter, Route, Routes} from "react-router-dom";
import Home from "./Pages/Home";
import Listings from "./Pages/Listings";
import Agencies from "./Pages/Agencies";
import Login from "./Pages/Login";
import Navbar from "./Components/Navbar";
import Testing from "./Components/Testing";

const AppRoutes = () => {
  return (
    <BrowserRouter>
    <Navbar />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/listings" element={<Listings />} />
        <Route path="/agencies" element={<Agencies />} />
        <Route path="/login" element={<Login />} />
        <Route path="/testing" element={<Testing />} />
      </Routes>
    </BrowserRouter>
  );
}

export default AppRoutes;