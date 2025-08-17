# 🚀 MasteryFlow - Multi-Tenant Whop-Integrated Adaptive Learning Platform

> **"Duolingo for Business"** - Convert static courses into interactive lessons with AI-powered quizzes, branching paths, and gamified engagement.

## 🎯 **Vision & Mission**

MasteryFlow transforms how businesses deliver training and education. Instead of static videos, PDFs, and documents, creators can build engaging, interactive learning experiences that adapt to each learner's needs.

### **Key Features**
- **🎬 Content Player**: Video/PDF/TEXT content on top, interactive elements below
- **🧠 AI-Powered Quiz Generation**: Automatically create assessments from uploaded content
- **🔄 Adaptive Learning Paths**: Branch learners based on performance
- **🏆 Gamification**: Streaks, achievements, leaderboards, and certificates
- **👥 Multi-Tenant**: Strict isolation between different Whop communities
- **📊 Analytics**: Comprehensive insights for creators and learners

## 🏗️ **Architecture Overview**

### **Tech Stack**
- **Frontend**: Next.js 15 (App Router), TypeScript, TailwindCSS, FrostedUI
- **Backend**: Next.js Route Handlers + Prisma ORM + PostgreSQL
- **AI**: OpenAI API (GPT-4) for quiz generation and feedback
- **Auth**: Whop SSO with role-based access control
- **Storage**: S3-compatible storage for file uploads
- **Testing**: Jest (unit) + Playwright (e2e)

### **Multi-Tenant Design**
```
Tenant (Whop Company) → Users (Creators + Learners) → Courses → Modules → Quizzes
     ↓
Strict data isolation, custom branding, independent analytics
```

## 🚀 **Quick Start**

### **Prerequisites**
- Node.js 18+ 
- PostgreSQL database
- Whop developer account
- OpenAI API key

### **1. Clone & Install**
```bash
git clone <your-repo>
cd MasteryFlow-App
npm install --legacy-peer-deps
```

### **2. Environment Setup**
Create `.env.local`:
```env
# Whop Configuration
WHOP_API_KEY=your_whop_api_key
NEXT_PUBLIC_WHOP_APP_ID=your_whop_app_id
NEXT_PUBLIC_WHOP_AGENT_USER_ID=your_agent_user_id
NEXT_PUBLIC_WHOP_COMPANY_ID=your_company_id

# Database
DATABASE_URL="postgresql://user:password@localhost:5432/masteryflow"

# OpenAI
OPENAI_API_KEY=your_openai_api_key
```

### **3. Database Setup**
```bash
# Generate Prisma client
npx prisma generate

# Push schema to database
npx prisma db push

# Seed with demo data
npm run seed
```

### **4. Start Development**
```bash
npm run dev
```

Visit `http://localhost:3000` to see your app!

## 📁 **Project Structure**

```
/app
  /(public)          # Marketing pages
  /auth              # Authentication
  /creator           # Creator dashboard & tools
  /learner           # Learner experience
  /api               # API routes
/components          # Reusable UI components
  /LessonPlayer.tsx  # Core lesson player
  /CreatorDashboard.tsx # Creator management
/lib                 # Utilities & services
  /auth.ts          # Authentication logic
  /ai.ts            # OpenAI integration
  /validation.ts    # Zod schemas
/prisma             # Database schema & migrations
/scripts            # Development tools
  /seed.ts          # Database seeding
```

## 🎨 **Core Components**

### **Lesson Player**
The heart of MasteryFlow - displays content on top with interactive elements below:

```tsx
<LessonPlayer
  module={module}
  onComplete={handleComplete}
  onNext={handleNext}
  onPrevious={handlePrevious}
  hasNext={hasNext}
  hasPrevious={hasPrevious}
/>
```

**Features:**
- **Content Display**: Video, PDF, or text content
- **Interactive Elements**: Quizzes, funnels, CTAs
- **Progress Tracking**: Time spent, completion status
- **Navigation**: Previous/next module support

### **Creator Dashboard**
Comprehensive management interface for course creators:

- **📊 Overview**: Key metrics and quick actions
- **📚 Courses**: CRUD operations for courses and modules
- **👥 Learners**: Progress tracking and analytics
- **📈 Analytics**: Performance insights and trends
- **📤 Uploads**: Content upload with AI quiz generation

### **AI Integration**
Automated quiz generation from uploaded content:

