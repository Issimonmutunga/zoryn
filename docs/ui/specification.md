# Section 1 — Vision & Design Principles

---

# 1. Purpose

Zoryn is an explainable environmental reasoning platform designed to transform environmental observations into transparent scientific discoveries.

The user interface exists to communicate **reasoning**, not merely results.

Unlike conventional GIS dashboards that primarily visualize spatial data, Zoryn visualizes the reasoning process that transforms environmental observations into scientifically supported conclusions.

The interface therefore prioritizes:

* transparency
* traceability
* scientific confidence
* explainability
* spatial context

rather than numerical dashboards or predictive outputs.

Every interaction should reinforce one central idea:

> **Every environmental conclusion should be understandable, inspectable and scientifically defensible.**

---

# 2. Product Identity

Zoryn is **not** a dashboard.

Zoryn is **not** a map viewer.

Zoryn is **not** another AI assistant.

Zoryn is an

> **Environmental Reasoning Workspace**

The map provides context.

The reasoning is the product.

This distinction should be evident within the first minute of using the application.

---

# 3. Design Principles

Every design decision should satisfy the following principles.

## 3.1 Explainability First

Every conclusion must expose:

* supporting observations
* supporting evidence
* environmental patterns
* hypothesis
* scientific rule
* scientific standard

Nothing should appear as a "black box."

---

## 3.2 Scientific Trust

The interface should communicate scientific credibility through clarity rather than visual complexity.

Trust is established by:

* traceability
* deterministic reasoning
* standards references
* explicit assumptions
* explicit limitations

not decorative graphics.

---

## 3.3 Progressive Disclosure

The interface serves users with different levels of expertise.

General users should immediately understand:

* what happened
* where
* confidence

Scientists should be able to progressively inspect:

* reasoning
* methodology
* scientific rules
* evidence
* raw observations

without leaving the application.

---

## 3.4 Spatial Context

Maps provide spatial awareness.

Maps should never dominate the reasoning.

The reasoning panel is the primary interface.

The map supports it.

---

## 3.5 Calm Interaction

Interactions should feel deliberate.

Avoid:

* flashing indicators
* unnecessary animations
* excessive notifications
* moving dashboards

Motion should communicate reasoning, not attract attention.

---

## 3.6 Minimal Cognitive Load

Every screen should answer one primary question.

Landing page

> What is Zoryn?

Explorer

> What is happening here?

Reasoning

> Why did Zoryn conclude this?

Methodology

> How does Zoryn reason?

Standards

> Which scientific guidance supports this?

Users should never wonder what a screen is trying to communicate.

---

# 4. Design Language

The interface should resemble:

* scientific field notebooks
* environmental atlases
* research publications

rather than enterprise dashboards.

Visual tone:

* restrained
* calm
* precise
* elegant
* timeless

Avoid fashionable UI effects that reduce readability.

---

# 5. Colour System

## Primary

Earth Brown

```text
#6E5845
```

Clay

```text
#8C6D52
```

Sand

```text
#EDE6D8
```

Warm White

```text
#F8F6F2
```

---

## Secondary

Sage

```text
#8A9A5B
```

Forest

```text
#48634A
```

Olive

```text
#6F7347
```

---

## Hazard Colours

Hazard colours communicate environmental state only.

They must never be reused decoratively.

| Hazard            | Colour       |
| ----------------- | ------------ |
| Drought           | Burnt Orange |
| Flood             | Blue         |
| Heat              | Crimson      |
| Vegetation Stress | Olive        |
| Compound Hazard   | Purple       |

Colour should never be the sole means of communicating information.

Icons and labels should reinforce every hazard category.

---

# 6. Typography

Typeface should prioritise readability.

Recommended:

Primary

```
Inter
```

Alternative

```
Source Sans 3
```

Scientific diagrams

```
IBM Plex Sans
```

Monospaced values

```
JetBrains Mono
```

Typography should establish hierarchy through weight and spacing rather than excessive size differences.

---

# 7. Spacing System

Base spacing unit

```
8 px
```

