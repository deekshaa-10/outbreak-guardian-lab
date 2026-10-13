import { useEffect, useState } from "react";
import { Link } from "@tanstack/react-router";
import { Activity, ArrowUpRight, Database, HeartPulse, Minus, Network, Pause, Play, RotateCcw, Shield, ShieldCheck, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useResearch } from "@/components/research/shared";
import { clock, getStats, scenarios, wards } from "@/lib/research-data";
import hospitalImage from "@/assets/hospital-simulator.jpg";

const domains = [
  { to: "/outbreak", name: "Outbreak Replay", area: "EMERGENCY", icon: Network, position: "outbreak", tone: "threat" },
  { to: "/diagnosis", name: "Infection Diagnosis", area: "RADIOLOGY", icon: ShieldCheck, position: "diagnosis", tone: "research" },
  { to: "/quarantine", name: "Quarantine Policy Lab", area: "OPERATING THEATRE", icon: Shield, position: "quarantine", tone: "care" },
  { to: "/monitor-integrity", name: "Monitor Integrity", area: "CRITICAL CARE", icon: Activity, position: "monitor", tone: "research" },
  { to: "/methodology", name: "Methodology & Data", area: "RESEARCH & ADMINISTRATION", icon: Database, position: "methodology", tone: "neutral" },
] as const;

export function HospitalSimulator() {
  const { scenario } = useResearch();
  const [minute, setMinute] = useState(0);
  const [playing, setPlaying] = useState(false);
  const [zoom, setZoom] = useState(1);
  const [ward, setWard] = useState("all");
  const stats = getStats(scenario, minute);
  const wardStats = getStats(scenario, minute, ward);
  const selected = scenarios.find((item) => item.id === scenario) ?? scenarios[0];
  useEffect(() => {
    if (!playing) return;
    const timer = window.setInterval(() => setMinute((value) => Math.min(58, value + 1)), 600);
    return () => window.clearInterval(timer);
  }, [playing]);
  useEffect(() => { if (minute === 58) setPlaying(false); }, [minute]);
  useEffect(() => { setMinute(0); setPlaying(false); }, [scenario]);
  return (
    <div className="hospital-experience">
      <header className="hospital-heading">
        <div><div className="eyebrow">PATIENTZERO / HOSPITAL SIMULATOR</div><h1>Hospital research environment</h1></div>
        <span className="hospital-scenario"><span className="status-dot" /> {selected.short}</span>
      </header>
      <div className="hospital-world">
        <div className="hospital-world-meta"><span>FLOOR 01 <span className="text-muted-foreground">/ HOSPITAL NETWORK</span></span><span className="badge synthetic">ILLUSTRATIVE HOSPITAL · SYNTHETIC EVENTS</span></div>
        <div className={`hospital-stage zoom-${zoom}`}>
          <img src={hospitalImage} width={1536} height={1024} alt="Isometric cutaway hospital with emergency beds, an operating theatre, intensive care, radiology, reception and medical equipment" className="hospital-image" />
          <nav aria-label="Hospital research domains" className="hospital-domains">
            {domains.map((domain) => (
              <Button asChild variant="outline" key={domain.to} className={`hospital-domain domain-${domain.position} domain-${domain.tone}`}>
                <Link to={domain.to} search={domain.to === "/outbreak" ? { ward: "all" } : {}}>
                  <span className="domain-icon"><domain.icon /></span>
                  <span className="domain-copy"><small>{domain.area}</small><strong>{domain.name}</strong></span>
                  <ArrowUpRight className="domain-arrow" />
                </Link>
              </Button>
            ))}
          </nav>
        </div>
        <div className="hospital-legend"><span><i className="legend-dot research" /> Research domain</span><span><i className="legend-dot threat" /> Cyber threat</span><span><i className="legend-dot care" /> Care continuity</span></div>
        <div className="hospital-zoom">
          <Button variant="outline" size="icon" aria-label="Zoom out" title="Zoom out" disabled={zoom === 1} onClick={() => setZoom(1)}><Minus /></Button>
          <span>{zoom === 1 ? "100" : "125"}%</span>
          <Button variant="outline" size="icon" aria-label="Zoom in" title="Zoom in" disabled={zoom === 2} onClick={() => setZoom(2)}><Plus /></Button>
        </div>
      </div>
      <div className="hospital-timeline">
        <Button variant={playing ? "secondary" : "default"} size="icon" aria-label={playing ? "Pause hospital replay" : "Play hospital replay"} title={playing ? "Pause" : "Play"} onClick={() => { if (minute === 58) setMinute(0); setPlaying(!playing); }}>{playing ? <Pause /> : <Play />}</Button>
        <Button variant="ghost" size="icon" aria-label="Restart hospital replay" title="Restart" onClick={() => { setPlaying(false); setMinute(0); }}><RotateCcw /></Button>
        <div className="hospital-clock"><strong>T+{clock(minute)}</strong><small>{playing ? "REPLAYING" : "PAUSED"} · SYNTHETIC</small></div>
        <input type="range" min={0} max={58} value={minute} aria-label="Hospital replay minute" onChange={(event) => setMinute(Number(event.target.value))} />
        <span className="mono text-muted-foreground">58:00</span>
        <div className="hospital-counter"><Network size={15} /><strong>{stats.total}</strong><span>devices</span></div>
        <div className="hospital-counter threat"><Shield size={15} /><strong>{stats.infected}</strong><span>infected</span></div>
        <div className="hospital-counter care"><HeartPulse size={15} /><strong>{stats.critical}</strong><span>critical</span></div>
      </div>
      <section className="hospital-ward-strip" aria-label="Ward status">
        <div><label htmlFor="hospital-ward">WARD STATUS</label><select id="hospital-ward" value={ward} onChange={(event) => setWard(event.target.value)}><option value="all">All hospital wards</option>{wards.map((item) => <option value={item.id} key={item.id}>{item.name}</option>)}</select></div>
        <p><strong>{wardStats.total}</strong> devices <span> / </span><strong className="text-destructive">{wardStats.infected}</strong> infected <span> / </span><strong className="text-warning">{wardStats.critical}</strong> care-critical</p>
        <Button asChild variant="ghost" size="sm"><Link to="/outbreak" search={{ ward }}>Inspect network <ArrowUpRight /></Link></Button>
      </section>
    </div>
  );
}