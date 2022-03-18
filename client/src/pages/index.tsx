import type { NextPage } from "next"
import { createContext, Dispatch, FC, Fragment, SetStateAction, useContext, useEffect, useState } from "react"
import { NewTodo, Todo } from "../api/types"
import { deleteTodo, getTodo, postTodo } from "../api/wrapper"
import { Box, Container, PopupForm } from "../components/lib"
import { TrashIcon, XIcon } from "@heroicons/react/outline"
import { useMutation, useQuery, useQueryClient } from "react-query"
import Link from "next/link"

// Stores the state for the Popup
const PopupContext = createContext<[any, Dispatch<SetStateAction<any>>] | null>(null);

interface TodoItemProps {
  todo: Todo
  onError: (error: String) => void
}

/**
 * Todo in the list
 * Delete is implemented as a button
 * @param TodoItemProps
 */
const TodoItem: FC<TodoItemProps> = ({ todo, onError: emitError }) => {
  const queryClient = useQueryClient()
  const { mutate } = useMutation(() => deleteTodo(todo.id), {

    // Returning fetching error
    onError: (error: String) => emitError(error),

    // Invalidate Todo Querys and forces Todo to refetch
    onSuccess: () => {
      queryClient.invalidateQueries("todos")
    }
  })

  return (
      <div className="flex h-fit cursor-pointer justify-between rounded-lg bg-gray-100 shadow-sm transition-all hover:scale-105 hover:bg-gray-50">

        <Link href={"/" + todo.id}>

          <div className="flex w-80 flex-grow flex-col p-3">

            {/* Title of Item */}
            <h1 className="truncate font-medium">{todo.title}</h1>
            {/* Description of Item */}
            <p className="truncate text-sm text-gray-500">{todo.description}</p>

          </div>

        </Link>

        {/* Delete Button */}
        <div
          className="flex h-full w-20 items-center justify-center rounded-tr-lg rounded-br-lg bg-gray-400"
          onClick={() => {
            mutate()
          }}
        >
          <TrashIcon className="h-6" />
        </div>
      </div>
  )
}

interface AddTodoFormData {
  title: String;
  description: String;
}

/**
 * The Popup for creating a new todo
 */
const AddTodoPopup: FC = () => {
  const [isExpanded, setExpanded] = useContext(PopupContext) as any;
  const [formData, setFormData] = useState<AddTodoFormData>({
    title: "",
    description: "",
  })
  const [error, setError] = useState<String | null>("")

  const queryClient = useQueryClient()
  const todos = useMutation((new_todo: NewTodo) => postTodo(new_todo), {

    onSuccess: () => {
      // Invalidate `Todo` Queries
      queryClient.invalidateQueries("todos")

      // Close Popup
      setExpanded(false)
    },
  })

  // Only displayed when `isExpanded` equals `true`
  return (
    <PopupForm isExpanded={isExpanded}>

      <form
        onSubmit={(e) => {

          e.preventDefault()

          // Validate Input
          if (formData.title == "" || formData.description == "") {
            return setError("Please fill out all fields")
          }

          // Make request & insert new Todo 
          todos.mutate({
            title: formData.title,
            description: formData.description,
            done: false,
          })

        }}
        className="flex flex-col gap-5 p-6 pt-0"
      >

        <div className="flex h-20 w-full justify-between">

          <h1 className="flex h-20 w-full items-center p-0 text-2xl text-gray-600">
            Add Todo
          </h1>

          {/* Button to close Popup */}
          <button
            onClick={() => {
              setExpanded(false)

              // Reset Errors
              setError(null)
            }}
            className="flex h-full w-10 items-center justify-center font-semibold text-gray-600"
          >
            <XIcon className="h-6 w-6" />
          </button>

        </div>
        
        {/* `title` input */}
        <input
          type={"text"}
          placeholder="Title"
          className="h-10 rounded-lg p-3 outline-none transition-all duration-200 hover:bg-gray-50 focus:bg-gray-100"
          onChange={(e) => setFormData((prev) => {
            return {
              ...prev,
              title: e.target.value 
            }
          })}
        />

        {/* `description` text input */}
        <input
          type={"text"}
          placeholder="Description"
          className="h-10 rounded-lg p-3 outline-none transition-all duration-200 hover:bg-gray-50 focus:bg-gray-100"
          onChange={(e) => setFormData((prev) => {
            return {
              ...prev,
              description: e.target.value 
            }
          })}
        />

        {/* Display error message */}
        {error ? <p className="text-sm text-red-400">{error}</p> : null}

        {/* Submit Button */}
        <input
          type={"submit"}
          value="Submit"
          className="h-8 cursor-pointer rounded-md bg-blue-200 text-gray-100 transition-all hover:bg-blue-300"
        />

      </form>

    </PopupForm>
  )
}

/**
 * Todo List:
 * Create, Delete and View Todos
 */
const Index: NextPage = () => {
  const popupState = useState<boolean>(false)
  const [,setExpanded] = popupState;
  const [error, setError] = useState<String>();
  const { isLoading, data: todos } = useQuery(
    "todos",
    () => getTodo(5)
  )

  return (
    <PopupContext.Provider value={popupState}>

      <Container className="flex justify-center items-center">

        <AddTodoPopup />

        {/* Box Container */}
        <Box className="h-[550px] w-[500px]">

          {/* Header Container */}
          <div className="flex h-20 w-full justify-between rounded-lg bg-gray-300">

            <div className="ml-5 mr-5 flex h-20 w-full items-center justify-between">

              <h1 className="text-2xl text-gray-700">Todos</h1>

              {/* Add Todo Button */}
              <input
                type="submit"
                value="Add"
                className="w-20 cursor-pointer rounded-md bg-blue-300 p-2 text-gray-100"
                onClick={() => setExpanded(true)}
              />

            </div>

          </div>

          {/* List Container */}
          <ul className="m-5 flex flex-col h-full gap-5">

            {/* Displaying Todo Items */}
            {(() => {

              if (isLoading) return <p className="text-blue-500">Loading</p>

              if (!todos) return <p className="text-blue-500">No Todos</p>

              return (
                <Fragment>
                  {todos.map((item) =>
                      <TodoItem
                        key={item.id}
                        todo={item}
                        onError={(error: String) => setError(error)}
                      />
                  )}
                </Fragment>
              )
                  
            })()}

          </ul>

        </Box>

      </Container>

    </PopupContext.Provider>
  )
}

export default Index