Spacing scale

```
8

16

24

32

48

64
```

No arbitrary spacing values should be introduced.

---

# 8. Iconography

Icons should be:

* outline style
* consistent stroke width
* visually quiet

Recommended library

```
Lucide
```

Icons should support recognition, not decoration.

---

# 9. Motion

Animation should explain system behaviour.

Acceptable animations:

* panel expansion
* map transitions
* reasoning replay
* timeline progression

Avoid:

* bouncing
* spinning loaders
* exaggerated easing
* decorative motion

Target duration

```
150–300 ms
```

Reasoning replay is the only intentionally slower animation because it communicates scientific inference.

---

# 10. Accessibility

The interface should conform to WCAG 2.2 AA where practical.

Requirements:

* keyboard navigable
* visible focus indicators
* colour-independent communication
* sufficient contrast
* screen-reader friendly labels
* scalable typography

Scientific information should remain understandable without colour.

---

# 11. Performance Goals

Target application behaviour:

Initial load

```
< 2 seconds
```

Map interaction

```
60 FPS
```

Panel transitions

```
< 200 ms
```

Discovery retrieval

```
< 100 ms
```

No blocking operations should occur during normal interaction.

---

# 12. User Experience Statement

Every screen should leave the user with the same impression:

> **Zoryn does not ask users to trust its conclusions. It enables them to verify them.**

The interface is therefore an extension of the scientific reasoning engine itself.

Excellent. Section 1 defines **who Zoryn is**. Section 2 defines **how users experience it**.

From this point onward, every screen we build should be derivable from this section.

---


# Section 2 — Information Architecture

---

# 2.1 Purpose

The information architecture defines how users move through Zoryn.

Navigation should follow the natural workflow of environmental reasoning rather than software functionality.

The application is organised around answering progressively deeper questions:

```text
What is Zoryn?

↓

What is happening?

↓

Why is it happening?

↓

How did Zoryn conclude this?

↓

What scientific evidence supports it?
```

Every page should answer one primary question.

---

# 2.2 Navigation Philosophy

Navigation should remain intentionally small.

Users should never need to search through dozens of menus.

The pilot consists of five primary destinations.

```text
Home

Explorer

Methodology

Scientific Standards

About
```

Future modules can be added later without changing the overall structure.

---

# 2.3 Global Navigation

Desktop navigation.

```text
 --------------------------------------------------------------
| ZORYN                                   Search          About |
 --------------------------------------------------------------
| Home | Explorer | Methodology | Standards |
 --------------------------------------------------------------
```

Only one navigation bar exists.

No secondary side navigation.

---

# 2.4 Screen Hierarchy

```text
Home
│
├── Explorer
│      │
│      ├── Discovery
│      ├── Reasoning
│      ├── Timeline
│      └── Scientific Basis
│
├── Methodology
│
├── Standards
│
└── About
```

The hierarchy remains intentionally shallow.

No screen should be more than two navigation levels deep.

---

# 2.5 Home

Primary objective

Introduce Zoryn.

Primary question

```text
What is Zoryn?
```

Contains

* Logo
* Mission
* Launch Explorer
* Explore Methodology
* Short reasoning animation

The home page should not contain maps.

---

# 2.6 Explorer

Primary objective

Explore environmental discoveries spatially.

Primary question

```text
What is happening here?
```

Layout

```text
 ----------------------------------------------------------
| Search                                     Time Slider   |
 ----------------------------------------------------------
|                          |                               |
|                          |                               |
|          MAP             |      Reasoning Workspace      |
|                          |                               |
|                          |                               |
 ----------------------------------------------------------
```

The Explorer is the operational workspace.

---

# 2.7 Reasoning Workspace

The reasoning workspace occupies the right-hand side of the Explorer.

It is organised into tabs.

```text
Discovery

Reasoning

Methodology

Timeline

Standards
```

Each tab answers a different scientific question.

---

## Discovery

Answers

```text
What did Zoryn conclude?
```

Contains

* discovery
* confidence
* summary

---

## Reasoning

Answers

