# Task Manager - Full Stack Web Application

A modern, secure task management application built with **Java Spring Boot** backend and **React TypeScript** frontend, best practices and modern web technologies.

## 🎯 Project Overview

This full-stack application showcases a basic task management system with role-based JWT token authentication, REST API design, relational database, server-side pagination and sorting, and a responsive user interface.

## 🏗️ Architecture & Technical Stack

### Backend (Java Spring Boot)
- **Framework**: Spring Boot 3.5.0
- **Language**: Java 21
- **Security**: Spring Security with JWT authentication
- **Database**: H2 (In-memory) with JPA/Hibernate
- **Validation**: Bean Validation 
- **Build Tool**: Maven
- **Additional Libraries**:
  - Lombok for code generation
  - JJWT for JWT token handling
  - Spring Boot DevTools for development

### Frontend (React TypeScript)
- **Framework**: React 19.1.0 with TypeScript
- **UI Library**: PrimeReact 10.9.5 
- **State Management**: React Context API
- **HTTP Client**: Axios with interceptors
- **Routing**: React Router DOM
- **Styling**: PrimeFlex CSS framework
- **Authentication**: JWT token handling with automatic refresh



### Authorization Levels
- **Anonymous Access**: Login endpoint
- **Authenticated Access**: All task operations
- **Role-based Permissions**:
  - **Admin**: Can update any task
  - **Reader**: Can only manage own tasks

## 🚀 Key Features & Business Logic

###  Authorization Use Cases
- **Task Ownership Validation**: Users can only view, edit, and delete their own tasks
- **Cross-User Access Prevention**: Attempting to access another user's task returns 403 Forbidden
- **Role-Based Task Updates**: Only Admin users can update any task; Reader users restricted to own tasks
- **Secure Task Deletion**: Users can only delete tasks they own, with ownership verification
- **Authentication-Required Operations**: All task operations require valid JWT token

### Task Management
- **Protected CRUD Operations**: All operations validate user ownership and permissions
- **Data Validation**: Server-side and client-side validation with business rules
- **Pagination with User Filtering**: Server-side pagination showing only user's own tasks
- **Sorting & Filtering**: Advanced data grid capabilities with user-scoped data

### User Experience & Security Integration
- **Responsive Design**: Mobile-friendly interface with secure authentication flow
- **Real-time Feedback**: Toast notifications for authorization errors and success messages
- **Error Handling**: Comprehensive error boundary with security-aware error messages
- **Confirmation Dialogs**: Safe deletion with ownership verification


## 📊 API Endpoints

### Authentication
- `POST /auth/login` - User authentication with JWT token generation

### Task Management (All Protected)
- `GET /tasks` - Retrieve user's own tasks with pagination
- `POST /tasks` - Create new task (auto-assigned to authenticated user)
- `GET /tasks/{id}` - Get specific task details (ownership verified)
- `PUT /tasks/{id}` - Update existing task (role-based + ownership verification)
- `DELETE /tasks/{id}` - Delete task (ownership verified)

## 🎨 Frontend Features

### Component Architecture
- **Modular Components**: Reusable and maintainable component structure
- **Context API**: Centralized authentication state management
- **Custom Hooks**: Efficient state and side-effect management

### UI/UX 
- **Professional Design**: Clean, modern interface using PrimeReact
- **Data Grid**: Advanced table with sorting, pagination, and filtering
- **Modal Dialogs**: Smooth task creation and editing experience
- **Loading States**: User-friendly loading indicators
- **Error Boundaries**: Graceful error handling and recovery

### Technical Implementation
- **TypeScript**: Type-safe development with interfaces and proper typing
- **Axios Interceptors**: Automatic JWT token attachment and error handling
- **Protected Routing**: Authentication-based route protection
- **Local Storage**: Secure token persistence

## 🛡️ Validation & Error Handling

### Backend Validation
- **Bean Validation**: Annotation-based validation (@NotBlank, @Size, @Min)
- **Custom Business Rules**: Task duration minimum 2 hours, description minimum 10 characters
- **Global Exception Handler**: Centralized error response formatting

### Frontend Validation
- **Form Validation**: Real-time input validation with user feedback
- **API Error Handling**: Comprehensive error message display
- **Authentication Guards**: Automatic redirect for unauthorized access



---



