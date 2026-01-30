# 📖 NotesAPI Documentation

This document provides a comprehensive overview of all available API endpoints, including detailed request/response formats, field descriptions, validation rules, and authentication requirements.

## 📍 Base URL
All API requests should be made to:
```
http://<api_url>/
```

## 📋 Response Format
All API responses follow a consistent structure:

**Success Response:**
```json
{
  "hasError": false,
  "statusCode": 200,
  "message": {
    "general": ["Success message"]
  },
  "response": { /* Response data */ }
}
```

**Error Response:**
```json
{
  "hasError": true,
  "statusCode": 400,
  "message": {
    "general": ["Error message"]
  },
  "response": {}
}
```

---

## 🛠 1. Common Endpoints

### Welcome Message
- **URL**: `/common/`
- **Method**: `GET`
- **Description**: Returns a simple welcome message to verify API is accessible.
- **Authentication**: Not required

**Example Response:**
```json
{
  "hasError": false,
  "statusCode": 200,
  "message": {
    "general": ["Welcome to NotesAPI"]
  },
  "response": {}
}
```

### Health Check
- **URL**: `/common/health/`
- **Method**: `GET`
- **Description**: Check if the server is running and healthy.
- **Authentication**: Not required

**Example Response:**
```json
{
  "hasError": false,
  "statusCode": 200,
  "message": {
    "general": ["Server is healthy"]
  },
  "response": {
    "status": "ok"
  }
}
```

### WebSocket Health Check
- **URL**: `/common/ws/health/`
- **Protocol**: `WebSocket`
- **Description**: Test WebSocket connectivity.
- **Authentication**: Not required

---

## 🔐 2. Authentication

All authenticated endpoints require a JWT token in the header:
```
Authorization: Bearer <access_token>
```

### 📥 User Registration

- **URL**: `/auth/register/`
- **Method**: `POST`
- **Authentication**: Not required
- **Description**: Register a new user account and receive authentication tokens.

**Request Body:**
| Field | Type | Required | Validation | Description |
|-------|------|----------|------------|-------------|
| `email` | string | Yes | Valid email format, 3-200 chars | User's email address (used as login identifier) |
| `password` | string | Yes | Minimum 8 characters | User's password (will be hashed before storage) |

**Example Request:**
```json
{
  "email": "john.doe@example.com",
  "password": "SecurePass123!"
}
```

**Example Success Response:**
```json
{
  "hasError": false,
  "statusCode": 200,
  "message": {
    "general": ["User successfully registered."]
  },
  "response": {
    "id": "550e8400-e29b-41d4-a716-446655440000",
    "name": "john.doe",
    "email": "john.doe@example.com",
    "access_token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "access_token_expiry": 30,
    "refresh_token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "refresh_token_expiry": 10080
  }
}
```

**Example Error Response:**
```json
{
  "hasError": true,
  "statusCode": 400,
  "message": {
    "general": ["Email already exist."]
  },
  "response": {}
}
```

---

### 🔑 User Login

- **URL**: `/auth/login/`
- **Method**: `POST`
- **Authentication**: Not required
- **Description**: Authenticate existing user and receive access tokens.

**Request Body:**
| Field | Type | Required | Validation | Description |
|-------|------|----------|------------|-------------|
| `email` | string | Yes | Valid email format, 3-200 chars | Registered email address |
| `password` | string | Yes | Minimum 8 characters | User's password |

**Example Request:**
```json
{
  "email": "john.doe@example.com",
  "password": "SecurePass123!"
}
```

**Example Success Response:**
```json
{
  "hasError": false,
  "statusCode": 200,
  "message": {
    "general": ["User login success."]
  },
  "response": {
    "id": "550e8400-e29b-41d4-a716-446655440000",
    "name": "john.doe",
    "email": "john.doe@example.com",
    "access_token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "access_token_expiry": 30,
    "refresh_token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "refresh_token_expiry": 10080
  }
}
```

**Example Error Responses:**
```json
{
  "hasError": true,
  "statusCode": 400,
  "message": {
    "general": ["User not found."]
  },
  "response": {}
}
```

```json
{
  "hasError": true,
  "statusCode": 400,
  "message": {
    "general": ["Invalid password."]
  },
  "response": {}
}
```

---

### 🔄 Refresh Access Token

- **URL**: `/auth/get-access-token/`
- **Method**: `GET`
- **Authentication**: Required (Refresh Token)
- **Description**: Generate a new access token using a valid refresh token.

