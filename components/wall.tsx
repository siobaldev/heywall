"use client";

import { useEffect, useState } from "react";
import { createClient } from "@/lib/utils/supabase/client";
import { Post } from "@/lib/types";
import PostForm from "./post-form";
import PostCard from "./post-card";
import ProfileCard from "./profile-card";
import AdsColumn from "./ads-column";

const supabase = createClient();

export default function Wall({ initialPosts }: { initialPosts: Post[] }) {
  const [posts, setPosts] = useState<Post[]>(initialPosts);
  const [, setTick] = useState(0);

  function addPost(incoming: Post) {
    setPosts((prev) =>
      prev.some((p) => p.id === incoming.id) ? prev : [incoming, ...prev].slice(0, 50),
    );
  }

  useEffect(() => {
    const channel = supabase
      .channel("posts-feed")
      .on("postgres_changes", { event: "INSERT", schema: "public", table: "posts" }, (payload) =>
        addPost(payload.new as Post),
      )
      .subscribe();

    // re-render every minute so "now" becomes "1m", "9h", etc.
    const timer = setInterval(() => setTick((t) => t + 1), 60_000);

    return () => {
      void supabase.removeChannel(channel);
      clearInterval(timer);
    };
  }, []);

  return (
    // mobile: feed only | tablet: feed + ads | desktop: profile + feed + ads
    <div className="mt-6 grid grid-cols-1 items-start gap-4 md:grid-cols-[minmax(0,1fr)_18rem] lg:grid-cols-[15rem_minmax(0,1fr)_18rem]">
      <ProfileCard />

      <main className="min-w-0 space-y-4">
        <PostForm onPostedAction={addPost} />

        {posts.length === 0 && (
          <p className="rounded-sm bg-white p-6 text-center text-foreground/60">
            Nothing on the wall yet. Be the first to share.
          </p>
        )}

        {posts.map((p) => (
          <PostCard key={p.id} post={p} />
        ))}
      </main>

      <AdsColumn />
    </div>
  );
}
