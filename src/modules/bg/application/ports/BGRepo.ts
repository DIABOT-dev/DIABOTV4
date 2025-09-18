import { BGLogDTO } from "../../domain/types";

export interface BGRepo {
  save(dto: BGLogDTO): Promise<{ status: number; id?: string }>;
}
