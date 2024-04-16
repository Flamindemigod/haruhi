'use client';

import { Button } from '@radix-ui/themes';
import { signIn } from 'next-auth/react';
import Image from 'next/image';

export const SignIn = () => {
  return (
    <Button
      className='cursor-pointer px-2 py-6 font-sans text-sm font-semibold'
      onClick={() => {
        signIn('anilist');
      }}
    >
      <Image
        src={'/AnilistIcon.svg'}
        height={32}
        width={32}
        alt='Anilist Icon'
      />
      Sign In With Anilist
    </Button>
  );
};
