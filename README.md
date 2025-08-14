# FetchIO - Professional Ticket Management System

[![License: CC BY-NC-SA 4.0](https://img.shields.io/badge/License-CC%20BY--NC--SA%204.0-lightgrey.svg)](https://creativecommons.org/licenses/by-nc-sa/4.0/)
[![Electron](https://img.shields.io/badge/Electron-27.1.0-blue.svg)](https://electronjs.org/)
[![React](https://img.shields.io/badge/React-18.3.1-blue.svg)](https://reactjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.6.2-blue.svg)](https://www.typescriptlang.org/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind%20CSS-3.4.12-blue.svg)](https://tailwindcss.com/)

A sophisticated, cross-platform desktop application built with Electron for professional ticket management, proxy handling, and automated task execution. Built on a modern tech stack with enterprise-grade architecture.

## 🚀 Features

### Core Functionality
- **Ticket Management**: Comprehensive ticket handling for multiple platforms
- **Proxy Management**: Advanced proxy configuration and validation
- **Group Management**: Organized account grouping with type-based categorization
- **Task Automation**: Automated task execution with configurable parameters
- **Multi-Platform Support**: Ticketmaster (FR/EU), Premier League clubs, and more

### Supported Platforms
- **Ticketmaster**: French and European markets
- **Premier League Clubs**: Arsenal, Chelsea, Everton, Tottenham, Liverpool, Newcastle, Manchester City, Manchester United
- **Custom Modules**: Extensible architecture for additional platforms

### Technical Features
- **Cross-Platform**: Windows, macOS, and Linux support
- **Modern UI**: Beautiful, responsive interface built with React and Tailwind CSS
- **Real-time Updates**: Live status monitoring and progress tracking
- **Data Persistence**: Local storage with JSON-based configuration
- **Authentication**: Discord OAuth2 integration
- **Offline Support**: Works without internet connection
- **Hot Reload**: Development-friendly with live code updates

## 🛠️ Tech Stack

### Frontend
- **React 18.3.1** - Modern React with hooks and functional components
- **TypeScript 5.6.2** - Type-safe development
- **Tailwind CSS 3.4.12** - Utility-first CSS framework
- **Radix UI** - Accessible, unstyled UI components
- **React Router DOM** - Client-side routing
- **React Hook Form** - Performant forms with validation

### Backend & Build Tools
- **Electron 27.1.0** - Cross-platform desktop framework
- **Webpack 5** - Module bundler with hot reload
- **Node.js** - Runtime environment
- **Sass** - CSS preprocessor
- **Jest** - Testing framework

### Development Tools
- **ESLint** - Code linting and formatting
- **Prettier** - Code formatting
- **TypeScript** - Static type checking
- **Hot Reload** - Instant development feedback

## 📋 Prerequisites

- **Node.js** >= 14.x
- **npm** >= 7.x
- **Git** for version control

## 🚀 Installation

### 1. Clone the Repository
```bash
git clone https://github.com/elite35804/fetch.git
cd fetch
```

### 2. Install Dependencies
```bash
npm install
```

### 3. Start Development Server
```bash
npm start
```

The application will open in development mode with hot reload enabled.

## 🏗️ Build & Package

### Development Build
```bash
npm run build
```

### Production Package
```bash
# Package for all platforms
npm run package

# Platform-specific packages
npm run package:mac      # macOS
npm run package:windows  # Windows
npm run package:linux    # Linux
```

### Build Output
Packaged applications are available in the `release/build/` directory.

## 🎯 Usage

### 1. Authentication
- Launch the application
- Click "Login with Discord" to authenticate
- Grant necessary permissions

### 2. Configuration
Navigate to **Settings** to configure:
- **Proxies**: Add and manage proxy lists
- **Groups**: Create account groups by platform type
- **General Settings**: Application preferences

### 3. Task Management
- **Create Tasks**: Set up automated ticket purchasing tasks
- **Configure Groups**: Assign accounts and proxies to tasks
- **Monitor Progress**: Track task execution in real-time
- **View Results**: Access detailed task outcomes

### 4. Ticket Operations
- **Browse Available Tickets**: View available events and tickets
- **Execute Purchases**: Automated ticket buying with configured parameters
- **Track Orders**: Monitor order status and history

## 📁 Project Structure

```
src/
├── main/                 # Electron main process
│   ├── main.ts          # Application entry point
│   ├── ipc.ts           # Inter-process communication
│   └── store.ts         # Data persistence
├── renderer/            # React application
│   ├── components/      # UI components
│   │   ├── views/       # Page components
│   │   ├── ui/          # Reusable UI elements
│   │   └── custom/      # Custom modals and dialogs
│   ├── config/          # Configuration files
│   └── styles/          # Global styles and themes
├── config/              # Shared configuration
└── types/               # TypeScript type definitions
```

## 🔧 Configuration

### Environment Variables
```typescript
// src/renderer/config.ts
export const API_URL = 'http://your-api-endpoint:8080';
export const CLIENT_ID = 'your-discord-client-id';
export const CLIENT_SECRET = 'your-discord-client-secret';
export const REDIRECT_URI = 'http://localhost:3000/auth';
```

### Proxy Format
Proxies should follow this format:
```
hostname:port:username:password
```

Example:
```
proxy1.example.com:8080:user1:pass1
proxy2.example.com:8080:user2:pass2
```

## 🧪 Testing

Run the test suite:
```bash
npm test
```

Run tests with coverage:
```bash
npm run test:coverage
```

## 📦 Scripts

| Script | Description |
|--------|-------------|
| `npm start` | Start development server |
| `npm run build` | Build for production |
| `npm run package` | Package for distribution |
| `npm run lint` | Run ESLint |
| `npm run lint:fix` | Fix ESLint issues |
| `npm test` | Run test suite |
| `npm run analyze` | Analyze bundle size |

## 🚀 Deployment

### macOS
- Requires code signing for distribution
- Supports ARM64, x64, and universal builds
- Includes DMG installer

### Windows
- NSIS installer and portable versions
- Supports Windows 10/11

### Linux
- Multiple package formats (AppImage, DEB, RPM)
- Snap package support

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

### Development Guidelines
- Follow TypeScript best practices
- Use ESLint and Prettier for code formatting
- Write tests for new features
- Update documentation as needed

## 📄 License

This project is licensed under the Creative Commons Attribution-NonCommercial-ShareAlike 4.0 International License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- Built on [electron-bones](https://github.com/shipkit-io/electron-bones) boilerplate
- UI components from [Radix UI](https://www.radix-ui.com/)
- Styling with [Tailwind CSS](https://tailwindcss.com/)

## 📞 Support

- **Issues**: [GitHub Issues](https://github.com/shipkit-io/electron-bones/issues)
- **Email**: me@lacymorrow.com
- **Documentation**: [Project Wiki](https://github.com/shipkit-io/electron-bones/wiki)

## 🔄 Changelog

### Version 0.0.1
- Initial release
- Core ticket management functionality
- Multi-platform support
- Discord authentication
- Proxy and group management
- Task automation system

---

**Note**: This application is designed for professional use and includes advanced features for ticket management automation. Please ensure compliance with all applicable terms of service and local regulations.
