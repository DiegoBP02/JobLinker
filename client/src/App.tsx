import { BrowserRouter, Routes, Route } from "react-router-dom";
import {
  SharedLayout,
  Error,
  Landing,
  Register,
  ProtectedRoute,
  AddJob,
  AddInterview,
  CompanyJobs,
  CompanyInterviews,
  SingleJob,
  SingleApplication,
} from "./pages";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route
          path="/"
          element={
            <ProtectedRoute>
              <SharedLayout />
            </ProtectedRoute>
          }
        >
          <Route index element={<AddJob />} />
          <Route path="company-jobs" element={<CompanyJobs />} />
          <Route
            path="add-interview/:jobId/:userId"
            element={<AddInterview />}
          />
          <Route path="company-interviews" element={<CompanyInterviews />} />
          <Route path="single-job/:id" element={<SingleJob />} />
          <Route
            path="single-application/:id"
            element={<SingleApplication />}
          />
        </Route>
        <Route path="/landing" element={<Landing />} />
        <Route path="/register" element={<Register />} />
        <Route path="*" element={<Error />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
