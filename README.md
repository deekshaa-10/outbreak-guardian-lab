# Outbreak Guardian Lab

PatientZero — Phase 1: Research Application UI

Act as a senior product designer and frontend engineer. Build the first phase of PatientZero, a cybersecurity research application that simulates a Mirai botnet outbreak inside a hospital network and investigates the trade-off between cyber containment and continuity of patient care.

1. Goal

Build a polished, responsive, dark-themed research application with a persistent navigation shell, a useful overview dashboard, and the initial pages for all four research modules.

This is Phase 1. Prioritize a cohesive design system, working navigation, meaningful interactions, and realistic synthetic demonstration fixtures. Do not attempt to implement or fabricate scientific ML results yet.

Inspect the existing project before modifying it. Preserve working functionality and follow the existing stack where reasonable. If starting from scratch, use React, TypeScript, Tailwind CSS, and reusable UI components compatible with Lovable.

2. Design direction

The interface should resemble a professional hospital cybersecurity operations and research platform.

Deep navy and charcoal backgrounds.

Restrained cyan and teal accents.

Red for active threats and amber for warnings.

Clear typography, thin borders, subtle grid patterns, and compact but readable data visualizations.

Consistent spacing, accessible contrast, useful tooltips, and purposeful hover states.

Responsive desktop, tablet, and mobile layouts.

Use a consistent icon library such as Lucide.

Use Recharts for appropriate data visualizations.

Avoid generic SaaS landing pages, oversized gradient hero sections, excessive glassmorphism, decorative meaningless charts, emoji icons, and giant vanity statistics.

The application should open directly into the actual research dashboard, not a marketing landing page.

3. Application shell

Create a persistent left sidebar with the PatientZero wordmark and these navigation items:

Overview — /

Outbreak Replay — /outbreak

Infection Diagnosis — /diagnosis

Quarantine Policy Lab — /quarantine

Monitor Integrity — /monitor-integrity

Methodology & Data — /methodology

Include:

A compact top bar with the current page title.

A visible badge stating "SYNTHETIC DEMO DATA".

A dataset status indicator.

A scenario selector.

A persistent research disclaimer accessible from the main interface.

A responsive sidebar that collapses appropriately on smaller screens.

Use proper client-side routing. Every navigation item must work. Browser refreshes on application routes should work in the intended deployment environment.

4. Overview dashboard

Design an informative dashboard with the following sections.

Header

Title: "Hospital Network Research Console"

Subtitle: "Interactive outbreak simulation, detection evaluation, and care-aware containment research."

Show the active scenario, its data provenance status, and a button linking to Outbreak Replay.

Summary metrics

Include cards for:

Total simulated devices.

Currently infected devices.

Outbreak events recorded.

Critical devices in the modeled network.

Every metric must be calculated from the demonstration fixtures. Label these as simulated values. Do not imply live hospital telemetry.

Outbreak overview

Add a readable time-series chart showing cumulative infected devices over a simulated 58-minute window.

Add an event activity chart showing simulated events over time.

Both charts must use coherent, deterministic fixture data. Provide meaningful axes, tooltips, and legends. Never present illustrative values as measured real-world results.

Hospital ward overview

Display seven wards:

ICU

Emergency

Neonatal

General Ward

Operating Theatre

Radiology

Hospital Administration

Show the device count, infected count, and critical-device count for each ward, calculated from shared fixtures.

Make ward rows or cards clickable so the user can navigate to Outbreak Replay with the selected ward filter applied.

Recent event feed

Show timestamp, simulated event type, source device, destination device when applicable, ward, and severity.

Use a consistent event schema and readable status labels.

Research module shortcuts

Provide concise cards linking to Outbreak Replay, Infection Diagnosis, Quarantine Policy Lab, and Monitor Integrity. Explain what each module investigates.

5. Initial module pages

Create a consistent page layout for each module. Each page must contain real navigation and meaningful initial interactions, not dead buttons.

/outbreak — Outbreak Replay

Include:

Playback toolbar with Play, Pause, Restart, and Step Forward.

A 58-minute timeline scrubber.

Configurable playback speed.

Filters for ward, device type, infection stage, and time.

A central visualization panel reserved for the hospital network graph.

A device details side panel.

Infection trend chart.

Event history table.

For Phase 1, implement a functional, deterministic demonstration replay using shared synthetic fixtures. If the full network graph is not ready, provide a clear, useful interim visualization rather than an empty box.

