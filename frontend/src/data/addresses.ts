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
  { id: "1", userId: "u1", name: "Sarah Miller", street: "123 Oak Avenue", city: "Portland", state: "OR", zip: "97201", country: "US", isDefault: true },
  { id: "2", userId: "u1", name: "Sarah Miller", street: "456 Work Street, Suite 200", city: "Portland", state: "OR", zip: "97204", country: "US", isDefault: false },
];
