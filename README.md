# CS50 Project 3 - Mail

A single-page email application built with Django and JavaScript for CS50's Web Programming with Python and JavaScript course.

## 📧 Overview

Mail is a front-end single-page email client that makes API calls to send and receive emails. The application allows users to send, receive, view, archive, and reply to emails in a Gmail-like interface.

## 🚀 Features

- **Send Mail**: Compose and send emails to one or multiple recipients
- **Mailbox Views**: View inbox, sent emails, and archived emails
- **Read/Unread Status**: Mark emails as read when opened
- **Archive**: Archive and unarchive emails from the inbox
- **Reply**: Reply to emails with pre-filled recipient and subject fields
- **User Authentication**: Register, login, and logout functionality
- **Single Page Application**: Dynamic content loading without page refreshes

## 🛠️ Tech Stack

- **Backend**: Python (61. 4%), Django
- **Frontend**: JavaScript (24.6%), HTML (13.9%), CSS (0.1%)
- **Database**: Django ORM with SQLite (default)

## 📂 Project Structure

```
cs50-project3-mail/
├── mail/
│   ├── static/mail/
│   │   └── inbox.js          # Main JavaScript for SPA functionality
│   ├── templates/mail/
│   │   ├── inbox.html        # Main inbox template
│   │   ├── layout.html       # Base template
│   │   ├── login.html        # Login page
│   │   └── register.html     # Registration page
│   ├── models.py             # Database models (User, Email)
│   ├── views.py              # Backend API views
│   ├── urls.py               # URL routing
│   └── ... 
├── project3/                 # Django project settings
├── manage.py                 # Django management script
└── . gitignore
```

## 📦 Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/andrejskocins/cs50-project3-mail. git
   cd cs50-project3-mail
   ```

2. **Set up a virtual environment** (recommended)
   ```bash
   python -m venv venv
   source venv/bin/activate  # On Windows: venv\Scripts\activate
   ```

3. **Install dependencies**
   ```bash
   pip install django
   ```

4. **Run migrations**
   ```bash
   python manage.py makemigrations mail
   python manage.py migrate
   ```

5. **Create a superuser** (optional)
   ```bash
   python manage.py createsuperuser
   ```

6. **Run the development server**
   ```bash
   python manage.py runserver
   ```

7. **Access the application**
   
   Open your browser and navigate to `http://127.0.0.1:8000`

## 📊 Database Models

### User
Extends Django's `AbstractUser` model for authentication.

### Email
- `user`: The user who owns this email (inbox copy)
- `sender`: The user who sent the email
- `recipients`: Many-to-many relationship with Users
- `subject`: Email subject line
- `body`: Email content
- `timestamp`: When the email was sent
- `read`: Boolean flag for read status
- `archived`: Boolean flag for archive status

## 🔌 API Endpoints

- `GET /emails/<mailbox>`: Fetch emails for a specific mailbox (inbox, sent, archive)
- `GET /emails/<email_id>`: Get details of a specific email
- `POST /emails`: Send a new email
- `PUT /emails/<email_id>`: Update email (mark as read/unread, archive/unarchive)

## 🎯 Key Features Implementation

### Compose Email
- Dynamic form for composing new emails
- Support for multiple recipients (comma-separated)
- Input validation for recipient existence

### Mailbox Views
- **Inbox**: Shows unarchived emails received by the user
- **Sent**:  Shows emails sent by the user
- **Archive**: Shows archived emails

### Email View
- Click on any email to view its full content
- Automatically marks email as read
- Shows sender, recipients, subject, timestamp, and body
- Archive/Unarchive button (not available for sent emails)
- Reply button

### Reply Functionality
- Pre-fills recipient with the original sender
- Pre-fills subject with "Re:  " prefix
- Pre-fills body with original email quoted

## 📝 Usage

1. **Register** a new account or **login** with existing credentials
2. **Compose** new emails using the "Compose" button
3. **View** your inbox, sent emails, or archived emails using the navigation buttons
4. **Click** on any email to view its details
5. **Archive/Unarchive** emails to organize your inbox
6. **Reply** to emails using the reply button
