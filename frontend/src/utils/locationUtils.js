export const generateCheckpoints = (start, destination) => {
  const numPoints = Math.floor(Math.random() * 2) + 3; // 3-4 checkpoints
  const checkpoints = [];

  console.log("🗺️ Route Details:");
  console.log("📍 Starting from:", start);
  console.log("🎯 Destination:", destination);

  // Calculate intermediate points with some randomness
  for (let i = 1; i <= numPoints; i++) {
    const fraction = i / (numPoints + 1);

    // Linear interpolation between points
    const lat = start[0] + (destination.coordinates[0] - start[0]) * fraction;
    const lng = start[1] + (destination.coordinates[1] - start[1]) * fraction;

    // Add some randomness (approximately 100-200m deviation)
    const jitter = 0.002;
    const randomLat = lat + (Math.random() - 0.5) * jitter;
    const randomLng = lng + (Math.random() - 0.5) * jitter;

    const point = {
      coordinates: [randomLat, randomLng],
      message: getRandomMessage(i, numPoints),
      timeToNext: Math.floor(Math.random() * 10) + 10, // 10-20 minutes
    };

    console.log(`✨ Checkpoint ${i}:`, {
      coordinates: point.coordinates,
      estimatedTime: point.timeToNext + " minutes",
    });

    checkpoints.push(point);
  }

  return checkpoints;
};

const getRandomMessage = (current, total) => {
  const messages = [
    "Keep moving! Adventure awaits...",
    "You're getting closer to something special!",
    "The journey continues! Stay curious...",
    "Mystery and excitement ahead...",
    "Almost there! The destination is near...",
  ];
  return messages[current % messages.length];
};
