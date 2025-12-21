"use client";

import { useDeleteSession } from "@/apis/sessions";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useAlertActions } from "@/stores/alertStore";
import { MoreVertical, Pencil, Trash2 } from "lucide-react";
import { useState } from "react";
import ModifySessionModal from "../modals/ModifySessionModal";
const SessionConfigMenu = ({ session_id }: { session_id: string }) => {
  const [modifySessionModalOpen, setModifySessionModalOpen] = useState(false);
  const { confirm } = useAlertActions();
  const { mutateAsync: deleteSession } = useDeleteSession();

  const handleDeleteSession = async () => {
    confirm({
      title: "세션 삭제",
      description: "세션을 삭제하시겠습니까?",
      onConfirm: async () => {
        await deleteSession(session_id);
      },
    });
  };

  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
            }}
            className="group-hover:opacity-100 transition-opacity shrink-0 p-1 hover:bg-gray-600 rounded"
          >
            <MoreVertical className="w-4 h-4 text-gray-200" />
          </button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="w-48">
          <DropdownMenuItem
            onClick={(event) => {
              event.stopPropagation();
              setModifySessionModalOpen(true);
            }}
            className="cursor-pointer"
          >
            <Pencil className="mr-2 h-4 w-4" />
            정보 변경
          </DropdownMenuItem>
          <DropdownMenuItem
            onClick={(event) => {
              event.stopPropagation();
              handleDeleteSession();
            }}
            className="cursor-pointer text-red-600 focus:text-red-600 focus:bg-red-50"
          >
            <Trash2 className="mr-2 h-4 w-4" />
            삭제
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
      <ModifySessionModal
        session_id={session_id}
        open={modifySessionModalOpen}
        onClose={() => setModifySessionModalOpen(false)}
      />
    </>
  );
};

export default SessionConfigMenu;
