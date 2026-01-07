import { BaseResponse } from "@/types/BaseResponse";
import api from "./axios";
import { InputModel } from "@/types/InputModel";
import { CountingModel } from "@/types/CountingModel";
export type ModuleModel = [string, string];
const orionDbName = "orion";

export const getModules = async (
  phone: string,
  dbName: string
): Promise<ModuleModel[]> => {
  try {
    const input = new InputModel(orionDbName, "spLoad_Ph_PermittedModules");
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

export const getCountingList = async (
  dbName: string,
  startDate: string,
  endDate: string
): Promise<CountingModel[]> => {
  try {
    const input = new InputModel(dbName, "spLoad_CntApp_CountingList");

    input.addParam("@date_start", "datetime", 0, startDate);
    input.addParam("@date_end", "datetime", 0, endDate);

    const res = await api.post<BaseResponse<CountingModel[]>>(
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