```text
Why?
```

Contains

* evidence
* patterns
* hypothesis
* reasoning replay

---

## Methodology

Answers

```text
How does this reasoning work?
```

Contains

* reasoning chain
* definitions
* assumptions
* limitations

---

## Timeline

Answers

```text
How did this evolve?
```

Contains

* historical discoveries
* confidence evolution
* observation history

---

## Standards

Answers

```text
Which scientific guidance supports this?
```

Contains

* applied standards
* applied rules
* references

---

# 2.8 Search

Search should always remain visible.

Supported initially

* H3 ID

Future

* location name
* administrative region
* coordinates

Search should immediately move the map.

---

# 2.9 User Journey

### Scientist

```text
Open Zoryn

↓

Read methodology

↓

Open Explorer

↓

Select H3

↓

Inspect reasoning

↓

Inspect standards

↓

Verify evidence

↓

Draw conclusion
```

---

### Policy Maker

```text
Open Explorer

↓

View hazard

↓

Read summary

↓

Confidence

↓

Scientific basis
```

---

### Researcher

```text
Methodology

↓

Scientific rules

↓

Explorer

↓

Replay reasoning

↓

Timeline

↓

Compare discoveries
```

---

# 2.10 Application States

Every screen supports five states.

```text
Loading

Ready

Empty

Error

Offline
```

These states should look consistent throughout the application.

---

# 2.11 Empty States

Example

```text
No discovery available.

This location currently has no
environmental discovery for the
selected date.
```

Empty states should explain the absence of information rather than implying failure.

---

# 2.12 Error States

Errors should describe:

* what failed
* why
* possible recovery

Avoid

```text
Something went wrong.
```

Prefer

```text
Knowledge dataset could not be loaded.
```

---

# 2.13 Loading

Loading should communicate progress.

Prefer skeleton placeholders.

Avoid spinners unless an operation exceeds approximately one second.

---

# 2.14 Mobile

The pilot targets desktop first.

Mobile should remain functional but simplified.

Explorer

```text
Map

↓

Reasoning

↓

Methodology
```

Panels become stacked vertically.

---

# 2.15 Future Expansion

Reserved navigation.

```text
Hazards

Rules

Knowledge Graph

Datasets

Administration
```

These should not appear in the pilot but should not require redesign when introduced.

---

# 2.16 Information Hierarchy

Every screen should follow the same order.

```text
Question

↓

Answer

↓

Confidence

↓

Evidence

↓

Scientific Basis

↓

Methodology
```

Never reverse this order.

Users naturally seek increasing levels of detail.

---

# 2.17 Design Constraint

Navigation should never expose implementation details.

Users should never encounter concepts such as:

* Pattern IDs
* Hypothesis IDs
* Evidence IDs
* Internal tables
* Repository objects

The application communicates scientific reasoning, not database structure.

---

# 2.18 Architectural Principle

The UI is organised around **questions**, not software modules.

Each screen exists because a user has a scientific question.

This ensures the interface remains intuitive while preserving the transparency required for environmental reasoning.

Excellent. This is where the specification becomes implementation-ready. From here onwards, a frontend engineer should be able to build the application without making design decisions.

---

# Section 3 — Screen Specifications

---

# 3.1 Overview

The pilot consists of five screens.

```text
Home

Explorer

Methodology

Scientific Standards

About
```

Each screen has a single primary purpose.

No screen should attempt to answer multiple unrelated questions.

---

# 3.2 Home

## Purpose

Introduce Zoryn and establish trust before users begin exploring.

The home page should feel more like the opening page of a scientific publication than a software landing page.

---

## Layout

```text
┌──────────────────────────────────────────────────────────────┐
│                         Navigation                           │
├──────────────────────────────────────────────────────────────┤
│                                                              │
│                      ZORYN Logo                              │
│                                                              │
│          Environmental Reasoning Engine                      │
│                                                              │
│              Observe • Reason • Protect                      │
│                                                              │
│      [ Launch Explorer ]   [ Methodology ]                   │
│                                                              │
├──────────────────────────────────────────────────────────────┤
│                                                              │
│            Animated Reasoning Pipeline                       │
│                                                              │
│ Observation → Signature → Evidence → Discovery               │
│                                                              │
├──────────────────────────────────────────────────────────────┤
│                                                              │
│                  Introduction                                │
│                                                              │
└──────────────────────────────────────────────────────────────┘
```

