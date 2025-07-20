

const parseType = (type) => {
    const isString = typeof type === 'string';
    
    if (!isString) {
        return; 
    }

  const isContactType = (type) => ["work", "home", "personal"].includes(type);

    if (isContactType(type)) {
        return type;
    }
};

export const parseFilterParams = (query) => {

    const { contactType, isFavourite } = query;
    
    const parsedType = parseType(contactType);

    const parsedIsFavourite = isFavourite === 'true' ? true : isFavourite === 'false' ? false : undefined;

  return {
    contactType: parsedType,
    isFavourite: parsedIsFavourite,
  };
};

