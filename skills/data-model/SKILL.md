---
name: data-model
description: Plan app-level data structures, FHIR resource mappings, storage decisions, and platform data sources for the React Native Template App.
---

# React Native Data Model Planner

Use this skill when a health data model needs to become concrete for the React Native Template App and its service layer.

## Focus

This skill is implementation-oriented. It is for translating product and clinical concepts into app entities, FHIR mappings, local storage shapes, sync behavior, and platform data sources.

## What To Plan

Work through:

- user and participant data
- observations and measurements
- tasks and schedules
- questionnaires and responses
- consent and study-related records
- conditions, medications, and care-plan style data if needed

## RN-Specific Modeling Questions

Ask:

- what data lives on device versus in a backend
- whether the app syncs with a FHIR server or another API
- whether Apple Health, Bluetooth devices, or manual entry provide measurements
- how offline behavior and sync conflict resolution should work
- what data needs round-trip-safe FHIR mappings

## Recommended Modeling Areas

### Core App Entities

Define app-facing models for:

- user or participant profile
- health observations
- tasks and completion records
- questionnaires and questionnaire responses
- consent records

For each, document:

- required fields
- optional fields
- IDs and identifier strategy
- timestamps
- source of truth

### FHIR Mapping

If the app uses FHIR, map app concepts to resources such as:

- Patient
- Observation
- Task
- Questionnaire
- QuestionnaireResponse
- Consent
- MedicationStatement
- Condition

Also define:

- terminology systems
- reference patterns
- required resource fields
- when to prefer standard fields over extensions

### Sensors and Platform Data

If the app collects device data, define:

- platform source such as Apple Health or Bluetooth peripheral input
- units and normalization
- provenance and source labeling
- refresh cadence
- missing-data behavior

### Storage and Sync

Plan:

- local cache shape
- sync ownership
- conflict handling
- retention of pending writes
- what can be read offline

## Output

Produce:

- app entity list
- mapping from app concepts to FHIR resources if applicable
- local versus remote storage decisions
- sync and provenance notes
- RN-specific modeling risks or open questions

## Checklist

- [ ] Core app entities defined
- [ ] Field requirements documented
- [ ] FHIR mapping needs assessed
- [ ] Sensor and platform data sources identified
- [ ] Storage and sync strategy outlined
- [ ] Key modeling risks documented
