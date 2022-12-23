//https://gist.github.com/techtheory/383ad87b1fdfb36cde15
export default function timeSince(date: number) {
  var seconds = Math.floor(new Date().getTime() / 1000 - date),
    interval = Math.floor(seconds / 31536000);

  if (interval > 1) return interval + ` years ago`;

  interval = Math.floor(seconds / 2592000);
  if (interval > 1) return interval + " months ago";

  interval = Math.floor(seconds / 86400);
  if (interval >= 1) return interval + " days ago";

  interval = Math.floor(seconds / 3600);
  if (interval >= 1) return interval + " hours ago";

  interval = Math.floor(seconds / 60);
  if (interval > 1) return interval + " minutes ago";

  return Math.floor(seconds) + " seconds ago";
}
