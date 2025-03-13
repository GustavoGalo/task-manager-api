/**
 * Generates a random alphanumeric code of specified length
 * @param length Length of the code to generate (default: 6)
 * @returns Random alphanumeric code
 */
export function generateRandomCode(length: number = 6): string {
  const characters = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789"; // Removed similar-looking characters
  let result = "";

  for (let i = 0; i < length; i++) {
    const randomIndex = Math.floor(Math.random() * characters.length);
    result += characters.charAt(randomIndex);
  }

  return result;
}
