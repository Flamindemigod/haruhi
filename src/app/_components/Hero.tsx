import cx from 'classix';

const Hero = () => {
  return (
    <div className='relative flex h-[60vh] w-full flex-col justify-center gap-2 p-12 text-black dark:text-white'>
      <h3 className={cx('font-georama text-3xl font-medium')}>
        Welcome To Haruhi
      </h3>
      <p className={cx('font-georama text-lg')}>
        A next gen anime and manga platform made for you with anilist
        integration to provide a seemless watching experience
      </p>
    </div>
  );
};

export default Hero;
