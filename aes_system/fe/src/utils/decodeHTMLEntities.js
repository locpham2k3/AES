const decodeCache = new Map();

const entityMap = {
  "&amp;": "&",
  "&lt;": "<",
  "&gt;": ">",
  "&quot;": '"',
  "&#39;": "'",
  // Thêm các thực thể HTML phổ biến khác nếu cần
};

export const decodeHTMLEntities = (text) => {
  if (decodeCache.has(text)) {
    return decodeCache.get(text);
  }

  let decoded = text;
  for (const [entity, character] of Object.entries(entityMap)) {
    if (decoded.includes(entity)) {
      decoded = decoded.split(entity).join(character);
    }
  }

  decodeCache.set(text, decoded);
  return decoded;
};
