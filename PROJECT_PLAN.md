---
editor_options: 
  markdown: 
    wrap: 72
---

# Movie Database Web API System

## Project Planning Document

**Project Name:** TCSS460-MovieWebAPI

**Version:** 1.0\
**Date:** October 10, 2025\
**Prepared For:** Client Review

------------------------------------------------------------------------

## Executive Summary

This document outlines the development of a comprehensive movie database
management system consisting of two interconnected web services. The
system will allow authorized users to securely access, search, and
manage a collection of over 9,000 movies from the last 30 years. The
platform prioritizes security, ease of use, and robust functionality for
both end users and administrators.

**Note:** Features are marked as either **[CORE]** (required
functionality) or **[ENHANCED]** (additional value-add features)
throughout this document.

------------------------------------------------------------------------

## System Overview

The project consists of two main components:

1.  **Authentication & User Management Service** - Handles all security,
    user accounts, and access control
2.  **Movie Database Service** - Provides access to movie information
    and management capabilities

These services work together to create a secure, professional-grade
platform for managing movie data.

------------------------------------------------------------------------

## Component 1: Authentication & User Management Service

### Purpose

This service ensures that only authorized users can access the movie
database and provides tools for managing user accounts and permissions.

### Core Functionality

#### **[CORE]** User Registration & Login

-   **New User Registration**: Allows individuals to create an account
    by providing:
    -   Email address (must be unique and valid format)
    -   Password (minimum 8 characters, must include uppercase,
        lowercase, number, and special character)
    -   Full name
    -   Optional phone number
-   **User Login**: Registered users can securely log into their
    accounts using email and password
-   **[ENHANCED]** Session Management: The system will remember
    logged-in users and automatically log them out after 24 hours of
    inactivity for security

#### **[CORE]** Password Security Features

-   **Password Reset**: Users who know their current password can change
    it to a new one
-   **Forgot Password**: Users who forget their password can request a
    reset link via email
    -   The system sends a secure, time-limited link (valid for 1 hour)
    -   Users click the link and create a new password
-   **Password Requirements Enforcement**: All passwords must meet
    minimum security standards

#### **[CORE]** Account Verification

-   **Email Verification**:
    -   New users receive a verification email upon registration
    -   Account remains in "unverified" status until email is confirmed
    -   Verification links expire after 24 hours
-   **Phone Number Verification** (Optional):
    -   Users can add and verify their phone number
    -   Receives a 6-digit verification code via SMS
    -   Code expires after 10 minutes

#### **[CORE]** Administrative Functions

Only users designated as administrators can perform these actions:

-   **View All Users**: Search and browse the complete list of
    registered users with filtering options by:
    -   Registration date
    -   Verification status
    -   User role (admin, regular user)
    -   Account status (active, suspended)
-   **Add New Users**: Administrators can manually create user accounts
-   **Update User Information**: Modify user details including:
    -   Name and contact information
    -   Password (can force password reset)
    -   User role and permissions
    -   Account status
-   **Remove Users**: Permanently delete user accounts and associated
    data

#### Security Features

-   **[CORE]** Role-Based Access Control: Different permission levels
    (regular user, admin)
-   **[CORE]** API Key Management: Generate secure API keys for
    accessing the movie database
-   **[ENHANCED]** Account Lockout: Automatically lock accounts after 5
    failed login attempts (unlocks after 30 minutes)
-   **[ENHANCED]** Audit Logging: Track all administrative actions for
    security compliance

------------------------------------------------------------------------

## Component 2: Movie Database Service

### Purpose

This service provides comprehensive access to a database of 9,326 movies
released in the last 30 years, with detailed information about each film
including cast, crew, financial data, and more.

### **[CORE]** Access Control

All access to this service requires a valid API key obtained from the
Authentication Service. This ensures only authorized users can view or
modify movie data.

### Available Movie Information

Each movie in the database contains:

**Basic Information:** - Title (both original and localized titles) -
Release date - Runtime in minutes - Genre categories (Action, Drama,
Comedy, etc.) - Plot overview/summary - Content rating (G, PG, PG-13, R,
etc.)

