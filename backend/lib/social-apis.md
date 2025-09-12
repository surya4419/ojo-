# Social Media API Setup Guide

## Instagram Basic Display API

### 1. Create Facebook App
1. Go to [Facebook Developers](https://developers.facebook.com/)
2. Create a new app
3. Add "Instagram Basic Display" product
4. Get your App ID and App Secret

### 2. Get Instagram Access Token
1. Go to Instagram Basic Display > Basic Display
2. Add Instagram Testers (your Instagram account)
3. Generate User Access Token
4. Add to `.env` file:
```
INSTAGRAM_ACCESS_TOKEN=your-instagram-access-token
```

## LinkedIn API

### 1. Create LinkedIn App
1. Go to [LinkedIn Developers](https://www.linkedin.com/developers/)
2. Create a new app
3. Request "People Search" permission (requires approval)
4. Get Client ID and Client Secret

### 2. Add to `.env` file:
```
LINKEDIN_CLIENT_ID=your-linkedin-client-id
LINKEDIN_CLIENT_SECRET=your-linkedin-client-secret
```

**Note**: LinkedIn API requires special approval for people search functionality.

## Facebook Graph API

### 1. Create Facebook App
1. Go to [Facebook Developers](https://developers.facebook.com/)
2. Create a new app
3. Add "Facebook Login" product
4. Get App ID and App Secret

### 2. Add to `.env` file:
```
FACEBOOK_APP_ID=your-facebook-app-id
FACEBOOK_APP_SECRET=your-facebook-app-secret
```

## Google Custom Search API

### 1. Create Google Custom Search Engine
1. Go to [Google Custom Search](https://cse.google.com/)
2. Create a new search engine
3. Get Search Engine ID

### 2. Get API Key
1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Enable Custom Search API
3. Create API Key

### 3. Add to `.env` file:
```
GOOGLE_SEARCH_API_KEY=your-google-search-api-key
GOOGLE_SEARCH_ENGINE_ID=your-google-search-engine-id
```

## YouTube Data API

### 1. Get API Key
1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Enable YouTube Data API v3
3. Create API Key

### 2. Add to `.env` file:
```
YOUTUBE_API_KEY=your-youtube-api-key
```

## Complete .env Example

```env
# Database
TIDB_HOST=your-tidb-host
TIDB_PORT=4000
TIDB_USERNAME=your-username
TIDB_PASSWORD=your-password
TIDB_DATABASE=your-database

# AI
GEMINI_API_KEY=your-gemini-api-key

# Social Media APIs
FACEBOOK_APP_ID=your-facebook-app-id
FACEBOOK_APP_SECRET=your-facebook-app-secret
INSTAGRAM_ACCESS_TOKEN=your-instagram-access-token
LINKEDIN_CLIENT_ID=your-linkedin-client-id
LINKEDIN_CLIENT_SECRET=your-linkedin-client-secret

# Search APIs
GOOGLE_SEARCH_API_KEY=your-google-search-api-key
GOOGLE_SEARCH_ENGINE_ID=your-google-search-engine-id
YOUTUBE_API_KEY=your-youtube-api-key
```
