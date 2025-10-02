import { products3 } from "@/shared/constants/products";

type Product = (typeof products3)[number];

type FilterState = {
  price: [number, number];
  isNew: string | boolean;
  deals: string;
  rating: string | number;
  brands: string[];
  filtered: Product[];
  sortingOption: string;
  sorted: Product[];
  currentPage: number;
  itemPerPage: number;
  activeFilterOnSale: boolean;
};

type FilterAction =
  | { type: "SET_PRICE"; payload: [number, number] }
  | { type: "SET_DEALS"; payload: string }
  | { type: "SET_RATING"; payload: string | number }
  | { type: "SET_ISNEW"; payload: string | boolean }
  | { type: "SET_BRANDS"; payload: string[] }
  | { type: "SET_FILTERED"; payload: Product[] }
  | { type: "SET_SORTING_OPTION"; payload: string }
  | { type: "SET_SORTED"; payload: Product[] }
  | { type: "SET_CURRENT_PAGE"; payload: number }
  | { type: "TOGGLE_FILTER_ON_SALE" }
  | { type: "SET_ITEM_PER_PAGE"; payload: number }
  | { type: "CLEAR_FILTER" };

export const initialState: FilterState = {
  price: [0, 100],
  isNew: "All",
  deals: "All",
  rating: "All",
  brands: [],
  filtered: products3,
  sortingOption: "Default",
  sorted: products3,
  currentPage: 1,
  itemPerPage: 6,
  activeFilterOnSale: false,
};

export function reducer(state: FilterState, action: FilterAction): FilterState {
  switch (action.type) {
    case "SET_PRICE":
      return { ...state, price: action.payload };
    case "SET_DEALS":
      return { ...state, deals: action.payload };
    case "SET_RATING":
      return { ...state, rating: action.payload };
    case "SET_ISNEW":
      return { ...state, isNew: action.payload };
    case "SET_BRANDS":
      return { ...state, brands: action.payload };
    case "SET_FILTERED":
      return { ...state, filtered: [...action.payload] };
    case "SET_SORTING_OPTION":
      return { ...state, sortingOption: action.payload };
    case "SET_SORTED":
      return { ...state, sorted: [...action.payload] };
    case "SET_CURRENT_PAGE":
      return { ...state, currentPage: action.payload };
    case "TOGGLE_FILTER_ON_SALE":
      return { ...state, activeFilterOnSale: !state.activeFilterOnSale };
    case "SET_ITEM_PER_PAGE":
      return { ...state, itemPerPage: action.payload };
    case "CLEAR_FILTER":
      return {
        ...state,
        price: [0, 100],
        isNew: "All",
        deals: "All",
        rating: "All",
        brands: [],
      };
    default:
      return state;
  }
}
