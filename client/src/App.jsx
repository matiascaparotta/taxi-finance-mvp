import { BrowserRouter, Routes, Route } from "react-router-dom";
import MainLayout from "./layouts/MainLayout";
import HomePage from "./pages/HomePage";
import NewWorkDayPage from "./pages/NewWorkDayPage";

function App() {
  return (
    <BrowserRouter>

    <Routes>
  
      <Route element={<MainLayout />}>
  
        <Route path="/" element={<HomePage />} />
  
        <Route
  
          path="/new-work-day"
  
          element={<NewWorkDayPage />}
  
        />
  
      </Route>
  
    </Routes>
  
  </BrowserRouter>
  );
}

export default App;