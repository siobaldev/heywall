"use client";

import { useRef, useState } from "react";
import { createClient } from "@/lib/utils/supabase/client";
import { PROFILE } from "@/lib/profile";
import { Post } from "@/lib/types";

const supabase = createClient();
const MAX_CHARS = 280;
const MAX_IMAGE_BYTES = 5 * 1024 * 1024;
const ALLOWED_TYPES = ["image/jpeg", "image/png", "image/gif"];

export default function PostForm({ onPostedAction }: { onPostedAction: (post: Post) => void }) {
  const [message, setMessage] = useState("");
  const [file, setFile] = useState<File | null>(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const fileRef = useRef<HTMLInputElement>(null);

  function handleFile(e: React.ChangeEvent<HTMLInputElement>) {
    const f = e.target.files?.[0];
    if (!f) return;
    if (!ALLOWED_TYPES.includes(f.type)) {
      setError("Only JPG, PNG, or GIF files are allowed.");
      e.target.value = "";
      return;
    }
    if (f.size > MAX_IMAGE_BYTES) {
      setError("Image must be 5MB or smaller.");
      e.target.value = "";
      return;
    }
    setError("");
    setFile(f);
  }

  async function handleShare(e: React.SubmitEvent<HTMLFormElement>) {
    e.preventDefault();
    const text = message.trim();
    if (!text) return;
    setLoading(true);
    setError("");

    let image_url: string | null = null;
    if (file) {
      const ext = file.name.split(".").pop();
      const path = `${Date.now()}-${Math.random().toString(36).slice(2)}.${ext}`;
      const { error: upErr } = await supabase.storage.from("post-images").upload(path, file);
      if (upErr) {
        setError("Image upload failed. Try again.");
        setLoading(false);
        return;
      }
      image_url = supabase.storage.from("post-images").getPublicUrl(path).data.publicUrl;
    }

    const { data, error: insErr } = await supabase
      .from("posts")
      .insert({ author: PROFILE.name, message: text, image_url })
      .select()
      .single();

    console.log(insErr);

    if (insErr || !data) {
      setError("Couldn't share your post. Try again.");
    } else {
      onPostedAction(data as Post); // Wall dedupes if Realtime delivers it too
      setMessage("");
      setFile(null);
      if (fileRef.current) fileRef.current.value = "";
    }
    setLoading(false);
  }

  return (
    <form onSubmit={handleShare} className="rounded-sm bg-white p-2">
      <textarea
        value={message}
        onChange={(e) => setMessage(e.target.value)}
        maxLength={MAX_CHARS}
        placeholder="What's on your mind?"
        className="h-36 w-full resize-none rounded-sm bg-bg px-5 py-3 outline-none placeholder:text-foreground/50"
      />
      <div className="mt-3 flex items-center justify-between gap-3">
        <div className="min-w-0">
          <button
            type="button"
            onClick={() => fileRef.current?.click()}
            className="max-w-full truncate text-left"
          >
            {file ? file.name : "Click here to attach image (Optional)"}
          </button>
          <p className="text-xs text-foreground/60">JPG, PNG, GIF up to 5MB</p>
          <input
            ref={fileRef}
            type="file"
            accept="image/jpeg,image/png,image/gif"
            onChange={handleFile}
            className="hidden"
          />
        </div>
        <div className="flex shrink-0 items-center gap-3">
          <span className="inline-block w-12 text-right text-xs tabular-nums text-foreground/60">
            {message.length}/{MAX_CHARS}
          </span>
          <button
            disabled={loading || !message.trim()}
            className="rounded-sm bg-primary px-3 py-2 text-white disabled:opacity-50"
          >
            {loading ? "Sharing…" : "Share"}
          </button>
        </div>
      </div>
      {error && <p className="mt-2 text-sm text-red-600">{error}</p>}
    </form>
  );
}
