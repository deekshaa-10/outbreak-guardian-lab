import { createFileRoute } from "@tanstack/react-router";
import { PageHeader, Panel, Pending } from "@/components/research/shared";
import { researchHead } from "@/lib/research-data";
export const Route = createFileRoute("/monitor-integrity")({
  head: () =>
    researchHead(
      "Is the Monitor Lying?",
      "Research monitoring-signal integrity with explicit pending dataset verification and no clinical diagnosis.",
    ),
  component: Monitor,
});
function Monitor() {
  return (
    <>
      <PageHeader
        eyebrow="MODULE 04 / MONITORING-SIGNAL INTEGRITY"
        title="Is the Monitor Lying?"
        description="Investigate the trustworthiness of patient-monitoring signals, not the diagnosis of patients."
        action={<span className="badge warning">Dataset verification pending</span>}
      />
      <div className="notice">
        <strong>Not a clinical tool.</strong> No patient observations, waveforms or integrity labels
        are loaded. Signal comparisons require verified data and cannot be inferred from the
        synthetic botnet fixtures.
      </div>
      <div className="two-columns">
        <Panel title="Dataset provenance & availability">
          <div className="panel-content">
            {[
              ["Source dataset", "Not selected / verified"],
              ["License & permitted use", "Pending review"],
              ["Patient identifiers", "No patient data loaded"],
              ["Signal channels & sampling", "Unverified"],
              ["Integrity labels", "Unavailable"],
            ].map(([a, b]) => (
              <div className="status-row" key={a}>
                <span>{a}</span>
                <span>{b}</span>
              </div>
            ))}
          </div>
        </Panel>
        <Panel title="Integrity / anomaly detection evaluation">
          <Pending title="Not yet evaluated">
            A verified dataset, reference labels and leakage-safe protocol are required before
            reporting anomaly detection performance.
          </Pending>
        </Panel>
      </div>
      <div className="two-columns">
        <Panel title="Signal visualization">
          <Pending title="Dataset verification pending">
            No waveform is displayed. Verified signal records and sampling metadata are required.
          </Pending>
        </Panel>
        <Panel title="Normal versus manipulated signals">
          <Pending title="Comparison unavailable">
            Paired, provenance-verified signals and documented manipulation procedures have not been
            supplied.
          </Pending>
        </Panel>
      </div>
      <Panel title="Leakage demonstration & evaluation methodology">
        <div className="inspection-grid">
          <div>
            <h3>Leakage risks to investigate</h3>
            <p>
              Patient overlap across splits, temporally adjacent windows, shared recording
              artifacts, and transformations fitted before splitting could inflate performance.
              These are methodological concerns, not findings from an evaluated dataset.
            </p>
          </div>
          <div>
            <h3>Verification protocol · pending</h3>
            <p>
              Define patient-level or recording-level grouping, preserve chronological boundaries,
              fit preprocessing on training data only, and report held-out evaluation with
              uncertainty. Dataset-specific choices remain pending.
            </p>
            <span className="badge neutral">NO DEMONSTRATION RESULTS</span>
          </div>
        </div>
      </Panel>
    </>
  );
}
