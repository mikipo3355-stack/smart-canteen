const vendorShopMap: Record<string, string> = {
  vendor1: 'shop-1',
};

export function getVendorShopId(vendorId: string): string {
  return vendorShopMap[vendorId] || 'shop-1';
}
