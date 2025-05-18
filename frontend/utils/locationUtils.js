export const calculateDistance = (point1, point2) => {
  const R = 6371; // Earth's radius in km
  const [lat1, lon1] = point1;
  const [lat2, lon2] = point2;

  const dLat = ((lat2 - lat1) * Math.PI) / 180;
  const dLon = ((lon2 - lon1) * Math.PI) / 180;

  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos((lat1 * Math.PI) / 180) *
      Math.cos((lat2 * Math.PI) / 180) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);

  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
};

export const generateCheckpoints = async (start, end) => {
  const numPoints = Math.floor(Math.random() * 2) + 3; // 3-4 checkpoints
  const checkpoints = [];

  const messages = [
    "Keep moving! Adventure awaits...",
    "You're on the right track!",
    "Getting warmer... something exciting nearby!",
    "The mystery deepens! Keep exploring...",
    "Almost there! Can you feel the energy?",
  ];

  for (let i = 1; i <= numPoints; i++) {
    const fraction = i / (numPoints + 1);
    const lat = start[0] + (end.coordinates[0] - start[0]) * fraction;
    const lng = start[1] + (end.coordinates[1] - start[1]) * fraction;

    checkpoints.push({
      coordinates: [lat, lng],
      message: messages[i - 1],
      timeToNext: Math.floor(Math.random() * 10) + 10, // 10-20 minutes
    });
  }

  return checkpoints;
};
