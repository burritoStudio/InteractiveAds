import { BrowserRouter, Routes, Route } from "react-router-dom";
import Display from "./pages/Display";
import Play from "./pages/Play";

export default function App() {
    return (
        <BrowserRouter>
            <Routes>
                <Route path="/display" element={<Display />} />
                <Route path="/play" element={<Play />} />
                <Route path="/" element={<Display />} />
            </Routes>
        </BrowserRouter>
    );
}