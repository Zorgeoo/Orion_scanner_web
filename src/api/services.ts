import { BaseResponse } from "@/types/BaseResponse";
import api from "./axios";
import { InputModel } from "@/types/InputModel";
import { CountingModel } from "@/types/CountingModel";
import { FullProductModel } from "@/types/FullProductModel";
import { BarcodeProductModel } from "@/types/BarcodeProductModel";
import { ProductModel } from "@/types/ProductModel";
import { ModuleModel } from "@/types/ModuleModel";
import { SerialModel } from "@/types/SerialModel";

export type ModuleTuple = [string, string];
type BarcodeProductTuple = [string, string, string, number];
type ProductTuple = [string, string, string, string, number, number];
type SerialTuple = [
  string,
  number,
  string | Record<string, unknown>,
  string,
  number,
  string | Record<string, unknown>
];

type FullProductTuple = [
  number,
  string,
  string,
  string,
  string,
  string,
  number,
  string,
  number,
  string | Record<string, unknown>,
  string | Record<string, unknown>,
  number,
  string
];

type CountingTuple = [
  string, // 0 - id
  string, // 1 - name + date + location
  string, // 2 - status text
  string, // 3 - status code
  number, // 4 - total amount
  boolean, // 5 - canEdit
  boolean, // 6 - canDelete
  boolean // 7 - canView
];

const orionDbName = "orion";

