# Agentic Workflows & Human–AI Pair Programming in Real Development

## Table of Contents

- [Workshop](#workshop)
  - [Overview](#overview)
  - [What to Expect](#what-to-expect)
  - [Getting Started](#getting-started)
- [Task](#task)
- [Human-AI Pair-Programming: A Rough Guide](#human-ai-pair-programming-a-rough-guide)
  - [IQRE Process](#iqre-process)
  - [Workshop Phases](#workshop-phases)
    - [Conception](#conception)
    - [Environment & Tickets](#environment--tickets)
    - [Implementation](#implementation)
    - [Context Management](#context-management)
    - [Presentation](#presentation)
  - [Key Guidelines](#key-guidelines)
    - [AI Collaboration](#ai-collaboration)
    - [Team Coordination](#team-coordination)
    - [Quality Assurance](#quality-assurance)
    - [Success Criteria](#success-criteria-1)

## Workshop

### Overview

In this workshop, you will work in human-AI pairs to build a Kanban board application using Claude Code as your AI partner. The focus is on practicing effective AI-assisted development, improving prompt hygiene, and fostering human oversight while collaborating with AI.

### What to Expect

You will:

- Collaborate with both human teammates and AI partners.
- Develop a Kanban board application as a team.
- Practice prompt refinement and iterative AI guidance.

### Getting Started

One developer on your team should create a new repository [using this repository as a template](https://github.com/new?template_name=fac-ws_ai_pair-programming&template_owner=TandemCreativeDev). After this, add your other team member [as a collaborator](https://docs.github.com/en/account-and-profile/setting-up-and-managing-your-personal-account-on-github/managing-access-to-your-personal-repositories/inviting-collaborators-to-a-personal-repository) for that repo.

## Task

Details of the task are contained in the [brief](BRIEF.md).

## Human-AI Pair-Programming: A Rough Guide

### IQRE Process

Follow these four steps consistently throughout the workshop:

1. **Iterate**: Share ideas/request code from AI and develop specifications or features through iteration.
2. **Question**: Review AI proposal, identify gaps, and refine through follow-up questions.
3. **Accept**: If AI proposal is acceptable, allow it to generate the code or specs.
4. **Review/Create**: Understand generated code/specs. If inspired, create a new, enhanced solution based on AI's output.
5. **Explain**: Present outputs to teammates, emphasising clear foundations and alignment.

---

### Workshop Phases

> [!NOTE]
> All prompts referred to in the below section are available [here](PROMPTS.md).

#### CONCEPTION

- **Pair Formation**: Form teams (1 frontend + 1 backend developer)
- **Repository Setup**: Following [Getting Started](#getting-started)
- **Specification Development**:
  - Once you have completed [Getting Started](#getting-started), both developers should work together on one computer for the rest of the Conception phase.
  * Sitting on the same computer, you should initialise a new instance of Claude Code. Use the GENERATE SPECS prompt to have a conversation with Claude and determine the specifications of your project. You should be discussing each answer with each other before sending it to Claude. This is a collaborative effort!
  * Use SPEC WRAP-UP prompt - this should create `FUNCTIONAL.md`, `ARCHITECTURE.md`, and `CLAUDE.md` files.
  * Push everything to your repo.

> **Output**: Initial documentation pushed to repo

#### ENVIRONMENT & TICKETS

> [!WARNING]  
> Set up your environment, install your dependencies etc. **manually**. AI can be terrible at this and using AI for setup could add a lot of config issues to your project before you can even get started.

- **Parallel Setup (now working on separate machines, using normal Git practices e.g. working on different branches)**:

  - **Frontend Dev**: Use the GENERATE TICKETS prompt to create `TICKETS.md`. Remember to follow the IQRE methodology! Check that your tickets actually make sense so that you don't end up with a lot of vague, impossibly scoped tickets that no one could follow!
  - **Backend Dev**: Set up environment, frameworks, folder structure, install dependencies

- **Coordination**: Review tickets for dependencies and overlaps

> **Output**: Ready-to-code environment with structured tickets

#### IMPLEMENTATION

Work on individual machines with separate Claude Code instances.

**Per Ticket Process**:

1. Use KICKOFF/REFRESH MEMORY prompt
2. Implement features
3. Make sure to review constantly
4. Use CONTEXT RESET after ticket completion

**Between Sessions**:

- Coordinate dependencies with teammate
- Update `CLAUDE.md` with learned standards

> **Output**: Incremental feature completion with documented PRs

#### CONTEXT MANAGEMENT

- Use `HISTORY\_[NAME].md` for context summaries
- Reset Claude's context window after each ticket
- Maintain clean workspace

> **Output**: Archived context for reference, clean workspace

#### PRESENTATION

- Demo Kanban board
- Show AI collaboration examples
- Present evolved standards
- Reflect on deliberate architectural decisions

> **Output**: 5-minute presentation with examples and demo

---

### Key Guidelines

#### AI Collaboration

- **Explicit Prompting**: Always tell Claude which files to reference (it won't do this automatically)
- **Context Management**: Use CONTEXT RESET prompt to maintain clarity
- **Standards Evolution**: Update `CLAUDE.md` when discovering new patterns

#### Team Coordination

- **Sync Regularly**: During designated progress sessions
- **Check Dependencies**: Use DEPENDENCY CHECK prompt when unclear
- **Share Learnings**: Document architectural decisions and standard updates

#### Quality Assurance

- **Follow IQRE**: Apply the four steps consistently
- **Review Obsessively**: You need to know everything the AI is generating
- **Maintain Standards**: Keep `CLAUDE.md` current and concise

#### Success Criteria

- Functional Kanban board with task management
- Effective AI collaboration patterns
- Evolved standards documented in `CLAUDE.md`
- Clear architectural decisions

**Remember**: You're the human-in-the-loop. Guide the AI, don't just accept its output.
