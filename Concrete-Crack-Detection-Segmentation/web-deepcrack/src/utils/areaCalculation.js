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