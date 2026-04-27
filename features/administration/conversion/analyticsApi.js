import { api } from "@/shared/lib/axios";


const API = "/api/analytics";

export const getConversionRates = async () => {
  const res = await api.get(`${API}/conversion`);
  const data = res.data;
  console.log(data);
  return data;
};
