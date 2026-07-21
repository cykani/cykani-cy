export interface User {
  readonly id: string;
  readonly name: string;
  readonly email: string;
  readonly avatar: string;
  readonly role: string;
}

export const users: User[] = [
  {
    id: "1",
    name: "Admin",
    email: "admin@cykani.com",
    avatar: "",
    role: "admin",
  },
];

export const rootUser = users[0];
