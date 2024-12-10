# NYC Engraving Service Web System Specification

## General Setup

### Page Setup
- Header and Footer:
  - Attractive CSS design for aesthetics.
  - Responsive design supporting mobile browsers.
- Dark Mode:
  - Toggle for Dark Mode: ON/OFF/Auto (based on system settings).
  - Toggle accessible globally in admin settings.

## Client Side

### Entry Page
- **Greeting and Options**:
  - Button to create a new project.
  - Button to continue an existing project (requires project code).

### Project Creation Wizard
- **Initial Step**:
  - Option to import a picture via local upload or camera capture.
- **Project Type Selection**:
  - Options to choose between text-only engraving or vector graphic upload.
- **File Upload (if vector graphic selected)**:
  - Supported file formats: *.ai, *.svg, *.pdf.
  - Sanity check to ensure file is a vector graphic.
  - Preview of uploaded vector graphic.
  - Options to accept or re-upload the graphic.

### Main Project Editor
- **Interface**:
  - Similar to Adobe Illustrator or Photoshop.
  - Top menu bar with editing options.
  - Sidebar displaying assets (background image, imported vector image, text) which can be added, deleted, or hidden.
- **Functionality**:
  - Import additional vectors and create text overlays.
  - Adjust and move the background picture freely.
  - Resize, rotate, and reposition vector graphics and text.
  - Responsive support for both mobile and desktop.
- **Submission**:
  - Collect user details (name, phone number, email, appointment time, project type, material make).
  - Generate a 10-digit project code.
  - Export user-edited mockup to a PDF vector file.
  - Upload all project details to Firebase database.

## Admin Page

### Access Control
- **Authentication**:
  - Multi-admin user support.
  - Secure and standardized login.
  - User login data storage.

### Functionality
- **Project Lookup**:
  - Input field for project code.
  - Display all related project information.
  - Options to download vector file and edited mockup PDF.
  - Edit project using the main project editor.
- **Project Management**:
  - Table view listing all submitted projects with detailed information.
- **System Settings**:
  - Add/remove admin users.
  - Change passwords for admin users.

## Additional Features
- Designed to be future-proof for easy addition of new features.
- Responsive design tailored for both desktop and mobile usability.


