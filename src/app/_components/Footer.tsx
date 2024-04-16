import { HeartFilledIcon } from '@radix-ui/react-icons';
import Image from 'next/image';

const Footer = () => {
  return (
    <footer className='flex w-full flex-col justify-between bg-white/60 p-8 text-black dark:bg-black/50 dark:text-white sm:flex-row'>
      <div className='flex items-center'></div>
      <div>
        <div className='flex flex-col justify-end gap-2'>
          <div className='flex flex-wrap items-center gap-1'>
            <span>Made for you with</span>
            <HeartFilledIcon className='animate-color_morph' />
            <span>by Flamindemigod</span>
          </div>
          <a
            className='btn flex items-center justify-center bg-primary-500 text-white'
            href={'https://ko-fi.com/flamindemigod'}
          >
            <Image
              width={32}
              height={32}
              src='https://storage.ko-fi.com/cdn/brandasset/kofi_p_logo_nolabel.png'
              alt='Ko-fi Logo'
            />
            Support me on Kofi
          </a>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
