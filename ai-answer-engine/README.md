# AI Answer Engine (Portfolio Project)

An advanced, AI-powered research assistant and chat application inspired by Perplexity.ai. This project demonstrates modern full-stack development capabilities using Next.js, LangChain, and various LLM providers (Groq, Gemini, Ollama).

## 🚀 Features

- **Multi-Model Support**: Switch seamlessly between Llama 3 (via Groq), Gemini 1.5 Pro/Flash, and local models via Ollama.
- **Real-Time Web Research**: The AI searches the web, analyzes multiple sources, and provides cited answers.
- **Deep Research Mode**: A specialized mode for exhaustive, academic-quality research.
- **File Analysis**: Upload and chat with PDF and text documents.
- **Image Generation**: Generate images directly within the chat interface.
- **Modern UI/UX**: Built with Tailwind CSS, Framer Motion, and Shadcn UI for a responsive and polished experience.
- **Voice Input**: Integrated voice-to-text functionality.

## 🛠️ Tech Stack

- **Frontend**: Next.js 14 (App Router), TypeScript, Tailwind CSS, Framer Motion
- **AI Framework**: LangChain.js
- **Backend**: Node.js, Express
- **Database**: MongoDB (Chat History), Pinecone (Vector Search)
- **LLM Providers**: Groq (Llama 3, Gemma), Google Generative AI (Gemini), Ollama (Local)
- **Tools**: Serper (Search), PDF Parse, Cheerio (Scraping)

## 📦 Getting Started

### Prerequisites

- Node.js 18+
- MongoDB instance (Local or Atlas)
- API Keys for:
  - Groq (`GROQ_API_KEY`)
  - Google Gemini (`GOOGLE_API_KEY`)
  - Serper.dev (`SERPER_API_KEY`)
  - OpenAI (Optional, for embeddings if not using Ollama)

### Installation

1.  **Clone the repository**:
    ```bash
    git clone https://github.com/yourusername/ai-answer-engine.git
    cd ai-answer-engine
    ```

2.  **Install dependencies**:
    ```bash
    # Install server dependencies
    cd server
    npm install

    # Install client dependencies
    cd ..
    npm install
    ```

3.  **Environment Setup**:
    - Create `.env` in `server/` and populate it with your API keys.
    - Create `.env.local` in the root for Next.js configuration if needed.

4.  **Run the Application**:
    ```bash
    # Start Backend (from server/ directory)
    npm run dev

    # Start Frontend (from root directory)
    npm run dev
    ```

5.  **Access the App**:
    Open [http://localhost:3000](http://localhost:3000) in your browser.

## 📸 Screenshots

*(Add screenshots of your application here)*

## 🤝 Contributing

This is a portfolio project, but contributions and suggestions are welcome!

## 📄 License

MIT License
