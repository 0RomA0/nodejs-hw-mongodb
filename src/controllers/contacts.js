import { getAllContacts, getContactById, createContact, updateContact, deleteContact } from '../services/contacts.js';
import createHttpError from 'http-errors';



export async function getAllContactsController(req, res) {
    const contacts = await getAllContacts();

        res.json({
            status: 200,
            message: "Successfully found contacts!",
            data: contacts,
        });
}



export async function getContactByIdController(req, res) {
    
    const { id } = req.params;
    const contactById = await getContactById(id);

        if (contactById === null) {
           throw createHttpError(404, "Contact not found");

        }

        res.json({
            status: 200,
            message: "Successfully found contacts!",
            data: contactById,
        });
};



export async function createContactController(req, res) {
    
    const newContact = await createContact(req.body);

        res.status(201).json({
		    status: 201,
		    message: "Successfully created a contact!",
		    data: newContact,
        });
};



export async function updateContactController(req, res) {

    const { id } = req.params;
    const updatedContact = await updateContact(id, req.body);

    if (updatedContact === null) {
           throw createHttpError(404, "Contact not found");

        }

        res.status(200).json({
	        status: 200,
	        message: "Successfully patched a contact!",
            data: updatedContact,
        });
};



export async function deleteContactController(req, res) {

    const { id } = req.params;
    const deletedContact = await deleteContact(id);

    if (deletedContact === null) {
           throw createHttpError(404, "Contact not found");

        }

    res.status(204).send();
};