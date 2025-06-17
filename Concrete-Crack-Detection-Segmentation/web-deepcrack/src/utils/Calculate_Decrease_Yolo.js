function calculateCrackReductionSummary(beforeMetrics, afterMetrics) {
  const beforeArea = beforeMetrics.total_crack_area_mm2;
  const afterArea = afterMetrics.total_crack_area_mm2;

  const beforePercent = beforeMetrics.crack_percentage;
  const afterPercent = afterMetrics.crack_percentage;

  // Avoid division by zero
  const areaDecreasePercent = beforeArea === 0 ? 0.0 : ((beforeArea - afterArea) / beforeArea) * 100;
  const coverageDecreasePercent = beforePercent === 0 ? 0.0 : ((beforePercent - afterPercent) / beforePercent) * 100;

  const roundedAreaDrop = Math.round(areaDecreasePercent * 100) / 100;
  const roundedCoverageDrop = Math.round(coverageDecreasePercent * 100) / 100;

  const summary = `Crack area reduced by ${Math.max(roundedAreaDrop, 0)}%, and surface coverage reduced by ${Math.max(roundedCoverageDrop, 0)}%.`;
  return {
      area_decrease_percent: Math.max(roundedAreaDrop, 0),
      coverage_decrease_percent: Math.max(roundedCoverageDrop, 0),
      summary: summary
  };
}

export default calculateCrackReductionSummary;
