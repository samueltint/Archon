import fs from "fs";
import path from "path";

const filePath = path.resolve("./src/util/bestiaryShort.json");

// Fields to remove from each entry
const fieldsToRemove: string[] = [
  "page",
  "environment",
  "traitTags",
  "senseTags",
  "actionTags",
  "languageTags",
  "damageTags",
  "miscTags",
  "spellcastingTags",
  "attachedItems",
  "damageTagsSpell",
  "savingThrowForced",
  "hasToken",
  "conditionInflict",
  "conditionInflictSpell",
  "savingThrowForcedSpell",
  "legendaryGroup",
  "referenceSources",
  "isNamedCreature",
  "isNpc",
  "pbNote",
  "summonedBySpell",
  "summonedBySpellLevel",
  "trait",
  "action",
  "spellcasting",
  "_mod",
  "hasFluffImages",
  "_versions",
  "foundryTokenScale",
  "bonus",
  "reaction",
  "legendary",

];

const data = JSON.parse(fs.readFileSync(filePath, "utf8"));

const updated = data.map((entry) => {
  const cleaned = { ...entry };
  for (const field of fieldsToRemove) {
    delete cleaned[field];
  }
  return cleaned;
});

fs.writeFileSync(filePath, JSON.stringify(updated, null, 2), "utf8");

console.log(
  `Removed fields [${fieldsToRemove.join(", ")}] from ${updated.length} entries`,
);
