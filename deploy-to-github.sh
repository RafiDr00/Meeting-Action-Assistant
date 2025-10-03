#!/bin/bash

# Meeting Action Assistant Corporate - GitHub Deployment Script
# This script helps you create a GitHub repository and push your corporate project

echo "🏢 Meeting Action Assistant Corporate - GitHub Setup"
echo "=================================================="

# Colors for output
GREEN='\033[0;32m'
BLUE='\033[0;34m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

echo -e "${BLUE}📋 Pre-deployment checklist:${NC}"
echo "✅ Project copied to Portfolio folder"
echo "✅ Git repository initialized"
echo "✅ Initial commit created with corporate styling"
echo "✅ Corporate glassmorphism design implemented"
echo ""

echo -e "${YELLOW}🔧 Next Steps - Manual GitHub Setup:${NC}"
echo ""
echo "1. 🌐 Go to GitHub.com and create a new repository:"
echo "   - Repository name: meeting-action-assistant-corporate"
echo "   - Description: Professional SaaS Dashboard with Corporate Glassmorphism Design"
echo "   - Make it Public (for portfolio visibility)"
echo "   - Don't initialize with README (we already have one)"
echo ""

echo "2. 📤 Push your code to GitHub:"
echo "   Run these commands in your terminal:"
echo ""
echo -e "${GREEN}   git remote add origin https://github.com/YOUR-USERNAME/meeting-action-assistant-corporate.git${NC}"
echo -e "${GREEN}   git branch -M main${NC}"
echo -e "${GREEN}   git push -u origin main${NC}"
echo ""

echo "3. 🎨 Repository Features to Enable:"
echo "   - Enable GitHub Pages (Settings → Pages → Deploy from branch: main)"
echo "   - Add topics: react, typescript, ai, openai, corporate-design, glassmorphism"
echo "   - Set repository image (use a screenshot of your corporate dashboard)"
echo ""

echo "4. 📄 Update Repository Description:"
echo '   "Professional meeting analysis tool with corporate glassmorphism design, AI-powered transcription, and enterprise-ready dashboard. Built with React, TypeScript, FastAPI, and OpenAI."'
echo ""

echo "5. 🏷️ Suggested Repository Topics:"
echo "   meeting-analysis, ai-powered, corporate-design, glassmorphism, react-typescript"
echo "   openai-integration, professional-dashboard, enterprise-ui, saas-design"
echo ""

echo -e "${BLUE}🎯 Corporate Project Highlights:${NC}"
echo "• Deep Navy (#1E293B) and Cool Gray (#64748B) color scheme"
echo "• Teal accent (#14B8A6) for professional highlights"
echo "• Modern glassmorphism effects throughout the UI"
echo "• Enterprise-ready dashboard with analytics"
echo "• AI-powered meeting transcription and action item extraction"
echo "• Professional styling perfect for client presentations"
echo ""

echo -e "${GREEN}✨ Your corporate Meeting Action Assistant is ready for GitHub!${NC}"
echo ""
echo "🔗 After pushing to GitHub, your repository will be available at:"
echo "   https://github.com/YOUR-USERNAME/meeting-action-assistant-corporate"
echo ""

# Wait for user input
read -p "Press Enter when you've created the GitHub repository and are ready to push..."

echo ""
echo -e "${YELLOW}🚀 Ready to push? Run these commands:${NC}"
echo ""
echo "git remote add origin https://github.com/YOUR-USERNAME/meeting-action-assistant-corporate.git"
echo "git branch -M main"  
echo "git push -u origin main"
echo ""
echo -e "${GREEN}🎉 Happy coding!${NC}"