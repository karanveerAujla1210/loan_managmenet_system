import { v4 as uuidv4 } from 'uuid';

export const generateClientRef = () => {
  return uuidv4();
};

export const generateLocalId = () => {
  return `local_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
};