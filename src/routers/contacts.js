import { Router } from 'express';
import { getAllContactsController, getContactByIdController,createContactController, updateContactController, deleteContactController } from '../controllers/contacts.js';
import { ctrlWrapper } from '../utils/ctrlWrapper.js';
import { validateBody } from '../middlewares/validateBody.js';
import { createContactsSchema, updateContactsSchema } from '../validation/contacts.js';
import { isValidId } from '../middlewares/isValidId.js';


const router = Router();

router.get("/", ctrlWrapper(getAllContactsController));

router.get("/:id", isValidId, ctrlWrapper(getContactByIdController));

router.post("/", validateBody(createContactsSchema), ctrlWrapper(createContactController));

router.patch("/:id", isValidId, validateBody(updateContactsSchema), ctrlWrapper(updateContactController));

router.delete("/:id", isValidId, ctrlWrapper(deleteContactController))

    
export default router;