**Visual Assets:** - Movie poster image (high quality) - Backdrop/banner
image (for featured displays) - Studio logos

**Financial Data:** - Production budget - Box office revenue - Studio(s)
that produced the film

**Cast & Crew:** - Up to 10 featured actors with their character names
and profile photos - Director(s) - Producer(s)

**Additional Details:** - Film collection/franchise information (if part
of a series) - Production studio countries - Studio information and
branding

### Core Functionality

#### **[CORE]** 1. Search & Query Movies

Users can search for movies using various criteria:

**Search By:** - Movie title (partial matching supported - e.g., "Star"
finds "Star Wars", "A Star is Born") - Genre (find all action movies,
all comedies, etc.) - Release year or date range (e.g., all movies from
2020-2023) - Actor name (find all movies featuring a specific actor) -
Director name - Studio name - MPA rating (find all PG-rated movies) -
Runtime range (e.g., movies between 90-120 minutes) - Budget or revenue
range

**Required Features:** - **[CORE] Pagination**: Search results are
divided into pages of 20 movies each to improve performance - Users can
navigate through pages (page 1, page 2, etc.) - System indicates total
number of results and current page - **[ENHANCED] Sorting Options**:
Results can be sorted by: - Release date (newest or oldest first) -
Title (alphabetically) - Revenue (highest grossing first) - Runtime -
**[ENHANCED] Combined Filters**: Multiple search criteria can be used
simultaneously (e.g., "Action movies from 2020-2022 rated PG-13")

**Individual Movie Retrieval:** - Get complete details for a specific
movie by its unique identifier - Includes all available information in a
single response

#### **[CORE]** 2. Add New Movies

Authorized users can add new movies to the database by providing:

**Required Information:** - Movie title - Original title (if
different) - Release date - Runtime

**Optional Information:** - Genre(s) - Overview/plot summary - Budget
and revenue - MPA rating - Studio information - Collection/franchise -
Director and producer names - Up to 10 cast members with character
names - URLs for poster and backdrop images - Studio logos and country
information

**Validation:** - System ensures required fields are provided -
Validates data formats (e.g., dates, numbers) - Prevents duplicate
entries - Confirms image URLs are accessible

#### **[CORE]** 3. Update Movie Information

Users can modify existing movie records:

**Editable Fields:** - Any movie information can be updated (title,
release date, cast, crew, financial data, etc.) - Partial updates
supported (only change specific fields without affecting others)

**Update Features:** - Modify a single field (e.g., correct a typo in
the title) - Update multiple fields simultaneously - Add or remove cast
members - Update financial information as box office data changes -
Change poster or backdrop images

**Validation:** - System ensures data integrity during updates -
Prevents invalid data from being saved

#### **[CORE]** 4. Delete Movies

Authorized users can remove movies from the database:

**Deletion Process:** - Permanent removal of movie record and all
associated data - **[ENHANCED]** Confirmation required to prevent
accidental deletion

------------------------------------------------------------------------

## Technical Implementation Details

### Technology Stack

-   **Framework**: Node.js with Express (industry-standard web service
    framework)
-   **Database**: PostgreSQL (enterprise-grade relational database)
-   **Documentation**: Swagger/OpenAPI (interactive API documentation)
-   **Testing**: Postman (automated testing of all features)
-   **Hosting**: Cloud-based deployment

### **[CORE]** Security Measures

-   **Encrypted Passwords**: All passwords stored using
    industry-standard encryption
-   **HTTPS**: All data transmitted securely over encrypted connections
-   **API Key Protection**: Keys encrypted in database and transmitted
    securely
-   **Input Validation**: All user inputs sanitized to prevent security
    vulnerabilities

### **[CORE]** Documentation

-   **Interactive API Documentation**: Live, web-based documentation
    accessible at a dedicated URL
-   **Code Examples**: Sample requests and responses for each feature
-   **Error Reference Guide**: Detailed explanations of all possible
    error conditions

### **[CORE]** Testing & Quality Assurance

-   **Automated Testing**: Every feature tested automatically before
    deployment
-   **Unit Tests**: Individual test cases covering all functionality
-   **Integration Tests**: Ensures all components work together
    correctly

