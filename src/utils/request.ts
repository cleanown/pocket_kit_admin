import axios, { type AxiosRequestConfig, type AxiosResponse, type Method } from "axios";

/**
 * 数据请求状态处理
 * @param res 接口返回真实数据
 * @returns 接口返回数据格式化
 */
function resFiler (res: AxiosResponse): CustomRes {
  if (res.status == 200) {
    return {
      code: 200,
      data: res.data,
    }
  }
  return {
    code: -1,
    data: res,
    message: '服务器异常'
  }
}

const server = axios.create({
  timeout: 60 * 1000
})

server.interceptors.request.use(res => {
  return res
}, (error) => {
  console.log("%cserver.interceptors.request.use-error", "color: #F44336;", error);
  return error
})

server.interceptors.response.use((res) => {
  return res
}, (error) => {
  console.log("%cserver.interceptors.response.use-error", "color: #F44336;", error);
  return error
})

export default function request(method: Method, path: string, data: Record<any, any> = {}, options: AxiosRequestConfig = {}): Promise<CustomRes> {
  return new Promise(async (resolve) => {
    const res = await server({
      method: method,
      url: path,
      params: method === "GET" ? data : {},
      data: method === "GET" ? {} : data,
      ...options
    })
    resolve(resFiler(res))
  })
}