type GetStopRotationOptions = {
  choiceCount: number;
  selectedIndex: number;
  currentRotation: number;
  extraTurns?: number;
};

function normalizeDegrees(degrees: number): number {
  return ((degrees % 360) + 360) % 360;
}

export function getStopRotation({
  choiceCount,
  selectedIndex,
  currentRotation,
  extraTurns = 5,
}: GetStopRotationOptions): number {
  if (!Number.isInteger(choiceCount) || choiceCount < 2) {
    throw new Error("choiceCount must be an integer of at least 2");
  }
  if (!Number.isInteger(selectedIndex) || selectedIndex < 0 || selectedIndex >= choiceCount) {
    throw new Error("selectedIndex must point to an existing choice");
  }

  const sectorDegrees = 360 / choiceCount;
  const selectedCenter = (selectedIndex + 0.5) * sectorDegrees;
  const targetRotation = normalizeDegrees(-selectedCenter);
  const forwardDegrees = normalizeDegrees(targetRotation - currentRotation);

  return currentRotation + extraTurns * 360 + forwardDegrees;
}

export function getSelectedIndexAtPointer(choiceCount: number, rotation: number): number {
  const sectorDegrees = 360 / choiceCount;
  return Math.floor(normalizeDegrees(-rotation) / sectorDegrees);
}
