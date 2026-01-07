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

export const getCountingList = async (dateStart: string, dateEnd: string) => {
  try {
    const input = new InputModel(baseDbName, "spLoad_CntApp_CountingList");

    input.addParam("@date_start", "datetime", 0, dateStart);
    input.addParam("@date_end", "datetime", 0, dateEnd);

    const res = await api.post<BaseResponse<ModuleModel[]>>(
      "action/exec_proc",
      input
    );
    console.log(res);

    if (res.data.is_succeeded && res.data.result) {
      return res.data.result;
    }
    return [];
  } catch (error) {
    console.log(error);
    return [];
  }
};
