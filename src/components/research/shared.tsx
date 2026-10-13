import { createContext, useContext, useState, type ReactNode } from "react";
import { Link, useRouterState } from "@tanstack/react-router";
import {
  Activity,
  ArrowUpRight,
  ChevronRight,
  CircleHelp,
  Database,
  FlaskConical,
  LayoutDashboard,
  Menu,
  Network,
  Shield,
  ShieldCheck,
  Stethoscope,
  X,
} from "lucide-react";
import * as Dialog from "@radix-ui/react-dialog";
import { Button } from "@/components/ui/button";
import {
  scenarios,
  type ScenarioId,
  type OutbreakEvent,
  wardName,
  clock,
} from "@/lib/research-data";
const ResearchContext = createContext<{
  scenario: ScenarioId;
  setScenario: (id: ScenarioId) => void;
}>({ scenario: "baseline", setScenario: () => {} });
export const useResearch = () => useContext(ResearchContext);
export const nav = [
  { to: "/", name: "Overview", icon: LayoutDashboard },
  { to: "/outbreak", name: "Outbreak Replay", icon: Network },
  { to: "/diagnosis", name: "Infection Diagnosis", icon: ShieldCheck },
  { to: "/quarantine", name: "Quarantine Policy Lab", icon: Shield },
  { to: "/monitor-integrity", name: "Monitor Integrity", icon: Activity },
  { to: "/methodology", name: "Methodology & Data", icon: Database },
] as const;
export function ResearchShell({ children }: { children: ReactNode }) {
  const [scenario, setScenario] = useState<ScenarioId>("baseline");
  const [open, setOpen] = useState(false);
  const [disclaimer, setDisclaimer] = useState(false);
  const path = useRouterState({ select: (s) => s.location.pathname });
  const current = nav.find((n) => n.to === path);
  return (
    <ResearchContext.Provider value={{ scenario, setScenario }}>
      <div className="app-shell">
        {open && <div className="mobile-scrim" onClick={() => setOpen(false)} />}
        <aside className={`sidebar ${open ? "is-open" : ""}`}>
          <Link to="/" className="brand" onClick={() => setOpen(false)}>
            <span className="brand-mark">
              <Activity size={24} />
            </span>
            <span>
              Patient<span className="text-primary">Zero</span>
              <small>CYBERSECURITY RESEARCH</small>
            </span>
          </Link>
          <div className="sidebar-label">RESEARCH WORKSPACE</div>
          <nav aria-label="Main navigation">
            {nav.map((item) => (
              <Link
                key={item.to}
                to={item.to}
                activeOptions={{ exact: true }}
                activeProps={{ className: "nav-link active" }}
                inactiveProps={{ className: "nav-link" }}
                onClick={() => setOpen(false)}
              >
                <item.icon size={18} />
                <span>{item.name}</span>
                {path === item.to && <ChevronRight className="nav-arrow" size={14} />}
              </Link>
            ))}
          </nav>
          <div className="sidebar-bottom">
            <div className="workspace-status">
              <span className="status-dot" />
              <span>
                Research environment<small>Phase 1 · Demonstration</small>
              </span>
            </div>
            <Button
              variant="ghost"
              className="disclaimer-button"
              onClick={() => setDisclaimer(true)}
            >
              <CircleHelp />
              Research disclaimer
              <ArrowUpRight size={14} />
            </Button>
            <div className="sidebar-version">
              PATIENTZERO <span>v0.1.0</span>
            </div>
          </div>
        </aside>
        <div className="workspace">
          <header className="topbar">
            <div className="topbar-location">
              <Button
                variant="ghost"
                size="icon"
                className="mobile-menu"
                aria-label="Open navigation"
                onClick={() => setOpen(!open)}
              >
                <Menu />
              </Button>
              <span className="topbar-project">Workspace</span>
              <ChevronRight size={14} />
              <span>{current?.name ?? "Research"}</span>
            </div>
            <div className="topbar-actions">
              <span className="badge synthetic">
                <span className="status-dot" />
                SYNTHETIC DEMO DATA
              </span>
              <span className="dataset-status">
                <span className="status-dot" />
                Dataset ready
              </span>
              <span className="topbar-divider" />
              <label className="sr-only" htmlFor="scenario">
                Scenario
              </label>
              <select
                id="scenario"
                value={scenario}
                onChange={(e) => setScenario(e.target.value as ScenarioId)}
              >
                {scenarios.map((s) => (
                  <option key={s.id} value={s.id}>
                    {s.name}
                  </option>
                ))}
              </select>
              <div className="avatar" title="Research workspace">
                <FlaskConical size={16} />
              </div>
            </div>
          </header>
          <main className="main-content">{children}</main>
          <footer className="workspace-footer">
            <span>
              <ShieldCheck size={13} /> Isolated research environment · No live hospital connection
            </span>
            <span>
              All times are simulated <span className="footer-dot">·</span> Phase 1
            </span>
          </footer>
        </div>
        <Dialog.Root open={disclaimer} onOpenChange={setDisclaimer}>
          <Dialog.Portal>
            <Dialog.Overlay className="research-dialog-overlay" />
            <Dialog.Content className="research-modal research-dialog-content">
              <div className="panel-heading">
                <Dialog.Title asChild>
                  <h2>Research disclaimer</h2>
                </Dialog.Title>
                <Dialog.Close asChild>
                  <Button variant="ghost" size="icon" aria-label="Close disclaimer">
                    <X />
                  </Button>
                </Dialog.Close>
              </div>
              <Stethoscope className="text-primary" size={32} />
              <Dialog.Description asChild>
                <p>
                  PatientZero is an isolated cybersecurity research demonstration. Every device,
                  event, connection and outbreak statistic in Phase 1 is synthetic.
                </p>
              </Dialog.Description>
              <p>
                It is not connected to a hospital, does not diagnose patients, and must not inform
                clinical decisions. Model evaluation, counterfactual policy outcomes and monitoring
                datasets remain unverified.
              </p>
              <Button asChild onClick={() => setDisclaimer(false)}>
                <Link to="/methodology">
                  Read methodology <ArrowUpRight />
                </Link>
              </Button>
            </Dialog.Content>
          </Dialog.Portal>
        </Dialog.Root>
      </div>
    </ResearchContext.Provider>
  );
}
export function PageHeader({
  eyebrow,
  title,
  description,
  action,
}: {
  eyebrow: string;
  title: string;
  description: string;
  action?: ReactNode;
}) {
  return (
    <div className="page-header">
      <div>
        <div className="eyebrow">{eyebrow}</div>
        <h1>{title}</h1>
        <p>{description}</p>
      </div>
      {action}
    </div>
  );
}
export function Panel({
  title,
  meta,
  children,
  className = "",
}: {
  title: string;
  meta?: ReactNode;
  children: ReactNode;
  className?: string;
}) {
  return (
    <section className={`panel ${className}`}>
      <div className="panel-heading">
        <h2>{title}</h2>
        {meta}
      </div>
      {children}
    </section>
  );
}
export function Pending({ title, children }: { title: string; children?: ReactNode }) {
  return (
    <div className="pending-state">
      <FlaskConical size={25} />
      <strong>{title}</strong>
      <p>
        {children ??
          "Results will be available after data verification and reproducible evaluation."}
      </p>
      <span className="badge neutral">NOT AVAILABLE · PHASE 1</span>
    </div>
  );
}
export function EventTable({ events, limit = 8 }: { events: OutbreakEvent[]; limit?: number }) {
  return (
    <div className="table-scroll">
      <table className="event-table">
        <thead>
          <tr>
            <th>SIM. TIME</th>
            <th>EVENT TYPE</th>
            <th>SOURCE → DESTINATION</th>
            <th>WARD</th>
            <th>SEVERITY</th>
          </tr>
        </thead>
        <tbody>
          {events
            .slice(-limit)
            .reverse()
            .map((e) => (
              <tr key={e.id}>
                <td className="mono">T+{clock(e.minute)}</td>
                <td>
                  <span className={`event-dot ${e.severity.toLowerCase()}`} />
                  {e.stage}
                </td>
                <td className="mono">
                  {e.sourceId}
                  <span className="text-muted-foreground">
                    {" "}
                    {e.destinationId ? `→ ${e.destinationId}` : "—"}
                  </span>
                </td>
                <td>{wardName(e.wardId)}</td>
                <td>
                  <span
                    className={`badge ${e.severity === "High" ? "danger" : e.severity === "Medium" ? "warning" : "neutral"}`}
                  >
                    {e.severity}
                  </span>
                </td>
              </tr>
            ))}
        </tbody>
      </table>
      {events.length === 0 && (
        <div className="empty-state">No synthetic events match this time and filter selection.</div>
      )}
    </div>
  );
}
