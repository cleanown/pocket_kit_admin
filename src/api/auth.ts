import request from "@/utils/request";

export function login(params: Record<any, any>) {
  return request("POST", "/login", params)
}