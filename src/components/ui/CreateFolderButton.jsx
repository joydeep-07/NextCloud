import { LayoutDashboard } from 'lucide-react';
import React from 'react'

const CreateFolderButton = () => {

    const handleCreateFolder = () => {
      console.log("Button clicked");
    };

  return (
    <div>
      <button
        onClick={handleCreateFolder}
        className="flex items-center space-x-2 text-gray-600 hover:text-blue-600 transition-colors p-2 rounded-lg hover:bg-gray-50"
      >
        <LayoutDashboard className="w-4 h-4" />
        <span className="text-sm font-medium"> Create New Folder</span>
      </button>
    </div>
  );
}

export default CreateFolderButton