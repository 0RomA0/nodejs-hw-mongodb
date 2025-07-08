import { contactsCollection } from "../db/model/contacts.js";


export const getAllContacts = async () => {
    const contacts = await contactsCollection.find();
    return contacts;
};


export const getContactById = async (contactId) => {
    const contactById = await contactsCollection.findById(contactId);
    return contactById;
};
