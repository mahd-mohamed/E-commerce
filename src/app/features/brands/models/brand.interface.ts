export interface Brand {
  _id: string;
  name: string;
  slug: string;
  image: string;
  createdAt: string;
  updatedAt: string;
}
export interface BrandsApiResponse {
  metadata: {
    currentPage: number;
    limit: number;
    numberOfPages: number;
    total: number;
  };
  status: string;
  results: number;
  data: Brand[];
  pagination: {
    currentPage: number;
    limit: number;
    numberOfPages: number;
    total: number;
  };
}

export interface BrandResponse {
  status: string;
  data: Brand;
}