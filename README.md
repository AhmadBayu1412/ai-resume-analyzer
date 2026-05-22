# CVPilot 🚀

### AI-Powered Resume Analyzer & ATS Optimization Platform

CVPilot is a modern AI-powered resume analyzer platform designed to help job seekers improve their resumes, optimize ATS compatibility, and receive intelligent feedback for better hiring opportunities.
The platform combines elegant UI design with AI-driven resume analysis to create a fast, interactive, and beginner-friendly career optimization experience.

## ⏮️ Preview CVPilot
<img width="1839" height="928" alt="cv-pilot" src="https://github.com/user-attachments/assets/6be1525c-4a94-4cf9-9f54-7a97afb7d61b" />
CVPilot is a modern AI-powered resume analyzer platform built to help users optimize their resumes for ATS (Applicant Tracking Systems), improve resume quality, and receive intelligent AI-generated feedback.

This project was originally inspired by a tutorial project and later heavily modified with:
* redesigned modern UI/UX
* improved responsive layout
* enhanced ATS visualization
* custom AI provider architecture
* Puter AI integration
* future-ready OpenRouter fallback system

The current version uses Puter AI as the main provider, while the architecture is prepared for future OpenRouter multi-model support.

Live Demo:
[CVPilot Live Demo
](https://cv-ai-resume-analyzer.netlify.app/)

Tutorial inspiration:
[Original Tutorial Reference
](https://www.youtube.com/watch?v=iYOz165wGkQ&list=PL6QREj8te1P6wX9m5KnicnDVEucbOPsqR&utm_source=chatgpt.com)---

# ✨ Features

## 📄 Resume Upload & Analysis

* Upload resumes instantly
* AI-powered resume parsing
* Smart resume evaluation
* ATS compatibility checking

## 🎯 ATS Optimization

* Detect missing keywords
* Improve ATS readability
* Analyze formatting quality
* Generate optimization suggestions

## 🤖 AI Feedback System

* AI-generated career recommendations
* Resume enhancement insights
* Job description matching
* Professional feedback experience

## 🎨 Modern UI/UX

* Elegant responsive interface
* Animated landing page
* Interactive components
* Professional dark-themed design

## ☁️ Cloud Deployment

* Hosted on Netlify
* Fast frontend delivery
* Responsive across devices

---

# 🧠 AI System Architecture

Currently, the displayed application uses **Puter AI integration** as the main AI provider.

However, the project architecture was intentionally designed so it can later be upgraded with:

* OpenRouter integration
* Multi-model AI selection
* AI provider fallback system
* Advanced quota management

This means:

```text id="fswvk3"
Puter Quota Active
        ↓
Use Puter AI
        ↓
Quota Exhausted
        ↓
Fallback to OpenRouter (Future Upgrade)
```

With OpenRouter integration, users would be able to:

* choose different AI models
* switch between providers
* use higher-capability models
* avoid downtime when Puter quota is exhausted

For now:

* the public/demo application only uses Puter AI
* users may need Puter Premium for larger quotas
* free quota usage is still limited

---

# ⚠️ Current Limitations

Some features are still manually implemented during the current development phase:

## Manual UI Data

The following sections are currently static/manual:

* profile progress bar
* trusted by companies section
* testimonials/reviews section

Examples:

* Trusted by Shopee
* Trusted by Tokopedia
* User review cards

These are placeholder/demo elements for future backend integration.

---

# 🛠️ Tech Stack

## Frontend

* React
* TypeScript
* Vite
* Tailwind CSS

## AI Integration

* Puter.js
* Planned OpenRouter Integration
* Gemma AI Model Support (Architecture Ready)

## Deployment

* Netlify

---

# 📸 Main Features Preview

## Homepage

Modern ATS-focused landing page with elegant UI and animated components.

## Resume Analyzer

Upload resumes and receive instant AI-powered feedback.

## AI Feedback Dashboard

Detailed ATS optimization suggestions including:

* ATS score
* Resume improvements
* Keyword optimization
* Formatting analysis

---

# ⚙️ Installation

Clone repository:

```bash id="4k5zfi"
git clone https://github.com/yourusername/cvpilot.git
```

Go to project folder:

```bash id="sw3r0t"
cd cvpilot
```

Install dependencies:

```bash id="n2e6do"
npm install
```

Run development server:

```bash id="slsic8"
npm run dev
```

---

# 🚀 Deployment

Live Demo:

[CVPilot Live Demo](https://cv-ai-resume-analyzer.netlify.app/)

Build production:

```bash id="tdzv4o"
npm run build
```

---

# 📂 Project Structure

```bash id="7rrv07"
AI-RESUME-ANALYZER/
│
├── app/
│   ├── components/        # Reusable UI components
│   ├── lib/               # AI providers & utilities
│   ├── routes/            # Application routing
│   ├── app.css            # Global styles
│   ├── root.tsx           # Root application entry
│   └── routes.ts          # Route configuration
│
├── build/                 # Production build output
│
├── constants/             # Static constants & config
│
├── public/
│   ├── icons/
│   ├── images/
│   ├── favicon.ico
│   └── pdf.worker.min.mjs
│
├── types/                 # TypeScript type definitions
│
├── .env.local             # Local environment config
├── .gitignore
├── Dockerfile
├── package.json
├── react-router.config.ts
├── README.md
├── tsconfig.json
└── vite.config.ts
```

---

# 🔥 Project Highlights

* AI-powered ATS optimization
* Modern responsive interface
* Scalable AI architecture
* Future-ready multi-model support
* Elegant portfolio-grade UI
* Beginner-friendly experience
* Real-world deployment ready

---

# 📌 Future Improvements

Planned upgrades:

* OpenRouter fallback integration
* AI model selector
* Resume history management
* Cover letter generator
* LinkedIn analyzer
* Dynamic dashboard statistics
* Real backend testimonial system
* Advanced authen 

tication system
* Multi-provider AI routing

---

# 👨‍💻 Developer

Built by **Ahmad Bayu Samudera**

Focused on:

* AI Applications
* Modern Web Development
* Automation
* ATS Optimization Tools

---

# 📄 License

This project is licensed under the MIT License.

---

# ⭐ Support

If you like this project, consider giving it a ⭐ on GitHub!
