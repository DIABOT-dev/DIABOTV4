// src/modules/meal/domain/types.ts
export type MealType = "breakfast" | "lunch" | "dinner" | "snack";
export type Portion = "low" | "medium" | "high";

export type SaveMealLogDTO = {
  meal_type: MealType;
  text?: string;        // món đã chọn hoặc mô tả nhập tay
  portion: Portion;     // map trực tiếp với DB (text/enum)
  ts: string;           // ISO string, <= now
};
