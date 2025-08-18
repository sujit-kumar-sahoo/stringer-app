/**
 * Utility to encode any object into Base64 JSON string
 */
export const encodePayload = (payload: object): string => {
  return btoa(JSON.stringify(payload));
};

/**
 * Convert FormData into a plain object
 */
export const formDataToObject = (formData: FormData): Record<string, any> => {
  const obj: Record<string, any> = {};
  formData.forEach((value, key) => {
    obj[key] = value;
  });
  return obj;
};
