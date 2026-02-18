# AI Chat App

This is an AI-powered chat application featuring an answer engine capable of searching the web and providing cited responses.

## Features

- **AI Answer Engine**: Uses LangChain and Ollama (Llama 3.2) to process queries.
- **Web Search**: Integrates with search tools (Tavily, Serper) to fetch real-time information.
- **Citation**: Provides answers with inline citations and source links.
- **Vector Search**: Supports RAG (Retrieval-Augmented Generation) using Pinecone.
- **Follow-up Questions**: Automatically generates relevant follow-up questions.

## Project Structure

- `ai-answer-engine/`: The main application folder.
  - `server/`: Backend Express server.
  - `src/`: Frontend Next.js application.

## Getting Started

1.  **Clone the repository**:
    ```bash
    git clone https://github.com/Soruj24/ai-chat-app.git
    cd ai-chat-app
    ```

2.  **Install Dependencies**:
    Navigate to the project directory and install dependencies.
    ```bash
    cd ai-answer-engine
    npm install
    ```

3.  **Environment Setup**:
    Create a `.env` file in `ai-answer-engine/server` based on your configuration requirements (API keys for search tools, database URIs, etc.).

4.  **Run the Application**:
    Start the backend and frontend servers.

## License

[MIT](LICENSE)
