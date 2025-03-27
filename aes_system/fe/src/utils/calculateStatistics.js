export const calculateStatistics = (studentData) => {
  const scores = studentData.map((student) => student.averageScore);

  const average = scores.reduce((sum, score) => sum + score, 0) / scores.length;
  const highest = Math.max(...scores);
  const lowest = Math.min(...scores);
  const stdDev = Math.sqrt(
    scores.reduce((sum, score) => sum + Math.pow(score - average, 2), 0) /
      scores.length
  );

  return {
    average,
    highest,
    lowest,
    stdDev,
  };
};
