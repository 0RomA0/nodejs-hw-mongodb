import { SORT_ORDER } from "../constants/index.js";
import { contactsCollection } from "../db/model/contacts.js";
import { calculatePaginationData } from "../utils/calculatePaginationData.js";


export const getAllContacts = async ({ page, perPage, sortOrder = SORT_ORDER.ASC,
    sortBy = '_id', filter = {}, }) => {

    const limit = perPage;
    const skip = (page - 1) * perPage;

    const contactsQuery = contactsCollection.find();

    if (filter.contactType) {
        contactsQuery.where('contactType').equals(filter.contactType);
    }
    
    if (filter.isFavourite !== undefined) {
        contactsQuery.where('isFavourite').equals(filter.isFavourite);
    }

    const contactsCount = await contactsCollection.find().merge(contactsQuery).countDocuments();

    const contacts = await contactsQuery.skip(skip).limit(limit).sort({ [sortBy]: sortOrder }).exec();

    const paginationData = calculatePaginationData(contactsCount, perPage, page);

    return {
        data: contacts,
        ...paginationData,
    };
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