**Headers:**
```
Authorization: Bearer <refresh_token>
```

**Example Success Response:**
```json
{
  "hasError": false,
  "statusCode": 200,
  "message": {
    "general": []
  },
  "response": {
    "access_token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "access_token_expiry": 30
  }
}
```

**Example Error Response:**
```json
{
  "hasError": true,
  "statusCode": 400,
  "message": {
    "general": ["User not found."]
  },
  "response": {}
}
```

---

## 🌍 3. Public Endpoints

### 👁 View Public Note

- **URL**: `/public/{note_id}/view/`
- **Method**: `GET`
- **Authentication**: Not required
- **Description**: Fetch details of a note that has been marked as public.

**Path Parameters:**
| Parameter | Type | Description |
|-----------|------|-------------|
| `note_id` | string (UUID) | Unique identifier of the note |

**Example Request:**
```
GET /api/public/550e8400-e29b-41d4-a716-446655440000/view/
```

**Example Success Response:**
```json
{
  "hasError": false,
  "statusCode": 200,
  "message": {
    "general": []
  },
  "response": {
    "id": "550e8400-e29b-41d4-a716-446655440000",
    "title": "My Public Note",
    "content": "This is the content of my public note."
  }
}
```

**Example Error Response:**
```json
{
  "hasError": true,
  "statusCode": 400,
  "message": {
    "general": ["Note not found"]
  },
  "response": {}
}
```

---

## 📝 4. Note Management

All note management endpoints require authentication.

### ➕ Create Note

- **URL**: `/manage-note/create/`
- **Method**: `POST`
- **Authentication**: Required (Access Token)
- **Description**: Create a new note with title and content.

**Request Body:**
| Field | Type | Required | Validation | Description |
|-------|------|----------|------------|-------------|
| `title` | string | Yes | 3-100 characters | Title of the note |
| `content` | string | No | No limit | Content/body of the note (can be empty) |

**Example Request:**
```json
{
  "title": "Meeting Notes",
  "content": "Discussed Q1 goals and project timelines."
}
```

**Example Success Response:**
```json
{
  "hasError": false,
  "statusCode": 200,
  "message": {
    "general": ["Note created successfully"]
  },
  "response": {
    "id": "550e8400-e29b-41d4-a716-446655440000",
    "title": "Meeting Notes"
  }
}
```

---

### 📜 List All Notes

- **URL**: `/manage-note/list-all/`
- **Method**: `GET`
- **Authentication**: Required (Access Token)
- **Description**: Retrieve all notes belonging to the authenticated user with optional search.

**Query Parameters:**
| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `search` | string | No | Search keyword to filter notes by title (case-insensitive) |

**Example Request:**
```
GET /api/manage-note/list-all/?search=meeting
```

**Example Success Response:**
```json
{
  "hasError": false,
  "statusCode": 200,
  "message": {
    "general": []
  },
  "response": [
    {
      "id": "550e8400-e29b-41d4-a716-446655440000",
      "title": "Meeting Notes",
      "content": "Discussed Q1 goals and project timelines.",
      "created_at": "2026-01-11 10:30:45.123456",
      "created_by": "550e8400-e29b-41d4-a716-446655440001",
      "updated_at": "2026-01-11 11:15:22.654321",
      "updated_by": "550e8400-e29b-41d4-a716-446655440001"
    },
    {
      "id": "660e8400-e29b-41d4-a716-446655440002",
      "title": "Team Meeting",
      "content": "Sprint planning session notes.",
      "created_at": "2026-01-10 14:20:10.987654",
      "created_by": "550e8400-e29b-41d4-a716-446655440001",
      "updated_at": "2026-01-10 14:20:10.987654",
      "updated_by": "550e8400-e29b-41d4-a716-446655440001"
    }
  ]
}
```

---

### 📄 Get Specific Note

- **URL**: `/manage-note/{note_id}/list/`
- **Method**: `GET`
- **Authentication**: Required (Access Token)
- **Description**: Retrieve details of a specific note owned by the authenticated user.

**Path Parameters:**
| Parameter | Type | Description |
|-----------|------|-------------|
| `note_id` | string (UUID) | Unique identifier of the note |

**Example Request:**
```
GET /api/manage-note/550e8400-e29b-41d4-a716-446655440000/list/
```

