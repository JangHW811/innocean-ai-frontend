"use client";

import AvailableAnalysis from "./AvailableAnalysis";
import DataUpload from "./DataUpload";
import NewSessionCard from "./NewSessionCard";

export default function Sidebar() {
  return (
    <aside className="w-82 bg-white border-r border-gray-200 flex flex-col h-full shadow-sm z-10">
      <section className="transition-all duration-300">
        <NewSessionCard />
      </section>
      <section className="flex-1 overflow-y-auto transition-all duration-300">
        <DataUpload />
        <AvailableAnalysis />
      </section>
    </aside>
  );
}
