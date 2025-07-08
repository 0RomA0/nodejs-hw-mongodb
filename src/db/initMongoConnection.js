import { getEnvVar } from "../utils/getEnvVar.js";
import mongoose from 'mongoose';

export async function initMongoConnection() {
    const user = getEnvVar("MONGODB_USER");
    const password = getEnvVar("MONGODB_PASSWORD");
    const url = getEnvVar("MONGODB_URL");
    const db = getEnvVar("MONGODB_DB");


    try {
        mongoose.connect(`mongodb+srv://${user}:${password}@${url}/${db}?retryWrites=true&w=majority&appName=Cluster0`)
        console.log("Mongo connection successfully established!");
    } catch (error) {
        console.log("Error while setting up mongo connection", error);
        throw error;
    }
}