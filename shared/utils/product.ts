export const getOldPrice = (product: unknown): number | undefined => {
  if (
    product &&
    typeof product === "object" &&
    "oldPrice" in product &&
    typeof (product as { oldPrice: unknown }).oldPrice === "number"
  ) {
    return (product as { oldPrice: number }).oldPrice;
  }

  return undefined;
};

export const getHoverImage = (product: unknown): string | undefined => {
  if (
    product &&
    typeof product === "object" &&
    "imgHover" in product &&
    typeof (product as { imgHover: unknown }).imgHover === "string"
  ) {
    return (product as { imgHover: string }).imgHover;
  }

  return undefined;
};
