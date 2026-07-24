export function applyMoneyKey(currentValue, key) {
  if (key === "⌫") {
    return currentValue.slice(0, -1);
  }

  if (key === ",") {
    if (currentValue.includes(",")) {
      return currentValue;
    }

    return currentValue ? `${currentValue},` : "0,";
  }

  const decimalPart = currentValue.split(",")[1];

  if (decimalPart?.length >= 2) {
    return currentValue;
  }

  if (currentValue === "0") {
    return key;
  }

  return `${currentValue}${key}`;
}

export function parseMoneyInput(value) {
  if (!value) {
    return 0;
  }

  return Number(value.replace(",", "."));
}
