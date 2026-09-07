// Line icons for the admin console. Single stroke weight, currentColor,
// sized by the caller via className so they inherit text sizing.

type IconProps = { className?: string };

function Svg({ className = "h-4 w-4", children }: IconProps & { children: React.ReactNode }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={1.75}
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      className={className}
    >
      {children}
    </svg>
  );
}

export function IconDashboard(p: IconProps) {
  return (
    <Svg {...p}>
      <rect x="3" y="3" width="7.5" height="8.5" rx="1.5" />
      <rect x="13.5" y="3" width="7.5" height="5" rx="1.5" />
      <rect x="13.5" y="11" width="7.5" height="10" rx="1.5" />
      <rect x="3" y="14.5" width="7.5" height="6.5" rx="1.5" />
    </Svg>
  );
}

export function IconInbox(p: IconProps) {
  return (
    <Svg {...p}>
      <path d="M3 13h4l1.5 3h7L17 13h4" />
      <path d="M4.6 5.5 3 13v5a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-5l-1.6-7.5A2 2 0 0 0 17.45 4H6.55a2 2 0 0 0-1.95 1.5Z" />
    </Svg>
  );
}

export function IconStore(p: IconProps) {
  return (
    <Svg {...p}>
      <path d="M4 9v10a1 1 0 0 0 1 1h14a1 1 0 0 0 1-1V9" />
      <path d="M3 9h18l-1.2-4.2A1 1 0 0 0 18.84 4H5.16a1 1 0 0 0-.96.8L3 9Z" />
      <path d="M9.5 20v-5.5h5V20" />
    </Svg>
  );
}

export function IconBox(p: IconProps) {
  return (
    <Svg {...p}>
      <path d="M21 8.2v7.6a1.6 1.6 0 0 1-.85 1.41l-7 3.6a1.6 1.6 0 0 1-1.3 0l-7-3.6A1.6 1.6 0 0 1 3 15.8V8.2a1.6 1.6 0 0 1 .85-1.41l7-3.6a1.6 1.6 0 0 1 1.3 0l7 3.6A1.6 1.6 0 0 1 21 8.2Z" />
      <path d="m3.4 7.3 8.6 4.4 8.6-4.4M12 11.7V20.6" />
    </Svg>
  );
}

export function IconTags(p: IconProps) {
  return (
    <Svg {...p}>
      <path d="M11.6 3H5a2 2 0 0 0-2 2v6.6a2 2 0 0 0 .59 1.41l7.4 7.4a2 2 0 0 0 2.82 0l6.6-6.6a2 2 0 0 0 0-2.82L13 3.59A2 2 0 0 0 11.6 3Z" />
      <circle cx="7.8" cy="7.8" r="1.3" />
    </Svg>
  );
}

export function IconArticle(p: IconProps) {
  return (
    <Svg {...p}>
      <path d="M5 3h9.5L19 7.5V21H5z" />
      <path d="M14 3v5h5" />
      <path d="M8.5 12.5h7M8.5 16h4.5" />
    </Svg>
  );
}

export function IconImage(p: IconProps) {
  return (
    <Svg {...p}>
      <rect x="3" y="4.5" width="18" height="15" rx="2" />
      <circle cx="8.5" cy="10" r="1.5" />
      <path d="m3.5 17 4.8-4.4a1.6 1.6 0 0 1 2.2 0L15 17M14 15l1.6-1.5a1.6 1.6 0 0 1 2.2 0l2.7 2.5" />
    </Svg>
  );
}

export function IconCheck(p: IconProps) {
  return (
    <Svg {...p}>
      <path d="m4.5 12.5 5 5 10-11" />
    </Svg>
  );
}

export function IconX(p: IconProps) {
  return (
    <Svg {...p}>
      <path d="M6 6l12 12M18 6 6 18" />
    </Svg>
  );
}

export function IconPhone(p: IconProps) {
  return (
    <Svg {...p}>
      <path d="M7.4 3.5h-.9A2.5 2.5 0 0 0 4 6.1C4 14 10 20 17.9 20a2.5 2.5 0 0 0 2.6-2.5v-.9a1.2 1.2 0 0 0-.86-1.15l-3-.9a1.2 1.2 0 0 0-1.28.42l-.86 1.1a12.4 12.4 0 0 1-5.5-5.5l1.1-.86a1.2 1.2 0 0 0 .42-1.28l-.9-3A1.2 1.2 0 0 0 7.4 3.5Z" />
    </Svg>
  );
}

