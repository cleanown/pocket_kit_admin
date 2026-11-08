interface CustomRes {
  code: number;
  data?: any;
  message?: string;
  [key: any]: any;
}

interface UserInfo {
  username: string;
  phone: number | null;
  avatar: string;
  account: string;
  email: string;
}