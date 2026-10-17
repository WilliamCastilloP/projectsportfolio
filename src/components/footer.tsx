import { LocalTime } from "@/components/local-time";

export function Footer({
  name,
  location,
  timeZone,
  socials,
}: {
  name: string;
  location: string;
  timeZone: string;
  socials: { label: string; href: string }[];
}) {
  return (
    <footer className="border-t border-line py-10">
      <div className="flex flex-col gap-6 sm:flex-row sm:items-center sm:justify-between">
        <p className="label text-faint">
          © {new Date().getFullYear()} {name}
        </p>

        <LocalTime timeZone={timeZone} location={location} />

        {socials.length > 0 ? (
          <ul className="flex flex-wrap gap-x-6 gap-y-2">
            {socials.map((social) => (
              <li key={social.href}>
                <a
                  href={social.href}
                  target="_blank"
                  rel="noreferrer noopener"
                  className="label text-faint transition-colors hover:text-fg"
                >
                  {social.label}
                </a>
              </li>
            ))}
          </ul>
        ) : (
          <span />
        )}
      </div>
    </footer>
  );
}
