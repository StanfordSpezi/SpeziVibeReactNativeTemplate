# AI Coding Instructions

## Project Structure

```text
cli/           CLI tool (npx create-spezivibe-app)
packages/      @spezivibe/* npm packages
template/      Base app copied to new projects
features/      Optional features merged during generation
skills/        React Native specific skills synced into generated apps
```

## Commands

```bash
npm run sync:skills                                    # Sync repo skills into template/skills
npm test                                               # Run all tests (must pass)
npm test --workspace=@spezivibe/account                # Test specific package
npm run test:update --workspace=create-spezivibe-app   # Update CLI snapshots
```

## Critical Rules

1. **Always use Standard** - Access data via `useStandard()`, never import backends directly
2. **AccountService = auth only** - Login, register, logout, profile
3. **BackendService = data only** - Tasks, outcomes, questionnaires
4. **Cancellation tokens** - Every async effect needs `let cancelled = false`
5. **Memoize context values** - Always `useMemo` for provider values
6. **Declarative auth guards** - Use `<Redirect href="..." />`, not `router.replace()`

## Skills

- The canonical React Native skills live in `skills/`.
- Generated apps receive copies of those skills under `template/skills/`.
- Do not add or restore `template/.claude/commands/`.
