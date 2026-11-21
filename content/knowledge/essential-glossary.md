---
slug: "essential-glossary"
title: "Essential glossary: design engineering, AI and APIs"
category: "Quick reference"
topics: ["Design engineering","Artificial intelligence","API development","Integration","Glossary"]
date: "2026-11-21"
readTime: "Look up a term"
excerpt: "Plain meanings for 65 terms you will meet while designing and building software. Each definition stays within two sentences."
status: "published"
kind: "knowledge"
level: "beginner"
prerequisites: ["No prior technical knowledge required"]
objectives: ["Understand common terms in design engineering, AI and APIs","Distinguish related ideas before using them in your work"]
sources: ["https://www.nngroup.com/articles/mental-models/","https://www.nngroup.com/topic/signifiers/","https://developers.openai.com/api/docs/concepts","https://developers.openai.com/api/docs/guides/embeddings","https://www.anthropic.com/engineering/building-effective-agents","https://www.anthropic.com/news/model-context-protocol","https://developer.mozilla.org/en-US/docs/Web/HTTP/Reference/Methods","https://developer.mozilla.org/en-US/docs/Web/HTTP/Guides/CORS","https://spec.openapis.org/oas/latest.html"]
---

Keep this nearby while you read, design or build. Choose a subject from the page links, or use your browser’s Find in page to look up a term.

## Design engineering

### Design engineering

Bringing design and software engineering together to turn an understood problem into a working experience. The work includes how something looks, behaves and holds up in use.

### Problem framing

Defining whose problem you are solving, what is happening and why it matters before choosing a solution.

### User research

Studying people’s behaviour, circumstances and needs so decisions rely on evidence rather than guesses.

### Generative research

Research that helps you discover problems, needs and possibilities before deciding what to build.

### Evaluative research

Research that examines how well an existing idea, prototype or product works for people.

### Mental model

A person’s understanding of how something works, shaped by their experience. Your interface becomes easier to use when its behaviour makes sense within that understanding.

### Affordance

An action made possible by the relationship between a person and an object. A handle affords gripping; whether someone notices it is a separate question.

### Signifier

A clue that communicates where or how to act, such as an underlined link or a clearly labelled button.

### Feedback

Information that tells someone what happened after an action, such as “Your message was sent.”

### Constraint

A limit that shapes what is possible or prevents an unsuitable action, such as allowing only valid dates.

### Information architecture

How information is organised, named and connected so people can find and understand it.

### User flow

The sequence of actions someone takes to complete a task, including decisions and recovery from errors.

### Cognitive load

The mental effort a task demands. Unclear labels, unnecessary choices and remembering information across screens can increase it.

### Design system

Shared principles, components and rules that help a team build consistent experiences.

### Design tokens

Named values for decisions such as colour, spacing and typography, making them easier to reuse and change consistently.

### Accessibility

Designing and building so people with disabilities can perceive, understand and operate a product.

### State

A condition a component or system is currently in, such as loading, empty, successful or failed.

### Progressive disclosure

Showing the information needed now while making further detail available when it becomes relevant.

## Artificial intelligence

### Artificial intelligence — AI

A broad field concerned with systems that perform tasks involving abilities such as prediction, perception, language and decision-making.

### Machine learning — ML

An approach where a system learns patterns from data rather than having every rule written explicitly.

### Generative AI

AI that produces content such as text, images, audio or code from learned patterns and supplied input.

### Large language model — LLM

A model trained on large amounts of data to process and generate language. Fluent output does not guarantee accurate understanding or facts.

### Multimodal model

A model that can process or generate more than one kind of information, such as text, images and audio.

### Inference

Running a trained model on new input to produce an output.

### Token

A unit a model processes, often a word fragment or punctuation mark. Tokens affect how much information a model can handle and how usage is measured.

### Context window

The maximum amount of information a model can consider in a single interaction, measured in tokens.

### Prompt engineering

Writing and refining instructions, examples and constraints to guide a model’s response.

### Context engineering

Selecting and organising the instructions, information, tools and conversation history available to a model during a task.

### Embedding

A numerical representation of information that helps software compare patterns or similarity.

### Retrieval-augmented generation — RAG

Retrieving relevant material and supplying it to a model before it answers. Its usefulness depends on both the retrieved evidence and how the model uses it.

### Fine-tuning

