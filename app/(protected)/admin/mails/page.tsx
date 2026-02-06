import MailTabView from "./_components/tab-view";

export default function MailPage() {
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold tracking-tight">Mail Management</h1>
      </div>
      <MailTabView />
    </div>
  );
}
