export interface User {
  id: string;
  email: string;
  phone: string;
  role: string;
  username: string;
  fullname: string;
  address: string;
  preferences: {
    theme: "light" | "dark" | "system";
    notifications: boolean;
  };
}