export const getModules = async (
  phone: string,
  dbName: string
): Promise<ModuleModel[]> => {
  try {
    const input = new InputModel(orionDbName, "spLoad_Ph_PermittedModules");
    input.addParam("@phone", "nvarchar", 50, phone);
    input.addParam("@db_name", "nvarchar", 50, dbName);
    const res = await api.post<BaseResponse<ModuleTuple[]>>(
      "action/exec_proc",
      input
    );
    if (res.data.is_succeeded && res.data.result) {
      const modules: ModuleModel[] = res.data.result.map(([code, name]) => ({
        code,
        name,
      }));
      return modules;
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

    const res = await api.post<BaseResponse<CountingTuple[]>>(
      "action/exec_proc",
      input
    );

    if (res.data.is_succeeded && res.data.result) {
      const countings: CountingModel[] = res.data.result.map(
        ([
          id,
          name,
          statusText,
          statusCode,
          totalAmount,
          IsBySeriesNumber,
          isEnabledPhoneApp,
          isShowUldApp,
        ]) => ({
          id,
          name,
          statusText,
          statusCode,
          totalAmount,
          IsBySeriesNumber,
          isEnabledPhoneApp,
          isShowUldApp,
        })
      );
      return countings;
    }
    return [];
  } catch (error) {
    console.log(error);
    return [];
  }
};
// Тооллогын жагсаалтанд байгаа бараанууд авах
export const getProducts = async (
  dbName: string,
  id: string
): Promise<{ products: FullProductModel[]; isSuccess: boolean }> => {
  try {
    const input = new InputModel(dbName, "spLoad_CntApp_OneToollogoList");

    input.addParam("@full_id", "nvarchar", 50, id);

    const res = await api.post<BaseResponse<FullProductTuple[]>>(
      "action/exec_proc",
      input
    );

    if (res.data.is_succeeded && res.data.result) {
      const products: FullProductModel[] = res.data.result.map(
        ([
          lineId,
          barcodeAndName,
          qtyAndPrice,
          groupNum,
          name,
          barcode,
          quantity,
          serial,
          costPrice,
          expiryISO,
          expiryDisplay,
          sellingPrice,
          createdBy,
        ]) => ({
          lineId,
          barcodeAndName,
          qtyAndPrice,
          groupNum,
          name,
          barcode,
          quantity,
          serial,
          costPrice,
          expiryISO,
          expiryDisplay,
          sellingPrice,
          createdBy,
        })
      );
      return { products: products, isSuccess: true };
    }
    return { products: [], isSuccess: false };
  } catch (error) {
    console.log(error);
    return { products: [], isSuccess: false };
  }
};

// Барааны баркод авах
export const getBarcodeList = async (
  dbName: string,
  id: string
): Promise<BarcodeProductModel[]> => {
  try {
    const input = new InputModel(
      dbName,
      "spLoad_CntApp_OneToollogoBarcodeList"
    );

    input.addParam("@full_id", "nvarchar", 50, id);

    const res = await api.post<BaseResponse<BarcodeProductTuple[]>>(
      "action/exec_proc",
      input
    );

    if (res.data.is_succeeded && res.data.result) {
      const products: BarcodeProductModel[] = res.data.result.map(
        ([groupNum, barcode, name, price]) => ({
          groupNum,
          barcode,
          name,
          price,
        })
      );

      return products;
    }
    return [];
  } catch (error) {
    console.log(error);
    return [];
  }
};
// Барааны жагсаалт авах асуух ??????
export const getProductList = async (
  dbName: string,
  id: string
): Promise<{ products: ProductModel[]; success: boolean }> => {
  try {
    const input = new InputModel(dbName, "spLoad_CntApp_ProductList");

    input.addParam("@full_id", "nvarchar", 50, id);

    const res = await api.post<BaseResponse<ProductTuple[]>>(
      "action/exec_proc",
      input
    );

    if (res.data.is_succeeded && res.data.result) {
      const products: ProductModel[] = res.data.result.map(
        ([barcode, groupNum, name, category, price, quantity]) => ({
          barcode,
          groupNum,
          name,
          category,
          price,
          quantity,
        })
      );
      return { products: products, success: true };
    }
    return { products: [], success: false };
  } catch (error) {
    console.log(error);
    return { products: [], success: false };
  }
};

export const saveProductQuantity = async (
  dbName: string,
  product: FullProductModel,
  newQty: number,
  userId: string,
  countingId: string
): Promise<boolean> => {
  try {
    const input = new InputModel(dbName, "spPh_SaveCountingLine");

    input.addParam("@full_id", "nvarchar", 50, countingId);
    input.addParam("@group_num", "nvarchar", 200, product.groupNum);
    input.addParam("@bar_code", "nvarchar", 200, product.barcode);
    input.addParam("@qty", "decimal", 0, newQty);
    input.addParam("@user_id", "int", 0, Number(userId));
    input.addParam("@series_number", "nvarchar", 50, product.serial);
    input.addParam("@cost", "decimal", 0, product.costPrice);
    input.addParam("@line_id", "int", 0, product.lineId);

    const res = await api.post<BaseResponse<any>>("action/exec_proc", input);

    if (res.data.is_succeeded && res.data.result) {
      return true;
    }
    return false;
  } catch (error) {
    console.log(error);
    return false;
  }
};

export const getSeriesList = async (
  dbName: string,
  fullId: string,
  groupNum: string
): Promise<{ serials: SerialModel[]; isSuccess: boolean }> => {
  try {
    const input = new InputModel(dbName, "spLoad_CntApp_Series");

    input.addParam("@full_id", "nvarchar", 50, fullId);
    input.addParam("@group_num", "nvarchar", 200, groupNum);

    const res = await api.post<BaseResponse<SerialTuple[]>>(
      "action/exec_proc",
      input
    );

    if (res.data.is_succeeded && res.data.result) {
      const serials: SerialModel[] = res.data.result.map(
        ([seriesNumber, cost, endDate, fullSeriesNumber, qty, something]) => ({
          seriesNumber,
          cost,
          endDate,
          fullSeriesNumber,
          qty,
          something,
        })
      );
      return { serials: serials, isSuccess: true };
    }
    return { serials: [], isSuccess: false };
  } catch (error) {
    console.log(error);
    return { serials: [], isSuccess: false };
  }
};

export const getBarcodeByGroupNum = async (
  dbName: string,
  groupNum: string
): Promise<string> => {
  try {
    const input = new InputModel(dbName, "spPh_GetBarcodeByGroupnum");

    input.addParam("@group_num", "nvarchar", 200, groupNum);

    const res = await api.post<BaseResponse<any[]>>("action/exec_proc", input);

    if (res.data.is_succeeded && res.data.result) {
      return res.data.result[0][0];
    }
    return "";
  } catch (error) {
    console.log(error);
    return "";
  }
};

export const formatDate = (dateString: string) => {
  const date = new Date(dateString);
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0"); // months are 0-indexed
  const day = String(date.getDate()).padStart(2, "0");

  return `${year}-${month}-${day}`;
};

export const createNewSeries = async (
  dbName: string,
  groupNum: string,
  seriesNumber: string,
  cost: string,
  endDate: string
): Promise<boolean> => {
  try {
    const decimalCost = parseFloat(cost || "0");
    const input = new InputModel(dbName, "spPh_AddSeries");

    input.addParam("@group_num", "nvarchar", 200, groupNum);
    input.addParam("@series_number", "nvarchar", 50, seriesNumber);
    input.addParam("@price_avsan", "decimal", 0, decimalCost);
    input.addParam("@date_end", "datetime", 0, formatDate(endDate));

    const res = await api.post<BaseResponse<any[]>>("action/exec_proc", input);

    if (res.data.is_succeeded && res.data.result) {
      return true;
    }
    return false;
  } catch (error) {
    console.log(error);
    return false;
  }
};

export const saveBarcode = async (
  dbName: string,
  groupNum: string,
  barcode: string
): Promise<boolean> => {
  try {
    const input = new InputModel(dbName, "spPh_AddBarcode");

    input.addParam("@group_num", "nvarchar", 200, groupNum);
    input.addParam("@bar_code", "nvarchar", 200, barcode);

    const res = await api.post<BaseResponse<any[]>>("action/exec_proc", input);

    if (res.data.is_succeeded) {
      console.log(res);

      return true;
    }
    return false;
  } catch (error) {
    console.log(error);
    return false;
  }
};
