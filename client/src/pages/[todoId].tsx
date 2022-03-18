import { NextPage } from 'next'
import { useRouter } from 'next/router'
import { useState } from 'react'
import { useMutation, useQuery, useQueryClient } from 'react-query'
import { NewTodo, Todo } from '../api/types'
import { getTodoById, updateTodo } from '../api/wrapper'
import { Box, Container } from '../components/lib'

/**
 * Page for showing details of the todo item 
 */
const Todo: NextPage = () => {
  const router = useRouter()
  const queryClient = useQueryClient()

  const [title, setTitle] = useState<String>("");
  const [description, setDescription] = useState<String>("");
  const [errorMessage, setErrorMessage] = useState<String>("");

  const { todoId } = router.query
  // Fetching the Todo item by its `id`
  const { data: current_todo } = useQuery(["todo", todoId], () => getTodoById(Number(todoId)), {

    onSuccess: (todo: Todo) => {

      // Set value of inputs to fetched data
      setTitle(todo.title)
      setDescription(todo.description)
    }

  })

  // Create mutation for current todo item 
  const todo = useMutation(["todo", todoId], (updatedTodo: NewTodo) => updateTodo(Number(todoId), updatedTodo), {

    // Update chache
    onSuccess: () => {

      // Invalidate all Todos (force refetch)
      queryClient.invalidateQueries("todos") 
      router.push("/")
    }
  })

  return (
    <Container className="flex justify-center items-center">

      <Box className="w-[500px] h-[400px]">

        {/* Box Header */}
        <div className="flex flex-col justify-end h-20 mx-5 pb-2 pt-4 border-b border-gray-500">

          <h1 className="text-xl text-gray-700">Edit your Todo</h1>
          <p className="text-gray-500 text-sm">Here you can edit your todo</p>

        </div>

        {/* Input Form */}
        <form onSubmit={(e) => {
          e.preventDefault()

          // Check if the input is empty
          if (title == "" || description == "")
            return setErrorMessage("Please fill out all fields")

          // Check if is the same on client and server 
          if (title == current_todo?.title && description == current_todo?.description)
            return setErrorMessage("No changes detected")

          todo.mutate({
            title,
            description,
            done: false
          })
          
        }} className="flex flex-col h-full gap-3 m-5">

        {/* Title Input */}
          <div>

            <p className="text-gray-600">Title:</p>
            <input
              onChange={(e) => setTitle(e.target.value)}
              value={title as string}
              className="w-full rounded-md h-8 bg-gray-50 pl-2"
            />

          </div>

        {/* Description Input */}
          <div>

            <p className="text-gray-600">Description:</p>
            <textarea
              onChange={(e) => setDescription(e.target.value)}
              value={description as string}
              className="rounded-md max-h-24 bg-gray-50 pl-2 w-full"
            />

          </div>

        {/* Out puts Error when set */}
          {errorMessage ? <p className="text-red-400">{errorMessage}</p> : null}

          {/* Button Container */}
          <div className="flex justify-between h-full items-end">

             {/* Submit Button */}
            <input
              type="submit"
              className="cursor-pointer w-32 h-10 bg-blue-300 text-gray-100 rounded-md hover:bg-blue-400 transition-all" 
            />

            {/* Cancel Button */}
            <button
              type="button"
              className="w-32 h-10 bg-red-300 text-gray-100 rounded-md hover:bg-red-400 transition-all" 
              onClick={() => router.push("/")}
            >
              Cancel
            </button>

          </div>

        </form>

      </Box>

    </Container>
  )

}

export default Todo 