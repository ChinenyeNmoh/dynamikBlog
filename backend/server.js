import path from "path";
import { fileURLToPath } from 'url';
import { dirname } from 'path';
import express from "express";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";
import { notFound, errorHandler } from "./middlewares/errorMiddlewares.js";
import connectDB from "./config/db.js";
import userRoutes from "./routes/userRoutes.js";
import cors from 'cors'
import morgan from "morgan";
import postRoutes from "./routes/postRoutes.js";
import commentRoutes from "./routes/commentRoutes.js";


dotenv.config();

// Connect to MongoDB
connectDB();

const app = express();

const port = process.env.PORT || 5000;

// body parser

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());


app.use(cors());
  

// Define __dirname and __filename for ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// path to our static folders
app.use(express.static(path.join(__dirname, 'public')));


// Routes
app.use("/api/users", userRoutes);
app.use("/api/posts", postRoutes);
app.use("/api/comments", commentRoutes);


// Logging using morgan middleware only if we are in development
if (process.env.NODE_ENV === 'development') {
    app.use(morgan('dev'));
  }

// Serve React frontend in production
if (process.env.NODE_ENV === 'production') {
  // Serve static files from the React app's build directory
  app.use(express.static(path.join(__dirname, '../frontend/build')));

  // Serve index.html for any unknown routes
  app.get('*', (req, res) =>
    res.sendFile(path.resolve(__dirname, '../frontend', 'build', 'index.html'))
  );
} else {
  // Serve a simple message for the root URL in development
  app.get('/', (req, res) => {
    res.send('API is running....');
  });
}

app.use(notFound);
app.use(errorHandler);



app.listen(port, () => {
    console.log(`app is running on port ${port}`)
})