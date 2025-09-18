// src/modules/meal/domain/validators.ts
import { SaveMealLogDTO } from "./types";

export function validateMealLog(dto: SaveMealLogDTO): true {
  const meals = ["breakfast", "lunch", "dinner", "snack"];
  if (!meals.includes(dto.meal_type)) throw new Error("Invalid meal_type");
  const portions = ["low","medium","high"];
  if (!portions.includes(dto.portion)) throw new Error("Invalid portion");
  if (!dto.ts) throw new Error("ts required");
  const t = new Date(dto.ts);
  if (isNaN(t.getTime())) throw new Error("ts must be ISO string");
  if (t.getTime() > Date.now()) throw new Error("ts cannot be in the future");
  if (dto.text && dto.text.length > 200) throw new Error("text ≤ 200 chars");
  return true;
}
