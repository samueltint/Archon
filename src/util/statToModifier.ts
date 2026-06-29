export default function statToMod(stat: number) {
  return Math.floor((stat - 10) / 2);
}

export function statToModStr(stat: number) {
  const mod = Math.floor((stat - 10) / 2);
  if (mod >= 0) {
    return `+${mod}`;
  } else {
    return `${mod}`;
  }
}
