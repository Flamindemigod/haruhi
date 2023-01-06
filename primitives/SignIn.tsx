import React from "react";
import Link from "next/link";
import Image from "next/image";
const SignIn = () => {
  return (
    <button className="btn flex justify-center items-center bg-primary-500">
      <Link
        href={`https://anilist.co/api/v2/oauth/authorize?client_id=8343&redirect_uri=${process.env.NEXT_SERVER}/api/login&response_type=code`}
        className={"text-white flex gap-2 justify-center items-center"}
      >
        <Image
          src={"/AnilistIcon.svg"}
          alt={"Anilist Icon"}
          width={32}
          height={32}
        />{" "}
        Sign In with Anilist
      </Link>
    </button>
  );
};

export default SignIn;
