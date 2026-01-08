import { BaseResponse } from "@/types/BaseResponse";
import api from "./axios";
import { InputModel } from "@/types/InputModel";
import { CountingModel } from "@/types/CountingModel";
import { ProductModel } from "@/types/ProductModel";
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

export const getProducts = async (
  dbName: string,
  id: string
): Promise<ProductModel[]> => {
  try {
    const input = new InputModel(dbName, "spLoad_CntApp_OneToollogoList");

    input.addParam("@full_id", "nvarchar", 50, id);

    const res = await api.post<BaseResponse<ProductModel[]>>(
      "action/exec_proc",
      input
    );

    if (res.data.is_succeeded && res.data.result) {
      return res.data.result;
    }
    return [];
  } catch (error) {
    console.log(error);
    return [];
  }
};

export const getBarcodeList = async (dbName: string, id: string) => {
  try {
    const input = new InputModel(
      dbName,
      "spLoad_CntApp_OneToollogoBarcodeList"
    );

    input.addParam("@full_id", "nvarchar", 50, id);

    const res = await api.post<BaseResponse<any>>("action/exec_proc", input);

    if (res.data.is_succeeded && res.data.result) {
      return res.data.result;
    }
    return [];
  } catch (error) {
    console.log(error);
    return [];
  }
};

export const getProductList = async (dbName: string, id: string) => {
  try {
    const input = new InputModel(dbName, "spLoad_CntApp_ProductList");

    input.addParam("@full_id", "nvarchar", 50, id);

    const res = await api.post<BaseResponse<any>>("action/exec_proc", input);

    if (res.data.is_succeeded && res.data.result) {
      return res.data.result;
    }
    return [];
  } catch (error) {
    console.log(error);
    return [];
  }
};

// export const saveProductQuantity = async (
//   dbName: string,
//   product: ProductModel
// ) => {
//   try {
//     const input = new InputModel(dbName, "spPh_SaveCountingLine");

//     input.addParam("@full_id", "nvarchar", 50, id);
//     input.addParam("@group_num", "nvarchar", 200, id);
//     input.addParam("@bar_code", "nvarchar", 200, id);
//     input.addParam("@qty", "decimal", 0, id);
//     input.addParam("@user_id", "int", 0, id);
//     input.addParam("@series_number", "nvarchar", 50, id);
//     input.addParam("@cost", "decimal", 0, id);
//     input.addParam("@line_id", "int", 0, id);

//     const res = await api.post<BaseResponse<any>>("action/exec_proc", input);

//     if (res.data.is_succeeded && res.data.result) {
//       return res.data.result;
//     }
//     return [];
//   } catch (error) {
//     console.log(error);
//     return [];
//   }
// };
