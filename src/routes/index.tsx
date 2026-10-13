import { createFileRoute, Link } from "@tanstack/react-router";
import {
  ArrowRight,
  ArrowUpRight,
  Activity,
  Network,
  ShieldAlert,
  Server,
  HeartPulse,
  Layers,
  Building2,
  ShieldCheck,
  Database,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { PageHeader, Panel, EventTable, useResearch } from "@/components/research/shared";
import { ResearchChart } from "@/components/research/charts";
import { wards, scenarios, getStats, getEvents, researchHead } from "@/lib/research-data";
export const Route = createFileRoute("/")({
  head: () =>
    researchHead(
      "Hospital Network Research Console",
      "Explore a synthetic Mirai outbreak, infection-stage labels and care-aware containment research.",
    ),
  component: Overview,
});
const modules = [
  {
    to: "/outbreak",
    title: "Outbreak Replay",
    description: "Trace infection paths and replay the outbreak across hospital wards.",
    icon: Network,
  },
  {
    to: "/diagnosis",
    title: "Infection Diagnosis",
    description: "Investigate six infection stages and evaluate detection models.",
    icon: ShieldCheck,
  },
  {
    to: "/quarantine",
    title: "Quarantine Policy Lab",
    description: "Explore containment policies and their impact on continuity of care.",
    icon: ShieldAlert,
  },
  {
    to: "/monitor-integrity",
    title: "Monitor Integrity",
    description: "Examine monitoring-signal integrity and evaluation leakage.",
    icon: Activity,
  },
] as const;
function Overview() {
  const { scenario } = useResearch();
  const stats = getStats(scenario);
  const selected = scenarios.find((s) => s.id === scenario) ?? scenarios[0];
  return (
    <>
      <PageHeader
        eyebrow="OVERVIEW / RESEARCH CONSOLE"
        title="Hospital Network Research Console"
        description="Interactive outbreak simulation, detection evaluation, and care-aware containment research."
        action={
          <Button asChild size="sm">
            <Link to="/outbreak" search={{ ward: "all" }}>
              <Network />
              Open outbreak replay <ArrowRight />
            </Link>
          </Button>
        }
      />
      <div className="scenario-strip">
        <div className="scenario-icon">
          <Network size={22} />
        </div>
        <div>
          <div className="strip-label">ACTIVE SCENARIO</div>
          <strong>Mirai botnet · {selected.short}</strong>
        </div>
        <span className="badge neutral">58 MIN WINDOW</span>
        <div className="strip-provenance">
          <Database size={13} />
          Synthetic topology & event fixtures <span className="badge success">Ready</span>
        </div>
      </div>
      <div className="metrics-grid">
        {[
          {
            label: "Total simulated devices",
            value: stats.total,
            icon: Server,
            foot: "Across 7 hospital wards",
            tone: "",
          },
          {
            label: "Currently infected devices",
            value: stats.infected,
            icon: ShieldAlert,
            foot: `At simulated minute 58 · ${Math.round((stats.infected / stats.total) * 100)}% of network`,
            tone: "danger",
          },
          {
            label: "Outbreak events recorded",
            value: stats.events,
            icon: Layers,
            foot: "Six modeled infection stages",
            tone: "primary",
          },
          {
            label: "Critical devices",
            value: stats.critical,
            icon: HeartPulse,
            foot: "Continuity-of-care sensitive",
            tone: "warning",
          },
        ].map((m) => (
          <div className="metric" key={m.label}>
            <div className="metric-label">
              {m.label}
              <m.icon size={17} className="metric-icon" />
            </div>
            <div className={`metric-value ${m.tone}`}>{m.value}</div>
            <div className="metric-foot">
              <span className="status-dot" />
              {m.foot}
            </div>
            <div className="metric-foot">SIMULATED VALUE</div>
          </div>
        ))}
      </div>
      <div className="section-label">
        <h2>Outbreak overview</h2>
        <span>SCENARIO TIME · T+00:00 → T+58:00</span>
      </div>
      <div className="two-columns">
        <Panel title="Infection progression" meta={<span className="panel-meta">CUMULATIVE</span>}>
          <ResearchChart scenario={scenario} />
        </Panel>
        <Panel title="Event activity" meta={<span className="panel-meta">2-MIN INTERVALS</span>}>
          <ResearchChart scenario={scenario} activity />
        </Panel>
      </div>
      <div className="two-columns">
        <Panel
          title="Hospital ward overview"
          meta={<span className="panel-meta">7 WARDS · SYNTHETIC</span>}
        >
          <div className="table-scroll">
            <table className="ward-table">
              <thead>
                <tr>
                  <th>HOSPITAL WARD</th>
                  <th>DEVICES</th>
                  <th>INFECTED</th>
                  <th>CRITICAL</th>
                </tr>
              </thead>
              <tbody>
                {wards.map((w) => {
                  const s = getStats(scenario, 58, w.id);
                  return (
                    <tr key={w.id}>
                      <td>
                        <Link to="/outbreak" search={{ ward: w.id }} className="ward-link">
                          <span className="ward-symbol">
                            <Building2 size={12} />
                          </span>
                          {w.name}
                          <ArrowUpRight size={12} />
                        </Link>
                      </td>
                      <td>{s.total}</td>
                      <td className="infected-count">
                        {s.infected}
                        <span className="ward-bar" />
                      </td>
                      <td>{s.critical}</td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </Panel>
        <Panel
          title="Scenario context"
          meta={<span className="badge synthetic">DEMO FIXTURE</span>}
        >
          <div className="panel-content">
            <div className="eyebrow">MIRAI / HOSPITAL NETWORK</div>
            <h3>Contain the outbreak. Consider the care.</h3>
            <p className="context-copy">
              {selected.description} Investigate how connected medical devices become exposed, and
              where isolation could interrupt essential care.
            </p>
            <div className="status-row">
              <span>Data provenance</span>
              <span>Fully synthetic</span>
            </div>
            <div className="status-row">
              <span>Network relationships</span>
              <span>Modeled adjacency</span>
            </div>
            <div className="status-row">
              <span>ML & policy evaluation</span>
              <span className="badge warning">Not yet evaluated</span>
            </div>
            <Link to="/methodology" className="text-link context-link">
              Review assumptions & limitations <ArrowUpRight size={12} />
            </Link>
          </div>
        </Panel>
      </div>
      <Panel
        title="Recent outbreak events"
        className="recent-panel"
        meta={
          <Link to="/outbreak" search={{ ward: "all" }} className="text-link">
            View event history <ArrowRight size={12} />
          </Link>
        }
      >
        <EventTable events={getEvents(scenario)} limit={5} />
      </Panel>
      <div className="section-label">
        <h2>Research modules</h2>
        <span>FOUR PERSPECTIVES · ONE SHARED SCENARIO</span>
      </div>
      <div className="modules-grid">
        {modules.map((m, i) => (
          <Link key={m.to} to={m.to} className="module-card">
            <div className="module-card-top">
              <m.icon size={21} />
              <ArrowUpRight size={15} />
            </div>
            <h3>{m.title}</h3>
            <p>{m.description}</p>
            <div className="module-number">MODULE 0{i + 1}</div>
          </Link>
        ))}
      </div>
    </>
  );
}
