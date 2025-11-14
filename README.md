# Morocco Travel Assistant 

## 🎓 Academic Project Overview
This is an NLP (Natural Language Processing) project developed as part of a Master's degree program, focusing on intelligent travel recommendations for Morocco.

### Current Implementation
The chatbot currently uses **Google's Gemini API** to generate conversational responses and travel recommendations for Moroccan cities including:
- 🍽️ Restaurants (Moroccan, Italian, French, Indian, Seafood, etc.)
- 🏨 Hotels & Riads
- ☕ Cafés
- 🎭 Tourist Attractions

**Note**: The system occasionally generates fictional recommendations when specific data is not available in the database. This is intentional behavior to maintain conversation flow and provide helpful suggestions.

### 🎯 Future Goal
The ultimate objective is to deploy a **custom prompt-engineered Mistral model** that has been specifically trained for Morocco travel recommendations. This migration is pending the availability of a **free cloud GPU with at least 16GB of memory**.

**Why Mistral?**
- Better control over responses
- Reduced hallucination with proper prompt engineering
- Cost-effective for production deployment
- Fine-tuned specifically for Morocco tourism domain

---

## TEST IT : 
**URL**: https://marrakech-muse-interface-4rtm1509y-emadilsalma-6846s-projects.vercel.app/

## 🚀 Technologies Used
This project is built with:
- **Frontend**: React + TypeScript + Vite
- **Styling**: Tailwind CSS + shadcn-ui
- **AI/NLP**: Google Gemini API (temporary) → Mistral Model (planned)
- **Deployment**: Vercel (API) + Lovable (Frontend)

---

## 🔧 How can I edit this code?

### Use Lovable
Simply visit the [Lovable Project](https://lovable.dev/projects/8bb6b8a4-592e-4f07-84c7-afe89858d5f8) and start prompting.
Changes made via Lovable will be committed automatically to this repo.

+
The only requirement is having Node.js & npm installed - [install with nvm](https://github.com/nvm-sh/nvm#installing-and-updating)


## ⚙️ Environment Variables

To run this project, you need to set up the following environment variable in Vercel:

```
GEMINI_API_KEY=your_gemini_api_key_here
```

Get your free Gemini API key from [Google AI Studio](https://aistudio.google.com/app/apikey).

---

## 📦 Project Structure

```
├── api/
│   └── chat.ts          # Gemini API integration (will be replaced with Mistral)
├── src/
│   ├── components/      # React components
│   ├── pages/          # Application pages
│   └── ...
└── README.md
```


## 📝 Academic Notes

**Current Status**: ✅ Functional with Gemini API  
**Target Status**: 🎯 Mistral model deployment pending GPU availability  
**Accuracy**: The system works well for recommendations but may generate plausible fictional data when specific information is unavailable  
**Purpose**: Demonstrating NLP capabilities for conversational AI in the tourism domain

---

## 🤝 Contributing

This is an academic project. Suggestions and improvements are welcome!

---

## 📄 License

This project is part of a Master's degree program in NLP.

## Made with LOVE by : SALMA LIDAME
