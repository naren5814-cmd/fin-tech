const API = import.meta.env.VITE_API_URL;

export const getMessage = async () => {
  const res = await fetch(`${API}/api/message`);
  return res.json();
};