---

## Components

Hero

Contains

* Logo
* Name
* Mission statement
* Two primary buttons

---

Reasoning animation

A subtle animation introducing the reasoning chain.

Duration

```
4–6 seconds
```

Loop continuously.

---

Introduction

Approximately three short paragraphs.

No technical terminology.

---

## User Actions

Launch Explorer

Navigate to Explorer.

---

Methodology

Navigate to Methodology page.

---

# 3.3 Explorer

## Purpose

Interactive scientific reasoning workspace.

This becomes the primary application screen.

---

## Layout

```text
┌──────────────────────────────────────────────────────────────────────────────┐
│ Navigation                                           Search      Time Slider │
├───────────────────────────────────────────────┬──────────────────────────────┤
│                                               │                              │
│                                               │                              │
│                                               │                              │
│                                               │                              │
│                Interactive Map                │      Reasoning Workspace     │
│                                               │                              │
│                                               │                              │
│                                               │                              │
│                                               │                              │
├───────────────────────────────────────────────┴──────────────────────────────┤
│ Status Bar                                                           Ready   │
└──────────────────────────────────────────────────────────────────────────────┘
```

---

## Map Panel

Occupies

```
70%
```

of available width.

Contains

* Base map
* H3 polygons
* Legend
* Zoom controls
* Layer selector
* Search result highlight

No charts.

No floating dialogs.

---

## Right Panel

Occupies

```
30%
```

of width.

Scrollable independently.

Contains tabbed reasoning workspace.

---

# 3.4 Discovery Tab

Primary question

```
What did Zoryn conclude?
```

Layout

```text
Discovery

Developing Meteorological Drought

Reasoning Confidence

█████████░

Summary

...

Location

...

Time

...

Scientific Basis

WMO SPI
```

---

Information order

1 Discovery

2 Confidence

3 Summary

4 Metadata

5 Scientific Basis

---

# 3.5 Reasoning Tab

Primary question

```
Why?
```

Layout

```text
Evidence

SPI ↓

Rainfall anomaly ↓

────────────────────────

Patterns

Persistent Dryness

────────────────────────

Hypothesis

Developing Meteorological Drought

────────────────────────

Replay Reasoning ▶
```

This page contains no maps.

Only reasoning.

---

# 3.6 Methodology Tab

Primary question

```
How did Zoryn reason?
```

Layout

```text
Observation

↓

Environmental Signature

↓

Relationship

↓

Evidence

↓

Pattern

↓

Hypothesis

↓

Discovery
```

Selecting a node displays

Definition

Purpose

Inputs

Outputs

Applied Rule

---

# 3.7 Timeline Tab

Primary question

```
How has this evolved?
```

Contains

* observation timeline
* discovery timeline
* confidence evolution

Future enhancement

Animated replay.

---

# 3.8 Standards Tab

Primary question

```
Which scientific standards support this?
```

Layout

```text
Scientific Basis

✓ WMO SPI User Guide

Applied Rule

Persistent Dryness Rule

Reason

Three consecutive decreases
in SPI.

Reference

...
```

Every discovery should expose at least one scientific reference.

---

# 3.9 Methodology Page

Purpose

Explain Zoryn itself.

Sections

```text
Introduction

↓

Philosophy

↓

Environmental Reasoning

↓

Knowledge Model

↓

Scientific Rules

↓

Validation

↓

Limitations

↓

References
```

No application controls.

This page reads like a scientific publication.

---

# 3.10 Standards Page

Purpose

Document all supported standards.

Cards

```text
WMO SPI

Implemented

────────────

IPCC

Available

────────────

FAO

Available
```

Future standards remain visible but marked

```
Planned
```

---

