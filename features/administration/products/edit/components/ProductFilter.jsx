import {FilterItem} from "@/shared/components/FilterItem.jsx";

export function ProductFilter({ filterLabel, activeFilter, onFilter }) {
  return (
    <ul className="product-filter">
      {filterLabel.map((item) => (
        <FilterItem
          key={item.value}
          label={item.label}
          value={item.value}
          activeFilter={activeFilter}
          onClick={onFilter}
        />
      ))}
    </ul>
  );
}
