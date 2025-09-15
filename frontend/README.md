
# OJO Frontend

A neural biography mapping system built with React and Vite.

## 🚀 Features

- **AI-Powered Biography Generation**: Instantly creates comprehensive profiles
- **Interactive Timeline**: Visual life events with categorization
- **Real-time Search**: Semantic search across biographical data
- **Responsive Design**: Works on all devices
- **Cyberpunk UI**: Futuristic interface design

## 🛠️ Tech Stack

- **Frontend**: React 18 + TypeScript
- **Build Tool**: Vite
- **Styling**: Tailwind CSS + Radix UI
- **Icons**: Lucide React
- **Deployment**: Netlify

## 🚀 Quick Start

### Prerequisites
- Node.js 18+
- npm or yarn

### Installation
```bash
# Clone the repository
git clone https://github.com/yourusername/ojo-frontend.git
cd ojo-frontend

# Install dependencies
npm install

# Start development server
npm run dev
```

### Build for Production
```bash
npm run build
```

## 🔗 API Integration

This frontend connects to the TIDB backend API:
- **Development**: `http://localhost:3000/api`
- **Production**: `https://tidb-backend.onrender.com/api`

## 🌐 Environment Variables

Create a `.env` file:
```bash
VITE_API_BASE_URL=https://tidb-backend.onrender.com/api
```

## 📦 Deployment

### Netlify (Recommended)
1. Connect this repository to Netlify
2. Set build command: `npm run build`
3. Set publish directory: `build`
4. Add environment variable: `VITE_API_BASE_URL`

## 🤝 Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License.
  