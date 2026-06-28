import fs from "fs";
import path from "path";

const filePath = path.resolve("./src/util/bestiaryTiny.json");

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
  "summonedByClass",
  "hasFluff",
  "soundclip",
  "treasure",
  "skill",
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
  "immune",
  "conditionImmune",
  "resist",
  "passive",
  "languages",
  "vulnerable",
  "alignment",
  "srd52",
  "senses",
];

const data = JSON.parse(fs.readFileSync(filePath, "utf8"));
const filtered = data.filter((entry: Record<string, unknown>) => !("reprintedAs" in entry));

const updated = filtered.map((entry) => {
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
