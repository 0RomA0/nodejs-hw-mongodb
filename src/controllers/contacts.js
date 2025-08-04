import { getAllContacts, getContactById, createContact, updateContact, deleteContact } from '../services/contacts.js';
import createHttpError from 'http-errors';
import { parsePaginationParams } from '../utils/parsePaginationParams.js';
import { parseSortParams } from '../utils/parseSortParams.js';
import { parseFilterParams } from '../utils/parseFilterParams.js'
import { saveFileToCloudinary } from '../utils/saveFileToCloudinary.js';



export async function getAllContactsController(req, res) {

    const { page, perPage } = parsePaginationParams(req.query);
    const { sortBy, sortOrder } = parseSortParams(req.query);
    const filter = parseFilterParams(req.query);

    const contacts = await getAllContacts({
        page,
        perPage,
        sortBy,
        sortOrder,
        filter,
        userId: req.user._id,
    });

        res.json({
            status: 200,
            message: "Successfully found contacts!",
            data: contacts,
        });
}



export async function getContactByIdController(req, res) {
    
        const { id } = req.params;
            const userId = req.user._id;
                const contactById = await getContactById(id, userId);

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
    
    const userId = req.user._id;
    const photo = req.file

    let photoUrl;

    if (photo) {
            photoUrl = await saveFileToCloudinary(photo);
        }
    


    const newContact = await createContact({ ...req.body, photo: photoUrl, userId });

      if (!newContact) {
        next(createHttpError(404, 'Contact not found'));
            return;
    }
    

        res.status(201).json({
		    status: 201,
            message: "Successfully created a contact!",
            data: newContact,
        });
};



export async function updateContactController(req, res) {

    const { id } = req.params;
    const userId = req.user._id;
    
    const photo = req.file

    let photoUrl;

    if (photo) {
            photoUrl = await saveFileToCloudinary(photo);
        }
    


    const updatedContact = await updateContact(id, { ...req.body, photo: photoUrl }, userId);

      if (!updatedContact) {
        next(createHttpError(404, 'Contact not found'));
            return;
    }


        res.status(200).json({
	        status: 200,
	        message: "Successfully patched a contact!",
            data: updatedContact,
        });
};



export async function deleteContactController(req, res) {

    const { id } = req.params;
        const userId = req.user._id;
            const deletedContact = await deleteContact(id, userId);

    if (deletedContact === null) {
           throw createHttpError(404, "Contact not found");

        }

    res.status(204).send();
};