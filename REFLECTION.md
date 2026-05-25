# 📜 Project Reflection: FocusForge (Botanical Sanctuary)

## 1. What was Easy?
*   **Design Synthesis**: Using Stitch to generate high-fidelity UI assets allowed us to quickly move from abstract "Mental Peace" concepts to concrete, beautiful layouts.
*   **Theming with NativeWind**: Implementing a CSS variable-based engine made the complex "inverting" of the color scheme (Deep Green <-> Celadon White) remarkably clean to manage at scale.
*   **Component Modularity**: Breaking down the Stitch HTML into reusable React Native components (`UsageRing`, `PlantCard`, `RadialTimer`) was a straightforward process that instantly improved the codebase's maintainability.

## 2. What was Difficult?
*   **Splash Animation Scaling**: Ensuring the `logo_code.mp4` video perfectly filled the viewport across varying mobile resolutions (like the Galaxy S10) and web emulation modes required several iterations. We ultimately had to use a "bulletproof" approach involving `position: fixed`, viewport units (`vw/vh`), and explicit pixel matching to bypass browser quirks.
*   **State Alignment**: Linking the "hallucinated" sample features from the Stitch designs to the project's actual PRD and Architecture (specifically the timestamp-anchored focus engine) required careful data binding to ensure the UI wasn't just a shell but a functional tool.
*   **Theme Reactivity**: transitioning from hardcoded style constants in the original template to a fully dynamic, reactive theme system meant we had to refactor almost every screen to ensure text remained legible during mode switches.

## 3. What I Learned
*   **Responsive Video Handling**: I learned that for cinematic entry experiences, serving orientation-specific assets (`9:16` vs `16:9`) combined with strict viewport-unit styling is the only way to guarantee a seamless "full-screen" feel on every device.
*   **AI Design Integration**: The build proved that AI-generated designs are most effective when treated as "Source of Truth" assets (HTML/CSS) that are surgically ported into a robust mobile framework like Expo, rather than just static screenshots.
*   **Technical Rigor**: Dealing with the `setFlag` and `router` undefined errors reinforced the importance of immediate, targeted type-checking after significant UI refactors to maintain a stable, submission-ready build.

## 4. Final Thoughts
FocusForge is no longer just a productivity app; it's an immersive digital garden. The technical journey from a generic template to a high-fidelity "Botanical Sanctuary" taught me how to bridge the gap between creative AI vision and production-grade software engineering.
