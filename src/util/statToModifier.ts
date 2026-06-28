export default function statToModifier(stat: number) {
  return Math.floor((stat - 10) / 2);
}
