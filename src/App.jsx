import { Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import Conexo from "./pages/Conexo";
import Cruzadas from "./pages/Cruzadas";
import Feliz from "./pages/Feliz";
import Memoria from "./pages/Memoria";
import Parabens from "./pages/Parabens";

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/conexo" element={<Conexo />} />
      <Route path="/cruzadas" element={<Cruzadas />} />
      <Route path="/feliz" element={<Feliz />} />
      <Route path="/memoria" element={<Memoria />} />
      <Route path="/parabens" element={<Parabens />} />
    </Routes>
  );
}
