export function calculateAreaDecreasePercent(beforeMetrics, afterMetrics) {
  if (!beforeMetrics || !afterMetrics) return 0;

  // Extract and default missing values
  const {
    length_mm: bl = 0,
    width_mm: bw = 0,
    angle_deg: ba = 0,
    crack_percentage: bp =0,
  } = beforeMetrics;

  const {
    length_mm: al = 0,
    width_mm: aw = 0,
    angle_deg: aa = 0,
    crack_percentage: ap = 0,
  } = afterMetrics;

  // Calculate areas
  const beforeArea = bl * bw;
  const afterArea = al * aw;

  // Angle impact (0 to 1)
  const beforeAngleImpact = Math.abs(Math.sin((ba * Math.PI) / 180));
  const afterAngleImpact = Math.abs(Math.sin((aa * Math.PI) / 180));

  // Composite weighted score (like a health score)
  const beforeScore = beforeArea * 0.4 + beforeAngleImpact * 100 * 0.2 + bp * 0.4;
  const afterScore = afterArea * 0.4 + afterAngleImpact * 100 * 0.2 + ap * 0.4;
  // Decrease percentage
  const decrease = beforeScore - afterScore;
  const percentDecrease = (decrease / beforeScore) * 100;

  return Math.max(0, Math.min(100, parseFloat(percentDecrease.toFixed(2))));
}
