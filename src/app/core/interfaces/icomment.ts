export interface Icomment {
  id: number;
  content: string;
  createdAt: string;
  userId: string;
  userName: string;
  isLocked: boolean;
  profilePicUrl: string;
  containsBadWord: boolean;
}
