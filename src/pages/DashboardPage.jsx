import { useState } from "react";
import CreateFolderButton from "../components/ui/CreateFolderButton";
import CreateFolderModal from "../components/ui/CreateFolderModal";

const DashboardPage = () => {
  const [isCreateOpen, setIsCreateOpen] = useState(false);

  return (
    <div>
      <CreateFolderButton onClick={() => setIsCreateOpen(true)} />

      {isCreateOpen && (
        <CreateFolderModal onClose={() => setIsCreateOpen(false)} />
      )}
    </div>
  );
};

export default DashboardPage;
