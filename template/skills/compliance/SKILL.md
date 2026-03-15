---
name: compliance
description: Plan privacy, research, and regulatory implementation details for apps built with the React Native Template App, including Expo and Apple-native integration considerations.
---

# React Native Compliance Planner

Use this skill when privacy, consent, data handling, or regulatory requirements need to be translated into concrete work inside the React Native Template App.

## Focus

This skill is React Native and Expo specific. Use it after broader compliance questions have already been framed.

## What To Review

- which data is stored on device, sent to a backend, or exported
- whether the app uses Expo-managed capabilities or custom native modules
- whether Apple-native integrations such as HealthKit or Bluetooth change permissions, consent, or review requirements
- how account deletion, export, and retention should map into actual product flows
- what app copy, settings, and support surfaces must exist

## React Native Implementation Areas

### Consent and Disclosure Flows

Plan:

- first-run disclosure order
- study consent versus product terms and privacy notices
- where users can revisit consent language later
- how version changes are communicated and re-acknowledged

### Permissions

Only request device permissions when they unlock clear value.

Review whether the app needs:

- notifications
- camera or microphone
- Bluetooth
- Apple Health access
- background behavior or motion-related access

For each permission, define:

- why it is needed
- when it is requested
- what happens if the user declines
- where the app explains how to enable it later

### Data Export and Deletion

Translate compliance requirements into product capabilities:

- a visible export path in settings or account management
- a deletion flow with clear consequences
- in-app status messaging for pending deletion or retention exceptions
- support escalation paths if deletion cannot be immediate

### RN and Expo-Specific Risks

Check for:

- sensitive data placed in logs or analytics events
- tokens or secrets stored insecurely on device
- notifications revealing sensitive data on the lock screen
- platform capability mismatches between iOS and Android
- assumptions that Expo Go supports native-health features when a custom build is actually required

## Output

Produce:

- required user-facing compliance flows
- required permission justifications and fallback states
- backend and on-device data handling expectations
- app settings and support surfaces that must exist
- RN or Expo implementation risks to address next

## Checklist

- [ ] Consent and disclosure flows mapped
- [ ] Device permissions justified and sequenced
- [ ] Export and deletion paths defined
- [ ] On-device and backend data handling expectations documented
- [ ] Platform-specific compliance risks identified
