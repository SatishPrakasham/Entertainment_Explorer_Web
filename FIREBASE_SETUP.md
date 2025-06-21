# Firebase Authentication Setup

This document provides instructions for setting up Firebase Authentication in this project.

## Environment Variables

Create a `.env.local` file in the root of your project with the following variables:

```
# Firebase Client SDK (for browser)
NEXT_PUBLIC_FIREBASE_API_KEY=your_api_key
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your_project_id.firebaseapp.com
NEXT_PUBLIC_FIREBASE_PROJECT_ID=your_project_id
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your_project_id.appspot.com
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your_messaging_sender_id
NEXT_PUBLIC_FIREBASE_APP_ID=your_app_id

# Firebase Admin SDK (for server)
FIREBASE_PROJECT_ID=your_project_id
FIREBASE_CLIENT_EMAIL=your_client_email
FIREBASE_PRIVATE_KEY="your_private_key_with_quotes"
```

## Getting Firebase Configuration

1. Go to the [Firebase Console](https://console.firebase.google.com/)
2. Create a new project or select an existing one
3. Add a web app to your project
4. Copy the configuration values from the Firebase SDK snippet
5. For the Admin SDK, go to Project Settings > Service Accounts > Generate new private key

## Authentication Setup

1. In the Firebase Console, go to Authentication > Sign-in method
2. Enable Email/Password authentication
3. Optionally, set up other authentication methods as needed

## Firestore Setup

1. In the Firebase Console, go to Firestore Database
2. Create a new database if you don't have one
3. Start in production mode or test mode as needed
4. Create a collection named `users` (will be automatically created when users register)

## Security Rules

Add these basic security rules to your Firestore database:

```
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /users/{userId} {
      allow read, update, delete: if request.auth != null && request.auth.uid == userId;
      allow create: if request.auth != null;
    }
    match /{document=**} {
      allow read: if request.auth != null;
      allow write: if false;
    }
  }
}
```

## Testing

After setting up the environment variables, you can test the authentication by:

1. Starting the development server: `npm run dev`
2. Navigating to `/register` to create a new account
3. Signing in with your new account at `/login`
4. Checking your user profile at `/profile`
