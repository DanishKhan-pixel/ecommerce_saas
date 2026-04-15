export interface Address {
  id: string;
  userId: string;
  name: string;
  street: string;
  city: string;
  state: string;
  zip: string;
  country: string;
  isDefault: boolean;
}

export const addresses: Address[] = [
  {
    id: "1",
    userId: "u1",
    name: "Dansh ",
    street: "123 ",
    city: "  pakistan",
    state: "OR",
    zip: "97201",
    country: "pak",
    isDefault: true,
  },
  {
    id: "2",
    userId: "u1",
    name: "Sarah",
    street: "456 Work Street, Suite 200",
    city: "pakistan",
    state: "OR",
    zip: "97204",
    country: "pak",
    isDefault: false,
  },
];
