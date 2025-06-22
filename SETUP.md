# Solo Leveling Real Life - Fullstack Webapp Setup

## 🚀 Quick Start

1. **Install dependencies:**
   ```bash
   npm install
   ```

2. **Start the development server:**
   ```bash
   npm start
   ```

3. **Open your browser:**
   Navigate to `http://localhost:3000`

## 📦 Installed Dependencies

### Core Dependencies
- **React 19.1.0** - UI framework
- **Firebase 11.9.1** - Backend as a Service
- **React Router DOM 7.6.2** - Client-side routing
- **Tailwind CSS 3.3.5** - Utility-first CSS framework

### Additional Libraries
- **Axios** - HTTP client for API requests
- **Lucide React** - Beautiful icons
- **React Hook Form** - Form management with validation
- **Zod** - TypeScript-first schema validation
- **Date-fns** - Date utility library
- **React Hot Toast** - Toast notifications
- **Framer Motion** - Animation library

### Development Dependencies
- **Prettier** - Code formatter
- **ESLint** - Code linting
- **TypeScript types** - Type definitions

## 🛠️ Available Scripts

```bash
# Start development server
npm start

# Build for production
npm run build

# Run tests
npm test

# Format code
npm run format

# Check code formatting
npm run format:check

# Lint code
npm run lint

# Fix linting issues
npm run lint:fix
```

## 📁 Project Structure

```
src/
├── components/          # Reusable UI components
├── pages/              # Page components
├── hooks/              # Custom React hooks
├── utils/              # Utility functions
├── constants/          # App constants
├── firebase.js         # Firebase configuration
├── firestoreHelpers.js # Firestore operations
└── Router.js           # App routing
```

## 🔧 Configuration Files

- **`.prettierrc`** - Prettier formatting rules
- **`.vscode/settings.json`** - VS Code workspace settings
- **`tailwind.config.js`** - Tailwind CSS configuration
- **`postcss.config.js`** - PostCSS configuration

## 🎨 Styling

This project uses **Tailwind CSS** for styling. The configuration includes:
- Custom color palette
- Responsive breakpoints
- Custom animations
- Dark mode support

## 🔥 Firebase Setup

Make sure your Firebase configuration is set up in `src/firebase.js`:

```javascript
const firebaseConfig = {
  apiKey: "your-api-key",
  authDomain: "your-project.firebaseapp.com",
  projectId: "your-project-id",
  storageBucket: "your-project.appspot.com",
  messagingSenderId: "your-sender-id",
  appId: "your-app-id"
};
```

## 📱 Features

- ✅ User authentication (Firebase Auth)
- ✅ Real-time data persistence (Firestore)
- ✅ Goal management system
- ✅ XP and leveling system
- ✅ Attribute tracking
- ✅ Responsive design
- ✅ Form validation
- ✅ Toast notifications
- ✅ Code formatting and linting

## 🚀 Deployment

### Vercel (Recommended)
1. Connect your GitHub repository to Vercel
2. Vercel will automatically detect it's a React app
3. Deploy with one click

### Netlify
1. Build the project: `npm run build`
2. Upload the `build` folder to Netlify
3. Set environment variables if needed

### Firebase Hosting
1. Install Firebase CLI: `npm install -g firebase-tools`
2. Login: `firebase login`
3. Initialize: `firebase init hosting`
4. Build: `npm run build`
5. Deploy: `firebase deploy`

## 🔒 Environment Variables

Create a `.env` file in the root directory:

```env
REACT_APP_FIREBASE_API_KEY=your-api-key
REACT_APP_FIREBASE_AUTH_DOMAIN=your-project.firebaseapp.com
REACT_APP_FIREBASE_PROJECT_ID=your-project-id
REACT_APP_FIREBASE_STORAGE_BUCKET=your-project.appspot.com
REACT_APP_FIREBASE_MESSAGING_SENDER_ID=your-sender-id
REACT_APP_FIREBASE_APP_ID=your-app-id
```

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Run tests and linting
5. Submit a pull request

## 📄 License

This project is licensed under the MIT License. 