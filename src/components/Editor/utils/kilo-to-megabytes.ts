export const kiloToMegaBytes = (kilobyte: number): number => {
  const mb = kilobyte / 1024;
  const fixedMb = parseFloat(mb.toFixed(2));
  return fixedMb;
};
