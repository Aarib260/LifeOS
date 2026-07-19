import { Providers } from "@/app/providers";
import { Desktop } from "@/components/desktop/Desktop";
import { OSBootSequence } from "@/components/desktop/OSBootSequence";

export default function OSPage() {
  return (
    <Providers>
      <OSBootSequence>
        <Desktop />
      </OSBootSequence>
    </Providers>
  );
}