# 3.11 About

Purpose

Explain the project.

Contains

Mission

Goals

Architecture overview

Version

License

Repository

Authors

---

# 3.12 Search Behaviour

Supported

* H3 ID

Future

* Coordinates
* Administrative regions
* Named locations

Selecting a result

* zooms map
* highlights H3
* loads explanation

---

# 3.13 Time Slider

Position

Top of Explorer.

Behaviour

Changing time updates

* map colouring
* reasoning
* discovery
* confidence

The interface should represent

> "What would Zoryn conclude using only observations available at this date?"

---

# 3.14 Responsive Behaviour

Desktop

Two-column layout.

Tablet

Map

↓

Reasoning

Mobile

Map

↓

Discovery

↓

Reasoning

↓

Methodology

Navigation becomes a bottom navigation bar.

---

# 3.15 Loading Behaviour

Map

Skeleton.

Reasoning

Skeleton cards.

Time slider

Disabled until loaded.

Avoid blank screens.

---

# 3.16 Empty Discovery

Display

```text
No Environmental Discovery

No supported environmental
reasoning was produced for
this location and date.

Possible reasons

• Insufficient evidence

• No recognised pattern

• No supported hypothesis
```

This distinguishes "no discovery" from an application error.

---

# 3.17 Error Screen

Should explain

* what failed
* likely cause
* recovery

Example

```text
Knowledge dataset unavailable.

Verify that the exported
knowledge repository exists.
```

Never display stack traces or internal exceptions to the user.

---

# 3.18 Screen Design Rule

Every screen should satisfy the following hierarchy:

```text
Question

↓

Answer

↓

Confidence

↓

Evidence

↓

Scientific Basis

↓

Methodology
```

The interface should never begin with implementation details or raw data.

---
Excellent. This section is the most important one for implementation. If done well, every screen in Zoryn will feel like it belongs to the same system.

---


# Section 4 — Component Library

---

# 4.1 Philosophy

Components are the visual vocabulary of Zoryn.

Every component should communicate one concept only.

Components must be:

* reusable
* predictable
* accessible
* scientifically neutral
* visually calm

The component library should remain intentionally small.

If two components communicate the same idea, only one should exist.

---

# 4.2 Component Hierarchy

```text
Foundation

↓

Controls

↓

Information

↓

Scientific

↓

Spatial

↓

Layout
```

---

# 4.3 Foundation Components

## Button

Purpose

Perform actions.

Variants

```text
Primary

Secondary

Ghost

Danger
```

Primary

Earth brown.

Used only for important actions.

Examples

```text
Launch Explorer

Explain Discovery

Replay Reasoning
```

---

## Icon Button

Square.

Used for

* Zoom
* Layers
* Search
* Settings

Never contains text.

---

## Input

Used for

* Search
* Coordinates
* H3 ID

Rounded corners.

No decorative borders.

---

## Divider

Used to separate scientific concepts.

Never decorative.

---

# 4.4 Layout Components

## Navigation Bar

Persistent.

Contains

```text
Logo

Home

Explorer

Methodology

Standards

About

Search
```

Height

```text
64 px
```

---

## Page Container

Maximum width

```text
1600 px
```

Centered.

---

## Panel

Used throughout the application.

Variants

```text
Standard

Scientific

Highlighted
```

Panels never float over the map.

---

## Tabs

Used only inside the Reasoning Workspace.

```text
Discovery

Reasoning

Methodology

Timeline

Standards
```

No nested tabs.

---

# 4.5 Information Components

## Card

Generic information container.

Used sparingly.

---

## Summary Card

Displays

```text
Title

Summary

Confidence

Status
```

---

## Metadata Card

Displays

```text
Location

Date

Variables

Dataset
```

---

## Status Badge

Examples

```text
Implemented

Available

Planned

Experimental
```

Colour independent.

Always includes text.

---

# 4.6 Scientific Components

These define the identity of Zoryn.

---

## Discovery Card

Purpose

Display the environmental conclusion.

Contains

```text
Discovery

Confidence

Summary

Scientific Basis
```

