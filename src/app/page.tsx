import { getServerAuthSession } from '~/server/auth';
import { api } from '~/trpc/server';
import Background from './_components/Background';
import Hero from './_components/Hero';
import Trending from './_components/trending/Trending';
import Recommended from './_components/recommended/Recommended';
import { ActivityLogIcon } from '@radix-ui/react-icons';
import Current from './_components/current/Current';
import Pending from './_components/pending/Pending';

export default async function Home() {
  const sesh = await getServerAuthSession();

  return (
    <>
      <Background
        classes='fixed inset-0'
        backgroundImage='/haruhiHomeBg.webp'
      />
      <div className='relative flex w-full flex-col gap-2'>
        <div className='flex bg-white/50 dark:bg-black/75'>
          {/*TODO: Activity Feed*/}
          <button className='relative flex items-center justify-center gap-2 bg-primary-500/40 p-2 transition-colors hover:bg-primary-500 focus-visible:bg-primary-500'>
            <ActivityLogIcon
              className='h-8 w-8 flex-shrink-0'
              aria-label='Activity Feed'
            />
          </button>
          <Hero />
        </div>
        {!!sesh?.user ? (
          <>
            {/* User Current */}
            <Current />
            {/*User Up Next (Based On User Planning to Watching List) */}
            <Pending />
            {/*User Recommendations*/}
            <Recommended />
          </>
        ) : (
          <Trending />
        )}
      </div>
    </>
  );
}
