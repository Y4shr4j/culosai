# CulosAI Platform

A full-stack AI-powered platform for generating, managing, and viewing AI images and videos, with admin controls, age verification, and token-based content unlocking.

---

## Features

- **User Dashboard**: View, unlock, and download AI-generated images and videos
- **Admin Panel**: Upload, manage, and blur/unblur images; only accessible to admin users
- **Token System**: Users unlock blurred images using tokens (purchaseable)
- **Age Verification**: Modal popup ensures users are 18+ before accessing content
- **AWS S3 Integration**: Secure image storage and retrieval
- **Role-based Access**: Admin/user separation with JWT authentication
- **Responsive UI**: Modern, mobile-friendly React frontend

---

## Tech Stack

- **Frontend**: React, TypeScript, Tailwind CSS
- **Backend**: Node.js, Express, TypeScript
- **Database**: MongoDB (Mongoose)
- **Storage**: AWS S3
- **Authentication**: JWT, OAuth (Google, Facebook)

---

## Getting Started

### Prerequisites

- Node.js (v16+ recommended)
- npm or yarn
- MongoDB Atlas or local MongoDB instance
- AWS S3 bucket and IAM credentials

### 1. Clone the Repository

```bash
git clone <your-repo-url>
cd <your-repo-folder>
```

### 2. Setup Environment Variables

#### Server (`server/.env`):

```
MONGODB_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret
AWS_ACCESS_KEY_ID=your_aws_access_key
AWS_SECRET_ACCESS_KEY=your_aws_secret_key
AWS_REGION=us-east-2
AWS_S3_BUCKET=your_bucket_name
AWS_S3_UPLOAD_FOLDER=ChatImage
GOOGLE_CLIENT_ID=your_google_client_id
GOOGLE_CLIENT_SECRET=your_google_client_secret
FACEBOOK_APP_ID=your_facebook_app_id
FACEBOOK_APP_SECRET=your_facebook_app_secret
```

#### Client

- No .env needed by default, but you can add one for custom API URLs if needed.

### 3. Install Dependencies

#### Server

```bash
cd server
npm install
```

#### Client

```bash
cd ../client
npm install
```

### 4. Run the Application

#### Start the Server

```bash
cd server
npm run dev
```

#### Start the Client

```bash
cd ../client
npm run dev
```

- Client runs on [http://localhost:8080](http://localhost:8080)
- Server runs on [http://localhost:5000](http://localhost:5000)

---

## Usage

- **Register/Login** as a user
- **Verify Age** via popup modal (must be 18+)
- **Browse Dashboard**: View and unlock images/videos
- **Purchase Tokens**: Use tokens to unlock blurred images
- **Admin Access**: If your account is admin, use the "Admin" button in the navbar to access the admin panel
- **Admin Panel**: Upload, blur/unblur, and manage images

---

## Customization

- **Styling**: Edit Tailwind classes in `client/` for custom branding
- **Admin Users**: Set `isAdmin: true` in the MongoDB user document for admin access
- **S3 Bucket**: Update bucket policy for CORS and cross-account access as needed

---

## Security Notes

- Never commit your `.env` files or secrets to version control
- Use HTTPS in production
- Restrict S3 bucket access to only necessary IAM users

---

## License

MIT License
