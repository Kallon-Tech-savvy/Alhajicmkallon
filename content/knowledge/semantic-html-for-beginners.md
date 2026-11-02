---
slug: "semantic-html-for-beginners"
title: "What is semantic HTML, and where should a beginner start?"
category: "HTML foundations"
topics: ["HTML", "accessibility"]
date: "2026-11-02"
readTime: "4 min with practice"
excerpt: "Semantic HTML uses elements that describe the purpose of content. Use a heading for a heading, a link for navigation, and a button for an action. Begin with a small page whose structure makes sense before adding visual effects."
status: "published"
kind: "knowledge"
level: "beginner"
prerequisites: ["Open a text editor and a browser"]
objectives: ["Choose HTML elements by purpose", "Check a page with a keyboard"]
sources: ["https://developer.mozilla.org/en-US/docs/Learn_web_development/Core/Structuring_content"]
---

## Quick answer

Semantic HTML uses elements that describe the purpose of content. Use a heading for a heading, a link for navigation, and a button for an action. Begin with a small page whose structure makes sense before adding visual effects.

## Build a small example

Create a profile page with one main heading, an introduction, a project section and a contact link. Write the content first. Then mark up the project section with a descriptive heading.

```html
<main>
  <h1>My first project</h1>
  <section aria-labelledby="project-title">
    <h2 id="project-title">A community noticeboard</h2>
    <p>A place to find local events.</p>
    <a href="/work">Explore the project</a>
  </section>
</main>
```

## Try it yourself

Remove the styles. Can you still understand the page? Press Tab to reach the link, then Enter to follow it. Replace vague link text such as “click here” with its destination or purpose.

## Common mistake

A clickable div does not automatically provide the keyboard behaviour of a button. Prefer the native element instead of rebuilding its behaviour.

## Check your understanding

Should “open settings” be a button or a link? It depends: opening a dialog is an action; navigating to a settings page is a destination.

## Next step

Continue with [responsive layout fundamentals](/knowledge/css-layout-without-guesswork).

## Sources and further reading

- [MDN: Structuring content with HTML](https://developer.mozilla.org/en-US/docs/Learn_web_development/Core/Structuring_content)

Published 2 November 2026. Examples are teaching exercises, not claims about client results.
