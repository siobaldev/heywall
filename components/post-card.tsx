import { Post } from "@/lib/types";
import { timeAgo } from "@/lib/utils/time-ago";

export default function PostCard({ post }: { post: Post }) {
  return (
    <article className="w-full min-w-72 rounded-sm bg-white p-6">
      <h3 className="text-xl font-semibold">{post.author}</h3>
      <p className="mt-2 whitespace-pre-wrap wrap-anywhere text-lg">{post.message}</p>
      {post.image_url && (
        <img
          src={post.image_url}
          alt=""
          className="mt-3 max-h-105 max-w-full rounded-sm object-cover"
        />
      )}
      <time dateTime={post.created_at} className="mt-3 block text-right text-foreground/60">
        {timeAgo(post.created_at)}
      </time>
    </article>
  );
}
