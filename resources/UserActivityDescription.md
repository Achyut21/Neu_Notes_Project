# NeuNotes: User Manual

## Table of Contents
- [Getting Started](#getting-started)
  - [Registration](#registration)
  - [Login](#login)
  - [Navigation](#navigation)
- [Home Page](#home-page)
  - [Browsing Courses](#browsing-courses)
  - [Searching](#searching)
- [User Roles](#user-roles)
  - [Student Features](#student-features)
  - [Faculty Features](#faculty-features)
  - [Admin Features](#admin-features)
- [Course Management](#course-management)
  - [Viewing Courses](#viewing-courses)
  - [Creating Categories (Courses)](#creating-categories-courses)
  - [Creating Subcategories](#creating-subcategories)
  - [Enrolling in Courses](#enrolling-in-courses)
- [Notes Management](#notes-management)
  - [Uploading Notes](#uploading-notes)
  - [Viewing Note Details](#viewing-note-details)
  - [Downloading Notes](#downloading-notes)
  - [Deleting Notes](#deleting-notes)
- [Social Features](#social-features)
  - [Favoriting Notes](#favoriting-notes)
  - [Rating Notes](#rating-notes)
  - [Adding Comments](#adding-comments)
  - [Tagging Notes](#tagging-notes)
- [Profile Management](#profile-management)
  - [Viewing Your Profile](#viewing-your-profile)
  - [Viewing Your Uploads](#viewing-your-uploads)
  - [Viewing Your Activity](#viewing-your-activity)
- [Favorites Page](#favorites-page)
  - [Accessing Your Favorites](#accessing-your-favorites)
  - [Managing Your Favorites](#managing-your-favorites)
- [Admin Dashboard](#admin-dashboard)
  - [User Management](#user-management)
  - [Activity Logs](#activity-logs)
- [Troubleshooting](#troubleshooting)
  - [Common Issues](#common-issues)
  - [Contact Support](#contact-support)

## Getting Started

### Registration

1. **Access the Sign Up Page**:
   - Navigate to the NeuNotes homepage
   - Click the "Sign Up" button in the navigation bar

2. **Complete the Registration Form**:
   - Enter your first name and last name
   - Provide a valid email address
   - Create a secure password
   - Confirm your password by typing it again
   - Select your academic status (Undergraduate or Graduate)

3. **Submit the Form**:
   - Click the "Sign Up" button
   - You'll be redirected to the login page with a success message

### Login

1. **Access the Login Page**:
   - Navigate to the NeuNotes homepage
   - Click the "Login" button in the navigation bar

2. **Enter Credentials**:
   - Enter your registered email address
   - Enter your password
   - Click the "Sign In" button

3. **Successful Login**:
   - After successful authentication, you'll be redirected to the home page
   - Your name and role will appear in the navigation bar

### Navigation

The main navigation bar contains links to:

- **Home**: Returns to the main page showing available courses
- **Favorites**: Shows notes you've marked as favorites
- **Profile**: Displays your profile information and activities
- **Admin Dashboard**: Only visible to users with Admin role
- **User Info**: Shows your name and role
- **Logout**: Logs you out of the application

## Home Page

### Browsing Courses

The home page displays all available courses (categories) as cards:

1. **Course Cards**:
   - Each card shows the course name and code
   - Cards show the course creator's name
   - If you created a course, it will be marked with "(You)"

2. **Scroll Through Courses**:
   - Scroll down to see all available courses
   - Courses are displayed in a grid layout that adapts to screen size

### Searching

1. **Using the Search Bar**:
   - Located at the top of the home page
   - Enter keywords related to course names or codes
   - Results update as you type
   - Clear the search by clicking the "X" icon or deleting your query

## User Roles

NeuNotes has three user roles, each with different permissions:

### Student Features

As a Student, you can:
- View all available courses
- Enroll in courses
- Upload notes to courses you've enrolled in
- Download, rate, comment on, and favorite any notes
- Add tags to notes
- View your uploads and favorited notes
- Access your profile

### Faculty Features

As a Faculty member, you can:
- Create new categories (courses)
- Create subcategories within your courses
- Upload notes to any subcategory
- Manage (delete) notes you've uploaded
- Plus all Student features

### Admin Features

As an Admin, you have full access:
- Access the Admin Dashboard
- Manage user accounts (view all users, change roles)
- Create, edit, and delete any category or subcategory
- Delete any note, comment, or rating
- View system-wide activity logs
- Plus all Faculty and Student features

## Course Management

### Viewing Courses

1. **From the Home Page**:
   - All available courses are displayed as cards
   - Click on any course card to view its details

2. **Course Details Page**:
   - Shows the course name, code, and creator
   - Displays subcategories within the course
   - Lists all notes uploaded to each subcategory

### Creating Categories (Courses)

Faculty and Admin users can create new categories:

1. **From the Home Page**:
   - Click the "Create Category" button at the top of the page

2. **Fill in the Category Form**:
   - Enter a name for the category (required)
   - Optionally provide an image URL
   - Click "Create Category"
   - The system will automatically generate a unique code for the category

3. **Success**:
   - The new category will appear at the top of the categories list

### Creating Subcategories

Faculty and Admin users can create subcategories within courses they own:

1. **From the Course Details Page**:
   - Click the "Add Subcategory" button

2. **Fill in the Subcategory Form**:
   - Enter a name for the subcategory (required)
   - Click "Add Subcategory"

3. **Success**:
   - The new subcategory will appear in the course's subcategory list

### Enrolling in Courses

Student users need to enroll in courses to upload notes:

1. **From the Course Details Page**:
   - Click the "Enroll in this Course" button at the top of the page
   - This button only appears for Student users who aren't already enrolled

2. **Success**:
   - A green notification will appear confirming your enrollment
   - You'll now see the "Upload Note" button in subcategories

## Notes Management

### Uploading Notes

1. **From a Course Details Page**:
   - Navigate to the subcategory where you want to upload a note
   - Click the "Upload Note" button

2. **Fill in the Upload Form**:
   - Click the upload area or drag and drop your file (PDF or image only)
   - Optionally add a description of your note
   - Click "Upload Note"

3. **Success**:
   - Your note will appear in the subcategory's notes list
   - Other users can now view, download, rate, and comment on your note

### Viewing Note Details

1. **From a Course Details Page**:
   - Click on the eye icon next to any note to view its details

2. **Note Details Page**:
   - Shows the file name, upload date, and uploader
   - Displays analytics about the note (ratings, comments)
   - Shows tags associated with the note
   - Provides a rating interface
   - Displays comments section

### Downloading Notes

1. **From the Course Details Page**:
   - Click the download icon next to any note

2. **From the Note Details Page**:
   - Click the "Download" button at the top right

### Deleting Notes

Users can delete notes they've uploaded (Admin users can delete any note):

1. **From the Course Details Page**:
   - Click the trash icon next to your note
   - Confirm the deletion when prompted

## Social Features

### Favoriting Notes

1. **From the Course Details Page**:
   - Click the heart icon next to any note to favorite/unfavorite it
   - Empty heart: Not favorited; Filled heart: Favorited

2. **From the Note Details Page**:
   - Click the "Favorite"/"Favorited" button at the top right

3. **Accessing Favorites**:
   - Click "Favorites" in the navigation bar to see all your favorited notes

### Rating Notes

1. **From the Note Details Page**:
   - Find the Rating section
   - Click on any of the 5 stars to rate the note
   - Your rating will be highlighted in yellow
   - You can update your rating by clicking a different star

2. **Rating Statistics**:
   - The system shows the average rating and the total number of ratings
   - Your personal rating is highlighted when you've rated the note

### Adding Comments

1. **From the Note Details Page**:
   - Scroll to the Comments section
   - Type your comment in the text area
   - Click "Post Comment"

2. **Managing Comments**:
   - Your comments will display your name and timestamp
   - You can delete your own comments by clicking the "Delete" button

### Tagging Notes

1. **From the Note Details Page**:
   - Scroll to the Tags section
   - You can:
     - Select an existing tag from the dropdown and click "Add"
     - OR create a new tag by typing a name and clicking "Create & Add"

2. **Removing Tags**:
   - Click the "×" symbol next to any tag to remove it from the note

## Profile Management

### Viewing Your Profile

1. **Access Your Profile**:
   - Click your name or "Profile" in the navigation bar

2. **Profile Information**:
   - View your personal information (name, email, role, academic status)
   - Access other profile sections (uploads, activity log)

### Viewing Your Uploads

1. **From Your Profile Page**:
   - Click the "My Uploads" tab

2. **Uploads List**:
   - See all notes you've uploaded across all courses
   - Each entry shows the file name, category, subcategory, and upload date
   - Click on any upload to view its details

### Viewing Your Activity

1. **From Your Profile Page**:
   - Click the "Activity Log" tab

2. **Activity List**:
   - See a chronological list of your activities (uploads, comments, ratings, etc.)
   - Each entry shows the action and timestamp

## Favorites Page

### Accessing Your Favorites

1. **From Any Page**:
   - Click "Favorites" in the navigation bar

### Managing Your Favorites

1. **Favorites List**:
   - View all notes you've favorited
   - Each entry shows the note name, category, and upload date

2. **Actions**:
   - Click "View Note" to go to the note details
   - Click "Remove" to remove a note from your favorites

## Admin Dashboard

### User Management

Admin users can manage all users in the system:

1. **Accessing User Management**:
   - Go to the Admin Dashboard by clicking "Admin Dashboard" in the navigation bar
   - The Users tab is selected by default

2. **User Actions**:
   - View a list of all users with their details
   - Change a user's role using the dropdown menu (Student, Faculty, Admin)
   - Delete users by clicking the "Delete" button (you cannot delete yourself)

### Activity Logs

Admin users can view all system activity:

1. **Accessing Activity Logs**:
   - Go to the Admin Dashboard
   - Click the "Activity Logs" tab

2. **Activity Information**:
   - See all actions performed by all users
   - Each entry shows the user, action, and timestamp
   - Activities are sorted by most recent first

## Troubleshooting

### Common Issues

1. **Unable to Log In**:
   - Verify your email and password
   - Ensure caps lock is not enabled
   - Try resetting your password

2. **Cannot Upload Files**:
   - Check that your file is in a supported format (PDF, PNG, JPG, JPEG)
   - Ensure the file size is under 10MB
   - For students, verify you've enrolled in the course

3. **Features Not Appearing**:
   - Different features are available based on your user role
   - Verify your current role in your profile
   - If you believe you should have different permissions, contact an administrator

---

© 2025 NeuNotes. All rights reserved.