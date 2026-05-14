export interface Product {
  id: number;
  allergyInfo: string;
  brandName: string;
  count: number;
  dc: number;
  delType: number;
  description: string;
  imageUrl: string;
  imageUrlName: string;
  hotDeal: boolean;
  memberSpecial: boolean;
  notes: string;
  origin: string;
  pid: string;
  price: number;
  productDate: Date;
  productDescriptionImage: string;
  productInformationImage: string;
  productName: string;
  seller: string;
  unit: string;
  weight: string;
  categorySubId: number;
  upk?: number;
}