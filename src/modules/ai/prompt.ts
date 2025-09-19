import { UserContext } from './context';

export interface PromptTemplate {
  system: string;
  user: string;
}

/**
 * Kiểm tra số đo có nguy hiểm không
 */
function isDangerous(context: UserContext): boolean {
  const { metrics } = context;
  
  // BG nguy hiểm: <70 hoặc >300 mg/dL
  if (metrics.bg_latest) {
    const bg = metrics.bg_latest.value;
    if (bg < 70 || bg > 300) return true;
  }

  // BP nguy hiểm: SYS >180 hoặc DIA >110
  if (metrics.bp_latest) {
    const { systolic, diastolic } = metrics.bp_latest;
    if (systolic > 180 || diastolic > 110) return true;
  }

  return false;
}

/**
 * Template cho coach check-in thường ngày
 */
export function getCoachCheckinTemplate(context: UserContext): PromptTemplate {
  // Kiểm tra safety trước
  if (isDangerous(context)) {
    return getSafetyEscalationTemplate(context);
  }

  return {
    system: `Bạn là trợ lý sức khỏe DIABOT, chuyên hỗ trợ người bệnh tiểu đường.

NGUYÊN TẮC QUAN TRỌNG:
- KHÔNG chẩn đoán bệnh
- KHÔNG kê đơn thuốc  
- KHÔNG thay thế bác sĩ
- CHỈ khuyến khích theo dõi và tư vấn lối sống
- Khi số đo bất thường → khuyên gặp bác sĩ

PHONG CÁCH:
- Thân thiện, động viên
- Ngắn gọn, dễ hiểu
- Tập trung vào hành động cụ thể
- Sử dụng emoji phù hợp

DỮ LIỆU NGƯỜI DÙNG:
${context.summary}`,

    user: `Hãy đưa ra lời khuyên ngắn gọn dựa trên dữ liệu sức khỏe của tôi. Tập trung vào:
1. Nhận xét tích cực về những gì tôi đã làm tốt
2. Gợi ý cải thiện cụ thể cho ngày hôm nay
3. Nhắc nhở theo dõi nếu thiếu dữ liệu

Trả lời trong 2-3 câu, thân thiện và động viên.`
  };
}

/**
 * Template cho nhắc nhở với lý do
 */
export function getReminderReasonTemplate(context: UserContext, reminderType: 'bg' | 'water' | 'weight' | 'bp' | 'insulin'): PromptTemplate {
  const reminderMap = {
    bg: 'đo đường huyết',
    water: 'uống nước',
    weight: 'cân nặng',
    bp: 'đo huyết áp',
    insulin: 'ghi liều insulin'
  };

  return {
    system: `Bạn là trợ lý DIABOT, tạo lời nhắc nhở thân thiện.

NGUYÊN TẮC:
- Giải thích TẠI SAO việc ${reminderMap[reminderType]} quan trọng
- Động viên, không áp lực
- Đưa ra lợi ích cụ thể
- Ngắn gọn, dễ hiểu

DỮ LIỆU NGƯỜI DÙNG:
${context.summary}`,

    user: `Tạo lời nhắc nhở ${reminderMap[reminderType]} với lý do cụ thể dựa trên dữ liệu của tôi. 
Giải thích tại sao việc này quan trọng cho sức khỏe của tôi ngay bây giờ.
Trả lời trong 1-2 câu, thân thiện và có động lực.`
  };
}

/**
 * Template cho tình huống nguy hiểm - chuyển hướng y tế
 */
export function getSafetyEscalationTemplate(context: UserContext): PromptTemplate {
  return {
    system: `Bạn là trợ lý DIABOT trong tình huống khẩn cấp sức khỏe.

NHIỆM VỤ DUY NHẤT:
- Khuyên người dùng liên hệ bác sĩ NGAY LẬP TỨC
- KHÔNG tự đưa ra lời khuyên y tế
- KHÔNG giải thích chi tiết về tình trạng
- Tập trung vào hành động cần làm ngay

DỮ LIỆU NGUY HIỂM PHÁT HIỆN:
${context.summary}`,

    user: `Số đo sức khỏe của tôi có dấu hiệu bất thường. Hãy khuyên tôi nên làm gì ngay bây giờ.
Trả lời ngắn gọn, tập trung vào việc liên hệ y tế, không giải thích chi tiết tình trạng.`
  };
}

/**
 * Router chọn template phù hợp
 */
export function selectPromptTemplate(
  context: UserContext, 
  intent: string,
  reminderType?: 'bg' | 'water' | 'weight' | 'bp' | 'insulin'
): PromptTemplate {
  // Ưu tiên safety check
  if (isDangerous(context)) {
    return getSafetyEscalationTemplate(context);
  }

  // Reminder với lý do
  if (intent === 'reminder' && reminderType) {
    return getReminderReasonTemplate(context, reminderType);
  }

  // Default: coach check-in
  return getCoachCheckinTemplate(context);
}

/**
 * Render prompt với context thay thế
 */
export function renderPrompt(template: PromptTemplate, variables?: Record<string, string>): PromptTemplate {
  if (!variables) return template;

  let system = template.system;
  let user = template.user;

  // Thay thế variables trong template
  Object.entries(variables).forEach(([key, value]) => {
    const placeholder = `{{${key}}}`;
    system = system.replace(new RegExp(placeholder, 'g'), value);
    user = user.replace(new RegExp(placeholder, 'g'), value);
  });

  return { system, user };
}