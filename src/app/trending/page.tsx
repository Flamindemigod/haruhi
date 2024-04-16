import { RedirectType, redirect } from 'next/navigation';
import { getServerAuthSession } from '~/server/auth';
import Trending from '../_components/trending/Trending';

const Page = async () => {
  const sesh = await getServerAuthSession();
  if (!sesh?.user) {
    redirect('/', RedirectType.replace);
  }

  return <Trending />;
};

export default Page;
