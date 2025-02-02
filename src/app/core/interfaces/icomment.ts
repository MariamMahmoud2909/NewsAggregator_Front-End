export interface Icomment {
  id: number;
  content: string;
  createdAt: string;
  articleId: string;
  userId: string;
  user:{
    firstName: string;
    lastName: string;
    profilePicUrl: null;
    categories: any[];
    notifications: any[];
    id: string;
    userName: string;
    normalizedUserName: string;
    email: string;
    normalizedEmail: string;
    emailConfirmed: boolean;
    passwordHash: string;
    securityStamp: string;
    concurrencyStamp: string;
    phoneNumber: null;
    phoneNumberConfirmed: boolean;
    twoFactorEnabled: boolean;
    lockoutEnd: null;
    lockoutEnabled: boolean;
    accessFailedCount: number;
  };
}



