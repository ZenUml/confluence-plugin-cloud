export default async function time(action: () => Promise<any>, callback: (duration: number, actionResult: any) => any) {
  let actionResult;
  const startTime = performance.now();
  try {
    actionResult = await action();
    return actionResult;
  } finally {
    const duration = Math.round(performance.now() - startTime);
    callback(duration, actionResult);
  }
}