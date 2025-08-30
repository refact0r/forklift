---
applyTo: '**'
---

# forklift

## description

contributing to open source is hard. its difficult to both find repositories to contribute to, understand a specific repository/onboard it, and actually find things to contribute. i want to build a web app that streamlines the process.

### homepage and search

the app homepage should have a hero section and a searchbar, with popular repositories listed below (or personalized suggestions if we end up implementing user accounts). Searching keywords will bring up the /search page, displaying relevant repositories using the Github API. Searching a specific repository URL will bring up the /repo page, with an overview of the repository.

### repo overview page

The /repo page should focus on providing a good onboarding experience with three main sections:

1. **Quick Context** (what/who/why) - Human-readable summary answering: what the project does, who it's for, and why it matters. Based on repository full name, repository description, and README content.

2. **Project Landscape** (tech stack overview) - A concise list of technologies, languages, and skills needed. Based on GitHub's `language` field, file structure, package files (package.json, requirements.txt, etc.), and `topics` array. LLM provides minimal interpretation to clean up and format the tech stack list.

3. **Onboarding Essentials** (getting started) - Distilled setup instructions focusing on project prerequisites and installation steps. Based on README setup sections, CONTRIBUTING.md (if exists), and package files.

### issues

within the /repo page, there should be a /issues page that lists some of the open issues in the repository. these issues should be summarized with AI, and given a difficulty label (easy/medium/hard).

## technical details

This is a SvelteKit app using Svelte 5. ALWAYS FOLLOW SVELTE 5 CONVENTIONS, INCLUDING RUNES. Sveltekit/Svelte documentation can be found at /reference/svelte-llms-medium.md.

### css

Write as little CSS as possible. Make use of global styles and utility classes in /src/app.css.
