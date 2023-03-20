import { Navbar } from "../components";
import Dashboard from "./Dashboard";

const SharedLayout = () => {
  return (
    <>
      <main className="dashboard">
        <Navbar />
        <section className="dashboard-page">
          <Dashboard />
        </section>
      </main>
    </>
  );
};

export default SharedLayout;
