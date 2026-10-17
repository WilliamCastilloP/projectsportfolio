import type { PublicSettings } from "@/lib/site";

export function HomeStats({ stats }: { stats: PublicSettings["stats"] }) {
  return (
    <section className="border-y border-line bg-surface">
      <div className="mx-auto grid max-w-6xl grid-cols-2 divide-x divide-y divide-line sm:grid-cols-4 sm:divide-y-0">
        {stats.map((stat) => (
          <div key={stat.label} className="px-5 py-8 text-center sm:px-6">
            <p className="serif-display text-3xl text-fg">{stat.value}</p>
            <p className="mt-2 text-sm text-muted">{stat.label}</p>
          </div>
        ))}
      </div>
    </section>
  );
}
