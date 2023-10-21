import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import {
    addDummyDbItems,
    addDbItem,
    getAllDbItems,
    getDbItemById,
    DbItem,
    updateDbItemById,
} from "./db";
import filePath from "./filePath";
import axios, {Axios, AxiosResponse} from "axios";

import { PartnerInfo } from "./interfaces";

addDummyDbItems(20);

const app = express();

app.use(express.json());
app.use(cors());

dotenv.config();

const PORT_NUMBER = process.env.PORT ?? 4000;

const getPartnerInfo = async (): Promise<PartnerInfo> => {
    try {
        const response: AxiosResponse<PartnerInfo> = await axios.get('https://candidate.hubteam.com/candidateTest/v3/problem/dataset?userKey=e8d62d06369228d1bc5c512b8aab');
        if (response.status === 200) {
             return response.data;
        } else{
            console.error(response.status, 'Failed to fetch');
            throw new Error(`Failed to fetch ${response.status}`);
        }
    } catch (error) {
        console.error('error:', error);
        throw error;
        
    }
   
}


async function runFile(){
    try {
        const partnerInfo: PartnerInfo = await getPartnerInfo();
        console.log('Here is the data:', partnerInfo);
        
    } catch (error) {
        console.error('error:', error);
        
    }


}

runFile();


app.get("/", (req, res) => {
    const pathToFile = filePath("../public/index.html");
    res.sendFile(pathToFile);
});

// GET /items
app.get("/items", (req, res) => {
    const allSignatures = getAllDbItems();
    res.status(200).json(allSignatures);
});

// POST /items
app.post<{}, {}, DbItem>("/items", (req, res) => {
    // to be rigorous, ought to handle non-conforming request bodies
    // ... but omitting this as a simplification
    const postData = req.body;
    const createdSignature = addDbItem(postData);
    res.status(201).json(createdSignature);
});

// GET /items/:id



app.listen(PORT_NUMBER, () => {
    console.log(`Server is listening on port ${PORT_NUMBER}!`);
});
