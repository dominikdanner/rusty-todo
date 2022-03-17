import type { NewTodo, ResponseCode, Todo } from "./types"
import axios from "axios"

const api = axios.create({
  baseURL: "http://localhost:8080",
})

/**
 * Get todos
 * @async 
 * @param limit The max amout of todos to fetch
 */
export const getTodo = async (limit: number): Promise<Todo[]> => {
  const response = await api.get("/todo/?limit=" + limit)
  return response.data
}

/**
 * Insert new todo
 * @async
 * @param todo New Todo Item to insert
 */
export const postTodo = async (todo: NewTodo): Promise<ResponseCode> => {
  return await api.post("/todo/", JSON.stringify(todo), {
    headers: {
      "content-type": "application/json;charset=UTF-8",
    },
  })
}

/**
 * Delete a todo by id
 * @async
 * @param id  ID of the item to delete
 */
export const deleteTodo = async (id: number): Promise<ResponseCode> => {
  const response = await api.delete("/todo/?id=" + id)
  return response.status
}
