---
slug: mj-studio-backend
title: Building the backend foundation for MJ Studio
role: Backend engineering · In progress
summary: Engineering a photography-studio backend with a structured domain model, studio-aware permissions, transactional data operations, and automated API and migration checks.
topics: ["backend engineering", "API design", "data modelling", "access control", "testing"]
technologies: ["Node.js", "TypeScript", "Express", "Supabase", "PostgreSQL", "Vitest", "Supertest"]
status: published
publishedAt: 2026-11-01
---

## The product context

MJ Studio is a photography-studio application. Its backend must support the operational relationships between studios, photographers, clients, galleries, photographs, and client-facing review workflows.

This case study covers backend engineering that is still in progress. It does not claim that the full product is launched or that every workflow is production-ready.

## Modelling the workflow

The PostgreSQL schema represents more than a collection of independent records. It includes studios and studio membership, clients, galleries and gallery membership, photos and photo assets, gallery access, client sessions, selections, downloads, and feedback.

Database constraints and indexes help enforce important relationships and states. For example, gallery and client relationships are checked against studio ownership, and the schema includes constraints around photo positions, asset states, and active gallery access.

## Treating permissions as a server responsibility

The API resolves photographer identity from the session and checks studio membership and gallery permissions on the server. It does not rely on a caller simply submitting a studio ID or role as proof of authority.

Gallery creation is restricted to authorised studio roles. The operation also checks that the selected client belongs to the same studio, with related writes handled transactionally.

Gallery publication has prerequisites too: the client and access must be valid, and the required preview and thumbnail assets must be usable. This makes publication a workflow with explicit conditions rather than a status change alone.

## Building and checking the API

The Express application separates route handlers, services, database access, and middleware. Cross-cutting protections include request IDs, security headers, CORS and trusted-origin checks, input validation, request-size limits, rate limiting, and consistent error handling.

The backend test suite uses Vitest and Supertest. Existing integration coverage checks health and authentication behaviour, rejects untrusted origins and unauthenticated access, validates request formats and identifiers, exercises pagination boundaries, and tests that forged authority fields do not grant access.

The repository CI workflow runs backend tests and TypeScript build checks, a frontend production build, and a PostgreSQL migration smoke test.

## Current status and remaining work

The repository's automated checks provide evidence for the backend structure, selected access-control rules, and database migrations. They do not prove that the complete photography workflow is ready for production.

Photo storage and external delivery of access credentials remain integration work. Uploading, image processing, and client delivery should not be considered complete until those dependencies are configured and the full workflows are tested end to end.

## What I am working towards

The next milestone is to verify the complete path through the product: a photographer signs in, works within the correct studio, manages clients and galleries, prepares photographs, grants client access, and receives selections or feedback under the intended permissions.

The goal is not simply to make endpoints pass individually. It is to build a backend whose data model, permissions, and workflow rules remain consistent when the parts are used together.
