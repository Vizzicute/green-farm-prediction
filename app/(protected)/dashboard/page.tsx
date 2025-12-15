import DashboardPage from './_components/dashboard-page'
import { checkUserSubscription } from './_server/check-user-subscription';

const page = async () => {
  await checkUserSubscription();
  return <DashboardPage />
}

export default page
