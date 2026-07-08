/**
 * Base API Service for Don Guto Intranet
 */
export const apiRequest = async (url, options = {}) => {
  const defaultHeaders = {
    'Content-Type': 'application/json',
  };

  const config = {
    ...options,
    headers: {
      ...defaultHeaders,
      ...options.headers,
    },
  };

  if (config.body && typeof config.body !== 'string') {
    config.body = JSON.stringify(config.body);
  }

  try {
    const response = await fetch(url, config);
    
    if (!response.ok) {
      const errorText = await response.text();
      let errorJson;
      try {
        errorJson = JSON.parse(errorText);
      } catch (e) {
        // Not a JSON error
      }
      
      throw new Error(
        errorJson?.error || 
        errorJson?.message || 
        `HTTP error! status: ${response.status}`
      );
    }
    
    // Some endpoints return empty response on success or OPTIONS
    const text = await response.text();
    return text ? JSON.parse(text) : {};
  } catch (error) {
    console.error(`[API Service] Error requesting ${url}:`, error.message);
    throw error;
  }
};
