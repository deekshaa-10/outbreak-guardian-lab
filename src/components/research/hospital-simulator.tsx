import { useEffect, useState } from "react";
import { Link, useNavigate, useRouterState } from "@tanstack/react-router";
import { Activity, ArrowUpRight, Building2, ChevronLeft, ChevronRight, CircleHelp, Crosshair, HeartPulse, History, Layers, Menu, Minus, Network, Pause, Play, Plus, RotateCcw, Shield, StepForward, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { EventTable, nav, useResearch } from "@/components/research/shared";
import { HospitalScene, type HospitalMode } from "@/components/research/hospital-scene";
import { ResearchChart } from "@/components/research/charts";
import { clock, connections, devices, deviceTypes, getEvents, getStage, getStats, scenarios, stages, wardName, wards } from "@/lib/research-data";

export function HospitalSimulator({ initialWard = "all", outbreak = false }: { initialWard?: string; outbreak?: boolean }) {
  const { scenario, setScenario } = useResearch();
  const navigate = useNavigate();
  const path = useRouterState({ select: s => s.location.pathname });
  const [minute, setMinute] = useState(0);
  const [playing, setPlaying] = useState(false);
  const [speed, setSpeed] = useState(1);
  const [zoom, setZoom] = useState(1);
  const [ward, setWard] = useState(initialWard);
  const [mode, setMode] = useState<HospitalMode>(outbreak ? "outbreak" : "hospital");
  const [selected, setSelected] = useState<string>();
  const [panel, setPanel] = useState(true);
  const [historyOpen, setHistoryOpen] = useState(false);
  const [navigationOpen, setNavigationOpen] = useState(false);
  const [filters, setFilters] = useState(false);
  const [type, setType] = useState("all");
  const [stageFilter, setStageFilter] = useState("all");
  const [from, setFrom] = useState(0);
  const events = getEvents(scenario);
  const stats = getStats(scenario, minute, ward);
  const active = devices.find(d => d.id === selected);
  const activeStage = active ? getStage(active.id, events, minute) : undefined;
  const activeLinks = connections.filter(c => c.source === selected || c.target === selected);
  const visibleIds = new Set(devices.filter(d => (ward === "all" || d.wardId === ward) && (type === "all" || d.type === type) && (stageFilter === "all" || (stageFilter === "unaffected" ? !getStage(d.id,events,minute) : getStage(d.id,events,minute) === stageFilter))).map(d => d.id));
  const history = events.filter(e => e.minute <= minute && e.minute >= from && (ward === "all" || e.wardId === ward) && visibleIds.has(e.sourceId));
  const activeEvents = events.filter(e => e.minute <= minute && (e.sourceId === selected || e.destinationId === selected));
  useEffect(() => { setMinute(0); setPlaying(false); setSelected(undefined); }, [scenario]);
  useEffect(() => { setWard(initialWard); }, [initialWard]);
  useEffect(() => {
    if (!playing) return;
    const timer = window.setInterval(() => setMinute(t => Math.min(58,t+1)), 1000/speed);
    return () => window.clearInterval(timer);
  }, [playing,speed]);
  useEffect(() => { if (minute === 58) setPlaying(false); }, [minute]);
  function chooseWard(id: string) {
    setWard(id); setSelected(undefined); setPanel(true);
    if (path === "/outbreak") void navigate({ to: "/outbreak", search: { ward: id }, resetScroll: false });
  }
  function reset() { setMinute(0); setPlaying(false); setFrom(0); }
  function togglePlay() { if (minute === 58) setMinute(0); setPlaying(p => !p); }
  return <div className="immersive-simulator">
    <header className="sim-toolbar">
      <Button variant="ghost" size="icon" aria-label="Open research navigation" title="Research modules" onClick={() => setNavigationOpen(v => !v)}><Menu /></Button>
      <Link to="/" className="sim-brand"><Activity /><span>Patient<strong>Zero</strong></span></Link>
      <span className="sim-time mono" data-testid="replay-time">T+{clock(minute)}</span>
      <select aria-label="Scenario" value={scenario} onChange={e => { const next = scenarios.find(s => s.id === e.target.value); if (next) setScenario(next.id); }}>{scenarios.map(s => <option key={s.id} value={s.id}>{s.short}</option>)}</select>
      <div className="sim-playback"><Button size="icon" aria-label={playing ? "Pause hospital replay" : "Play hospital replay"} title={playing ? "Pause" : "Play"} onClick={togglePlay}>{playing ? <Pause /> : <Play />}</Button><Button variant="ghost" size="icon" aria-label="Restart hospital replay" title="Restart" onClick={reset}><RotateCcw /></Button></div>
      <select aria-label="Playback speed" value={speed} onChange={e => setSpeed(Number(e.target.value))}>{[0.5,1,2,4].map(s => <option value={s} key={s}>{s}× speed</option>)}</select>
      <div className="sim-mode-selector" role="group" aria-label="Hospital view mode">{([{ id: "hospital", label: "Hospital", icon: Building2 },{ id: "network", label: "Network", icon: Network },{ id: "outbreak", label: "Outbreak", icon: Shield }] as const).map(m => <Button key={m.id} variant={mode === m.id ? "secondary" : "ghost"} size="sm" aria-pressed={mode === m.id} onClick={() => setMode(m.id)}><m.icon /><span>{m.label}</span></Button>)}</div>
      <span className="sim-fiction badge synthetic">FICTIONAL · SYNTHETIC</span>
    </header>
    <div className="sim-main-scene">
      <HospitalScene mode={mode} minute={minute} events={events} ward={ward} selected={selected} visibleIds={visibleIds} zoom={zoom} onWard={chooseWard} onDevice={id => { setSelected(id); const d = devices.find(d => d.id === id); if (d) setWard(d.wardId); setPanel(true); }} />
      <div className="sim-scene-title"><span className="eyebrow">HOSPITAL ENVIRONMENT / FLOOR 01</span><h1>{outbreak ? "Outbreak Replay" : "Hospital simulation"}</h1><span>{playing ? "SIMULATION RUNNING" : "SIMULATION PAUSED"} · {mode.toUpperCase()} VIEW</span></div>
      <div className="sim-tools" role="toolbar" aria-label="Hospital tools">
        <Button variant={filters ? "secondary" : "ghost"} size="icon" title="Room selection and filters" aria-label="Room selection and filters" onClick={() => setFilters(v => !v)}><Building2 /></Button>
        <Button variant={mode === "network" ? "secondary" : "ghost"} size="icon" title="Toggle network overlay" aria-label="Toggle network overlay" onClick={() => setMode(m => m === "network" ? "hospital" : "network")}><Network /></Button>
        <Button variant="ghost" size="icon" title="Device inspection" aria-label="Device inspection" onClick={() => { setPanel(true); setFilters(true); }}><Crosshair /></Button>
        <Button variant={historyOpen ? "secondary" : "ghost"} size="icon" title="Event history" aria-label="Event history" onClick={() => setHistoryOpen(v => !v)}><History /></Button>
        <span className="sim-tool-divider" />
        <Button variant="ghost" size="icon" title="Zoom in" aria-label="Zoom in" disabled={zoom >= 1.8} onClick={() => setZoom(z => Math.min(1.8,z+0.2))}><Plus /></Button>
        <Button variant="ghost" size="icon" title="Zoom out" aria-label="Zoom out" disabled={zoom <= 0.8} onClick={() => setZoom(z => Math.max(0.8,z-0.2))}><Minus /></Button>
        <Button variant="ghost" size="icon" title="Reset view" aria-label="Reset view" onClick={() => setZoom(1)}><Layers /></Button>
      </div>
      {navigationOpen && <nav className="sim-navigation" aria-label="Research modules"><div className="sim-panel-heading"><strong>Research workspace</strong><Button variant="ghost" size="icon" aria-label="Close research navigation" onClick={() => setNavigationOpen(false)}><X /></Button></div>{nav.map(n => <Button key={n.to} asChild variant="ghost" className="sim-module-link"><Link to={n.to} search={n.to === "/outbreak" ? { ward } : {}} onClick={() => setNavigationOpen(false)}><n.icon />{n.name}<ArrowUpRight /></Link></Button>)}</nav>}
      {filters && <div className="sim-filters"><div className="sim-panel-heading"><strong>Hospital selection</strong><Button variant="ghost" size="icon" aria-label="Close filters" onClick={() => setFilters(false)}><X /></Button></div><label>Ward<select aria-label="Ward filter" value={ward} onChange={e => chooseWard(e.target.value)}><option value="all">All hospital wards</option>{wards.map(w => <option key={w.id} value={w.id}>{w.name}</option>)}</select></label><label>Equipment<select aria-label="Device type" value={type} onChange={e => setType(e.target.value)}><option value="all">All device types</option>{deviceTypes.map(t => <option key={t}>{t}</option>)}</select></label><label>Infection stage<select aria-label="Infection stage" value={stageFilter} onChange={e => setStageFilter(e.target.value)}><option value="all">All infection stages</option><option value="unaffected">No recorded activity</option>{stages.map(s => <option key={s}>{s}</option>)}</select></label><span className="mono">{visibleIds.size} matching devices</span><Button variant="outline" size="sm" onClick={() => { setType("all"); setStageFilter("all"); chooseWard("all"); }}>Clear selection</Button></div>}
      <Button className="sim-panel-toggle" variant="outline" size="icon" aria-label={panel ? "Collapse inspection panel" : "Open inspection panel"} title={panel ? "Collapse panel" : "Open panel"} onClick={() => setPanel(v => !v)}>{panel ? <ChevronRight /> : <ChevronLeft />}</Button>
      {panel && <aside className="sim-context" aria-label="Contextual inspection panel">
        <div className="sim-panel-heading"><span className="eyebrow">{active ? "DEVICE INSPECTION" : "HOSPITAL OVERVIEW"}</span>{active && <Button variant="ghost" size="icon" aria-label="Clear device selection" onClick={() => setSelected(undefined)}><X /></Button>}</div>
        <h2>{active?.id ?? (ward === "all" ? "Hospital network" : wardName(ward))}</h2>
        <p className="sim-context-subtitle">{active?.type ?? "Seven fictional care departments"}</p>
        {active ? <><div className={`sim-state ${activeStage && stages.indexOf(activeStage)>=2 ? "infected" : activeStage ? "warning" : ""}`}><span className="status-dot" />{activeStage ?? "No recorded activity"}</div><dl className="sim-detail-rows">{[["Ward",wardName(active.wardId)],["Equipment",active.type],["Synthetic IP",active.address],["Care-critical",active.critical ? "Yes" : "No"],["Adjacency links",String(activeLinks.length)]].map(([k,v]) => <div key={k}><dt>{k}</dt><dd>{v}</dd></div>)}</dl><h3>Connected equipment</h3><div className="sim-linked-devices">{activeLinks.map(c => { const id = c.source === active.id ? c.target : c.source; return <Button key={c.id} size="sm" variant="ghost" onClick={() => setSelected(id)}><Network />{id}<ArrowUpRight /></Button>; })}</div><h3>Recent device events</h3><div className="sim-mini-events">{activeEvents.length === 0 ? <p>No events at this simulated time.</p> : activeEvents.slice(-4).reverse().map(e => <div key={e.id}><span className="mono">{clock(e.minute)}</span><span>{e.stage}</span></div>)}</div></> : <><div className="sim-overview-stats"><div><strong>{stats.total}</strong><span>Simulated devices</span></div><div className="text-destructive"><strong>{stats.infected}</strong><span>Compromised devices</span></div><div><strong>{stats.critical}</strong><span>Care-critical equipment</span></div><div><strong>{stats.events}</strong><span>Recorded events</span></div></div><h3>Departments</h3><div className="sim-ward-list">{wards.map(w => { const s = getStats(scenario,minute,w.id); return <Button key={w.id} variant={ward === w.id ? "secondary" : "ghost"} size="sm" onClick={() => chooseWard(w.id)}><span>{w.name}</span><span className={s.infected ? "text-destructive mono" : "mono"}>{s.infected}/{s.total}</span></Button>; })}</div></>}
        {!outbreak && <Button asChild size="sm" variant="outline"><Link to="/outbreak" search={{ ward }}>Inspect network<ArrowUpRight /></Link></Button>}
        <p className="sim-safety"><HeartPulse />Device compromise is not patient infection. Synthetic adjacency; no observed clinical data.</p>
        <Button asChild size="sm" variant="ghost"><Link to="/methodology"><CircleHelp />Research disclaimer<ArrowUpRight /></Link></Button>
      </aside>}
      <div className="sim-bottom-caption"><span className="status-dot" />FICTIONAL HOSPITAL · {visibleIds.size} EQUIPMENT LOCATIONS<span className="sim-caption-legend">{mode !== "hospital" && <><i className="sim-key network" />Network adjacency</>}{mode === "outbreak" && <><i className="sim-key warning" />Scanning / guessing<i className="sim-key infection" />Device compromised</>}</span></div>
      {historyOpen && <section className="sim-history"><div className="sim-panel-heading"><strong>Event history · {history.length} synthetic events</strong><label>From minute<input aria-label="Events from minute" type="number" min={0} max={58} value={from} onChange={e => setFrom(Math.min(58,Math.max(0,Number(e.target.value))))} /></label><Button variant="ghost" size="icon" aria-label="Close event history" onClick={() => setHistoryOpen(false)}><X /></Button></div><EventTable events={history} limit={30} /><ResearchChart scenario={scenario} ward={ward} minute={minute} /></section>}
    </div>
    <footer className="sim-bottom-timeline"><div className="sim-timeline-actions"><Button size="icon" variant="ghost" aria-label={playing ? "Pause timeline" : "Play timeline"} title={playing ? "Pause" : "Play"} onClick={togglePlay}>{playing ? <Pause /> : <Play />}</Button><Button size="icon" variant="ghost" aria-label="Restart replay" title="Restart replay" onClick={reset}><RotateCcw /></Button><Button size="icon" variant="ghost" aria-label="Step forward" title="Step forward one minute" disabled={minute===58} onClick={() => { setPlaying(false); setMinute(m => Math.min(58,m+1)); }}><StepForward /></Button><strong className="mono">T+{clock(minute)}</strong></div><div className="sim-timeline-track"><div className="sim-event-markers">{Array.from({length:59},(_,m) => { const count=events.filter(e=>e.minute===m).length; return count ? <Button variant="ghost" key={m} className={`sim-event-marker ${m<=minute ? "passed" : ""}`} style={{left:`${m/58*100}%`}} title={`${clock(m)} · ${count} synthetic events`} aria-label={`Jump to minute ${m}`} onClick={() => { setPlaying(false); setMinute(m); }}><span /></Button> : null; })}</div><input type="range" aria-label="Hospital replay minute" min={0} max={58} value={minute} onChange={e => { setMinute(Number(e.target.value)); setPlaying(false); }} /><div className="sim-timeline-ticks">{[0,10,20,30,40,50,58].map(m => <span key={m}>{clock(m)}</span>)}</div></div><span className="sim-timeline-status mono">{playing ? "REPLAYING" : "PAUSED"}<small>58 MIN · SYNTHETIC</small></span></footer>
  </div>;
}
