# Job Portal Backend - MERN Stack

This backend project serves as a comprehensive implementation of a Job Portal using Node.js, Express.js, and MongoDB. It supports essential features for Job Seekers and Employers, ensuring a fully functional and scalable job portal system.

## Features Implemented

### 1. User Authentication System
**Role-Based Access Control (RBAC):**
Supports two roles:
- Employer
- Job Seeker

**Endpoints:**
- `/api/auth/login`: Login for Job Seekers and Employers
- `/api/auth/register`: Register new Job Seekers or Employers

**Security:** Authentication is implemented using JWT (JSON Web Tokens).

**Test Credentials:**
- **Job Seeker:**
  - Email: kunal@gmail.com
  - Password: 12345678
- **Employer:**
  - Email: pooja@infotech.com
  - Password: 12345678

### 2. Employer Features
Employers have access to APIs to manage job postings and track applicants.

- **Create Job Post**  
  Endpoint: `POST /api/employers/jobs`
  
- **View All Job Posts**  
  Endpoint: `GET /api/employers/jobs`
  
- **View Applicants**  
  Endpoint: `GET /api/employers/jobs/:jobId/applicants`
  
- **Update Job Post**  
  Endpoint: `PUT /api/employers/jobs/:jobId`
  
- **Delete Job Post**  
  Endpoint: `DELETE /api/employers/jobs/:jobId`
  
- **Profile Details**  
  Endpoint: `GET/PUT /api/employers/profile`

### 3. Job Seeker Features
Job Seekers can browse and apply for jobs while managing their applications effectively.

- **Browse Jobs with Categories and Pagination**  
  Endpoint: `GET /api/users/jobs`
  
- **Search Job Applications**  
  Job Seekers can search for specific jobs using keywords or filters
  
- **View Single Job Details**  
  Endpoint: `GET /api/users/jobs/:jobId`
  
- **Apply for Job Posts**  
  Endpoint: `POST /api/users/jobs/:jobId/apply`
  
- **View Applied Jobs**  
  Endpoint: `GET /api/users/applications`
  
- **Profile Update**  
  Endpoint: `PUT /api/users/profile`

### 4. Additional Functionalities
- **Search and Filtering System**  
  Both Employers and Job Seekers can leverage a robust search and filter mechanism
- **Pagination**  
  All job listing endpoints support pagination

## API Routes Summary

| Role       | API Endpoints                              | Description                                      |
|------------|--------------------------------------------|--------------------------------------------------|
| Common     | `/api/auth/login`                          | Login endpoint                                   |
|            | `/api/auth/register`                       | Registration endpoint                            |
| Employer   | `/api/employers/jobs`                      | Create, view job posts                           |
|            | `/api/employers/profile`                   | Manage profile details                           |
|            | `/api/employers/jobs/:jobId/applicants`    | View applicants for a job                        |
| Job Seeker | `/api/users/jobs`                          | Browse all jobs with filters/pagination          |
|            | `/api/users/jobs/:jobId`                   | Get details of a specific job                    |
|            | `/api/users/jobs/:jobId/apply`             | Apply for a job                                  |
|            | `/api/users/applications`                  | Track applied jobs                               |
|            | `/api/users/profile`                       | Manage profile details                           |

## Technologies Used
- **Node.js**: Backend runtime environment
- **Express.js**: Web application framework for building APIs
- **MongoDB**: NoSQL database for data storage
- **JWT (JSON Web Tokens)**: For secure user authentication

## Setup Instructions

1. Clone the repository:
   ```bash
   git clone https://github.com/your-username/job-portal-backend.git
