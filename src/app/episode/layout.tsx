import { TabBar } from "@/components/TabBar";
import { Garde } from "@/components/Garde";

export default function EpisodeLayout({ children }: { children: React.ReactNode }) {
  return (
    <Garde>
      {children}
      <TabBar />
    </Garde>
  );
}
