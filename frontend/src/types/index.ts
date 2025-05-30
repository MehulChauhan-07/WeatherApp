export interface User {
  id?: string;
  _id?: string;
  username: string;
  email: string;
  isAdmin: boolean;
}

export interface SearchHistory {
  _id: string;
  userId: string;
  username: string;
  city: string;
  country: string;
  searchDate: string;
}
