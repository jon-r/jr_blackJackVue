// todo review where these are and add where feels good+consistent
export async function wait(delay: number): Promise<void> {
  await new Promise((resolve) => setTimeout(resolve, delay));
}
