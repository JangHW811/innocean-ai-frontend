export interface User {
  id: string;
  password: string;
  name?: string;
}

// admin1   admin1!
// admin2   admin2!
// admin3   admin3!
// admin4   admin4!
// admin5   admin5!
// admin6   admin6!
// admin7   admin7!
// admin888   admin888!
// admin999   admin999!
// admin111   admin111!
export const USERS: User[] = [
  { id: "admin1", password: "admin1!", name: "관리자1" },
  { id: "admin2", password: "admin2!", name: "관리자2" },
  { id: "admin3", password: "admin3!", name: "관리자3" },
  { id: "admin4", password: "admin4!", name: "관리자4" },
  { id: "admin5", password: "admin5!", name: "관리자5" },
  { id: "admin6", password: "admin6!", name: "관리자6" },
  { id: "admin7", password: "admin7!", name: "관리자7" },
  { id: "admin888", password: "admin888!", name: "관리자888" },
  { id: "admin999", password: "admin999!", name: "관리자999" },
  { id: "admin111", password: "admin111!", name: "관리자111" },
];
