import axios from './axios';

export type ContactFormResponse = {
  success: boolean;
  message: string;
  partial?: boolean;
  contactId?: string;
};

export const submitContactForm = async (data: {
  name: string;
  email: string;
  subject: string;
  message: string;
}): Promise<ContactFormResponse> => {
  try {
    const response = await axios.post<ContactFormResponse>('/api/contact/submit', data);
    return response.data;
  } catch (error: unknown) {
    const err = error as { response?: { data?: ContactFormResponse } };
    const payload = err.response?.data;
    if (payload?.message) {
      return { success: false, message: payload.message };
    }
    return {
      success: false,
      message: 'An error occurred while sending your message. Please try again.',
    };
  }
};
