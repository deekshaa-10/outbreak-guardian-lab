import { createFileRoute } from "@tanstack/react-router";
import { HospitalSimulator } from "@/components/research/hospital-workspace";
import { researchHead } from "@/lib/research-data";

export const Route = createFileRoute("/")({
  head: () => researchHead("Hospital Simulator", "Explore PatientZero's illustrative hospital environment, synthetic outbreak timeline, and connected cybersecurity research domains."),
  component: HospitalSimulator,
});