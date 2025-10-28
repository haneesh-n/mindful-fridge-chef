export interface Ingredient {
  id: string;
  name: string;
  quantity: string;
  category: string;
  purchaseDate: Date;
  expiryDate: Date;
  image?: string;
}

export type ExpiryStatus = 'fresh' | 'expiring-soon' | 'expired';

export const getExpiryStatus = (expiryDate: Date): ExpiryStatus => {
  const now = new Date();
  const daysUntilExpiry = Math.ceil((expiryDate.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));
  
  if (daysUntilExpiry < 0) return 'expired';
  if (daysUntilExpiry <= 2) return 'expiring-soon';
  return 'fresh';
};

export const getExpiryColor = (status: ExpiryStatus): string => {
  switch (status) {
    case 'fresh':
      return 'bg-success text-success-foreground';
    case 'expiring-soon':
      return 'bg-warning text-warning-foreground';
    case 'expired':
      return 'bg-destructive text-destructive-foreground';
  }
};
