export interface HeaderData {
  value?: string;
  viewValue?: string;
}

export interface Action {
  value: any[];
  id: string;
}

export interface User {
  id?: number;
  email: string;
  first_name: string;
  last_name: string;
  avatar?: string;
  _id: number;
}



export interface Support {
  url: string;
  text: string;
}

export interface UserResponseData {
  page: number;
  per_page: number;
  total: number;
  total_pages: number;
  data: User[];
  support: Support;
}

export interface UserData {
  name: string;
  job: string;
  id?: number;
  createdAt?: Date;
}

export interface UserLocation {
  languages: string;
  distance: string;
  countryCode: string;
  countryName: string;
}
