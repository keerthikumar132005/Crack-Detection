export function calculateAreaDecreasePercent(length1, width1, length2, width2) {
  // Validate input
  if (length1 <= 0 || width1 <= 0) {
      throw new Error("Original length1 and width1 must be positive and non-zero.");
  }

  const originalArea = length1 * width1;
  const newArea = length2 * width2;

  const decreaseAmount = originalArea - newArea;
  const percentDecrease = (decreaseAmount / originalArea) * 100;

  return percentDecrease;
}

// Example usage:
const l1 = 120.0, w1 = 80.0;
const l2 = 100.0, w2 = 64.0;

try {
  const pct = calculateAreaDecreasePercent(l1, w1, l2, w2);
  console.log(`Combined (area) decreased by ${pct.toFixed(2)}%`);
} catch (error) {
  console.error(error.message);
}


