---
slug: mj-studio-backend
title: Building the backend foundation for MJ Studio
role: Backend engineering · In progress
summary: Developing the API and data foundation for a photography studio workflow, with Supabase-backed persistence, authentication, and resources for clients, galleries, and photos.
topics: ["backend engineering", "API design", "photography workflow", "authentication", "database integration"]
technologies: ["Node.js", "TypeScript", "Express", "Supabase", "PostgreSQL"]
status: published
publishedAt: 2026-11-01
---

## The product context

MJ Studio is a photography-studio application. Its backend needs to support the operational work around clients, galleries, photographs, and recommendations—not just expose endpoints, but provide a dependable foundation for the studio's workflow.

The work documented here is the backend implementation in progress. It should not be read as a claim that the full product has launched or that every workflow is complete.

## My focus

I have been working on the server-side foundation using Node.js, TypeScript, and Express, with Supabase providing the PostgreSQL database.

The API is organised around the main areas of the application:

- Authentication and photographer login.
- Studio and client records.
- Galleries and photographs.
- Recommendations and related workflow data.

## Engineering decisions

The implementation separates route concerns and uses middleware for cross-cutting responsibilities such as request security, trusted-origin checks, CORS, and request handling. Database connectivity is configured through the Supabase PostgreSQL connection string.

This work has also involved investigating integration issues between the local application, API origin checks, authentication requests, and database credentials. Those debugging steps are part of making the backend behave reliably across the browser and server boundary.

## Current status and evidence

This is an in-progress engineering project. The API structure and database integration are being developed and tested locally. I am not presenting it as a completed production system, and I am not claiming measured improvements in studio operations, delivery time, or client experience.

The next meaningful evidence will come from completing and testing the core end-to-end workflows: a photographer signing in, accessing the appropriate studio data, managing clients and galleries, and working with photographs through the intended permissions.

## What comes next

The priority is to verify the critical workflows as a connected system rather than treating individual endpoints as finished in isolation. That includes authentication, trusted-origin behaviour, data access boundaries, error handling, and the gallery/photo lifecycle.

The aim is a backend that supports a clear studio workflow and can be maintained as the product develops.
