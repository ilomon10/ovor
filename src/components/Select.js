import React, { useMemo } from "react";
import { Button, MenuItem } from "@blueprintjs/core";
import { Select as BPSelect } from "@blueprintjs/select";

const Select = ({
  id,
  intent,
  fill,
  filterable = true,

  allowCreateItem,
  options,
  optionRenderer,
  onCreateNew,
  onChange,
  onClick,
  onOpening,
  value,
  loading,
}) => {
  const items = useMemo(() => {
    return options;
  }, [options]);
  const activeItem = useMemo(() => {
    return items.find(item => item.value === value);
  }, [value, items]);

  const createNewItemRenderer = (query, active) => {
    return (
      <MenuItem
        active={active}
        icon="add"
        text={`Add new group "${query}"`}
        onClick={(e) => {
          onCreateNew(query);
        }}
      />
    )
  }

  const itemRenderer = (item, { handleClick, modifiers }) => {
    if (!modifiers.matchesPredicate) {
      return null;
    }
    return (
      <MenuItem
        key={item.value}
        active={modifiers.active}
        disabled={modifiers.disabled}
        onClick={handleClick}
        text={item.label}
      />
    )
  }

  const itemPredicate = (query, item) => {
    const normalizeLabel = item.label.toLowerCase();
    const normalizeQuery = query.toLowerCase();
    return `${item.value} ${normalizeLabel}`.indexOf(normalizeQuery) >= 0;
  }

  return (
    <BPSelect
      filterable={filterable}
      items={items}
      activeItem={activeItem}
      itemRenderer={optionRenderer || itemRenderer}
      itemPredicate={itemPredicate}
      onItemSelect={onChange}
      createNewItemPosition="first"
      createNewItemRenderer={allowCreateItem ? createNewItemRenderer : null}
      createNewItemFromQuery={allowCreateItem ? () => null : null}
      inputProps={{
        onKeyDown: (e) => {
          if (e.code === "Enter") {
            e.stopPropagation();
            onCreateNew(e.target.value);
          }
        }
      }}

      popoverProps={{
        fill: fill,
        onOpening: onOpening,
        minimal: true
      }}
      noResults={(
        <MenuItem text={loading ? "Loading..." : "No Item"} />
      )}
    >
      <Button
        id={id}
        fill={fill}
        alignText="left"
        intent={intent}
        loading={loading}
        text={activeItem ? activeItem.label : "Select"}
        rightIcon="caret-down"
        onClick={onClick}
      />
    </BPSelect >
  )
}

export default Select;