import { AppLaunchTracker } from "@/app/apps/_components/app-launch-tracker";

export default function AppsLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <AppLaunchTracker />
      {children}
    </>
  );
}