Further training an existing model on selected examples to change aspects of its behaviour or performance.

### Hallucination

A model output that presents invented or unsupported information as though it were reliable.

### Grounding

Connecting an answer to identifiable evidence or system data rather than relying only on the model’s learned patterns.

### Evaluation — eval

A structured check of whether an AI system performs adequately on defined tasks and failure cases.

### Tool calling

A model producing a structured request for software to execute, such as searching records or checking availability.

### AI agent

A system that uses a model to choose actions and tools while working towards a goal. Its independence depends on the permissions and limits you give it.

### AI workflow

A defined sequence of steps involving AI, tools or people. Unlike an agent, its overall route is largely arranged in advance.

### Prompt injection

Instructions hidden in input or external content that try to redirect an AI system away from its intended task or rules.

### Model Context Protocol — MCP

An open protocol for connecting AI applications to external tools and information sources through a shared interface.

## API development and integration

### Application programming interface — API

An agreed way for software to request information or actions from other software.

### Integration

Connecting systems so they exchange information or coordinate work, including handling permissions, errors and differences in their data.

### Protocol

Rules that systems follow to communicate, including how messages are structured and exchanged.

### HTTP

A protocol used to exchange requests and responses on the web, including many APIs.

### Endpoint

A specific address through which an API exposes a resource or action, such as `/api/articles`.

### HTTP method

The part of a request that expresses its intended operation, such as `GET` for retrieval or `DELETE` for removal.

### Request / response

A request asks a system to do something; a response reports the result.

### Payload

The substantive data carried in a message, such as the contact details submitted through a form.

### Schema

A description of a data structure, including fields, types and rules about which values are allowed.

### Validation

Checking whether incoming data meets defined requirements before accepting or processing it.

### API contract

The agreement about how an API behaves, including accepted requests, returned data, errors and compatibility expectations.

### OpenAPI

A standard format for describing HTTP APIs so people and tools can understand their operations and data structures.

### REST

An architectural style that organises interactions around resources and a consistent interface, with constraints including stateless communication.

### SDK

A software development kit containing tools or libraries that make a service or platform easier to use in code.

### Authentication

Establishing which person or system is making a request.

### Authorization

Deciding what that person or system is allowed to access or do.

### OAuth

A framework for granting an application limited access to a service without giving it the user’s password.

### Webhook

An HTTP request a service sends to your system when a particular event occurs, such as a completed payment.

### Polling

Repeatedly asking a service whether something has changed.

### Idempotency

A property where repeating the same operation has the same intended effect as performing it once. It helps make retries safer.

### Rate limiting

Restricting how many requests a client can make within a period to manage capacity or abuse.

### Pagination

Returning a large collection in smaller portions rather than sending everything at once.

### CORS

A browser mechanism through which a server declares which other origins may read its responses. It does not replace authentication or authorization.

### Timeout

A limit on how long a caller waits for an operation. Reaching it does not necessarily mean the remote operation stopped or failed.

### Retry with backoff

Trying a failed operation again after a delay, usually increasing the delay between attempts.

### Observability

Using signals such as logs, metrics and traces to understand what a running system is doing and investigate failures.

## Keep learning

Follow a request through the [software protocol course](/knowledge/protocols), practise [checking API data with TypeScript](/knowledge/typescript-runtime-validation), or [suggest a correction](/contact).

## Sources and further reading

- [Nielsen Norman Group: Mental models](https://www.nngroup.com/articles/mental-models/)
- [Nielsen Norman Group: Signifiers](https://www.nngroup.com/topic/signifiers/)
- [OpenAI: Key concepts](https://developers.openai.com/api/docs/concepts)
- [OpenAI: Embeddings](https://developers.openai.com/api/docs/guides/embeddings)
- [Anthropic: Building effective agents](https://www.anthropic.com/engineering/building-effective-agents)
- [Anthropic: Model Context Protocol](https://www.anthropic.com/news/model-context-protocol)
- [MDN: HTTP request methods](https://developer.mozilla.org/en-US/docs/Web/HTTP/Reference/Methods)
- [MDN: Cross-Origin Resource Sharing](https://developer.mozilla.org/en-US/docs/Web/HTTP/Guides/CORS)
- [OpenAPI Specification](https://spec.openapis.org/oas/latest.html)

Reviewed 21 November 2026. These are short working definitions; the linked sources explain the details and exceptions.
