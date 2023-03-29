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
  GetAllJobs,
  GetAllApplications,
  GetAllInterviews,
} from "./pages";
import Dashboard from "./pages/Dashboard";
import CreateApplication from "./pages/User/CreateApplication";
import SingleInterview from "./pages/User/SingleInterview";
import Authorization from "./utils/Authorization";

const Company = Authorization(["company", "admin"]);
const CompanyAddJob = Company(AddJob);
const CompanyAddInterview = Company(AddInterview);
const CompanyAllInterviews = Company(CompanyInterviews);
const CompanySingleApplication = Company(SingleApplication);

const User = Authorization(["user", "admin"]);
const UserAllJobs = User(GetAllJobs);
const UserCreateApplication = User(CreateApplication);
const UserGetAllApplication = User(GetAllApplications);
const UserGetAllInterviews = User(GetAllInterviews);
const UserSingleInterview = User(SingleInterview);

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
            {/* company routes */}
            <Route index element={<Dashboard />} />
            <Route path="/add-job" element={<CompanyAddJob />} />
            <Route
              path="/add-interview/:jobId/:userId"
              element={<CompanyAddInterview />}
            />
            <Route
              path="/company-interviews"
              element={<CompanyAllInterviews />}
            />
            <Route
              path="/single-application/:id"
              element={<CompanySingleApplication />}
            />
            {/* no authorization */}
            <Route path="/single-job/:id" element={<SingleJob />} />
            <Route path="/company-jobs" element={<CompanyJobs />} />

            {/* user routes */}
            <Route path="/all-jobs" element={<UserAllJobs />} />
            <Route
              path="/create-application/:jobId"
              element={<UserCreateApplication />}
            />
            <Route
              path="/all-applications"
              element={<UserGetAllApplication />}
            />
            <Route path="/all-interviews" element={<UserGetAllInterviews />} />
            <Route
              path="/single-interview/:id"
              element={<UserSingleInterview />}
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