**Example Success Response:**
```json
{
  "hasError": false,
  "statusCode": 200,
  "message": {
    "general": []
  },
  "response": {
    "id": "550e8400-e29b-41d4-a716-446655440000",
    "title": "Meeting Notes",
    "content": "Discussed Q1 goals and project timelines.",
    "created_at": "2026-01-11 10:30:45.123456",
    "created_by": "550e8400-e29b-41d4-a716-446655440001",
    "updated_at": "2026-01-11 11:15:22.654321",
    "updated_by": "550e8400-e29b-41d4-a716-446655440001"
  }
}
```

---

### ✏️ Update Note

- **URL**: `/manage-note/{note_id}/update/`
- **Method**: `PATCH`
- **Authentication**: Required (Access Token)
- **Description**: Update title, content, or public/private status of a note. Only changed fields need to be sent.

**Path Parameters:**
| Parameter | Type | Description |
|-----------|------|-------------|
| `note_id` | string (UUID) | Unique identifier of the note |

**Request Body:**
| Field | Type | Required | Validation | Description |
|-------|------|----------|------------|-------------|
| `title` | string | No | 3-100 characters | New title for the note |
| `content` | string | No | No limit | New content for the note |
| `is_public` | boolean | No | true/false | Whether the note should be publicly accessible |

**Example Request:**
```json
{
  "content": "Updated content with additional details.",
  "is_public": true
}
```

**Example Success Response:**
```json
{
  "hasError": false,
  "statusCode": 200,
  "message": {
    "general": ["Note updated successfully"]
  },
  "response": {}
}
```

**Example No Changes Response:**
```json
{
  "hasError": false,
  "statusCode": 200,
  "message": {
    "general": ["No changes detected"]
  },
  "response": {}
}
```

---

### 🗑 Delete Note

- **URL**: `/manage-note/{note_id}/delete/`
- **Method**: `DELETE`
- **Authentication**: Required (Access Token)
- **Description**: Permanently delete a note and all its versions.

**Path Parameters:**
| Parameter | Type | Description |
|-----------|------|-------------|
| `note_id` | string (UUID) | Unique identifier of the note |

**Example Request:**
```
DELETE /api/manage-note/550e8400-e29b-41d4-a716-446655440000/delete/
```

**Example Success Response:**
```json
{
  "hasError": false,
  "statusCode": 200,
  "message": {
    "general": ["Note deleted successfully"]
  },
  "response": {}
}
```

---

### 🤝 Real-time Collaboration (WebSocket)

- **URL**: `/manage-note/ws/{note_id}`
- **Protocol**: `WebSocket`
- **Authentication**: Required (via query parameter)
- **Description**: Establish WebSocket connection for real-time collaborative editing.

**Path Parameters:**
| Parameter | Type | Description |
|-----------|------|-------------|
| `note_id` | string (UUID) | Unique identifier of the note |

**Query Parameters:**
| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `token` | string | Yes* | JWT access token for authentication |
| `user_id` | string | Yes* | User ID (alternative to token) |

*Either `token` or `user_id` must be provided.

