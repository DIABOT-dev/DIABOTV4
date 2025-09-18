import { handleGet } from "@/interfaces/api/chart/get";
export async function GET(req: Request, ctx: { params: { metric: string }}) {
  return handleGet(req, ctx.params.metric);
}
