PatientZero

One hacked heart monitor. 58 minutes. How far does it spread?

PatientZero is an interactive simulation of a botnet outbreak inside a fictional hospital. You watch a single compromised device infect others across the ICU, Emergency, Neonatal and other wards, then test different ways to stop it and see what each one costs.

The twist: in a hospital, stopping a cyberattack can also hurt patients. Cut off an infected admin computer and nobody notices. Cut off an ICU monitor and a nurse loses sight of a patient. PatientZero is built around that trade-off: how do you contain an outbreak without disrupting patient care?

Fictional and synthetic. Every hospital, device and event in PatientZero is simulated. It is not connected to any real hospital network and is not a clinical or security tool.

Live app: https://outbreak-guardian-lab.lovable.app

The idea

In 2016, a piece of malware called Mirai took over hundreds of thousands of internet-connected devices, mostly cameras and routers. It got in the simplest way possible: many devices still used factory passwords like admin / admin. Every infected device then tried the same trick on the devices around it, so it spread like a cold through a classroom.

Hospitals are full of connected devices: bedside monitors, infusion pumps, ventilators, scanners, workstations. PatientZero asks what a Mirai-style outbreak would look like there.

What's inside
Module	What it explores
Outbreak Replay	Watch the outbreak unfold across seven wards on a 58-minute timeline. Play, pause, scrub back, and inspect any device.
Quarantine Policy Lab	Run the same outbreak under different containment strategies, from doing nothing to isolating whole wards, and compare infections prevented against care disrupted.
Infection Diagnosis	Classify network alerts into six attack stages: scanning, password guessing, malware download, command and control, spreading, and DDoS.
Is the Monitor Lying?	Explore how a tampered patient-monitor signal might be told apart from a real one.
Methodology & Data	The rules of the simulation, its assumptions, and where the data comes from.
Current status

Done: application layout, navigation, design system, synthetic hospital of 124 devices across 7 wards (42 care-critical), filters and module pages.
In progress: the simulation engine that generates the outbreak, so that pressing Play actually runs it.
Planned: interactive hospital floor view with clickable devices, policy comparisons, and the two ML experiments.

Module pages show clear "pending" states where results don't exist yet. Nothing is faked.

Built with

React, TypeScript, Tailwind CSS and Recharts, built with Lovable.

To run it on your own computer, you need Node.js installed. Then:
```sh
git clone https://github.com/deekshaa-10/outbreak-guardian-lab.git
cd outbreak-guardian-lab
npm i
npm run dev
```
