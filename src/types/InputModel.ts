import { ParamModel } from "./ParamModel";

/*
 interface - only can declare properties and types, cannot hold logic or method
 type - user it for unions ex : type ID = string | number;
 class - can contain properties, methods, and constructor logic.

 Compile time : Interfaces and types do not exist at runtime — they’re only for the compiler. checking syntax 
 Run time : Objects, classes, arrays, functions actually exist in memory while the app is running.
*/

export class InputModel {
  db_name: string;
  query: string;
  sql_params: ParamModel[] = [];

  constructor(db_name: string, query: string) {
    this.db_name = db_name;
    this.query = query;
  }

  addParam(name: string, type: string, length: number, value: string | number) {
    this.sql_params.push({ name, type, length, value });
  }
}