```typescript
// Generate quiz from text
const quiz = await generateQuizQuestions(text, {
  uploadId: 'upload_123',
  targetCount: 10,
  difficulty: 'MEDIUM',
  questionTypes: ['MCQ', 'TF', 'SHORT']
})
```

## 🗄️ **Database Schema**

### **Core Models**
- **Tenant**: Whop company isolation
- **User**: Creators and learners with roles
- **Course**: Learning paths with modules
- **Module**: Individual lessons with content
- **Quiz**: Assessments with questions
- **Progress**: Learner advancement tracking

### **Advanced Features**
- **PathNode**: Adaptive learning branching
- **Funnel**: Conversion optimization
- **Achievement**: Gamification system
- **Streak**: Daily engagement tracking
- **Leaderboard**: Competitive elements

## 🔐 **Authentication & Security**

### **Whop Integration**
- SSO authentication via Whop tokens
- Role-based access control (CREATOR/LEARNER)
- Company-based tenant isolation
- Secure API endpoints with validation

### **Security Features**
- Input validation with Zod schemas
- SQL injection prevention via Prisma
- Rate limiting on AI endpoints
- Audit logging for compliance

## 🧪 **Testing Strategy**

### **Unit Tests**
```bash
npm run test
```
- Authentication logic
- AI service functions
- Validation schemas
- Utility functions

### **E2E Tests**
```bash
npm run test:e2e
```
- Complete user flows
- Creator workflows
- Learner experiences
- API endpoint testing

## 🚀 **Deployment**

### **Production Checklist**
- [ ] Environment variables configured
- [ ] Database migrations applied
- [ ] AI rate limits configured
- [ ] File storage configured
- [ ] Monitoring and logging setup
- [ ] SSL certificates configured

### **Whop App Store**
- [ ] App metadata configured
- [ ] Screenshots and descriptions
- [ ] Pricing tiers defined
- [ ] Terms of service
- [ ] Privacy policy

## 📈 **Performance & Scaling**

### **Optimizations**
- React Query for server state management
- Incremental static regeneration
- Lazy loading of components
- Optimized database queries
- CDN for static assets

### **Monitoring**
- Performance metrics tracking
- Error boundary implementation
- User analytics integration
- Database query optimization

## 🔮 **Future Roadmap**

### **Phase 2: Advanced AI**
- **Smart Remediation**: AI-powered learning path suggestions
- **Content Generation**: Automated lesson creation
- **Personalization**: Adaptive difficulty adjustment

### **Phase 3: Enterprise Features**
- **SSO Integration**: SAML, OAuth support
- **Advanced Analytics**: Cohort analysis, predictive insights
- **White-labeling**: Custom branding and domains

### **Phase 4: Mobile & Offline**
- **Mobile App**: React Native implementation
- **Offline Support**: Progressive web app features
- **Push Notifications**: Engagement optimization

## 🤝 **Contributing**

### **Development Workflow**
1. Fork the repository
2. Create feature branch
3. Implement changes with tests
4. Submit pull request
5. Code review and merge

### **Code Standards**
- TypeScript strict mode
- ESLint + Prettier configuration
- Conventional commit messages
- Comprehensive test coverage

## 📚 **API Documentation**

### **Core Endpoints**
- `POST /api/courses` - Create course
- `POST /api/modules` - Create module
- `POST /api/ai/generate-quiz` - AI quiz generation
- `POST /api/quizzes/submit` - Submit quiz answers
- `GET /api/analytics/creator` - Creator analytics

### **Authentication Headers**
```http
Authorization: Bearer <whop_token>
X-Tenant-ID: <tenant_id>
```

## 🆘 **Support & Troubleshooting**

### **Common Issues**
- **Database Connection**: Check DATABASE_URL format
- **Whop Integration**: Verify API keys and app configuration
- **AI Generation**: Ensure OpenAI API key is valid
- **Build Errors**: Clear node_modules and reinstall

### **Getting Help**
- Check the [Issues](https://github.com/your-repo/issues) page
- Review [Whop Documentation](https://whop.com/docs)
- Join our [Discord Community](https://discord.gg/masteryflow)

## 📄 **License**

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 **Acknowledgments**

- **Whop Team** for the amazing platform
- **OpenAI** for AI capabilities
- **FrostedUI** for beautiful components
- **Next.js Team** for the excellent framework

---

**Built with ❤️ for the Whop community**

*Transform your static content into engaging learning experiences with MasteryFlow.*
