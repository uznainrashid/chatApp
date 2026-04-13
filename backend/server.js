import express from "express"
import dotenv from "dotenv"
import cors from "cors"
import connectDB from "./config/db.js";
import authRoutes from "./routes/authroutes.js"
import MessageRouter from "./routes/RouteMessage.js"
import { Server } from "socket.io"
import { createServer } from "http";
import { socketManager } from "./sockets/socketManager.js";

dotenv.config()

const app = express();
const httpServer = createServer(app);
const PORT = process.env.PORT || 5000;
connectDB()
// Cors settings
app.use(cors({
    origin: ["https://chat-app-eta-one-62.vercel.app", "http://localhost:5173", "http://localhost:3000"],
    methods: ["GET", "POST", "PUT", "DELETE"],
    credentials: true
}));

app.use(express.json())
// Get request
app.get("/",(req , res)=>{
    res.send("Hello woorld")
})
// Auth user api
app.use("/api/auth", authRoutes)
// Message user api 
app.use("/api/messages", MessageRouter)
// Socket.io server
const io = new Server(httpServer, { 
    cors: { 
        origin: ["https://chat-app-eta-one-62.vercel.app", "http://localhost:5173", "http://localhost:3000"], 
        methods: ["GET", "POST"],
        allowedHeaders: ["authorization"],
        credentials: true
    }
});
socketManager(io)
httpServer.listen(PORT, ()=>{
    console.log(`Server are listening http://localhost:${PORT}`)
})