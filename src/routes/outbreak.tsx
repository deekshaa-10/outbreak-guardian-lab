import { createFileRoute } from "@tanstack/react-router";
import { HospitalSimulator } from "@/components/research/hospital-workspace";
import { wards, researchHead } from "@/lib/research-data";
export const Route = createFileRoute("/outbreak")({
  validateSearch: (s: Record<string, unknown>) => ({
    ward:
      typeof s["ward"] === "string" && wards.some((w) => w.id === s["ward"])
        ? s["ward"]
        : undefined,
  }),
  head: () =>
    researchHead(
      "Outbreak Replay",
      "Replay a deterministic synthetic 58-minute Mirai outbreak across seven hospital wards.",
    ),
  component: Outbreak,
});
function Outbreak() {
  const { ward } = Route.useSearch();
  return <HospitalSimulator initialWard={ward ?? "all"} outbreak />;
}
