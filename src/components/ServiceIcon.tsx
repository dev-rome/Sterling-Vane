export type IconName =
  "scissors" | "razor" | "star" | "fade" | "beard" | "junior";

const paths: Record<IconName, React.ReactNode> = {
  scissors: (
    <>
      <circle cx="6" cy="6" r="3" />
      <circle cx="6" cy="18" r="3" />
      <path d="M8.1 8.1 20 20M8.1 15.9 20 4" />
    </>
  ),
  razor: (
    <>
      <path d="M3 15h11l6-6-2-2-8 8" />
      <path d="M3 15v2h10" />
    </>
  ),
  star: (
    <path d="M12 3l2.6 5.6 6 .7-4.5 4.1 1.2 6L12 16.4 6.7 19.4l1.2-6L3.4 9.3l6-.7z" />
  ),
  fade: (
    <>
      <path d="M4 4v6a8 8 0 0 0 16 0V4" />
      <path d="M8 4v5M12 4v7M16 4v5" />
    </>
  ),
  beard: (
    <>
      <path d="M6 9c0 7 2.7 12 6 12s6-5 6-12" />
      <path d="M6 9c2 1.5 4 2 6 2s4-.5 6-2" />
      <path d="M9 4h6" />
    </>
  ),
  junior: (
    <>
      <circle cx="12" cy="8" r="4" />
      <path d="M5 21c1-4 4-6 7-6s6 2 7 6" />
    </>
  ),
};

export function ServiceIcon({ name }: { name: IconName }) {
  return (
    <svg
      aria-hidden="true"
      viewBox="0 0 24 24"
      className="size-8.5 text-amber"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      {paths[name]}
    </svg>
  );
}
