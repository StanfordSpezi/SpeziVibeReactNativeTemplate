---
name: study-planner
description: Translate a digital health study design into React Native Template App structures such as onboarding, tasks, reminders, questionnaires, and platform permissions.
---

# React Native Study Planner

Use this skill when a study plan needs to become an implementation-ready plan for the React Native Template App.

## Focus

This skill assumes the team already has a study concept and now needs to map it into app behavior, mobile workflows, and technical constraints.

## Translate The Study Into App Structure

Work through:

- onboarding and consent sequence
- participant eligibility or screening flow
- recurring tasks and reminder cadence
- questionnaires and assessment timing
- passive versus active data collection
- coordinator or support escalation paths

## RN-Specific Planning Questions

Ask:

- whether the study must run on iOS, Android, or both
- whether Apple Health, Bluetooth peripherals, or background collection are essential
- whether Expo-managed workflows are sufficient or a custom native build is needed
- whether reminders should be local notifications, backend-driven notifications, or coordinator-triggered outreach

## App Mapping Areas

### Onboarding

Define:

- welcome and trust-building screens
- account creation or sign-in
- consent and study information
- profile or baseline setup
- permissions that belong before first use versus later

### Study Tasks

Translate the protocol into concrete app tasks:

- daily check-ins
- weekly questionnaires
- milestone surveys
- symptom logging
- adherence or medication tasks

For each task, define:

- trigger
- recurrence
- completion window
- what counts as missed or overdue

### Questionnaires and Assessments

Plan:

- which assessments can be short mobile check-ins
- which are better as longer scheduled sessions
- conditional logic or branching needs
- save-and-resume expectations

### Sensors and Health Data

If passive data collection is involved, define:

- data source
- permission requirements
- refresh expectations
- whether the experience must educate users about missing or delayed data

## Output

Produce:

- a study-to-app mapping
- recommended onboarding sequence
- task and reminder plan
- questionnaire and assessment structure
- platform risks or implementation blockers for the RN app

## Checklist

- [ ] Study procedures mapped to app flows
- [ ] Task cadence and windows defined
- [ ] Questionnaire strategy outlined
- [ ] Permission and sensor assumptions documented
- [ ] Cross-platform versus native-only constraints called out
