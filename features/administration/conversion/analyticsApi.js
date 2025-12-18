import { api } from "@/shared/lib/axios";


const API = "/api/analytics";

export const getConversionRates = async () => {
  const res = await api.get(`${API}/conversion`);
  return res.data;
};
