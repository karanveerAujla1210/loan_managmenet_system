# Collections Mobile App - Installation Guide

## Prerequisites
- Node.js 16+ 
- Expo CLI: `npm install -g @expo/cli`
- Android Studio (for Android) or Xcode (for iOS)

## Installation Steps

1. **Navigate to mobile app directory:**
   ```bash
   cd mobile-app
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Configure environment:**
   Create `app.config.js` in root:
   ```javascript
   export default {
     expo: {
       name: "Collections App",
       slug: "collections-mobile-app",
       extra: {
         apiUrl: process.env.API_URL || "http://192.168.1.100:3000/api/v1"
       }
     }
   };
   ```

4. **Start development server:**
   ```bash
   npx expo start
   ```

5. **Run on device:**
   - Scan QR code with Expo Go app
   - Or press 'a' for Android emulator
   - Or press 'i' for iOS simulator

## Background Fetch Setup

### Android
- Background fetch is automatically configured via `app.json`
- Minimum interval: 15 minutes

### iOS  
- Background fetch requires app store approval
- Configure in `app.json` under `ios.backgroundModes`

## Environment Configuration

Set API base URL in `app.config.js`:
```javascript
extra: {
  apiUrl: "https://your-api-domain.com/api/v1"
}
```

## Build for Production

```bash
# Android APK
npx expo build:android

# iOS IPA  
npx expo build:ios
```

## Troubleshooting

1. **SQLite issues:** Ensure expo-sqlite is properly installed
2. **Network errors:** Check API_URL configuration
3. **Background sync not working:** Verify background permissions
4. **Image picker issues:** Check camera/gallery permissions