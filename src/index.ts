import express, { Request, Response } from 'express';
import http from 'http';
import cookieParser from 'cookie-parser';
import cors from 'cors';
import dotenv from 'dotenv';
import { Server } from 'socket.io';
import auth from './routes/auth';
import adminRoute from './routes/adminRoute';
import { setupSocket } from './sockets/socket';

dotenv.config();

const app = express();
const server = http.createServer(app);
const io = new Server(server);

app.use(cookieParser());
app.use(express.json());

app.use(cors({
  origin: 'http://localhost:3000', // frontend URL
}));

app.use('/api/auth', auth);
app.use('/api', adminRoute);

setupSocket(io);

const port = process.env.PORT || 3000;
server.listen(port, () => {
  console.log(`Server started on port ${port}`);
});
