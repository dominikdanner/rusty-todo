import type { NewTodo, ResponseCode } from './types'

const BASE_URL = "http://localhost:8080";

export const getTodo = async(limit: number) => {
  try {
    let response = await fetch(BASE_URL + "/todo/?limit=" + limit)
    return await response.json();
  } catch (error) {
    console.log(error)
  }
}
export const postTodo = async (todo: NewTodo): Promise<ResponseCode> => {
  let response = await fetch(BASE_URL + "/todo/", {
    method: "POST",
    body: JSON.stringify(todo),
    headers: {
      'content-type': 'application/json;charset=UTF-8',
    }
  })

  return response.status;
}