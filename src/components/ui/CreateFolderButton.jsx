import { LayoutDashboard } from "lucide-react";

const CreateFolderButton = ({ onClick }) => {
  return (
    <button
      onClick={onClick}
      className="flex items-center gap-2 text-gray-600 
                 hover:text-[var(--accent-primary)] transition-colors 
                 p-2 rounded-sm hover:bg-gray-50 border border-[var(--border-light)] "
    >
      <LayoutDashboard className="w-4 h-4" />
      <span className="text-sm font-medium">Create New Folder</span>
    </button>
  );
};

export default CreateFolderButton;
