# TravelBeam - AI-Powered Travel Planner

## Overview
TravelBeam is an intelligent travel planning application that helps users create personalized travel itineraries using AI. The application provides custom travel recommendations based on user preferences, including destination, duration, budget, and group size.

## Features
- **AI-Powered Itinerary Generation**: Custom travel plans created using Google's Generative AI
- **Google Authentication**: Secure sign-in using Google OAuth
- **Responsive Design**: Works seamlessly across desktop and mobile devices
- **Interactive UI**: User-friendly interface with intuitive navigation
- **Trip Management**: Save and manage multiple trip itineraries
- **Place Recommendations**: Suggests places to visit with detailed information
- **Hotel Recommendations**: Provides hotel options based on preferences
- **Weather Integration**: Real-time weather forecasts for your destination
- **Budget Tracking**: Keep track of estimated expenses for your trip

## Technology Stack
- **Frontend**: React.js with Vite for blazing fast development
- **Styling**: Tailwind CSS for utility-first design
- **State Management**: Redux for global state handling
- **Authentication**: Google OAuth 2.0
- **Database**: Firebase Firestore for real-time data storage
- **Hosting**: Firebase Hosting for deployment
- **APIs**: 
    - Google Places API for location data
    - Google Generative AI (Gemini) for intelligent recommendations
    - Google Maps API for interactive maps
    - OpenWeather API for weather forecasts

## Prerequisites
- Node.js (v14 or higher)
- npm or yarn
- Google Cloud Platform account with enabled APIs:
    - Places API
    - Maps JavaScript API
    - Identity Services
    - Generative AI Studio
- Firebase account with Firestore database

## Environment Variables
Create a `.env.local` file in the root directory with the following variables:
```env
VITE_GOOGLE_PLACES_API_KEY=your_google_places_api_key
VITE_GOOGLE_AUTH_CLIENT_ID=your_google_auth_client_id
VITE_GOOGLE_GEMINI_AI_API_KEY=your_gemini_ai_api_key
VITE_FIREBASE_API_KEY=your_firebase_api_key
VITE_FIREBASE_AUTH_DOMAIN=your_firebase_auth_domain
VITE_FIREBASE_PROJECT_ID=your_firebase_project_id
VITE_FIREBASE_STORAGE_BUCKET=your_firebase_storage_bucket
VITE_FIREBASE_MESSAGING_SENDER_ID=your_firebase_messaging_sender_id
VITE_FIREBASE_APP_ID=your_firebase_app_id
```

## Installation
1. Clone the repository
```bash
git clone https://github.com/prabha55555/AI_TRIP_PARTNER.git
```

2. Install dependencies
```bash
cd mu
npm install
```

3. Start the development server
```bash
npm run dev
```


## Project Structure
```
mu/
│   ├── src/                  # Source files
│   │   ├── AI/               # AI integration services
│   │   │   ├── gemini.js     # Gemini AI API integration
│   │   │   └── prompts.js    # AI prompt templates
│   │   ├── components/
│   │   │   ├── custom/       # Application-specific components
│   │   │   │   ├── Header.jsx
│   │   │   │   ├── Hero.jsx
│   │   │   │   └── ...
│   │   │   └── ui/           # Reusable UI components
│   │   │       ├── Button.jsx
│   │   │       ├── Card.jsx
│   │   │       └── ...
│   │   ├── pages/            # Application pages
│   │   │   ├── create/       # Trip creation pages
│   │   │   │   ├── CreateTrip.jsx
│   │   │   │   └── ...
│   │   │   ├── my-trips/     # Trip management pages
│   │   │   │   ├── MyTrips.jsx
│   │   │   │   └── ...
│   │   │   └── view-trip/    # Trip details pages
│   │   │       ├── ViewTrip.jsx
│   │   │       └── ...
│   │   ├── services/         # Firebase and API services
│   │   │   ├── firebase.js
│   │   │   ├── googleMaps.js
│   │   │   └── ...
│   │   ├── store/            # Redux store configuration
│   │   │   ├── index.js
│   │   │   └── reducers/
│   │   ├── styles/           # Global styles
│   │   ├── utils/            # Utility functions
│   │   ├── App.jsx           # Main application component
│   │   └── main.jsx          # Entry point
│   ├── public/               # Static assets
│   ├── index.html            # HTML template
│   ├── tailwind.config.js    # Tailwind CSS configuration
│   ├── vite.config.js        # Vite configuration
│   └── package.json          # Project dependencies
```

## Features in Detail

### 1. Trip Creation
- **Destination Selection**: Utilize Google Places Autocomplete for accurate location search
- **Duration Planning**: Set trip length from 1 to 30 days
- **Budget Configuration**: Choose from economy, moderate, or luxury budget categories
- **Group Customization**: Specify group size and type (family, friends, solo, couple)
- **Interest Selection**: Choose activities and interests for personalized recommendations
