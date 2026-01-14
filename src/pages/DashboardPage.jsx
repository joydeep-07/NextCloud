import { useAuth } from "../context/AuthContext";

const DashboardPage = () => {
  const { profile, loading } = useAuth();

  if (loading) return <p>Loading...</p>;

  return (
  <>
  <div className="h-full w-full ">
    This is Dashboard page
  </div>
  </>
  );
};

export default DashboardPage;
