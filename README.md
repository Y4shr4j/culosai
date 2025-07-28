# CulosAI 🤖✨

CulosAI is a full-stack application for generating AI content. It integrates with Stability AI for image creation and Runway ML for video generation. The project features a modern React frontend and is powered by a Node.js/Express backend with MongoDB.

## Features

  - **AI Image Generation**: Integrates with Stability AI.
  - **AI Video Generation**: Integrates with Runway ML.
  - **Secure Authentication**: Social login with Google & Facebook using Passport.js.
  - **Cloud Storage**: Utilizes AWS S3 for scalable file storage.
  - **Modern Tech Stack**: Built with TypeScript, Vite, React, Express, and Tailwind CSS for a fast and type-safe development experience.
  - **Responsive UI**: A beautiful user interface built with Radix UI and shadcn/ui components.

-----

## Tech Stack

  - **Frontend**: React, TypeScript, Vite, Tailwind CSS, Radix UI
  - **Backend**: Node.js, Express, TypeScript
  - **Database**: MongoDB
  - **Authentication**: Passport.js (Google & Facebook OAuth), JWT
  - **File Storage**: AWS S3
  - **AI Services**: Stability AI, Runway ML

-----

## Getting Started

Follow these instructions to get a local copy up and running.

### Prerequisites

You will need the following installed on your machine:

  - Node.js (v18 or later)
  - npm or yarn
  - Git

You will also need accounts and API keys from:

  - MongoDB Atlas (for the connection URI)
  - Amazon Web Services (for S3 bucket credentials)
  - Stability AI
  - Runway ML
  - Google Cloud Platform & Facebook for Developers (for OAuth credentials)

### Installation

1.  **Clone the repository:**

    ```bash
    git clone <YOUR_REPOSITORY_URL>
    cd <repository-folder>
    ```

2.  **Install project dependencies:**

    ```bash
    npm install
    ```

### Environment Setup

1.  Create a file named `.env` in the project's **root directory**.

2.  Copy the contents of the block below into your new `.env` file.

3.  Replace all placeholder values (e.g., `<YOUR_MONGO_URI>`) with your actual credentials.

    ```.env
    # Server Configuration
    PORT=5000
    JWT_SECRET=<YOUR_SUPER_SECRET_JWT_KEY>
    SESSION_SECRET=<YOUR_SUPER_SECRET_SESSION_KEY>

    # Database
    MONGO_URI=<YOUR_MONGODB_CONNECTION_STRING>

    # AI Services
    STABILITY_API_KEY=<YOUR_STABILITY_AI_API_KEY>
    RUNWAY_API_KEY=<YOUR_RUNWAY_ML_API_KEY>

    # Google OAuth
    GOOGLE_CLIENT_ID=<YOUR_GOOGLE_CLIENT_ID>
    GOOGLE_CLIENT_SECRET=<YOUR_GOOGLE_CLIENT_SECRET>

    # Facebook OAuth
    FACEBOOK_APP_ID=<YOUR_FACEBOOK_APP_ID>
    FACEBOOK_APP_SECRET=<YOUR_FACEBOOK_APP_SECRET>

    # General Config
    OAUTH_CALLBACK_URL=http://localhost:5000/auth/google/callback
    FRONTEND_URL=http://localhost:8080

    # AWS S3 Configuration
    AWS_ACCESS_KEY_ID=<YOUR_AWS_ACCESS_KEY_ID>
    AWS_SECRET_ACCESS_KEY=<YOUR_AWS_SECRET_ACCESS_KEY>
    AWS_REGION=<YOUR_AWS_S3_BUCKET_REGION>
    AWS_S3_BUCKET=<YOUR_AWS_S3_BUCKET_NAME>
    AWS_S3_UPLOAD_FOLDER=ChatImage
    ```

### Running the Application

This project requires running the frontend and backend servers simultaneously in **two separate terminals**.

#### Terminal 1: Start the Frontend 🖥️

In your project's root directory, run the following command to start the React frontend:

```bash
npm run dev
```

This will make the frontend available at `http://localhost:8080`.

#### Terminal 2: Start the Backend ⚙️

In a new terminal window, start the backend Express server:

```bash
cd server
npx ts-node src/app.ts
```

This will start your backend API server, which will run on `http://localhost:5000`.

-----

## Available Scripts

  - `npm run dev`: Starts the frontend development server.
  - `npm run build`: Builds the client and server for production.
  - `npm run start`: Starts the production server from the `dist` folder (after building).
  - `npm run test`: Runs tests using Vitest.
