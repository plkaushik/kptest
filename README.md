# Life Financial Planner

A comprehensive financial planning application with user authentication, scenario modeling, and detailed financial projections.

## Features

- 🔐 **User Authentication** - Secure login/signup with data persistence
- 📊 **Financial Scenarios** - Create and compare different life paths
- 📈 **Interactive Charts** - Visualize net worth progression and financial metrics
- 🎯 **Retirement Planning** - Calculate retirement readiness and savings goals
- 💰 **Comprehensive Analysis** - Cash flow, emergency fund, and expense ratio tracking
- 📱 **Responsive Design** - Works on desktop, tablet, and mobile devices

## Quick Start

### Prerequisites
- Node.js (version 14 or higher)
- npm or yarn package manager

### Installation

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

### Demo Account
For quick testing, use these credentials:
- **Email:** demo@example.com
- **Password:** demo123

## Project Structure

```
src/
├── App.js                 # Main application component
├── auth.js               # Authentication logic and utilities
├── AuthComponents.jsx    # Login and signup UI components
├── index.js              # React app entry point
└── index.css             # Global styles

public/
├── index.html            # HTML template
└── manifest.json         # PWA manifest
```

## Available Scripts

- `npm start` - Runs the app in development mode
- `npm build` - Builds the app for production
- `npm test` - Launches the test runner
- `npm eject` - Ejects from Create React App (one-way operation)

## Authentication System

The app includes a complete authentication system with:

- **User Registration** - Create new accounts with email/password
- **User Login** - Sign in with existing credentials
- **Session Persistence** - Stay logged in across browser sessions
- **Data Isolation** - Each user has their own scenarios and profile
- **Form Validation** - Client-side validation with error messages

## Financial Planning Features

### Scenario Creation
- Define current financial situation
- Set income, expenses, and savings goals
- Plan for major life events (marriage, children, home purchase)
- Model different career paths and salary growth

### Analysis & Projections
- 45-year financial projections
- Net worth tracking over time
- Retirement readiness calculations
- Emergency fund analysis
- Expense ratio monitoring

### Visualization
- Interactive charts using Recharts
- Net worth progression graphs
- Cash flow analysis
- Scenario comparison tools

## Technology Stack

- **React 18** - Modern React with hooks
- **Lucide React** - Beautiful icon library
- **Recharts** - Responsive chart components
- **Tailwind CSS** - Utility-first CSS framework
- **Local Storage** - Client-side data persistence

## Development

### Adding New Features
1. Create new components in the `src/` directory
2. Update the main `App.js` component to include new routes
3. Add any new dependencies to `package.json`
4. Test thoroughly before committing

### Authentication Flow
1. User visits app → Login form displayed
2. User signs up/logs in → Profile setup (if new user)
3. User creates scenarios → Data saved to localStorage
4. User can logout → Returns to login form

### Data Persistence
- User profiles and scenarios are stored in localStorage
- Each user's data is isolated by user ID
- Data persists across browser sessions
- In production, this would connect to a real database

## Production Deployment

### Build for Production
```bash
npm run build
```

This creates a `build/` folder with optimized production files.

### Deploy Options
- **Netlify** - Drag and drop the build folder
- **Vercel** - Connect your GitHub repository
- **AWS S3** - Upload build files to S3 bucket
- **Heroku** - Deploy with buildpacks

### Environment Variables
For production, you'll want to:
1. Replace mock authentication with real API calls
2. Add environment variables for API endpoints
3. Implement proper password hashing
4. Add JWT token management

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## License

This project is open source and available under the MIT License.

## Support

For questions or issues:
1. Check the documentation above
2. Review the code comments
3. Create an issue in the repository
4. Contact the development team

---

**Happy Financial Planning! 💰📈**