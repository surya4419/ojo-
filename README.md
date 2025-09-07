# 🎯 Ojo - Wikipedia for Everyone's Journey

> **Ojo** *(Spanish for "eye")* - See beyond who someone is today, discover how they got there.

## 🚀 The Problem We're Solving

**Wikipedia is great, but...**
- **Limited Scope**: Only covers the globally famous
- **Static Snapshots**: Shows who someone *is*, not *how they became* that person
- **Missing Journeys**: No insight into the exact steps, education, jobs, and turning points

**Ojo changes this.**

## ✨ What is Ojo?

Ojo is **Wikipedia for everyone** - from Sundar Pichai to your local entrepreneur. We don't just tell you *who* someone is, we show you *their complete journey* - mapped out in a beautiful, structured timeline.

**Search any name** (including your own) and discover:
- 📚 Educational background and key certifications
- 💼 Career progression with exact roles and companies
- 🏗️ Projects and achievements over time
- 🎯 Critical turning points and decisions
- 🔗 Social profiles and contributions across platforms

## 🌟 Key Features

### 🔍 Multi-Source Intelligence
- **Google Search Results** - Web presence and news mentions
- **LinkedIn Integration** - Professional journey and career progression
- **GitHub Analysis** - Open source contributions and technical growth
- **Cross-Platform Synthesis** - Unified timeline from scattered data

### 📊 Interactive Timeline Visualization
- **Chronological Journey** - See the exact path someone took
- **Milestone Markers** - Key achievements and turning points
- **Rich Media Support** - Images, links, and detailed descriptions
- **Responsive Design** - Works perfectly on all devices

### 🎯 Universal Accessibility
- **For Anyone** - From global celebrities to local heroes
- **Self-Discovery** - Search your own name to see your journey
- **Inspiration Engine** - Learn from others' paths and strategies

## 🛠️ Tech Stack

### Frontend (React + Vite)
- **React 19** with TypeScript
- **Vite** for lightning-fast development
- **Tailwind CSS** for beautiful, responsive design
- **Modern UI Components** with shadcn/ui
- **Deployed on Netlify** with CI/CD pipeline

### Backend (Next.js)
- **Next.js 15** with App Router
- **TiDB Cloud** for scalable database storage
- **Gemini AI** for intelligent data processing
- **Multi-source API Integration** (Google, LinkedIn, GitHub)
- **Deployed on Render** with auto-scaling

## 🚀 Quick Start

### Prerequisites
- Node.js 18+ and npm
- TiDB Cloud account (for database)
- Gemini API key (for AI processing)

### 1. Clone the Repository
```bash
git clone [your-repo-url]
cd ojo
```

### 2. Backend Setup (Next.js)
```bash
cd backend
npm install --legacy-peer-deps

# Copy environment template
cp .env.example .env

# Edit .env with your keys:
# TIDB_HOST=your-tidb-host
# TIDB_USERNAME=your-username
# TIDB_PASSWORD=your-password
# TIDB_DATABASE=your-database
# GEMINI_API_KEY=your-gemini-key

npm run dev
```

### 3. Frontend Setup (React + Vite)
```bash
cd frontend
npm install

# Copy environment template
cp .env.example .env

# Edit .env:
# VITE_API_BASE_URL=http://localhost:3000/api

npm run dev
```

### 4. Environment Variables

#### Backend (.env)
```bash
# Database Configuration
TIDB_HOST=your-tidb-host.gcp.tidbcloud.com
TIDB_PORT=4000
TIDB_USERNAME=your-username
TIDB_PASSWORD=your-password
TIDB_DATABASE=ojo_prod

# AI Services
GEMINI_API_KEY=your-gemini-api-key

# Optional: External APIs
LINKEDIN_API_KEY=your-linkedin-key
GITHUB_TOKEN=your-github-token
```

#### Frontend (.env)
```bash
# API Configuration
VITE_API_BASE_URL=http://localhost:3000/api

# Development
VITE_DEV_MODE=true
```

## 📁 Project Structure

```
ojo/
├── backend/                 # Next.js API server
│   ├── app/api/            # API routes
│   ├── lib/               # Database & AI integrations
│   ├── components/        # Backend UI components
│   └── render.yaml        # Render deployment config
├── frontend/              # React Vite application
│   ├── src/
│   │   ├── components/    # React components
│   │   ├── utils/         # Helper functions
│   │   └── styles/        # CSS & styling
│   ├── netlify.toml       # Netlify deployment config
│   └── Dockerfile         # Container deployment
└── README.md             # This file
```

## 🌐 Deployment

### Frontend (Netlify)
- **Build Command**: `npm run build`
- **Publish Directory**: `dist`
- **Environment**: Auto-deploy from `main` branch

### Backend (Render)
- **Build Command**: `npm run build`
- **Start Command**: `npm start`
- **Environment**: Node.js 18+ with TiDB connection

## 🔍 Usage Examples

### Search for Anyone
```
Search: "Elon Musk"
Result: Complete timeline from Pretoria → UPenn → Zip2 → PayPal → Tesla → SpaceX

Search: "Local Tech Entrepreneur"
Result: University → First startup → Failed attempt → Successful exit → Current venture

Search: "Your Own Name"
Result: Discover your own digital footprint and journey
```

### What You'll Discover
- **Educational Timeline**: Degrees, certifications, key courses
- **Career Progression**: Job changes, promotions, company switches
- **Project Evolution**: Side projects scaling to major ventures
- **Skill Development**: Technical growth and expertise building
- **Network Growth**: Connections and influence expansion

## 🤝 Contributing

We welcome contributions! Here's how you can help:

1. **Data Sources**: Add new integration APIs
2. **Timeline Visualization**: Improve the journey display
3. **Search Accuracy**: Enhance profile matching algorithms
4. **UI/UX**: Make the experience even better

### Development Workflow
```bash
# Fork the repository
git checkout -b feature/your-feature
npm run dev  # Start both frontend and backend
# Make your changes
git commit -m "Add: your feature"
git push origin feature/your-feature
# Create a pull request
```

## 🛡️ Privacy & Ethics

- **Consent-Based**: Only aggregates publicly available information
- **No Personal Data Storage**: Respects privacy boundaries
- **Transparent Sources**: Shows where each piece of information comes from
- **User Control**: Easy removal requests for personal profiles

## 📈 Roadmap

### Phase 1: Core Features ✅
- [x] Multi-source data aggregation
- [x] Interactive timeline visualization
- [x] Basic search functionality
- [x] Responsive design

### Phase 2: Enhanced Intelligence
- [ ] AI-powered journey analysis
- [ ] Pattern recognition across careers
- [ ] Success factor identification
- [ ] Career path recommendations

### Phase 3: Community Features
- [ ] User-contributed corrections
- [ ] Journey sharing and inspiration
- [ ] Mentorship matching
- [ ] Career planning tools

## 🆘 Support

- **Issues**: [GitHub Issues](https://github.com/your-repo/issues)
- **Discussions**: [GitHub Discussions](https://github.com/your-repo/discussions)
- **Documentation**: [Wiki](https://github.com/your-repo/wiki)

## 📄 License

MIT License - see [LICENSE](LICENSE) file for details.

---

## 🌟 The Vision

**Ojo isn't just a tool** - it's a movement to democratize the understanding of human potential. By making every journey visible and learnable, we inspire the next generation of innovators, leaders, and changemakers.

Because **knowing where someone is today is useful**, but **knowing how they reached there is inspiring**.

---

*Built with ❤️ for everyone who's ever wondered "How did they get there?"*\nnote
