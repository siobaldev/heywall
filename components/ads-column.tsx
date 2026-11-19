const ADS = [
  {
    brand: "Brewtopia",
    headline: "Your 3 p.m. slump, solved.",
    body: "Single-origin beans delivered every two weeks.",
    cta: "Get 20% off",
    bg: "bg-orange-50",
  },
  {
    brand: "CatNap Cloud",
    headline: "Pillows cats actually fight over.",
    body: "Memory foam, machine washable, purr-approved.",
    cta: "Shop pillows",
    bg: "bg-blue-50",
  },
  {
    brand: "WhiskerWi-Fi",
    headline: "Zero lag. Even at 2 a.m. zoomies.",
    body: "Fiber internet from $29/mo. No contracts.",
    cta: "Check your address",
    bg: "bg-green-50",
  },
];

// hidden on mobile, visible from tablet up
export default function AdsColumn() {
  return (
    <aside className="hidden min-h-211 space-y-6 rounded-sm bg-white p-5 md:block">
      {ADS.map((ad) => (
        <a key={ad.brand} href="#" className={`block rounded-sm p-5 ${ad.bg}`}>
          <p className="text-xs text-foreground/60">Sponsored · {ad.brand}</p>
          <h4 className="mt-2 text-xl font-semibold leading-tight">{ad.headline}</h4>
          <p className="mt-2 text-sm">{ad.body}</p>
          <span className="mt-4 inline-block rounded-sm bg-primary px-3 py-1.5 text-sm text-white">
            {ad.cta}
          </span>
        </a>
      ))}
    </aside>
  );
}
