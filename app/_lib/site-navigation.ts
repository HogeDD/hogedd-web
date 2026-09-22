export const youtubeChannelUrl = "https://www.youtube.com/@HogeDD";

type NavigationItem = {
  href: string;
  label: string;
  external?: boolean;
};

export const primaryNavigation: readonly NavigationItem[] = [
  { href: "/apps", label: "Apps" },
  { href: "/mypage", label: "My Page" },
  { href: "/#about", label: "About" },
  { href: youtubeChannelUrl, label: "YouTube", external: true },
];
