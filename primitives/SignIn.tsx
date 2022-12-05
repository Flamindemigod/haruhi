import React from "react";
import Link from "next/link";
import Image from "next/image";
const SignIn = () => {
  return (
    <button className="btn bg-primary-500">
      <Link
        href={
          "https://anilist.co/api/v2/oauth/authorize?client_id=9465&redirect_uri=http://136.243.175.33:8080/api/login&response_type=code"
        }
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
