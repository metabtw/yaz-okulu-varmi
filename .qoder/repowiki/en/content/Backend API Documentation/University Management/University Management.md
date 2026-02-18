# University Management

<cite>
**Referenced Files in This Document**
- [university.controller.ts](file://apps/api/src/modules/university/university.controller.ts)
- [university.dto.ts](file://apps/api/src/modules/university/university.dto.ts)
- [university.service.ts](file://apps/api/src/modules/university/university.service.ts)
- [course.controller.ts](file://apps/api/src/modules/course/course.controller.ts)
- [course.service.ts](file://apps/api/src/modules/course/course.service.ts)
- [widget.controller.ts](file://apps/api/src/modules/widget/widget.controller.ts)
- [widget.service.ts](file://apps/api/src/modules/widget/widget.service.ts)
- [admin.controller.ts](file://apps/api/src/modules/admin/admin.controller.ts)
- [auth.controller.ts](file://apps/api/src/modules/auth/auth.controller.ts)
- [auth.service.ts](file://apps/api/src/modules/auth/auth.service.ts)
- [roles.guard.ts](file://apps/api/src/common/guards/roles.guard.ts)
- [roles.decorator.ts](file://apps/api/src/common/decorators/roles.decorator.ts)
- [roles.ts](file://apps/api/src/common/constants/roles.ts)
- [schema.prisma](file://apps/api/prisma/schema.prisma)
</cite>

## Table of Contents
1. [Introduction](#introduction)
2. [Project Structure](#project-structure)
3. [Core Components](#core-components)
4. [Architecture Overview](#architecture-overview)
5. [Detailed Component Analysis](#detailed-component-analysis)
6. [Dependency Analysis](#dependency-analysis)
7. [Performance Considerations](#performance-considerations)
8. [Troubleshooting Guide](#troubleshooting-guide)
9. [Conclusion](#conclusion)
10. [Appendices](#appendices)

## Introduction
This document provides comprehensive API documentation for the university management system. It covers:
- University profile management and verification workflows
- Course CRUD operations with search and analytics
- Widget configuration and external embedding
- Analytics endpoints for university dashboards
- Multitenancy implementation and data isolation
- Authentication and authorization flows
- Practical administrative and staff workflows

The system is built with NestJS and Prisma, using PostgreSQL as the datastore. It implements role-based access control (RBAC), JWT authentication, and tenant isolation via university-scoped resources.

## Project Structure
The API module organizes functionality by domain:
- Authentication and authorization
- University management (profile, verification, widget config)
- Course management (CRUD, search, comparison)
- Widget integration for external embedding
- Administrative dashboards and management
- Shared security guards and decorators
- Prisma schema defining models, relations, and indexes

```mermaid
graph TB
subgraph "API Modules"
AUTH["Auth Module<br/>auth.controller.ts, auth.service.ts"]
UNI["University Module<br/>university.controller.ts, university.service.ts, university.dto.ts"]
COURSE["Course Module<br/>course.controller.ts, course.service.ts"]
WIDGET["Widget Module<br/>widget.controller.ts, widget.service.ts"]
ADMIN["Admin Module<br/>admin.controller.ts"]
USER["User Module<br/>user.controller.ts"]
end
subgraph "Shared"
GUARD["RolesGuard<br/>roles.guard.ts"]
DECORATOR["Roles Decorator<br/>roles.decorator.ts"]
PRISMA["Prisma Schema<br/>schema.prisma"]
end
AUTH --> PRISMA
UNI --> PRISMA
COURSE --> PRISMA
WIDGET --> PRISMA
ADMIN --> PRISMA
USER --> PRISMA
UNI --> GUARD
COURSE --> GUARD
WIDGET --> GUARD
ADMIN --> GUARD
USER --> GUARD
UNI --> DECORATOR
COURSE --> DECORATOR
WIDGET --> DECORATOR
ADMIN --> DECORATOR
USER --> DECORATOR
```

**Diagram sources**
- [university.controller.ts](file://apps/api/src/modules/university/university.controller.ts#L1-L114)
- [course.controller.ts](file://apps/api/src/modules/course/course.controller.ts#L1-L148)
- [widget.controller.ts](file://apps/api/src/modules/widget/widget.controller.ts#L1-L30)
- [admin.controller.ts](file://apps/api/src/modules/admin/admin.controller.ts#L1-L119)
- [auth.controller.ts](file://apps/api/src/modules/auth/auth.controller.ts#L1-L28)
- [roles.guard.ts](file://apps/api/src/common/guards/roles.guard.ts#L1-L56)
- [roles.decorator.ts](file://apps/api/src/common/decorators/roles.decorator.ts#L1-L16)
- [schema.prisma](file://apps/api/prisma/schema.prisma#L1-L183)

**Section sources**
- [university.controller.ts](file://apps/api/src/modules/university/university.controller.ts#L1-L114)
- [course.controller.ts](file://apps/api/src/modules/course/course.controller.ts#L1-L148)
- [widget.controller.ts](file://apps/api/src/modules/widget/widget.controller.ts#L1-L30)
- [admin.controller.ts](file://apps/api/src/modules/admin/admin.controller.ts#L1-L119)
- [auth.controller.ts](file://apps/api/src/modules/auth/auth.controller.ts#L1-L28)
- [roles.guard.ts](file://apps/api/src/common/guards/roles.guard.ts#L1-L56)
- [roles.decorator.ts](file://apps/api/src/common/decorators/roles.decorator.ts#L1-L16)
- [schema.prisma](file://apps/api/prisma/schema.prisma#L1-L183)

## Core Components
- Authentication and Authorization
  - Registration validates domain for university staff and sets initial status
  - Login generates JWT tokens with role and university association
  - Guards enforce role-based access per endpoint
- University Management
  - CRUD endpoints for universities with multitenancy checks
  - Verification workflow for administrators
  - Widget configuration with color and theme
- Course Management
  - Public search with natural language parsing and filters
  - University-scoped CRUD operations
  - Course comparison and analytics
- Widget Integration
  - Public JSON endpoint for university course data
  - Embed script for third-party websites
- Administration
  - Dashboard statistics and popular searches
  - Pending user approvals and university management
  - Global course administration

**Section sources**
- [auth.service.ts](file://apps/api/src/modules/auth/auth.service.ts#L1-L205)
- [roles.guard.ts](file://apps/api/src/common/guards/roles.guard.ts#L1-L56)
- [university.controller.ts](file://apps/api/src/modules/university/university.controller.ts#L1-L114)
- [university.service.ts](file://apps/api/src/modules/university/university.service.ts#L1-L451)
- [course.controller.ts](file://apps/api/src/modules/course/course.controller.ts#L1-L148)
- [course.service.ts](file://apps/api/src/modules/course/course.service.ts#L1-L310)
- [widget.controller.ts](file://apps/api/src/modules/widget/widget.controller.ts#L1-L30)
- [widget.service.ts](file://apps/api/src/modules/widget/widget.service.ts#L1-L108)
- [admin.controller.ts](file://apps/api/src/modules/admin/admin.controller.ts#L1-L119)

## Architecture Overview
The system follows layered architecture with clear separation of concerns:
- Controllers handle HTTP requests and apply guards and decorators
- Services encapsulate business logic and enforce multitenancy
- Prisma provides type-safe database access with indexes and relations
- Guards and decorators centralize authorization logic

```mermaid
sequenceDiagram
participant Client as "Client"
participant AuthCtrl as "AuthController"
participant AuthService as "AuthService"
participant Prisma as "PrismaService"
participant Jwt as "JwtService"
Client->>AuthCtrl : POST /api/auth/register
AuthCtrl->>AuthService : register(dto)
AuthService->>Prisma : check unique email
Prisma-->>AuthService : exists?
AuthService->>AuthService : validate role and domain
AuthService->>Prisma : create user (status=PENDING for university)
AuthService->>Jwt : sign token with role/universityId
Jwt-->>AuthService : JWT
AuthService-->>AuthCtrl : {user, token}
AuthCtrl-->>Client : response
Client->>AuthCtrl : POST /api/auth/login
AuthCtrl->>AuthService : login(dto)
AuthService->>Prisma : find user by email
Prisma-->>AuthService : user
AuthService->>AuthService : verify password and status
AuthService->>Jwt : sign token
Jwt-->>AuthService : JWT
AuthService-->>AuthCtrl : {user, token}
AuthCtrl-->>Client : response
```

**Diagram sources**
- [auth.controller.ts](file://apps/api/src/modules/auth/auth.controller.ts#L1-L28)
- [auth.service.ts](file://apps/api/src/modules/auth/auth.service.ts#L1-L205)

**Section sources**
- [auth.controller.ts](file://apps/api/src/modules/auth/auth.controller.ts#L1-L28)
- [auth.service.ts](file://apps/api/src/modules/auth/auth.service.ts#L1-L205)
- [roles.guard.ts](file://apps/api/src/common/guards/roles.guard.ts#L1-L56)
- [roles.decorator.ts](file://apps/api/src/common/decorators/roles.decorator.ts#L1-L16)

## Detailed Component Analysis

### University Management Endpoints
- Public endpoints
  - List verified universities
  - Retrieve university by slug or ID
- Protected endpoints
  - Admin-only: create, update, delete universities
  - Admin-only: verify university accounts
  - University/Admin: update university profile
  - University-only: update widget configuration

```mermaid
sequenceDiagram
participant Client as "Client"
participant UniCtrl as "UniversityController"
participant UniServ as "UniversityService"
participant Prisma as "PrismaService"
Client->>UniCtrl : PATCH /api/universities/ : id
UniCtrl->>UniCtrl : extract user from JWT
UniCtrl->>UniServ : update(id, dto, requestingUniversityId)
UniServ->>Prisma : find university by id
Prisma-->>UniServ : university
UniServ->>UniServ : enforce tenant isolation
UniServ->>Prisma : update university
Prisma-->>UniServ : updated
UniServ-->>UniCtrl : result
UniCtrl-->>Client : response
```

**Diagram sources**
- [university.controller.ts](file://apps/api/src/modules/university/university.controller.ts#L78-L91)
- [university.service.ts](file://apps/api/src/modules/university/university.service.ts#L110-L128)

Key validation and schemas:
- CreateUniversitySchema: name, city, optional logo/website/contactEmail
- UpdateUniversitySchema: optional fields with nullable support
- WidgetConfigSchema: primaryColor hex and theme enum

**Section sources**
- [university.controller.ts](file://apps/api/src/modules/university/university.controller.ts#L1-L114)
- [university.dto.ts](file://apps/api/src/modules/university/university.dto.ts#L1-L48)
- [university.service.ts](file://apps/api/src/modules/university/university.service.ts#L1-L451)

### Course Management Endpoints
- Public search with filters and natural language parsing
- Public course comparison (2-4 courses)
- University-scoped CRUD operations
- Dashboard listing of university courses

```mermaid
flowchart TD
Start(["Search Request"]) --> Parse["Parse Natural Language Query"]
Parse --> BuildWhere["Build Prisma Where Conditions"]
BuildWhere --> ApplyFilters["Apply City, Online, ECTS, Price Filters"]
ApplyFilters --> Paginate["Page & Limit Results"]
Paginate --> QueryDB["Query Courses with University Relations"]
QueryDB --> Log["Log Search to SearchLog"]
Log --> Return["Return {data, meta}"]
```

**Diagram sources**
- [course.controller.ts](file://apps/api/src/modules/course/course.controller.ts#L49-L75)
- [course.service.ts](file://apps/api/src/modules/course/course.service.ts#L31-L133)

University-scoped operations:
- Create/update/delete enforce tenant isolation using universityId
- Comparison validates counts and computes statistics

**Section sources**
- [course.controller.ts](file://apps/api/src/modules/course/course.controller.ts#L1-L148)
- [course.service.ts](file://apps/api/src/modules/course/course.service.ts#L1-L310)

### Widget Configuration and Embedding
- Public JSON endpoint for university course data
- Embed script dynamically loads and renders course cards
- Widget configuration supports primary color and theme

```mermaid
sequenceDiagram
participant Site as "External Site"
participant WidgetCtrl as "WidgetController"
participant WidgetServ as "WidgetService"
participant Prisma as "PrismaService"
Site->>WidgetCtrl : GET /api/widget/ : univId
WidgetCtrl->>WidgetServ : getWidgetData(univIdOrSlug)
WidgetServ->>Prisma : find university with courses
Prisma-->>WidgetServ : university + courses
WidgetServ-->>WidgetCtrl : {university, courses, generatedAt}
WidgetCtrl-->>Site : JSON
Site->>WidgetCtrl : GET /api/widget/embed.js
WidgetCtrl->>WidgetServ : getEmbedScript()
WidgetServ-->>WidgetCtrl : script
WidgetCtrl-->>Site : JS
```

**Diagram sources**
- [widget.controller.ts](file://apps/api/src/modules/widget/widget.controller.ts#L15-L28)
- [widget.service.ts](file://apps/api/src/modules/widget/widget.service.ts#L18-L67)
- [widget.service.ts](file://apps/api/src/modules/widget/widget.service.ts#L70-L105)

**Section sources**
- [widget.controller.ts](file://apps/api/src/modules/widget/widget.controller.ts#L1-L30)
- [widget.service.ts](file://apps/api/src/modules/widget/widget.service.ts#L1-L108)

### Analytics Endpoints
University dashboard analytics include:
- Overview cards: total courses, new last month, views, favorites, application clicks
- Popular courses ranking with conversion metrics
- Time series data for views, favorites, and applications
- Course health status (application URL, date completeness)

```mermaid
flowchart TD
A["Dashboard Request"] --> B["Compute Totals & Aggregates"]
B --> C["Recent vs Previous Period Comparisons"]
C --> D["Popular Courses Ranking"]
D --> E["Time Series (last N days)"]
E --> F["Course Health Metrics"]
F --> G["Return Analytics Bundle"]
```

**Diagram sources**
- [university.service.ts](file://apps/api/src/modules/university/university.service.ts#L163-L278)
- [university.service.ts](file://apps/api/src/modules/university/university.service.ts#L281-L330)
- [university.service.ts](file://apps/api/src/modules/university/university.service.ts#L333-L397)
- [university.service.ts](file://apps/api/src/modules/university/university.service.ts#L399-L430)

**Section sources**
- [university.service.ts](file://apps/api/src/modules/university/university.service.ts#L158-L451)

### Administrative Workflows
- Dashboard statistics and popular searches
- Pending user requests approval/rejection
- University management (create, update, delete)
- Course management (list, create, delete)

```mermaid
sequenceDiagram
participant Admin as "Admin User"
participant AdminCtrl as "AdminController"
participant AdminServ as "AdminService"
participant Prisma as "PrismaService"
Admin->>AdminCtrl : GET /api/admin/pending-requests
AdminCtrl->>AdminServ : getPendingRequests()
AdminServ->>Prisma : find users with status=PENDING
Prisma-->>AdminServ : users
AdminServ-->>AdminCtrl : list
AdminCtrl-->>Admin : response
Admin->>AdminCtrl : PATCH /api/admin/users/ : id/approve
AdminCtrl->>AdminServ : approveUser(id)
AdminServ->>Prisma : update user status
Prisma-->>AdminServ : updated
AdminServ-->>AdminCtrl : result
AdminCtrl-->>Admin : response
```

**Diagram sources**
- [admin.controller.ts](file://apps/api/src/modules/admin/admin.controller.ts#L43-L56)

**Section sources**
- [admin.controller.ts](file://apps/api/src/modules/admin/admin.controller.ts#L1-L119)

## Dependency Analysis
The system relies on:
- NestJS guards and decorators for authorization
- Zod validation pipes for DTO schemas
- Prisma models with explicit indexes and relations
- JWT strategy for authentication

```mermaid
graph LR
RolesGuard["RolesGuard"] --> |checks| RolesDecorator["Roles Decorator"]
AuthController["AuthController"] --> |uses| AuthService["AuthService"]
UniversityController["UniversityController"] --> |uses| UniversityService["UniversityService"]
CourseController["CourseController"] --> |uses| CourseService["CourseService"]
WidgetController["WidgetController"] --> |uses| WidgetService["WidgetService"]
AdminController["AdminController"] --> |uses| AdminService["AdminService"]
UniversityService --> Prisma["PrismaService"]
CourseService --> Prisma
WidgetService --> Prisma
AuthService --> Prisma
Prisma --> Schema["Prisma Schema"]
```

**Diagram sources**
- [roles.guard.ts](file://apps/api/src/common/guards/roles.guard.ts#L1-L56)
- [roles.decorator.ts](file://apps/api/src/common/decorators/roles.decorator.ts#L1-L16)
- [auth.controller.ts](file://apps/api/src/modules/auth/auth.controller.ts#L1-L28)
- [auth.service.ts](file://apps/api/src/modules/auth/auth.service.ts#L1-L205)
- [university.controller.ts](file://apps/api/src/modules/university/university.controller.ts#L1-L114)
- [university.service.ts](file://apps/api/src/modules/university/university.service.ts#L1-L451)
- [course.controller.ts](file://apps/api/src/modules/course/course.controller.ts#L1-L148)
- [course.service.ts](file://apps/api/src/modules/course/course.service.ts#L1-L310)
- [widget.controller.ts](file://apps/api/src/modules/widget/widget.controller.ts#L1-L30)
- [widget.service.ts](file://apps/api/src/modules/widget/widget.service.ts#L1-L108)
- [admin.controller.ts](file://apps/api/src/modules/admin/admin.controller.ts#L1-L119)
- [schema.prisma](file://apps/api/prisma/schema.prisma#L1-L183)

**Section sources**
- [roles.guard.ts](file://apps/api/src/common/guards/roles.guard.ts#L1-L56)
- [roles.decorator.ts](file://apps/api/src/common/decorators/roles.decorator.ts#L1-L16)
- [schema.prisma](file://apps/api/prisma/schema.prisma#L1-L183)

## Performance Considerations
- Indexes on frequently queried columns (city, isVerified, universityId, name/code) improve search and filtering performance
- Pagination limits prevent excessive result sets
- Aggregation queries compute analytics efficiently using raw SQL fragments
- Logging is performed asynchronously to avoid impacting search latency

[No sources needed since this section provides general guidance]

## Troubleshooting Guide
Common issues and resolutions:
- Authentication failures
  - Invalid credentials or rejected status
  - Ensure correct email/password and check user status
- Authorization errors
  - Missing or insufficient roles
  - Verify JWT payload includes correct role and universityId
- Multitenancy violations
  - Attempting to modify another university’s data
  - Confirm requestingUniversityId matches resource owner
- Resource not found
  - Universities, courses, or widgets may not be verified or may not exist
  - Validate IDs/slugs and verification status

**Section sources**
- [auth.service.ts](file://apps/api/src/modules/auth/auth.service.ts#L136-L170)
- [roles.guard.ts](file://apps/api/src/common/guards/roles.guard.ts#L24-L54)
- [university.service.ts](file://apps/api/src/modules/university/university.service.ts#L110-L128)
- [widget.service.ts](file://apps/api/src/modules/widget/widget.service.ts#L48-L54)

## Conclusion
The university management system provides a robust, secure, and scalable foundation for managing university profiles, courses, and analytics. Its multitenancy model ensures data isolation, while comprehensive authorization and validation layers protect system integrity. The widget system enables seamless external integrations, and the admin suite streamlines oversight and operations.

[No sources needed since this section summarizes without analyzing specific files]

## Appendices

### API Reference Summary

- Authentication
  - POST /api/auth/register
  - POST /api/auth/login

- University
  - GET /api/universities
  - GET /api/universities/slug/:slug
  - GET /api/universities/:id
  - GET /api/admin/universities (Admin)
  - POST /api/universities (Admin)
  - PATCH /api/universities/:id (University/Admin)
  - PATCH /api/admin/verify/:id (Admin)
  - PATCH /api/universities/:id/widget (University)

- Course
  - GET /api/courses
  - GET /api/courses/compare
  - GET /api/courses/:id
  - GET /api/university/courses (University)
  - POST /api/university/courses (University)
  - PATCH /api/university/courses/:id (University)
  - DELETE /api/university/courses/:id (University)

- Widget
  - GET /api/widget/:univId
  - GET /api/widget/embed.js

- Admin
  - GET /api/admin/dashboard
  - GET /api/admin/stats/popular
  - GET /api/admin/pending-requests
  - PATCH /api/admin/users/:id/approve
  - PATCH /api/admin/users/:id/reject
  - GET /api/admin/universities
  - POST /api/admin/universities
  - PATCH /api/admin/universities/:id
  - DELETE /api/admin/universities/:id
  - GET /api/admin/courses
  - POST /api/admin/courses
  - DELETE /api/admin/courses/:id

**Section sources**
- [auth.controller.ts](file://apps/api/src/modules/auth/auth.controller.ts#L1-L28)
- [university.controller.ts](file://apps/api/src/modules/university/university.controller.ts#L1-L114)
- [course.controller.ts](file://apps/api/src/modules/course/course.controller.ts#L1-L148)
- [widget.controller.ts](file://apps/api/src/modules/widget/widget.controller.ts#L1-L30)
- [admin.controller.ts](file://apps/api/src/modules/admin/admin.controller.ts#L1-L119)

### Data Models Overview

```mermaid
erDiagram
UNIVERSITY {
string id PK
string name UK
string slug UK
string city
string logo
string website
string contactEmail
boolean isVerified
json widgetConfig
timestamp createdAt
timestamp updatedAt
}
USER {
string id PK
string email UK
string passwordHash
string fullName
enum role
enum status
string department
json preferredCities
string universityId FK
timestamp createdAt
timestamp updatedAt
}
COURSE {
string id PK
string code
string name
int ects
decimal price
string currency
boolean isOnline
string description
string applicationUrl
int quota
timestamp startDate
timestamp endDate
timestamp applicationDeadline
string universityId FK
int viewCount
timestamp createdAt
timestamp updatedAt
}
SEARCHLOG {
string id PK
string searchQuery
json filters
int resultCount
string ipHash
string userAgent
string userId FK
timestamp createdAt
}
ACTIVITYLOG {
string id PK
string userId FK
string action
string entity
string entityId
json details
string ipAddress
timestamp createdAt
}
USERFAVORITE {
string id PK
string userId FK
string courseId FK
timestamp createdAt
}
USERINTERACTION {
string id PK
string userId FK
string courseId FK
string actionType
timestamp createdAt
}
UNIVERSITY ||--o{ COURSE : "owns"
UNIVERSITY ||--o{ USER : "employs"
USER ||--o{ USERFAVORITE : "has"
USER ||--o{ USERINTERACTION : "has"
COURSE ||--o{ USERFAVORITE : "favorited_by"
COURSE ||--o{ USERINTERACTION : "interactions"
USER ||--o{ SEARCHLOG : "performed"
```

**Diagram sources**
- [schema.prisma](file://apps/api/prisma/schema.prisma#L36-L183)