const paths = {
  arrow: 'M4 12h16m-6-6 6 6-6 6',
  diagonal: 'M5 19 19 5M5 5h14v14',
  sun: 'M12 3v2m0 14v2M3 12h2m14 0h2M5.6 5.6 7 7m10 10 1.4 1.4M5.6 18.4 7 17M17 7l1.4-1.4',
  moon: 'M20.9 13a9 9 0 1 1-9.9-9.9A7 7 0 0 0 20.9 13Z',
  menu: 'M4 6h16M4 12h16M4 18h16',
  close: 'm6 6 12 12M18 6 6 18',
  code: 'm8 6-6 6 6 6m8-12 6 6-6 6m-3-15-2 18',
  search: 'M21 21l-5-5',
  check: 'm5 12 4 4L19 6',
  mail: 'M3 5h18v14H3zM3 5l9 8 9-8',
  lock: 'M5 10h14v11H5zM8 10V6a4 4 0 0 1 8 0v4',
  logout: 'M9 4H4v16h5m5-13 5 5-5 5m-6-5h11',
  star: 'm12 3 2.8 5.7 6.2.9-4.5 4.4 1.1 6.2-5.6-3-5.6 3 1.1-6.2L3 9.6l6.2-.9Z',
};

export default function Icon({ name = 'arrow', size = 20, ...props }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.7"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      {...props}
    >
      {name === 'sun' && <circle cx="12" cy="12" r="4" />}
      {name === 'search' && <circle cx="10.5" cy="10.5" r="6.5" />}
      <path d={paths[name] || paths.arrow} />
    </svg>
  );
}
