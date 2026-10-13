import { TabBar } from "@/components/TabBar";

export default function EpisodeLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      {children}
      <TabBar />
    </>
  );
}
