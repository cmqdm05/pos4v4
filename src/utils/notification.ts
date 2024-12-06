import { api } from '../store/api';

export const createNotification = async (
  dispatch: any,
  message: string,
  type: 'system' | 'alert' | 'info' = 'system',
  store?: string,
  recipientId?: string,
  recipientModel?: 'User' | 'Staff'
) => {
  try {
    await dispatch(
      api.endpoints.createSystemNotification.initiate({
        message,
        type,
        store,
        recipientId,
        recipientModel
      })
    ).unwrap();
  } catch (error) {
    console.error('Failed to create notification:', error);
  }
};

export const getWelcomeMessage = (name: string) => {
  return `Welcome to the system, ${name}! We're glad to have you here.`;
};

export const getStoreCreatedMessage = (storeName: string) => {
  return `Store "${storeName}" has been successfully created.`;
};

export const getLowStockMessage = (productName: string, currentStock: number) => {
  return `Low stock alert: ${productName} has only ${currentStock} units remaining.`;
};

export const getRoleCreatedMessage = (roleName: string) => {
  return `New role "${roleName}" has been created.`;
};

export const getStaffCreatedMessage = (staffName: string) => {
  return `New staff member "${staffName}" has been added.`;
};

export const getStaffLoginMessage = (staffName: string) => {
  return `${staffName} has logged in to the system.`;
};