Largest component in the workspace.

---

## Confidence Meter

Purpose

Communicate reasoning confidence.

Not a progress bar.

Layout

```text
Reasoning Confidence

█████████░

High

Supported by

58 Evidence

18 Patterns

1 Rule
```

Scientists care more about support than percentages.

---

## Evidence List

Purpose

Present supporting evidence.

Each item

```text
SPI

↓

Strength

Timestamp
```

No charts.

Simple list.

---

## Pattern Card

Purpose

Display recognised environmental pattern.

Contains

```text
Pattern

Frequency

Confidence

Rule
```

---

## Hypothesis Card

Purpose

Explain inferred environmental condition.

Contains

```text
Hypothesis

Supporting Patterns

Confidence
```

---

## Scientific Basis Card

Purpose

Connect reasoning to standards.

Contains

```text
Scientific Standard

Applied Rule

Reason

Reference
```

Every discovery includes at least one.

---

## Assumptions Card

Purpose

Expose scientific assumptions.

Example

```text
Assumptions

SPI represents precipitation anomaly.

Monthly aggregation.

Complete historical observations.
```

---

## Limitations Card

Purpose

Communicate uncertainty honestly.

Example

```text
Limitations

No soil moisture.

Meteorological drought only.

Vegetation not considered.
```

This greatly improves scientific credibility.

---

# 4.7 Reasoning Components

These distinguish Zoryn from GIS software.

---

## Reasoning Chain

Layout

```text
Observation

↓

Signature

↓

Relationship

↓

Evidence

↓

Pattern

↓

Hypothesis

↓

Discovery
```

Every node clickable.

---

## Reasoning Replay

Purpose

Animate the reasoning process.

Sequence

```text
Observation

↓

Signature

↓

Relationship

↓

Evidence

↓

Pattern

↓

Hypothesis

↓

Discovery
```

Approximately

```text
4–6 seconds
```

Animation should feel educational.

Not theatrical.

---

## Methodology Viewer

Displays

Definition

Purpose

Inputs

Outputs

Scientific Rule

Limitations

One node at a time.

---

# 4.8 Spatial Components

## Map

Purpose

Provide spatial context.

Not analytical interface.

Contains

* H3 polygons
* Base map
* Legend

Nothing else.

---

## Layer Selector

Simple checklist.

```text
Discoveries

Administrative Boundaries

Basemap
```

Future hazards appear automatically.

---

## Legend

Dynamic.

Shows only visible layers.

---

## Search Result Highlight

Pulse once.

Remain selected.

Avoid continuous animation.

---

# 4.9 Timeline Components

## Time Slider

Single global slider.

Updates

* map
* reasoning
* discovery
* confidence

Never only the map.

---

## Timeline Chart

Simple line.

No multiple axes.

Shows

Confidence

or

Discovery state

Not both simultaneously.

---

# 4.10 Feedback Components

## Empty State

Purpose

Explain absence.

Not failure.

---

## Error State

Explain

* problem
* cause
* recovery

---

## Loading Skeleton

Used instead of spinners.

Reasoning panel

Discovery card

Methodology

Timeline

---

## Toast

Used rarely.

Maximum

```text
3 seconds
```

No stacking.

---

# 4.11 Accessibility Rules

Every component must support

* keyboard navigation
* screen readers
* focus visibility
* high contrast
* scalable text

Icons never communicate meaning alone.

---

# 4.12 Component States

Every interactive component supports

```text
Default

Hover

Focus

Active

Disabled

Loading
```

States must remain visually consistent.

---

# 4.13 Naming Convention

Components use domain terminology.

Examples

```text
DiscoveryCard

EvidenceList

ScientificBasisCard

ReasoningChain

MethodologyViewer

ConfidenceMeter

TimeSlider
```

Avoid generic names such as

```text
Card1

InfoPanel

Widget
```

---

# 4.14 Component Design Rule

Every component must answer exactly one question.

Example

Confidence Meter

Question

```text
How confident is the reasoning?
```

Scientific Basis Card

