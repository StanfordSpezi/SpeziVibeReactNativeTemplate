# AI Coding Instructions

## Stack

React Native, Expo 54, TypeScript, Expo Router, Formik + Yup

## Commands

```bash
npx expo start    # Start dev server (press i for iOS, a for Android)
npm test          # Run tests
```

## Provider Hierarchy

Order matters:

```text
StandardProvider -> SchedulerProvider -> AccountProvider -> App
```

## Critical Rules

1. **Always use Standard** - Access data via `useStandard()`, never import backends directly
2. **AccountService = auth only** - Login, register, logout, profile
3. **BackendService = data only** - Tasks, outcomes, questionnaires
4. **Cancellation tokens** - Every async effect needs `let cancelled = false`
5. **Memoize context values** - Always `useMemo` for provider values
6. **Declarative auth guards** - Use `<Redirect href=\"...\" />`, not `router.replace()`

## Skills

This generated app includes repository-local skills in `skills/`.

Use those skills for React Native specific implementation help. Do not expect legacy `.claude/commands` in generated apps.
