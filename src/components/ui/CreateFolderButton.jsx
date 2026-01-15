import { LayoutDashboard } from "lucide-react";

const CreateFolderButton = ({ onClick }) => {
  return (
    <button
      onClick={onClick}
      className="flex items-center gap-2 text-gray-600 
                 hover:text-blue-600 transition-colors 
                 p-2 rounded-lg hover:bg-gray-50"
    >
      <LayoutDashboard className="w-4 h-4" />
      <span className="text-sm font-medium">Create New Folder</span>
    </button>
  );
};

export default CreateFolderButton;
