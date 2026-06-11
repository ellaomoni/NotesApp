# Notes App — Full Stack Take-Home Assignment

A full-stack notes application built with React, AWS Lambda, DynamoDB, and Supabase Auth. Authenticated users can create, search, edit, and delete personal notes, with all data scoped per user.

**Author:** Ella Omoni
**License:** ISC

## Live Demo

**Frontend:** https://notes-app-mu-tan.vercel.app

The demo is the deployed React frontend backed by the live AWS API. To try it, sign up with an email and password, then create notes. The API is not meant to be called directly — every request requires an authenticated user identity (see 
[Authentication Flow](#authentication-flow)).

## Architecture

```
React (Vercel)
    │
    │ HTTPS
    ▼
Supabase Auth
    │ userId from session
    ▼
AWS API Gateway
    │
    ▼
AWS Lambda (Node.js + TypeScript)
    │
    ▼
DynamoDB
```

## Tech Stack

Layer                  Technology                     Reason 
Frontend               React + TypeScript             Component-based UI with typesafety 
Auth                   Supabase                       Managed authentication without building auth infrastructure 
API                    AWS API Gateway (HTTP API)     Serverless HTTP routing, low latency, cost effective                
Backend                AWS Lambda + Node.js           Serverless compute, scales automatically, no server management 
Database               DynamoDB                       Serverless NoSQL, pairs naturally with Lambda, fast key-based lookups 
Hosting                Vercel                         Instant React deployments from GitHub 

## Features

- ✅ Create, read, update, delete notes
- ✅ Search notes by title or content
- ✅ User authentication (sign up / sign in / sign out)
- ✅ Each user only sees their own notes
- ✅ Responsive UI built with Tailwind CSS

## Project Structure

```
├── frontend/                  # React TypeScript app
│   ├── src/
│   │   ├── components/
│   │   │   ├── Auth.tsx       # Login / signup form
│   │   │   ├── NoteForm.tsx   # Create and edit notes
│   │   │   ├── NoteList.tsx   # Display notes
│   │   │   └── SearchBar.tsx  # Search input
│   │   ├── services/
│   │   │   ├── api.ts         # API calls to Lambda
│   │   │   └── supabase.ts    # Supabase client
│   │   ├── types/
│   │   │   └── index.ts       # Shared TypeScript types
│   │   └── App.tsx            # Root component
│   └── package.json
│
└── backend/                     # AWS Lambda functions
    ├── src/
    │   ├── handlers/
    │   │   ├── index.ts          # Lambda router (maps method + path to handlers)
    │   │   └── notesHandler.ts   # Request handlers (validation, auth, responses)
    │   ├── services/
    │   │   └── noteService.ts    # DynamoDB business logic
    │   ├── models/
    │   │   └── Note.ts           # TypeScript interfaces
    │   └── utils/
    │       ├── dynamodbClient.ts # DynamoDB client + table name
    │       ├── loadEnv.ts        # Loads environment variables via dotenv
    │       └── response.ts       # Success / error response formatter
    └── package.json
```

## API Endpoints

GET/notes -  List all notes for user 
POST/notes - Create a new note 
GET/notes/{noteId} - Get a single note 
PUT/notes/{noteId} - Update a note 
DELETE/notes/{noteId} - Delete a note
GET/notes/search?q= - Search notes by title or content

## DynamoDB Design

```
Table: Notes
Partition Key: userId  (groups all notes per user)
Sort Key:      noteId  (uniquely identifies each note)
```

This design allows efficient queries like "get all notes for user A"
without scanning the entire table.

## Authentication Flow

```
1. User signs up / signs in via Supabase
2. Supabase returns a session with user.id
3. Frontend passes user.id as x-user-id header
4. Lambda uses this to scope all DynamoDB operations
5. Users can only access their own notes
```

## Running Locally

### Backend

```bash
cd backend
npm install
npm run build
```

Create `backend/.env` for local runs (the backend reads these via `dotenv`):

```
AWS_REGION=us-east-1
DYNAMODB_TABLE=Notes
AWS_ACCESS_KEY_ID=your-access-key
AWS_SECRET_ACCESS_KEY=your-secret-key
```

Notes:
- `AWS_REGION` defaults to `us-east-1` and `DYNAMODB_TABLE` defaults to `Notes` if unset.
- `AWS_ACCESS_KEY_ID` / `AWS_SECRET_ACCESS_KEY` are only needed for local execution. On Lambda, the function's IAM role supplies credentials automatically — do not ship keys in the deployment package.

**Build & package for Lambda:**

```bash
npm run build           # compiles TypeScript to dist/
```

Zip the compiled output together with `node_modules` and upload to Lambda (or deploy via your IaC/CI of choice). Set the function handler to `handlers/index.handler` and the runtime to a supported Node.js version (see [AWS Infrastructure](#aws-infrastructure)).

### Frontend

```bash
cd frontend
npm install
```

Create `frontend/.env`:
```
REACT_APP_API_URL=https://your-api-gateway-url
REACT_APP_SUPABASE_URL=https://your-project.supabase.co
REACT_APP_SUPABASE_ANON_KEY=your-anon-key
```

```bash
npm start
```

## Known Limitations & Production Improvements

- **JWT Verification:** Currently the backend trusts the `x-user-id` header directly. In production, Lambda would verify the Supabase JWT cryptographically on every request.
- **Cloudflare Access:** The assignment specified Cloudflare Access for authentication. I implemented Cloudflare Tunnel to proxy traffic through Cloudflare's network. Full Cloudflare Access with JWT policies requires a custom domain — documented here as a production enhancement.
- **Search case sensitivity:** DynamoDB's `contains()` is case-sensitive. A production improvement would store a lowercase shadow field at write time and query against that.
- **Error handling:** Production-grade error handling would include request validation middleware and structured logging.

## AWS Infrastructure

The deployed resources behind the [Tech Stack](#tech-stack) above:

- **Lambda:** `notes-app-backend`, handler `handlers/index.handler`, Node.js 20.x runtime. Keep the local build target aligned with this runtime.
- **API Gateway:** HTTP API exposing the 6 routes listed under [API Endpoints](#api-endpoints).
- **DynamoDB:** `Notes` table, on-demand capacity, partition key `userId` + sort key `noteId`.
- **IAM Role:** `notes-app-lambda-role` with least-privilege DynamoDB access (no static credentials in the deployment package).

## Technical Document
[Teachical Document and Reasoning](https://docs.google.com/document/d/1WQlSQ9l5bRKQpITZ_tZIUXk8ezb4glbaYbDlaNQVLa0/edit?usp=sharing)