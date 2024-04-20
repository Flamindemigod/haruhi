import Image from 'next/image';
import Background from '~/app/_components/Background';
import Description from '~/app/_components/anime-manga/Description';
import NotFound from '~/app/not-found';
import { api } from '~/trpc/server';

const Page = async ({
  params,
  searchParams,
}: {
  params: { slug: string };
  searchParams?: {
    roomId: string;
  };
}) => {
  const data = (await api.anilist.anime.getMedia.query({
    id: parseInt(params.slug),
  }))!;
  if (!data) return <NotFound />;
  return (
    <div className='flex flex-col'>
      <div className='relative isolate grid h-64 w-full grid-cols-5 grid-rows-3 overflow-clip'>
        <Background
          classes='col-span-full row-span-full blur-md'
          backgroundImage={data.bannerImage ?? undefined}
        />
        <div className='col-start-2 col-end-[-2] row-span-full row-start-2 grid grid-cols-subgrid grid-rows-1 overflow-clip bg-black/20 backdrop-blur-lg'>
          <div className='relative col-span-1 col-start-1'>
            <Image
              fill
              className='my-auto object-contain'
              src={data.coverImage.large!}
              blurDataURL={data.coverImage.blurHash}
              alt={`Cover of ${data.title?.userPreferred}`}
              draggable={false}
              placeholder='blur'
            />
          </div>
          <div className='col-start-2 col-end-9 flex flex-col justify-center p-2 text-white'>
            <div className='font-semibold lg:text-xl'>
              {data.title?.userPreferred}
            </div>
            <div className='text-sm lg:text-lg'>{data.title?.english}</div>
          </div>
        </div>
      </div>
      <div className='flex flex-col gap-2 p-2'>
        <Description description={data.description ?? ''} />
      </div>
    </div>
  );
};

export default Page;
