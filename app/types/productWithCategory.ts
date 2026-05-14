
import { CategorySub } from "./categorySub";
import { Product } from "./product";

export interface ProductWithCategory extends Product {
  categorySub: CategorySub;
  user : {id : number};
}