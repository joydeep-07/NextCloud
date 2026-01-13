import { useParams } from "react-router-dom";

const InviteAcceptPage = () => {
  const { token } = useParams();

  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="max-w-md w-full text-center">
        <h1 className="text-2xl font-semibold mb-2">Folder Invitation</h1>
        <p className="text-sm text-gray-500">Invitation Token: {token}</p>
      </div>
    </div>
  );
};

export default InviteAcceptPage;
