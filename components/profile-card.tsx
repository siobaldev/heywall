import { PROFILE } from "@/lib/profile";

export default function ProfileCard() {
  return (
    <aside className="hidden min-h-201 rounded-sm bg-white p-4 lg:block">
      <img
        src={PROFILE.avatar}
        alt={PROFILE.name}
        className="h-57 w-full rounded-sm object-cover"
      />
      <h2 className="mt-4 px-1.5 text-lg font-semibold">{PROFILE.name}</h2>

      <div className="mt-8 rounded-sm bg-bg p-2.5 text-sm uppercase">Information</div>

      <dl className="mt-5 px-1.5">
        <dt className="text-sm text-foreground/60">Networks</dt>
        <dd className="mt-3 space-y-1 text-sm">
          {PROFILE.networks.map((n) => (
            <p key={n}>{n}</p>
          ))}
        </dd>
        <dt className="mt-8 text-sm text-foreground/60">Current City</dt>
        <dd className="mt-3">{PROFILE.city}</dd>
      </dl>
    </aside>
  );
}
