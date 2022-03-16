import type { NextPage } from "next"
import { FC, Fragment, useEffect, useState } from "react"
import { ResponseCode, Todo } from "../api/types"
import { getTodo, postTodo } from "../api/wrapper"
import { ModalPopup } from "../components/popup"
import { TrashIcon } from "@heroicons/react/solid"

const TodoItem: FC<{ item: Todo }> = ({ item }) => {
  return (
    <div
      className={`m-6 -mb-2 flex cursor-pointer justify-between rounded-lg bg-gray-100 p-3 shadow-sm transition-all hover:scale-105 hover:bg-gray-50`}
    >
      <div className="flex w-80 flex-col">
        <h1 className="font-medium ">{item.title}</h1>
        <p className="truncate text-sm text-gray-500">{item.description}</p>
      </div>
      <div className="flex w-full items-center justify-center">
        <TrashIcon className="h-7" />
      </div>
    </div>
  )
}

const Index: NextPage = () => {
  const [todos, setTodos] = useState<Todo[]>()
  const [isAddPopupExpanded, setAddPopupExpanded] = useState<boolean>(false)
  const [title, setTitle] = useState<String>("")
  const [description, setDescription] = useState<String>("")
  const [error, setError] = useState<String>("")

  useEffect(() => {
    getTodo(100).then((todos: Todo[]) => setTodos(todos))
  }, [])

  return (
    <div className="flex h-screen w-full items-center justify-center bg-gray-50">
      {isAddPopupExpanded ? (
        <ModalPopup>
          <form
            onSubmit={async (e) => {
              e.preventDefault()
              const responseCode: ResponseCode = await postTodo({
                title,
                description,
                done: false,
              })
            }}
            className="flex flex-col gap-5 p-6 pt-0"
          >
            <div className="flex h-20 w-full justify-between">
              <h1 className="flex h-20 w-full items-center p-0 text-2xl text-gray-600">
                Add Todo
              </h1>
              <button
                onClick={() => setAddPopupExpanded(false)}
                className="flex h-full w-10 items-center justify-center font-semibold text-gray-600"
              >
                x
              </button>
            </div>
            <input
              type={"text"}
              placeholder="Title"
              className="h-10 rounded-lg p-3 outline-none transition-all duration-200 hover:bg-gray-50 focus:bg-gray-100"
              onChange={(e) => setTitle(e.target.value)}
            ></input>
            <input
              type={"text"}
              placeholder="Description"
              className="h-10 rounded-lg p-3 outline-none transition-all duration-200 hover:bg-gray-50 focus:bg-gray-100"
              onChange={(e) => setDescription(e.target.value)}
            ></input>
            <input
              type={"submit"}
              className="h-8 cursor-pointer rounded-md bg-blue-200 text-gray-100 transition-all hover:bg-blue-300"
            ></input>
          </form>
        </ModalPopup>
      ) : null}
      <div className="flex h-[600px] w-[500px] flex-col rounded-lg bg-gray-200 shadow-xl">
        <div className="flex h-20 w-full justify-between rounded-lg bg-gray-300">
          <div className="ml-5 mr-5 flex h-20 w-full items-center justify-between">
            <h1 className="text-2xl text-gray-700">Todos</h1>
            <button
              type="submit"
              className="w-20 rounded-md bg-blue-300 p-2 text-gray-100"
              onClick={() => setAddPopupExpanded(true)}
            >
              Add
            </button>
          </div>
        </div>
        <div>
          {todos ? (
            todos.map((item) => <TodoItem item={item} />)
          ) : (
            <p>Loading</p>
          )}
        </div>
      </div>
    </div>
  )
}

export default Index
