import { BaseResponse } from "@/types/BaseResponse";
import api from "./axios";
import { InputModel } from "@/types/InputModel";
export type ModuleModel = [string, string];
const baseDbName = "orion";
export const getModules = async (
  phone: string,
  dbName: string
): Promise<ModuleModel[]> => {
  try {
    const input = new InputModel(baseDbName, "spLoad_Ph_PermittedModules");
    input.addParam("@phone", "nvarchar", 50, phone);
    input.addParam("@db_name", "nvarchar", 50, dbName);
    const res = await api.post<BaseResponse<ModuleModel[]>>(
      "action/exec_proc",
      input
    );
    if (res.data.is_succeeded && res.data.result) {
      return res.data.result;
    }
    return [];
  } catch (error: unknown) {
    console.log(error);
    return [];
  }
};