export function IconMail(p: IconProps) {
  return (
    <Svg {...p}>
      <rect x="3" y="5" width="18" height="14" rx="2" />
      <path d="m3.6 6.5 7.3 5.3a2 2 0 0 0 2.2 0l7.3-5.3" />
    </Svg>
  );
}

export function IconPin(p: IconProps) {
  return (
    <Svg {...p}>
      <path d="M12 21c4-4.4 6-7.6 6-10.2A6 6 0 0 0 6 10.8C6 13.4 8 16.6 12 21Z" />
      <circle cx="12" cy="10.6" r="2.2" />
    </Svg>
  );
}

export function IconStar({ className = "h-4 w-4", filled = false }: IconProps & { filled?: boolean }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill={filled ? "currentColor" : "none"}
      stroke="currentColor"
      strokeWidth={1.75}
      strokeLinejoin="round"
      aria-hidden="true"
      className={className}
    >
      <path d="m12 3.6 2.6 5.3 5.9.86-4.25 4.14 1 5.86L12 17l-5.25 2.76 1-5.86L3.5 9.76l5.9-.86L12 3.6Z" />
    </svg>
  );
}

export function IconTrash(p: IconProps) {
  return (
    <Svg {...p}>
      <path d="M4.5 6.5h15M9.5 6.5V4.8a1 1 0 0 1 1-1h3a1 1 0 0 1 1 1v1.7" />
      <path d="M6.5 6.5 7.3 19a1.5 1.5 0 0 0 1.5 1.4h6.4a1.5 1.5 0 0 0 1.5-1.4l.8-12.5" />
      <path d="M10.5 10v6.5M13.5 10v6.5" />
    </Svg>
  );
}

export function IconUndo(p: IconProps) {
  return (
    <Svg {...p}>
      <path d="M4 9h9.5a5.5 5.5 0 0 1 0 11H8" />
      <path d="m8 4.5-4 4.5 4 4.5" />
    </Svg>
  );
}

export function IconPlus(p: IconProps) {
  return (
    <Svg {...p}>
      <path d="M12 5v14M5 12h14" />
    </Svg>
  );
}

export function IconExternal(p: IconProps) {
  return (
    <Svg {...p}>
      <path d="M14 4h6v6" />
      <path d="M20 4 11 13" />
      <path d="M18 14.5V19a1.5 1.5 0 0 1-1.5 1.5h-11A1.5 1.5 0 0 1 4 19V8a1.5 1.5 0 0 1 1.5-1.5H10" />
    </Svg>
  );
}

export function IconChevronRight(p: IconProps) {
  return (
    <Svg {...p}>
      <path d="m9.5 5.5 7 6.5-7 6.5" />
    </Svg>
  );
}

export function IconArrowLeft(p: IconProps) {
  return (
    <Svg {...p}>
      <path d="M20 12H4.5" />
      <path d="m10 5.5-5.5 6.5L10 18.5" />
    </Svg>
  );
}

export function IconAlert(p: IconProps) {
  return (
    <Svg {...p}>
      <path d="M12 3.8 21 19.5H3L12 3.8Z" />
      <path d="M12 10v4M12 17h.01" />
    </Svg>
  );
}

export function IconChat(p: IconProps) {
  return (
    <Svg {...p}>
      <path d="M20.5 12.4c0 4.1-3.8 7.4-8.5 7.4a9.8 9.8 0 0 1-2.7-.37L4.5 21l1.2-3.6A7 7 0 0 1 3.5 12.4C3.5 8.3 7.3 5 12 5s8.5 3.3 8.5 7.4Z" />
    </Svg>
  );
}

export function IconUsers(p: IconProps) {
  return (
    <Svg {...p}>
      <circle cx="9.5" cy="8" r="3.3" />
      <path d="M3.5 20a6 6 0 0 1 12 0" />
      <path d="M16.2 5.2a3.3 3.3 0 0 1 0 6.3M17.5 14.6A6 6 0 0 1 21 20" />
    </Svg>
  );
}

export function IconMenu(p: IconProps) {
  return (
    <Svg {...p}>
      <path d="M4 7h16M4 12h16M4 17h16" />
    </Svg>
  );
}
