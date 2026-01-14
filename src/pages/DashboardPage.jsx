import { useAuth } from "../context/AuthContext";

const DashboardPage = () => {
  const { profile, loading } = useAuth();

  if (loading) return <p>Loading...</p>;

  return (
    <h1 className="text-2xl">
      Welcome {profile?.first_name ?? "User"} {profile?.last_name}👋
    </h1>
  );
};

export default DashboardPage;
