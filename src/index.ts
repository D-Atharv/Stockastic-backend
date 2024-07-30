import express,{ Request,Response } from "express";
import cookieParser from 'cookie-parser';
import auth from "./routes/auth";
import cors from 'cors';
import dotenv from 'dotenv';

dotenv.config();
const app = express();
app.use(cookieParser()); 
app.use(express.json());

const port =  process.env.PORT || 3000 ;

app.use(cors({
    origin : 'http://localhost:3000',
  }
  ));

app.use('/api/auth',auth);

app.listen(port,()=>console.log(`Server started on port ${port}`));







