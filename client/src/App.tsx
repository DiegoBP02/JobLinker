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
  Unauthorized,
} from "./pages";
import Dashboard from "./pages/Dashboard";
import Authorization from "./utils/Authorization";

const Company = Authorization(["company", "admin"]);
const CompanyAddJob = Company(AddJob);
const CompanyAllJobs = Company(CompanyJobs);
const CompanyAddInterview = Company(AddInterview);
const CompanyAllInterviews = Company(CompanyInterviews);
const CompanySingleJob = Company(SingleJob);
const CompanySingleApplication = Company(SingleApplication);

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
          <>
            <Route index element={<Dashboard />} />
            <Route path="add-job" element={<CompanyAddJob />} />
            <Route path="company-jobs" element={<CompanyAllJobs />} />
            <Route
              path="add-interview/:jobId/:userId"
              element={<CompanyAddInterview />}
            />
            <Route
              path="company-interviews"
              element={<CompanyAllInterviews />}
            />
            <Route path="single-job/:id" element={<CompanySingleJob />} />
            <Route
              path="single-application/:id"
              element={<CompanySingleApplication />}
            />
          </>
        </Route>

        <Route path="/landing" element={<Landing />} />
        <Route path="/register" element={<Register />} />
        <Route path="/unauthorized" element={<Unauthorized />} />
        <Route path="*" element={<Error />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
