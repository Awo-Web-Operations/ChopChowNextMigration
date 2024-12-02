import { toast } from "react-toastify";

export const canItemBeAddedToCart = (item) => {
  if (item?.inventories?.length < 1) {
    toast.error("Item not available for sale!");
    return false;
  }

  if (!item?.inventories?.some((inventory) => inventory.in_stock)) {
    toast.error("Item is out of stock!");
    return false;
  }

  return true;
};
