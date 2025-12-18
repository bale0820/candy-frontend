import {FilterItem} from "@/shared/components/FilterItem";
import "@/shared/components/filter.scss"

export function SearchFilterBar({ activeFilter, handleFilter }) {
  const filterLabel = [
    { label: "최신순", value: "new" },
    { label: "높은가격순", value: "priceHigh" },
    { label: "낮은가격순", value: "priceLow" }
  ];

  return (
    <ul className="product-filter">
      {filterLabel.map((item) => (
        <FilterItem
          key={item.value}
          label={item.label}
          value={item.value}
          activeFilter={activeFilter}
          onClick={handleFilter}
        />
      ))}
    </ul>
  );
}
