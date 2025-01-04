const OpenAI = require("openai");
const { ChatOpenAI } = require("@langchain/openai");
const { DirectoryLoader } = require("langchain/document_loaders/fs/directory");
const { PDFLoader } = require("@langchain/community/document_loaders/fs/pdf");
const { OpenAIEmbeddings } = require("@langchain/openai");
const { MemoryVectorStore } = require("langchain/vectorstores/memory");
const { RunnableSequence } = require("@langchain/core/runnables");
const { StringOutputParser } = require("@langchain/core/output_parsers");
const {
  ChatPromptTemplate,
  MessagesPlaceholder,
} = require("@langchain/core/prompts");
const { AIMessage, HumanMessage } = require("@langchain/core/messages");

class ChatService {
  constructor() {
    this.openai = new OpenAI({
      apiKey: process.env.OPENAI_API_KEY || "-",
    });
    this.vectorStore = null;
    this.retrievalChain = null;
    this.initializeVectorStore();
  }

  async initializeVectorStore() {
    try {
      const loader = new DirectoryLoader("data/", {
        ".pdf": (filePath) => new PDFLoader(filePath),
      });

      const documents = await loader.load();
      const embeddings = new OpenAIEmbeddings();
      this.vectorStore = await MemoryVectorStore.fromDocuments(
        documents,
        embeddings
      );

      const model = new ChatOpenAI({
        apiKey: process.env.OPENAI_API_KEY,
        modelName: "gpt-3.5-turbo",
        streaming: true,
      });

      const retriever = this.vectorStore.asRetriever({
        searchParams: { k: 1 },
      });

      const formatDocs = (docs) => {
        return docs.map((doc) => doc.pageContent).join("\n-----\n");
      };

      const prompt = ChatPromptTemplate.fromMessages([
        [
          "system",
          `You are a virtual assistant named neon.
          Answer the question based on the following context: {context}
          Your response should convey appropriate emotions.
          You should respond in a friendly and engaging manner.
          End your response with one of these emotions in brackets:
          [HAPPY], [SAD], [ANGRY], [SURPRISED], [FUNNY], or [NEUTRAL]`,
        ],
        new MessagesPlaceholder("chat_history"),
        ["human", "{question}"],
      ]);

      const formatChatHistory = (chatHistory) => {
        return chatHistory
          .map(([question, answer]) => [
            new HumanMessage(question),
            new AIMessage(answer),
          ])
          .flat();
      };

      this.retrievalChain = RunnableSequence.from([
        {
          context: async (input) => {
            const docs = await retriever.getRelevantDocuments(input.question);
            return formatDocs(docs);
          },
          chat_history: (input) => formatChatHistory(input.chat_history || []),
          question: (input) => input.question,
        },
        prompt,
        model,
        new StringOutputParser(),
      ]);
    } catch (error) {
      console.error("Error initializing vector store:", error);
    }
  }

  async generateResponse(userMessage) {
    try {
      const response = await this.retrievalChain.invoke({
        question: userMessage,
        chat_history: [],
      });

      // Extract emotion from response
      const emotionMatch = response.match(/\[(.*?)\]$/);
      const emotion = emotionMatch ? emotionMatch[1] : "NEUTRAL";
      const cleanResponse = response.replace(/\[.*?\]$/, "").trim();

      // Map emotions to facial expressions and animations
      const emotionMap = {
        HAPPY: {
          facialExpression: "smile",
          animation: "Talking_1",
        },
        SAD: {
          facialExpression: "sad",
          animation: "Crying",
        },
        ANGRY: {
          facialExpression: "angry",
          animation: "Angry",
        },
        SURPRISED: {
          facialExpression: "surprised",
          animation: "Talking_2",
        },
        FUNNY: {
          facialExpression: "funnyFace",
          animation: "Laughing",
        },
        NEUTRAL: {
          facialExpression: "default",
          animation: "Talking_0",
        },
      };

      const { facialExpression, animation } =
        emotionMap[emotion] || emotionMap.NEUTRAL;

      return [
        {
          text: cleanResponse,
          facialExpression,
          animation,
        },
      ];
    } catch (error) {
      console.error("Error generating response:", error);
      throw error;
    }
  }
}

module.exports = new ChatService();
