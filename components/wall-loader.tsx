import { createClient } from "@/lib/utils/supabase/server";
import Wall from "./wall";

// Async server component: fetches the first 50 posts on each request.
export default async function WallLoader() {
  const supabase = await createClient();
  const { data } = await supabase
    .from("posts")
    .select("*")
    .order("created_at", { ascending: false })
    .limit(50);

  return <Wall initialPosts={data ?? []} />;
}
