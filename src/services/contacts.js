import { contactsCollection } from "../db/model/contacts.js";


export const getAllContacts = async () => {
    const contacts = await contactsCollection.find();
    return contacts;
};


export const getContactById = async (contactId) => {
    const contactById = await contactsCollection.findById(contactId);
    return contactById;
};


export const createContact = async (payload) => {
    const newContact = await contactsCollection.create(payload);
    return newContact;
};


export const updateContact = async (contactId, payload) => {
    const updatedContact = await contactsCollection.findByIdAndUpdate(contactId, payload, {new: true});
    return updatedContact;
};


export const deleteContact = async (contactId) => {
    const deletedContact = await contactsCollection.findByIdAndDelete(contactId);
    return deletedContact;
};