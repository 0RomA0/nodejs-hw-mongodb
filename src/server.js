import express from 'express';
import pino from 'pino-http';
import cors from 'cors';
import { getEnvVar } from './utils/getEnvVar.js';
import { getAllContacts, getContactById } from './services/contacts.js';

const PORT = Number(getEnvVar('PORT', '8080'));

export function setupServer() {

    const app = express();

    app.use(express.json());
    app.use(cors());

    app.use(pino({
        transport: {
        target: 'pino-pretty',
            },
        }),
    );

    app.get("/contacts", async (req, res) => {
        const contacts = await getAllContacts();

        res.json({
            status: 200,
            message: "Successfully found contacts!",
            data: contacts,
        });
    });

    app.get("/contacts/:contactId", async (req, res) => {

        const { contactId } = req.params;
        const contactById = await getContactById(contactId);

        if (!contactById) {
            res.json({
                status: 404,
                message: 'Contact not found',
            });

            return;
        }

        res.json({
            status: 200,
            message: "Successfully found contacts!",
            data: contactById,
        });
    })


    app.use((req, res, next) => {
        res.status(404).json({
        message: 'Route not found',
        });
    });

    
    app.listen(PORT, () => {
        console.log(`Server is running on port ${PORT}`);
        });

}

