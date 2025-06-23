Entertainment Explorer Web Application
Overview
Entertainment Explorer is a comprehensive web application that allows users to discover and manage their favorite movies, books, and music in one place. The application integrates with multiple external APIs to provide rich content across different entertainment categories.

Features
Content Discovery
Movies: Search and browse movies using the OMDB API
Books: Explore books via the Open Library API
Music: Discover music tracks through the Deezer API
Trending & Popular: View curated lists of trending content in each category
User Features
Authentication: Secure user registration and login with Firebase Authentication
My List: Personalized collection of favorite movies, books, and songs
Profile Management: User profile customization and settings
Technical Features
Responsive Design: Mobile-first UI built with Tailwind CSS and Radix UI
API Integration: Multiple third-party API integrations with standardized data handling
Real-time Database: Firestore integration for user data persistence
Protected Routes: Secure access control for authenticated features
Tech Stack
Frontend
Framework: Next.js 14 (React)
Styling: Tailwind CSS
UI Components: Radix UI
State Management: React Context API
Form Handling: React Hook Form
Backend & Services
Authentication: Firebase Authentication
Database: Firestore
API Client: Axios
External APIs
OMDB API: Movie data
Open Library API: Book information
Deezer API: Music tracks and artists
Getting Started
Prerequisites
Node.js (v18 or higher)
npm or yarn package manager
Firebase account
Installation
Clone the repository:
bash
git clone https://github.com/yourusername/entertainment-explorer.git
cd entertainment-explorer
Install dependencies:
bash
npm install
# or
yarn install
Set up environment variables:
Create a .env.local file in the root directory
Add the following variables:
# Firebase Client SDK
NEXT_PUBLIC_FIREBASE_API_KEY=your_api_key
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your_project_id.firebaseapp.com
NEXT_PUBLIC_FIREBASE_PROJECT_ID=your_project_id
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your_project_id.appspot.com
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your_messaging_sender_id
NEXT_PUBLIC_FIREBASE_APP_ID=your_app_id

# Firebase Admin SDK
FIREBASE_PROJECT_ID=your_project_id
FIREBASE_CLIENT_EMAIL=your_client_email
FIREBASE_PRIVATE_KEY="your_private_key_with_quotes"

# API Keys
OMDB_API_KEY=your_omdb_api_key
NEXT_PUBLIC_OPEN_LIBRARY_API_BASE_URL=https://openlibrary.org
DEEZER_API_BASE_URL=https://api.deezer.com

Run the development server:
bash
npm run dev
# or
yarn dev

# Project Structure 
client/
├── app/                 # Next.js app directory (pages and routes)
│   ├── api/             # API routes
│   ├── books/           # Books section
│   ├── movies/          # Movies section
│   ├── music/           # Music section
│   ├── my-list/         # Personal favorites feature
│   ├── profile/         # User profile
│   └── layout.jsx       # Root layout
├── components/          # Reusable UI components
├── contexts/            # React contexts (auth, etc.)
├── hooks/               # Custom React hooks
├── lib/                 # Service layer and API clients
│   ├── firebase.js      # Firebase configuration
│   ├── myListService.js # User favorites management
│   ├── omdb.js          # Movies API integration
│   ├── openLibraryApi.js # Books API integration
│   └── deezer.js        # Music API integration
├── public/              # Static assets
└── styles/              # Global styles



