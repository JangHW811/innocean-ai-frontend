export interface User {
  id: string;
  password: string;
  name?: string;
}

export const USERS: User[] = [
  { id: "admin", password: "admin123", name: "관리자" },
  { id: "test", password: "test123", name: "테스트 사용자" },
  { id: "user1", password: "user123", name: "사용자1" },
  { id: "user2", password: "user456", name: "사용자2" },
  { id: "demo", password: "demo123", name: "데모 사용자" },
];
