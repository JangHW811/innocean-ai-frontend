import Chat from "./chat";
import Header from "./header/Header";
import MainContent from "./main/MainContent";
import Sidebar from "./sidebar/Sidebar";

export default function Layout() {
  return (
    <main className="bg-gray-50 text-gray-800 h-screen flex flex-col overflow-hidden">
      <Header />
      <aside className="flex flex-1 min-h-0">
        <Sidebar />
        <Chat />
        <MainContent />
      </aside>
    </main>
  );
}
