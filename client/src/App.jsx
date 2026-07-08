import { BrowserRouter, Routes, Route } from "react-router-dom";
import MainLayout from "./layouts/MainLayout";
import HomePage from "./pages/HomePage";
import NewWorkDayPage from "./pages/NewWorkDayPage";
import NewTripPage from "./pages/NewTripPage";
import CloseWorkDayPage from "./pages/CloseWorkDayPage";
import WorkDayClosedPage from "./pages/WorkDayClosedPage";
import EditTripPage from "./pages/EditTripPage";
import WorkDayHistoryPage from "./pages/WorkDayHistoryPage";
import WorkDayDetailPage from "./pages/WorkDayDetailPage";


function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route element={<MainLayout />}>
          <Route path="/" element={<HomePage />} />
          <Route path="/new-work-day" element={<NewWorkDayPage />} />
          <Route path="/new-trip" element={<NewTripPage />} />
          <Route path="/close-work-day" element={<CloseWorkDayPage />} />
          <Route path="/work-day-closed/:id" element={<WorkDayClosedPage />} />
          <Route path="/trips/:id/edit" element={<EditTripPage />} />
          <Route path="/history" element={<WorkDayHistoryPage />} />
          <Route path="/work-days/:id" element={<WorkDayDetailPage />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;