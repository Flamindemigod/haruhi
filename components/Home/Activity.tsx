import { DialogTitle } from "@radix-ui/react-dialog";
import { cookies } from "next/headers";
import Image from "next/image";
import Link from "next/link";
import Drawer from "../../primitives/Drawer";
import timeSince from "../../utils/timeSince";
const Activity = async () => {
  const nextCookies = cookies();

  const fetchActivityFeed = async () => {
    const data = await fetch(
      `${process.env.NEXT_PUBLIC_SERVER}/api/getFriendActivity`,
      {
        headers: {
          cookie: nextCookies.get("access_token")
            ? `access_token=${nextCookies.get("access_token")?.value}`
            : "",
        },
      }
    ).then((res) => res.json());
    return data;
  };
  const activityFeed = await fetchActivityFeed();
  return (
    <Drawer
      trigger={
        <button
          aria-label="Show Global/Friends Activity"
          className="absolute left-0 top-0 bottom-0 p-2 bg-primary-500 bg-opacity-30 hover:bg-opacity-100"
        >
          <svg
            className="scale-150 text-white"
            width="15"
            height="15"
            viewBox="0 0 15 15"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M6.1584 3.13508C6.35985 2.94621 6.67627 2.95642 6.86514 3.15788L10.6151 7.15788C10.7954 7.3502 10.7954 7.64949 10.6151 7.84182L6.86514 11.8418C6.67627 12.0433 6.35985 12.0535 6.1584 11.8646C5.95694 11.6757 5.94673 11.3593 6.1356 11.1579L9.565 7.49985L6.1356 3.84182C5.94673 3.64036 5.95694 3.32394 6.1584 3.13508Z"
              fill="currentColor"
              fillRule="evenodd"
              clipRule="evenodd"
            ></path>
          </svg>
        </button>
      }
      content={
        <div>
          <h1 className="text-xl dark:text-offWhite-100">Activity</h1>
          <div className="flex flex-col gap-2 p-2 w-full h-full overflow-auto dark:text-offWhite-100">
            {activityFeed.map((data: any) => (
              <div
                key={data.media.id}
                className="flex items-center justify-start gap-4 p-4 odd:bg-offWhite-200 dark:odd:bg-offWhite-700 bg-opacity-70 isolate"
              >
                <Image
                  width={80}
                  height={128}
                  src={data.media.coverImage.medium}
                  className={"object-cover flex-shrink-0"}
                  alt={data.media.title.userPreferred}
                />
                <div className="flex flex-col justify-center gap-4">
                  <div className="text-md">
                    {`${data.user.name} ${data.status} ${
                      data.progress ? data.progress : ""
                    } ${data.progress ? "of" : ""}`}{" "}
                    <Link
                      href={`/${String(data.media.type).toLowerCase()}/${
                        data.media.id
                      }`}
                    >
                      <span className="text-primary-500 hover:text-primary-300">
                        {data.media.title.userPreferred}
                      </span>
                    </Link>
                  </div>
                  <Image
                    className="rounded-full"
                    alt={`Avatar of user ${data.user.name}`}
                    height={32}
                    width={32}
                    src={data.user.avatar.medium}
                  />
                  <div className="text-sm">{timeSince(data.createdAt)}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      }
    />
  );
};

export default Activity;
