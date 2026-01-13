import { useParams } from "react-router-dom";

const FolderPage = () => {
  const { id } = useParams();

  return (
    <div>
      <h1 className="text-2xl font-semibold">Folder</h1>
      <p className="text-sm text-gray-500">Folder ID: {id}</p>
    </div>
  );
};

export default FolderPage;