Question

```text
Which scientific guidance supports this?
```

Reasoning Chain

Question

```text
How was the conclusion reached?
```

If a component answers multiple unrelated questions, it should be decomposed.

---

# 4.15 Identity Principle

A user should be able to remove the map entirely and still recognise the application as Zoryn.

The defining components are:

* Reasoning Chain
* Discovery Card
* Scientific Basis Card
* Confidence Meter
* Reasoning Replay

These components express the identity of Zoryn more strongly than any map or chart.

---
Excellent. This is the last section. It should answer one question:

> **How should Zoryn feel?**

This section is what prevents the frontend from becoming "functional but ordinary."

---


# Section 5 — Interaction, Motion & Implementation Guidelines

---

# 5.1 Purpose

Interactions are not decorative.

Every transition, animation and response should communicate scientific reasoning, system state or user intent.

Users should never wait without understanding why.

Likewise, the application should never animate without conveying information.

Motion is therefore considered part of the reasoning process rather than visual embellishment.

---

# 5.2 Interaction Philosophy

Every interaction should satisfy four principles.

## Immediate

The interface should acknowledge user actions immediately.

Even when data requires loading, the user should receive instant visual feedback.

---

## Predictable

The same interaction should always produce the same result.

Scientific systems should avoid surprising behaviour.

---

## Reversible

Users should always be able to return to a previous state.

Navigation should never trap users.

---

## Explainable

Every interaction should reveal more understanding rather than more interface.

---

# 5.3 Primary User Flow

The ideal pilot demonstration.

```text
Open Zoryn

↓

Launch Explorer

↓

Map loads

↓

Discoveries appear

↓

Select H3 Cell

↓

Reasoning Workspace opens

↓

Review Discovery

↓

Inspect Evidence

↓

Inspect Scientific Basis

↓

Replay Reasoning

↓

Understand conclusion
```

This entire journey should require fewer than three minutes for a first-time user.

---

# 5.4 Discovery Interaction

Selecting an H3 cell should produce exactly one interaction.

```text
Click H3

↓

Highlight Cell

↓

Reasoning Panel Updates

↓

Discovery Card Appears

↓

Reasoning Available
```

No popups.

No floating windows.

No modal dialogs.

The map remains visible at all times.

---

# 5.5 Search Interaction

User enters

```text
H3 ID
```

System

```text
Locate

↓

Zoom

↓

Highlight

↓

Load Explanation
```

Search should never require pressing multiple buttons.

---

# 5.6 Timeline Interaction

Moving the timeline should update

* discovery
* reasoning
* confidence
* evidence

not merely the map.

The timeline is a scientific replay mechanism.

---

# 5.7 Reasoning Replay

Purpose

Allow users to observe how Zoryn reached a conclusion.

Sequence

```text
Observation

↓

Environmental Signature

↓

Relationship

↓

Evidence

↓

Pattern

↓

Hypothesis

↓

Discovery
```

Each stage appears sequentially.

Nodes already completed remain visible.

The animation should communicate accumulation of reasoning.

---

Duration

```text
5 seconds
```

Replay speed should be adjustable.

---

# 5.8 Hover Behaviour

Hover should only reveal

* definition
* additional context
* available actions

Hover should never reveal essential information.

Essential information must always remain visible.

---

# 5.9 Click Behaviour

Clicks perform actions.

Hover provides explanation.

These responsibilities should never overlap.

---

# 5.10 Keyboard Navigation

Supported shortcuts

| Shortcut | Action             |
| -------- | ------------------ |
| /        | Focus Search       |
| Esc      | Close active panel |
| ← →      | Move Timeline      |
| Space    | Replay Reasoning   |
| M        | Open Methodology   |
| S        | Open Standards     |

Every interaction should remain possible without a mouse.

---

# 5.11 Motion System

Animation durations

| Interaction     | Duration |
| --------------- | -------- |
| Hover           | 120 ms   |
| Panel           | 200 ms   |
| Map transition  | 250 ms   |
| Timeline update | 250 ms   |
| Replay          | 5 s      |

