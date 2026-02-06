import { auth } from '@/lib/better-auth/auth';
import DashboardPage from './_components/dashboard-page'
import { checkUserSubscription } from './_server/check-user-subscription';
import { headers } from 'next/headers';
import { Metadata } from 'next';

export async function generateMetadata(): Promise<Metadata> {
  const session = await auth.api.getSession({
    headers: await headers()
  });

  return {
    title: session?.user?.name || "User",
  };
}

const page = async () => {
  await checkUserSubscription();
  return <DashboardPage />
}

export default page
