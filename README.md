# React Native Template App

Reusable React Native and Expo template infrastructure for digital health applications.

This template has already been used successfully by five teams in the 2025/26 offering of CS342 Building for Digital Health. That track record reflects a substantial amount of thoughtful work from students, contributors, and collaborators who helped shape it into a practical starting point for teams moving from a health-app idea to a working cross-platform prototype.

[Spezi Vibe](https://github.com/StanfordSpezi/SpeziVibe) is a good place to start before diving into implementation. It provides installable planning and setup skills that can help teams move from needs finding through prototyping in a more structured way.

## Quick Start

```bash
npx create-spezivibe-app my-app
```

The CLI prompts for a backend and optional features, then generates a React Native application from this template.

## What This Repository Owns

- `cli/` for app generation
- `template/` for the base generated app
- `features/` for additive feature manifests
- `packages/` for reusable React Native libraries
- `skills/` for React Native specific implementation skills

Generated apps now embed a `skills/` folder instead of legacy `.claude/commands`.

## Skills

React Native specific skills live in [skills/](skills/) and are synced into [template/skills/](template/skills/) for generated apps.

Run:

```bash
npm run sync:skills
```

after editing any React Native skill definitions.

## How This Fits With Spezi Vibe

Spezi Vibe is the broader skills package for digital health vibe coding. A useful pattern is:

1. use Spezi Vibe to explore the problem, define the need, choose a platform, and structure the solution
2. use this React Native Template App when the project is best served by a cross-platform app
3. use the repo-local skills here for implementation, testing, release notes, and app-specific iteration

## Contributing

This repository already represents meaningful work from multiple teams, and contributions are more than welcome to help it grow further. Improvements to the generator, template architecture, reusable packages, platform integrations, documentation, and developer experience all help build on that foundation.

Promising next steps include:

- creating React Native bridges for existing iOS and Android modules in the broader Spezi ecosystem
- publishing those bridges as reusable packages so they can be adopted across React Native health apps
- integrating those published packages back into this template in a clean, maintainable way
- continuing to mature this work so it can eventually move into the broader Spezi organization

If you want to contribute, the roadmap above offers several high-impact places to jump in.

## License

This project is licensed under the MIT License. See [LICENSE.md](LICENSE.md) and [LICENSES/](LICENSES/) for details.

## Contributors

This project is developed as part of the Stanford Mussallem Center for Biodesign at Stanford University.
See [CONTRIBUTORS.md](CONTRIBUTORS.md) for the current contributor list.

![Stanford Biodesign Footer](https://raw.githubusercontent.com/StanfordBDHG/.github/main/assets/biodesign-footer-light.png#gh-light-mode-only)
![Stanford Biodesign Footer](https://raw.githubusercontent.com/StanfordBDHG/.github/main/assets/biodesign-footer-dark.png#gh-dark-mode-only)