Animations should use ease-in-out.

Avoid elastic or bouncing transitions.

---

# 5.12 Loading Behaviour

Use skeleton components.

Never show empty white screens.

Loading order

```text
Application

↓

Navigation

↓

Map

↓

Reasoning Panel

↓

Scientific Details
```

The interface should become progressively usable.

---

# 5.13 Error Recovery

Every error should include

* What happened
* Why
* Recovery

Example

```text
Knowledge dataset unavailable.

Verify that the exported knowledge
repository has been generated.
```

Never expose stack traces.

---

# 5.14 Offline Behaviour

If the API becomes unavailable

Map remains usable.

Previously loaded discoveries remain available.

Reasoning panel indicates

```text
Offline

Displaying cached knowledge.
```

---

# 5.15 Performance Budget

Initial page

```text
<2 seconds
```

Discovery retrieval

```text
<100 ms
```

Map redraw

```text
<16 ms
```

Replay start

```text
<100 ms
```

No interaction should block the interface.

---

# 5.16 Design Tokens

## Border Radius

```text
Small   4 px

Medium  8 px

Large   16 px
```

---

## Shadow

Single elevation system.

Three levels

```text
Low

Medium

High
```

No coloured shadows.

---

## Border

```text
1 px
```

Neutral grey.

---

## Grid

```text
8 px
```

Entire application uses the same spacing grid.

---

# 5.17 Responsiveness

Desktop

```text
≥1280 px
```

Two-column workspace.

---

Tablet

```text
768–1279 px
```

Collapsible reasoning panel.

---

Mobile

```text
≤767 px
```

Single-column.

Reasoning becomes stacked beneath the map.

---

# 5.18 Accessibility

Every interaction must support

* keyboard
* screen readers
* reduced motion
* colour blindness
* high contrast mode

Animations should respect the operating system's "Reduce Motion" preference.

---

# 5.19 Frontend Technology

Recommended stack

| Layer      | Technology               |
| ---------- | ------------------------ |
| Framework  | React                    |
| Language   | TypeScript               |
| Build      | Vite                     |
| Styling    | Tailwind CSS             |
| Components | shadcn/ui                |
| Icons      | Lucide                   |
| Maps       | MapLibre GL JS           |
| State      | TanStack Query + Zustand |
| Charts     | Apache ECharts           |
| Animations | Framer Motion            |

The stack is selected for long-term maintainability, strong TypeScript support, and a clean separation between data, state, mapping, and UI.

---

# 5.20 Visual Quality Checklist

Before a release, every screen should satisfy:

* □ One primary question per screen.
* □ No unnecessary visual elements.
* □ Scientific reasoning is more prominent than the map.
* □ Every discovery exposes its evidence.
* □ Scientific standards are visible.
* □ Assumptions are explicit.
* □ Limitations are explicit.
* □ Confidence is contextualised.
* □ Navigation is consistent.
* □ Loading states are graceful.
* □ Empty states are informative.
* □ Keyboard navigation is complete.
* □ WCAG 2.2 AA principles are met where practical.

---

# 5.21 Pilot Acceptance Criteria

The pilot is complete when a first-time user can:

1. Understand what Zoryn is within one minute.
2. Explore discoveries without instruction.
3. Click any H3 cell and understand the conclusion.
4. Trace every conclusion back to evidence and scientific standards.
5. Replay the reasoning process.
6. Distinguish between conclusions, assumptions, and limitations.
7. Leave the application understanding **how** Zoryn reasons, not just **what** it concluded.

---

# 5.22 Final Design Principle

Every interface decision should reinforce a single statement:

> **Zoryn does not ask users to trust environmental conclusions. It provides the evidence, reasoning, and scientific context required for users to evaluate them independently.**

---

# Document Completion

With this section, the UI specification is complete. Together, the five sections define:

* **Identity** — what Zoryn is.
* **Structure** — how users navigate it.
* **Screens** — what each page contains.
* **Components** — the reusable building blocks.
* **Behaviour** — how the application responds and feels.
