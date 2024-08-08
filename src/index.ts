import express, { Request, Response } from 'express';
import http from 'http';
import cookieParser from 'cookie-parser';
import cors from 'cors';
import dotenv from 'dotenv';
import auth from './routes/auth';
import api from './routes/api';
import { Authorization } from './middlewares/authorization';
import stockRouter from './routes/stockRouter';
import { Server } from 'socket.io';
// import getStocks from './controllers/stockController'; 
import registerStockHandlers from './controllers/stockController';

dotenv.config();

const app = express();
const server = http.createServer(app);

const io = new Server(server, {
  cors: {
    origin: ['http://localhost:3000', 'http://localhost:5173', 'http://localhost:5174'],
    credentials: true,
  },
});


app.use(cookieParser());
app.use(express.json());
app.use(cors({
  origin: ['http://localhost:3000', 'http://localhost:5173', 'http://localhost:5174'],
  credentials: true // frontend URL
}));

app.use('/auth', auth);
app.use('/api', Authorization);
app.use('/api', stockRouter);

// Register socket handlers
registerStockHandlers(io);


const port = process.env.PORT || 3000;
server.listen(port, () => {
  console.log(`Server started on port ${port}`);
});
