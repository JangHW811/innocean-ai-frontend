import Chat from "./chat";
import MainContent from "./main/MainContent";
import Sidebar from "./sidebar/Sidebar";

export default function Layout() {
  return (
    <aside className="flex flex-1 min-h-0">
      <Sidebar />
      <Chat />
      <MainContent />
    </aside>
  );
}
