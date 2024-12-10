# NYC Engraving Service Web System Specification

## General Setup

### Page Setup
- Header and Footer:
  - Attractive CSS design for aesthetics.
  - Responsive design supporting mobile browsers.
- Dark Mode:
  - Toggle for Dark Mode: ON/OFF/Auto (based on system settings).
  - Toggle accessible in admin settings.
  - theme settings should be applied globally to all pages.

## Client Side

### Entry Page
- **Greeting and Options**:
  - Button to create a new project.(direct to Project Creation wizaed)
  - Button to continue an existing project (requires project code).

### Project Creation Wizard
- **Initial Step**:
 - Options to choose between text-only engraving or vector graphic upload if the client have a vector graphic.

- **Project Type Selection**:
  -Option to import a picture of the item client like to engrave via local upload or camera capture as the background image.
- **File Upload (if vector graphic selected)**:
  - Supported file formats: *.svg
  - Sanity check to ensure file is a vector graphic.
  - Preview of uploaded background image and vector graphic.
  - Options to accept or re-upload the graphic before moving forward.
  - Place the background image and vector graphic on the canvas in the editor so user can make further edits.

### Main Project Editor
- **Interface**:
  - Similar to Adobe Illustrator or Photoshop.
  - Top menu bar with editing options.
  - Sidebar displaying assets (background image, imported vector image, text) which more assets can be imported, deleted, or hidden.
- **Functionality**:
  - Import additional vectors and create text overlays.
  - Adjust and move the background picture freely.
  - Resize, rotate, and reposition vector graphics and text overlaying the background picture.
  - Responsive support for both mobile and desktop.
  - **Text Overlay**:
    - Users can add text layers to the canvas.
    - Text input field to type custom text.
    - Dropdown to select font.
    - Options to adjust font size, color, alignment, and styling (bold, italic, etc.).
    - Text can be moved, resized, and rotated freely.
    - Text can be hidden or shown.
    - Default font folder in the file system containing pre-installed fonts for users.
    - Option for users to upload custom fonts (supported formats: *.ttf, *.otf).
    - Sanity check for uploaded fonts to ensure compatibility.
    - Font preview showing how the text will look with each font before applying it.

- **Submission**:
  - Collect user details (name, phone number, email, appointment time, project type(walk-in /mail-in /bulk sample), material make).
  - Generate a 10-digit project code.
  - Export user-edited mockup to a PDF vector file.
  - Upload all project details to Firebase database.

## Admin Page

### Access Control
- **Authentication**:
  - admin pages should be protected by a login page and can only be accessed by admin users.
  - Multi-admin user support.
  - Secure and standardized login.
  - secure user login data storage(hashed password).

### Functionality
- **Project Lookup**:
  - Input field for project code.
  - Display all related project information and able to edit the project information.
  - Options to download vector file uploaded by client and edited mockup PDF.
  - able to edit project using the main project editor and resave all the changes.
- **Project Management**:
  - Table view listing all submitted projects with detailed information.
  - able to edit the project information and resave all the changes.
  - able to delete the project and all the data related to the project.
- **System Settings**:
  - Add/remove admin users.
  - Change passwords for admin users.
  - able to change the theme settings and apply it to all pages.
  
## Additional Features
- Designed to be future-proof for easy addition of new features.
- Responsive design tailored for both desktop and mobile usability.


