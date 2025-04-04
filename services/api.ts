import axios from 'axios';
import { supabase } from '@/lib/supabaseClient';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001/api';

// Create an axios instance with default config
const apiClient = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor to add auth token
apiClient.interceptors.request.use(async (config) => {
  // Get session from Supabase
  const { data: sessionData } = await supabase.auth.getSession();
  
  if (sessionData.session?.access_token) {
    config.headers.Authorization = `Bearer ${sessionData.session.access_token}`;
  }
  
  return config;
});

// Website related API calls
export const websiteApi = {
  // Verify website is reachable
  verifyWebsite: async (url: string) => {
    return apiClient.post('/websites/verify', { url });
  },
  
  // Add new website to monitoring
  addWebsite: async (websiteData: any) => {
    return apiClient.post('/websites', websiteData);
  },
  
  // Immediate check of website
  checkWebsite: async (websiteId: string) => {
    return apiClient.post(`/websites/${websiteId}/check`);
  },
  
  // Get all websites for current user
  getUserWebsites: async () => {
    return apiClient.get('/websites/user');
  },
  
  // Discover website routes
  discoverRoutes: async (websiteId: string) => {
    return apiClient.post(`/websites/${websiteId}/discover-routes`);
  }
};

export default apiClient;