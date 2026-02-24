export interface Pass {
  _id?: string;
  guestName: string;
  accessCode?: string;
  status?: 'PENDING' | 'USED' | 'EXPIRED';
  createdAt?: Date;
  expiresAt?: Date;
}
