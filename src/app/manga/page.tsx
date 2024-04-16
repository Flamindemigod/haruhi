import Image from 'next/image';
import Link from 'next/link';
import { getServerAuthSession } from '~/server/auth';
import {
  Category,
  ListSort,
  ListSortValidator,
  ListStatus,
  ListStatusValidator,
} from '~/types.shared/anilist';
import { SignIn } from '../_components/SignIn';
import List from '../_components/anime-manga/List/List';

const Page = async ({
  searchParams,
}: {
  searchParams?: {
    list?: ListStatus;
    sort?: ListSort;
  };
}) => {
  const sesh = await getServerAuthSession();
  if (!sesh?.user) {
    return (
      <div className='flex h-full w-full flex-col items-center justify-center gap-2'>
        <div className='flex flex-wrap items-center justify-center gap-2'>
          <Image
            draggable={false}
            className='p-4'
            src={'/haruhi-404.png'}
            alt='Not Found Image'
            width={400}
            height={400}
          />
          <h2 className='text-xl'>Need to be signed in to see this page</h2>
        </div>
        <div className='flex flex-wrap items-center justify-center gap-4'>
          <Link href='/' className='text-indigo-500 underline'>
            Return Home
          </Link>
          <SignIn />
        </div>
      </div>
    );
  }

  const listStatus = ListStatusValidator.parse(searchParams?.list);
  const listSort = ListSortValidator.parse(searchParams?.sort);

  return <List list={listStatus} sort={listSort} type={Category.Manga} />;
};

export default Page;
