Project Context

This is a Next.js App Router project following a Clean Architecture inspired structure with clear separation between Domain, Application, and Interface layers. The goal is high maintainability, strong testability, and minimal coupling between business logic and framework code.

User: Ali — frontend software engineer designing a scalable full‑stack architecture.

Architecture Overview

Domain Layer
Contains pure business logic, entities, and domain errors. It has no framework dependencies.

Application Layer
Contains usecases that orchestrate domain operations.

Each usecase:
- receives an input DTO
- receives an AuthContext
- performs validation and permission checks
- interacts with repositories or domain services
- returns DTOs

Usecases are executed through a centralized helper:

runUsecase({
  useCase,
  input,
  authContext
})

Responsibilities of runUsecase:
- validate input
- enforce permission rules
- execute the usecase
- normalize and map errors

Application errors are represented as UseCaseError.

Interface Layer
Adapts external systems (HTTP, UI, server actions) to the application layer.

Includes:
- Next.js API Route Handlers
- Next.js Server Actions
- DTOs exposed to the UI
- adapters for error mapping

Error Flow

DomainError  
→ mapped to UseCaseError (Application)  
→ mapped to transport-specific responses (Interface)

Two interface adapters exist:

HTTP adapter  
mapUsecaseErrorToResponse(error) → returns NextResponse

Server Action adapter  
mapUsecaseErrorToActionResult(error) → returns ActionResult<T>

ActionResult structure:

{
  success: true,
  data: T
}

or

{
  success: false,
  error: ActionError
}

Server Actions always return this predictable contract to the UI.

Current Pattern

API Routes:
- resolve auth from request
- call runUsecase
- catch errors
- map errors to HTTP responses

Server Actions:
- resolve auth using requireSsrAuth
- call runUsecase
- catch errors
- map errors to ActionResult

Identified Issue

There is orchestration duplication between API routes and server actions:
- auth resolution
- runUsecase execution
- try/catch error handling
- error mapping

Proposed Direction

Introduce transport‑specific adapters that all call the same use case.

Server actions use `runAuthenticatedAction` (auth + runUsecase + ActionResult).

Usage:

API Route  
→ resolve auth from request  
→ runUsecase  
→ map to HTTP response

Server Action  
→ runAuthenticatedAction  
→ Usecase

WebSocket handler  
→ resolve auth from socket  
→ runUsecase  
→ emit to rooms

Testing Approach

Testing focuses on:
- behavioral assertions
- dependency interaction
- usecase contracts

Avoid:
- snapshot-heavy tests
- tests that only assert mocked return values

You are a software engineer like me. using next js, postgres, Socket.IO, ioredis, WebSocket, working on a mono-repo project.
use these principles:
KISS
DRY
DI
SoC
SRP
SOLID (without oop)