**Example Connection:**
```
ws://your-domain/api/manage-note/ws/550e8400-e29b-41d4-a716-446655440000?token=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

**Message Format (Send):**
```json
{
  "title": "Updated Title",
  "content": "Updated content in real-time"
}
```

**Message Format (Receive - Broadcast):**
```json
{
  "title": "Updated Title",
  "content": "Updated content in real-time",
  "sender": "john.doe@example.com"
}
```

**WebSocket Success Response:**
```json
{
  "hasError": false,
  "statusCode": 200,
  "message": {
    "general": ["Connected successfully"]
  },
  "response": {}
}
```

**WebSocket Error Response:**
```json
{
  "hasError": true,
  "statusCode": 1000,
  "message": {
    "general": ["User not found"]
  },
  "response": {}
}
```

---

## ⏳ 5. Version Management

Track and restore previous versions of notes.

### 📑 List All Versions

- **URL**: `/manage-version/{note_id}/list/`
- **Method**: `GET`
- **Authentication**: Required (Access Token)
- **Description**: Retrieve all version history for a specific note.

**Path Parameters:**
| Parameter | Type | Description |
|-----------|------|-------------|
| `note_id` | string (UUID) | Unique identifier of the note |

**Example Request:**
```
GET /api/manage-version/550e8400-e29b-41d4-a716-446655440000/list/
```

**Example Success Response:**
```json
{
  "hasError": false,
  "statusCode": 200,
  "message": {
    "general": []
  },
  "response": [
    {
      "id": "770e8400-e29b-41d4-a716-446655440003",
      "version_no": 1,
      "content_snapshot": {
        "title": "Meeting Notes",
        "content": "Initial content"
      },
      "created_at": "2026-01-11 10:30:45.123456",
      "created_by": "550e8400-e29b-41d4-a716-446655440001"
    },
    {
      "id": "880e8400-e29b-41d4-a716-446655440004",
      "version_no": 2,
      "content_snapshot": {
        "title": "Meeting Notes",
        "content": "Updated content with additional details."
      },
      "created_at": "2026-01-11 11:15:22.654321",
      "created_by": "550e8400-e29b-41d4-a716-446655440001"
    }
  ]
}
```

---

### 🔍 Get Specific Version

- **URL**: `/manage-version/{note_id}/version/{version_id}/list/`
- **Method**: `GET`
- **Authentication**: Required (Access Token)
- **Description**: Retrieve details of a specific version.

**Path Parameters:**
| Parameter | Type | Description |
|-----------|------|-------------|
| `note_id` | string (UUID) | Unique identifier of the note |
| `version_id` | string (UUID) | Unique identifier of the version |

**Example Request:**
```
GET /api/manage-version/550e8400-e29b-41d4-a716-446655440000/version/770e8400-e29b-41d4-a716-446655440003/list/
```

**Example Success Response:**
```json
{
  "hasError": false,
  "statusCode": 200,
  "message": {
    "general": []
  },
  "response": {
    "id": "770e8400-e29b-41d4-a716-446655440003",
    "version_no": 1,
    "content_snapshot": {
      "title": "Meeting Notes",
      "content": "Initial content"
    },
    "created_at": "2026-01-11 10:30:45.123456",
    "created_by": "550e8400-e29b-41d4-a716-446655440001"
  }
}
```

---

### ⏪ Restore Previous Version

- **URL**: `/manage-version/{note_id}/restore-previous/`
- **Method**: `POST`
- **Authentication**: Required (Access Token)
- **Description**: Restore the note to its immediately previous version (version_no - 1).

**Path Parameters:**
| Parameter | Type | Description |
|-----------|------|-------------|
| `note_id` | string (UUID) | Unique identifier of the note |

**Example Request:**
```
POST /api/manage-version/550e8400-e29b-41d4-a716-446655440000/restore-previous/
```

**Example Success Response:**
```json
{
  "hasError": false,
  "statusCode": 200,
  "message": {
    "general": ["Note successfully restored to previous version"]
  },
  "response": {}
}
```

**Example Error Response:**
```json
{
  "hasError": true,
  "statusCode": 400,
  "message": {
    "general": ["Note has no previous version"]
  },
  "response": {}
}
```

---

### 🎯 Restore Specific Version

- **URL**: `/manage-version/{note_id}/restore/{version_id}/`
- **Method**: `POST`
- **Authentication**: Required (Access Token)
- **Description**: Restore the note to a specific version by version ID.

**Path Parameters:**
| Parameter | Type | Description |
|-----------|------|-------------|
| `note_id` | string (UUID) | Unique identifier of the note |
| `version_id` | string (UUID) | Unique identifier of the version to restore |

**Example Request:**
```
POST /api/manage-version/550e8400-e29b-41d4-a716-446655440000/restore/770e8400-e29b-41d4-a716-446655440003/
```

**Example Success Response:**
```json
{
  "hasError": false,
  "statusCode": 200,
  "message": {
    "general": ["Note successfully restored to the given version"]
  },
  "response": {}
}
```

**Example Error Response:**
```json
{
  "hasError": true,
  "statusCode": 400,
  "message": {
    "general": ["Version not found"]
  },
  "response": {}
}
```

---

## 🔒 Error Codes

| Status Code | Description |
|-------------|-------------|
| `200` | Success |
| `400` | Bad Request (validation errors, business logic errors) |
| `401` | Unauthorized (invalid or missing token) |
| `404` | Not Found |
| `500` | Internal Server Error |

## 📌 Notes

- All timestamps are in UTC format
- UUIDs are used for all resource identifiers
- Token expiry times are in minutes
- WebSocket connections automatically create new versions on updates
- Restoring a version creates a new version entry (doesn't delete history)
