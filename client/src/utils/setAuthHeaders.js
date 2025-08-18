const setAuthHeaders = headersObject => {
  let headers = { ...headersObject };
  const token = localStorage.getItem('jwtToken');
  if (token) {
    headers = { ...headers, Authorization: `Bearer ${token}` };
  }
  return headers;
};
export default setAuthHeaders;