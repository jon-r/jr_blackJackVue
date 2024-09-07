export async function wait(delay: number): Promise<void> {
  await new Promise((resolve) => setTimeout(resolve, delay));
}
