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
 
/**
 * Get todo by there id
 * @async
 * @param id 
 */
export const getTodoById = async (id: number): Promise<Todo> => {
  const response = await api.get("/todo/" + id, {
    headers: {
      "content-type": "application/json;charset=UTF-8",
    },
  })

  return response.data
}

/**
 * Update a todo by id 
 * @param id 
 * @param updatedTodo 
 */
export const updateTodo = async (id: number, updatedTodo: NewTodo): Promise<ResponseCode> => {
  const response = await api.put("/todo/" + id, JSON.stringify(updatedTodo), {
    headers: {
      "content-type": "application/json;charset=UTF-8",
    },
  })

  return response.status
}