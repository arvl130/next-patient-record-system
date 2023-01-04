type ErrorDialogProps = {
  title: string
  body: string
  okFn: () => void
}

export function ErrorDialog({ title, body, okFn }: ErrorDialogProps) {
  return (
    // Black canvas
    <div className="fixed inset-0 bg-black/40 flex justify-center items-center px-3">
      {/* Actual dialog box */}
      <div className="bg-white px-6 py-4 rounded-lg max-w-md">
        <div className="font-medium text-xl mb-1">{title}</div>
        <div className="mb-4">{body}</div>
        <div className="flex justify-end">
          <button
            autoFocus
            type="button"
            onClick={okFn}
            className="bg-sky-600  text-white hover:bg-sky-500 transition duration-200 px-4 py-1 rounded-md focus:outline-none focus:ring focus:ring-sky-300/40"
          >
            OK
          </button>
        </div>
      </div>
    </div>
  )
}

type DeleteDialogProps = {
  yesFn: () => void
  noFn: () => void
}

export function DeleteDialog({ yesFn, noFn }: DeleteDialogProps) {
  return (
    // Black canvas
    <div className="fixed inset-0 bg-black/40 flex justify-center items-center px-3">
      {/* Actual dialog box */}
      <div className="bg-white px-6 py-4 max-w-[16rem]">
        <div className="mb-3 px-4 py-2 text-center">
          Are you sure you want to delete this?
        </div>
        <div className="flex gap-8 justify-center">
          <button
            type="button"
            onClick={yesFn}
            className="py-1 border border-sky-500 w-20 hover:border-red-500 hover:bg-red-500 transition duration-200 hover:text-white focus:outline-none focus:ring focus:ring-red-300/40 focus:bg-red-500 focus:border-red-500 focus:text-white"
          >
            Yes
          </button>

          <button
            autoFocus
            type="button"
            onClick={noFn}
            className="py-1 border border-sky-500 w-20 hover:bg-sky-600 transition duration-200 hover:text-white focus:outline-none focus:ring focus:ring-sky-300/40 focus:bg-sky-600 focus:text-white"
          >
            No
          </button>
        </div>
      </div>
    </div>
  )
}
