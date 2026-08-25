# Student Management System — Backend

Node.js / Express / MongoDB backend for a Student Management System. Supports admin and student roles, JWT-based authentication, OTP email verification for admin login, and CRUD operations on students and courses.

## Tech Stack

- **Runtime:** Node.js
- **Framework:** Express 5
- **Database:** MongoDB (Mongoose)
- **Auth:** JWT (jsonwebtoken) + httpOnly cookies
- **Password hashing:** bcrypt
- **Validation:** Zod
- **Email (OTP):** Resend
- **Dev tooling:** nodemon

## Project Structure

```
studentMgtBackend/
├── controllers/       # Route handler logic
│   ├── admin-controller.js
│   ├── course-controller.js
│   └── student-controllers.js
├── database/           # MongoDB connection setup
│   └── index.js
├── middleware/
│   ├── authmiddleware.js  # verifyToken - JWT auth guard
│   └── validate.js        # Zod validation middleware
├── model/               # Mongoose schemas
│   ├── adminModel.js
│   ├── coursesModel.js
│   └── studentModel.js
├── routers/
│   ├── admin-router.js
│   ├── course-router.js
│   └── student-router.js
├── schemas/              # Zod validation schemas
│   └── userSchema.js
├── utils/
│   └── sendOTP.js
├── server.js
└── .env                  # not committed — see below
```

## Getting Started

### 1. Install dependencies
```bash
npm install
```

### 2. Configure environment variables

Create a `.env` file in the project root:

```env
PORT=3001
DATABASE_URI=your_mongodb_connection_string
JWT_SECRET_KEY=your_jwt_secret
ADMIN_REGISTER_SECRET=your_admin_registration_secret
RESEND_API_KEY=your_resend_api_key
```

### 3. Run the server

```bash
npm run dev
```

Server starts on `http://localhost:3001` (or your configured `PORT`).

## Authentication

Two separate roles, two separate cookies:

- **Admin** — registers/logs in via `/admin/register` and `/admin/login` → OTP sent to email → verified via `/admin/verify-otp` → sets `Token` cookie. Admin routes for managing students/courses are protected by `verifyToken`.
- **Student** — logs in via `/student/login` → sets `token` cookie.

## API Endpoints

### Admin
| Method | Endpoint | Description |
|---|---|---|
| POST | `/admin/register` | Register a new admin (requires secret key) |
| POST | `/admin/login` | Login, triggers OTP email |
| POST | `/admin/verify-otp` | Verify OTP, completes login |
| POST | `/admin/logout` | Clear admin session |

### Students *(admin-protected unless noted)*
| Method | Endpoint | Description |
|---|---|---|
| GET | `/student` | Get all students |
| POST | `/student/add` | Add a new student |
| PUT | `/student/update/:id` | Update a student |
| DELETE | `/student/delete/:id` | Delete a student |
| POST | `/student/login` | Student login *(public)* |
| POST | `/student/logout` | Student logout *(public)* |
| POST | `/student/reset-password/:id` | Reset student password *(public)* |

### Courses *(admin-protected)*
| Method | Endpoint | Description |
|---|---|---|
| GET | `/course` | Get all courses |
| POST | `/course/add` | Add a new course |

## Notes

- Passwords are hashed with bcrypt before storage.
- Auth tokens are stored in httpOnly cookies, not returned in the response body.
- Admin login requires OTP verification via email before a session token is issued.