# Moat Extended – DIABOT

## Mục tiêu
Các moat nâng cao, tách riêng, không trùng file với Moat Core.

## Danh sách
1. privacy.ts → enforcePrivacy(), auditLog()
2. trends.ts → analyzeTrends(ctx)
3. habit.ts → checkDailyHabits(), rewardCoins()
4. mealSuggest.ts → suggestMeal(ctx)
5. guardrails_ext.ts → validateExtended(ctx)

## Cách dùng
- Import từng moat vào gateway/route.ts khi cần.
- Không ghi đè Moat Core.
- Có thể bật/tắt bằng feature_flag trong DB sau này.
