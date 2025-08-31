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

Within the /repo page, there should be a /issues page that lists open issues from the repository. Each issue should be analyzed natively using OpenAI to:

- **Classify difficulty** (Easy/Medium/Hard) based on code complexity, scope, and beginner-friendliness
- **Generate topics/tags** (e.g., "docs", "api", "testing", "typescript") for categorization

The issues page should display:

- Page heading with issue count
- Table/list showing: issue number, title, difficulty badge, clickable indicator or button

### individual issue page

Clicking an issue should navigate to /repo/[owner]/[repo]/issues/[number] showing:

- **Issue details** (title, number, description, labels, GitHub link)
- **Difficulty context** explaining why it received its difficulty rating
- **AI-generated implementation guide** with suggested changes

## technical details

This is a SvelteKit app using Svelte 5. ALWAYS FOLLOW SVELTE 5 CONVENTIONS, INCLUDING RUNES. Sveltekit/Svelte documentation can be found at /reference/svelte-llms-medium.md.

### css

Write as little CSS as possible. Make use of global styles and utility classes in /src/app.css. No rounded corners.