------------------------------------------------------------------------

## User Roles & Permissions

### **[CORE]** Regular User

-   Access movie database with API key
-   Search and retrieve movie information
-   View own account information
-   Update own password and profile

### **[CORE]** Administrator

-   All Regular User permissions
-   Add new movies to database
-   Update existing movie information
-   Delete movies from database
-   Manage user accounts (create, update, delete users)
-   Generate API keys for users

### **[ENHANCED]** Content Manager (Optional Role)

-   All Regular User permissions
-   Add new movies to database
-   Update existing movie information
-   Cannot delete movies or manage users

------------------------------------------------------------------------

## **[CORE]** Project Deliverables

1.  **Authentication Service** - Fully functional user management system
    with all required routes
2.  **Movie Database Service** - Complete movie data access and
    management platform with pagination
3.  **Interactive Documentation** - Comprehensive, live API
    documentation using Swagger
4.  **Test Suite** - Automated Postman tests for all features exported
    to /tests directory
5.  **Deployment** - Both services hosted in the cloud and accessible
    via HTTPS
6.  **Git Repository** - Complete source code on GitHub with proper
    documentation

------------------------------------------------------------------------

## Success Criteria

The project will be considered successful when:

**Core Requirements Met:**

1\. ✅ All authentication routes function correctly (/login, /register,
password management, verification, admin routes)

2\. ✅ Movie database supports all CRUD operations (Create, Read,
Update, Delete)

3\. ✅ Pagination works correctly for queries returning multiple movies

4\. ✅ API key authentication protects all movie database routes

5\. ✅ All features are documented in live Swagger documentation

6\. ✅ 100% of features pass Postman unit tests

7\. ✅ Services are deployed and accessible in the cloud

8\. ✅ Git repository is properly organized with /tests and
/project_files directories

**Enhanced Features (Optional):** - Account lockout after failed login
attempts - Audit logging for administrative actions - Advanced sorting
and filtering combinations - Session management with automatic timeout -
Content Manager role with limited permissions

------------------------------------------------------------------------

## **[ENHANCED]** Future Enhancements (Post-Launch)

Potential features for future versions:

-   User ratings and reviews for movies
-   Watchlist/favorites functionality
-   Movie recommendations based on user preferences
-   Integration with external movie databases (TMDB, IMDB)
-   Mobile application support
-   Social features (follow other users, share reviews)
-   Advanced analytics and reporting
-   Multi-language support
-   Bulk import/export functionality

------------------------------------------------------------------------

## Dataset Structure

The movie database contains the following information fields:

| Field | Description | Example |
|------------------|--------------------------------|----------------------|
| Title | Movie title | "The Dark Knight" |
| Original Title | Original language title | "The Dark Knight" |
| Release Date | Theatrical release date | "2008-07-18" |
| Runtime (min) | Duration in minutes | 152 |
| Genres | Film categories | "Action, Crime, Drama" |
| Overview | Plot summary | "Batman faces the Joker..." |
| Budget | Production budget (\$) | $185,000,000 |
| Revenue | Box office revenue ($) |
| Studios | Production companies | "Warner Bros., Legendary" |
| Directors | Film director(s) | "Christopher Nolan" |
| Producers | Film producer(s) | "Emma Thomas, Charles Roven" |
| MPA Rating | Content rating | "PG-13" |
| Collection | Film series/franchise | "The Dark Knight Collection" |
| Actors 1-10 | Cast members with character names and photos | Multiple fields per actor |

**Total Records:** 9,326 movies from the last 30 years

------------------------------------------------------------------------

## Support & Maintenance

-   **Bug Fixes**: Response to critical issues
-   **Documentation Updates**: Ongoing improvements to guides and
    examples
-   **Monitoring**: System health monitoring

------------------------------------------------------------------------

## Contact Information

For questions about this project plan or to request modifications,
please contact the development team.

**Note**: This document represents the planned functionality. Core
requirements will be fully implemented in the initial release. Enhanced
features represent additional value-add functionality that demonstrates
professional-grade API design and may be included as time and resources
permit.
