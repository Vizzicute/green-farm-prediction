"use client";

import TabsView from "./_components/tabs-view";

export default function page() {
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold tracking-tight">Settings</h1>
      </div>
      <TabsView />
    </div>
  );
}
