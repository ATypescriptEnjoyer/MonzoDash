export interface Owner {
  user_id: string;
  preferred_name: string;
  preferred_first_name: string;
}

export interface Account {
  id: string;
  closed: boolean;
  created: Date;
  description: string;
  type: string;
  currency: string;
  country_code: string;
  owners: Owner[];
}
