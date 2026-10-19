export function Icon({ name, size = 20 }: { name: string; size?: number }) {
  const paths: Record<string, React.ReactNode> = {
    grid: <><rect x="3" y="3" width="7" height="7" rx="2" /><rect x="14" y="3" width="7" height="7" rx="2" /><rect x="3" y="14" width="7" height="7" rx="2" /><rect x="14" y="14" width="7" height="7" rx="2" /></>,
    dumbbell: <><path d="m6 6 12 12M4 9l5-5m6 16 5-5M2 7l5-5m10 20 5-5" /><path d="m3 4 4 4m9 9 4 4" /></>,
    activity: <><path d="M3 12h4l3-8 4 16 3-8h4" /></>,
    calendar: <><rect x="3" y="5" width="18" height="16" rx="2" /><path d="M7 3v4m10-4v4M3 10h18m-13 5h2m4 0h2" /></>,
    leaf: <><path d="M20 3C5 1 1 11 7 17c6 6 15 0 13-14Z" /><path d="m4 21 12-12" /></>,
    chart: <><path d="M4 3v17h17M8 15l4-5 4 2 5-7" /></>,
    user: <><circle cx="12" cy="8" r="4" /><path d="M4 21v-2a8 8 0 0 1 16 0v2" /></>,
    layers: <><path d="m12 3 10 5-10 5L2 8Zm-9 10 9 5 9-5M3 18l9 5 9-5" /></>,
    chevron: <path d="m9 5 7 7-7 7" />,
    arrow: <><path d="M4 12h16m-6-6 6 6-6 6" /></>,
    play: <path d="m8 4 12 8-12 8Z" />,
    plus: <path d="M12 4v16M4 12h16" />,
    check: <path d="m5 12 4 4L20 5" />,
    clock: <><circle cx="12" cy="12" r="9" /><path d="M12 7v5l3 2" /></>,
    target: <><circle cx="12" cy="12" r="9" /><circle cx="12" cy="12" r="5" /><circle cx="12" cy="12" r="1" /></>,
    download: <><path d="M12 3v12m-5-5 5 5 5-5M4 16v5h16v-5" /></>,
    trash: <><path d="M3 6h18M9 6V3h6v3M6 6l1 15h10l1-15M10 10v7m4-7v7" /></>,
    search: <><circle cx="10" cy="10" r="7" /><path d="m15 15 6 6" /></>,
    heart: <path d="M20 5c-3-3-6 0-8 2-2-2-5-5-8-2-5 5 3 12 8 16 5-4 13-11 8-16Z" />,
  };
  return <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">{paths[name] ?? paths.activity}</svg>;
}
