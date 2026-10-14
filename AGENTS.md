<!-- LOVABLE:BEGIN -->
> [!IMPORTANT]
> This project is connected to [Lovable](https://lovable.dev). Avoid rewriting
> published git history — force pushing, or rebasing/amending/squashing commits
> that are already pushed — as it rewrites history on Lovable's side and the
> user will likely lose their project history.
>
> Commits you push to the connected branch sync back to Lovable and show up in
> the editor, so keep the branch in a working state.
<!-- LOVABLE:END -->

## PatientZero architecture
- Keep synthetic research fixtures and derivations in `src/lib/research-data.ts`, separate from future observed-data adapters; every view must derive from consistent records.
- The root route owns the persistent research shell and scenario context; scenario selection applies across all research modules without a backend.
- Replay is a client-side deterministic timeline over fixture events, not a scientific transmission or counterfactual engine; unavailable scientific outputs stay explicit.
- Define visual roles in `src/styles.css` and reuse the research panels and design-system Button for consistent accessible controls.
- Overview and Outbreak Replay share the immersive hospital workspace; a separate scene renderer and structured fictional spatial layout display the existing fixture timeline without generating events, keeping research state independent of presentation.
- `src/scene` owns isometric projection, room geometry and reusable SVG object sprites; `src/sim/devices.ts` extends the shared research fixtures with spatial positions rather than duplicating simulation identities.