/diagnosis — Infection Diagnosis

Include:

Six target stages: Scanning, Password Guessing, Malware Download, Command and Control, Spreading, and DDoS Activity.

A dataset label-schema section.

A model evaluation section with an explicit "Not yet evaluated" state.

Placeholders for macro-F1, per-class precision and recall, confusion matrix, class distribution, and baseline comparison.

A prediction inspection panel clearly distinguishing illustrative examples from trained model predictions.

Do not generate invented model performance scores. Keep evaluation metrics unavailable until actual evaluation results exist.

/quarantine — Quarantine Policy Lab

Include four policy presets:

No Intervention

Reactive Isolation

Aggressive Containment

Care-Aware Containment

Add a policy configuration interface for response delay, quarantine duration, device-level versus ward-level isolation, critical-device exceptions, and detection threshold.

Include a comparison layout for total infections, infections prevented, containment time, peak infected devices, isolated devices, care-disruption minutes, and critical devices affected.

Initially show an explicit "Simulation engine pending" or equivalent state for results that have not been calculated. Clearly separate configurable policy inputs from verified simulation outputs.

/monitor-integrity — Monitor Integrity

Title the module "Is the Monitor Lying?"

Explain that this module investigates the integrity of patient-monitoring signals and is not intended to diagnose patients.

Include panels for:

Dataset provenance and availability.

Signal visualization.

Normal versus manipulated signal comparison, only when supported by actual data.

Integrity/anomaly detection evaluation.

Leakage demonstration and evaluation methodology.

Until the dataset and evaluation are verified, use a clear "Dataset verification pending" state. Do not invent patient observations, waveforms, labels, or model results.

/methodology — Methodology & Data

Create a research documentation page with sections for:

Dataset provenance.

Event-to-device mapping.

Observed versus inferred relationships.

Synthetic hospital topology.

Simulation assumptions.

ML train/test split and leakage prevention.

Counterfactual quarantine simulation.

Care-disruption calculation.

Reproducibility and limitations.

Use readable sections, status indicators, and tables where appropriate. Mark unresolved research questions as pending instead of inventing answers.

6. Shared data architecture

Create centralized, typed demonstration fixtures for:

Seven hospital wards.

Devices and device types.

Critical-device flags.

Network connections.

Timestamped outbreak events.

Event stages.

Scenario metadata.

Use stable IDs and consistent references between devices, wards, connections, and events.

Calculate dashboard metrics and chart data from these fixtures rather than duplicating hardcoded numbers in each component.

Mark all synthetic records and derived statistics clearly. Keep the fixtures separate from future real-data adapters.

7. Functional requirements

All six routes must render.

Navigation and browser refreshes must work.

Scenario and ward filters must have meaningful effects.

Dashboard cards and charts must use consistent underlying data.

Outbreak playback controls must change the simulated time and visible state.

Restart must reset the replay.

No dead buttons or misleading loading indicators.

Provide useful empty, unavailable, and error states.

Ensure keyboard accessibility and responsive layouts.

Keep components reusable and the code maintainable.

Do not require real dataset downloads or credentials for Phase 1.

8. Completion criteria

Before declaring Phase 1 complete:

Inspect all six routes.

Test sidebar navigation and browser refresh.

Verify that dashboard metrics agree with the shared fixtures.

Test the outbreak replay controls and restart behavior.

Check responsive layouts.

Fix visible console errors and broken interactions.

Begin by briefly outlining the implementation approach, then implement Phase 1. Prioritize a cohesive, functional research UI over superficial completeness.

This project was built with [Lovable](https://lovable.dev).

**Live app**: https://outbreak-guardian-lab.lovable.app

## Build with Lovable

Continue developing this project in the [Lovable editor](https://lovable.dev/projects/ae78d2b4-6390-58db-8658-8118a2be1fce).

- **Ship faster**: describe what you want to build and Lovable handles the code.
- **Stay in sync**: every change made in Lovable is committed straight to this repository.
- **Full ownership**: this code is yours. Push to `main` on GitHub and your changes sync back into Lovable, ready for your next prompt.

## Development

Prefer working locally? You need Node.js and npm — [install with nvm](https://github.com/nvm-sh/nvm#installing-and-updating).

```sh
git clone <this-repository-url>
cd <repository-name>
npm i
npm run dev
```
