import Link from "next/link"
import { useState } from "react"
import { DeleteDialog } from "../components/Dialog"
import { TrashIcon } from "../components/Icon"
import Loading from "../components/Loading"
import { useAuthenticatedUser } from "../hooks/useUser"
import { api } from "../utils/api"

type PatientEntryProps = {
  patient: {
    id: string
    fullName: string
    email: string
  }
  deleteFn: () => void
}

function PatientEntry({ patient, deleteFn }: PatientEntryProps) {
  const [isDeleteDialogVisible, setDeleteDialogVisible] = useState(false)
  return (
    <div className="grid grid-cols-[minmax(0,_8rem)_minmax(0,_12rem)_minmax(0,_1fr)_minmax(0,_10rem)_minmax(0,_10rem)_minmax(0,_6rem)] gap-4 px-4 py-2">
      <div className="overflow-hidden overflow-ellipsis uppercase">
        {patient.id}
      </div>
      <div className="overflow-hidden overflow-ellipsis">
        {patient.fullName}
      </div>
      <div className="overflow-hidden overflow-ellipsis">{patient.email}</div>
      <div className="overflow-hidden overflow-ellipsis">
        <Link href={`/patients/${patient.id}/view`}>View</Link>
      </div>
      <div className="overflow-hidden overflow-ellipsis">
        <Link href={`/patients/${patient.id}/treatments`}>View</Link>
      </div>
      <div className="overflow-hidden overflow-ellipsis">
        <button
          type="button"
          onClick={() => {
            setDeleteDialogVisible(true)
          }}
        >
          <TrashIcon />
        </button>
      </div>
      {isDeleteDialogVisible && (
        <DeleteDialog
          yesFn={deleteFn}
          noFn={() => {
            setDeleteDialogVisible(false)
          }}
        />
      )}
    </div>
  )
}

type SearchBarProps = {
  onSearch: (searchText: string) => void
}

function SearchBar({ onSearch }: SearchBarProps) {
  const [searchTerm, setSearchTerm] = useState("")
  return (
    <form
      onSubmit={(e) => {
        e.preventDefault()
        onSearch(searchTerm)
      }}
      className="grid grid-cols-[1fr_6rem] gap-3 mb-3"
    >
      <input
        type="text"
        value={searchTerm}
        onChange={(e) => {
          setSearchTerm(e.target.value)
        }}
        placeholder=" Type a name ..."
        className="w-full rounded-md px-4 py-2 border border-sky-600 focus:outline-none focus:ring focus:ring-sky-300/40"
      />
      <button
        type="submit"
        className="rounded-md px-4 py-2 bg-teal-400 text-white font-medium hover:bg-teal-300 transition duration-200 focus:outline-none focus:ring focus:ring-teal-300/40 focus:bg-teal-300"
      >
        Search
      </button>
    </form>
  )
}

export default function Dashboard() {
  const [searchFilter, setSearchFilter] = useState("")
  const [pageNumber, setPageNumber] = useState(0)
  const pageSize = 5

  function onSearch(searchTerm: string) {
    setPageNumber(0)
    setSearchFilter(searchTerm)
  }

  const {
    data: patientsInfiniteData,
    isLoading: isLoadingPatients,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage: isFetchingNextPatients,
  } = api.patients.getAll.useInfiniteQuery(
    {
      limit: pageSize,
      searchFilter,
    },
    {
      getNextPageParam: (lastPage) => lastPage.cursor,
    }
  )

  const apiContext = api.useContext()
  const { mutate } = api.patients.deleteOne.useMutation({
    onMutate: async (input) => {
      await apiContext.patients.getAll.cancel()

      const prevPageNumber = pageNumber
      const prevPatientsInfiniteData =
        apiContext.patients.getAll.getInfiniteData({
          limit: pageSize,
          searchFilter,
        })

      if (!prevPatientsInfiniteData) return { prevPageNumber }

      const patientsOnPageAfterMutation = prevPatientsInfiniteData.pages[
        prevPageNumber
      ].patients.filter((patient) => {
        return patient.id !== input.id
      }).length

      if (patientsOnPageAfterMutation === 0)
        setPageNumber((pageNumber) => {
          if (pageNumber > 1) return pageNumber - 1
          return 0
        })

      apiContext.patients.getAll.setInfiniteData(
        {
          limit: pageSize,
          searchFilter,
        },
        (infiniteData) => {
          if (!infiniteData) {
            return {
              pages: [],
              pageParams: [],
            }
          }

          return {
            ...infiniteData,
            pages: infiniteData.pages.map((page) => ({
              ...page,
              patients: page.patients.filter(
                (patient) => patient.id !== input.id
              ),
            })),
          }
        }
      )

      return { prevPageNumber, prevPatientsInfiniteData }
    },
    onError: async (err, input, context) => {
      if (!context) return

      const { prevPatientsInfiniteData, prevPageNumber } = context

      if (!prevPatientsInfiniteData) {
        setPageNumber(0)
        return
      }

      apiContext.patients.getAll.setInfiniteData(
        {
          limit: pageSize,
          searchFilter,
        },
        prevPatientsInfiniteData
      )

      setPageNumber(prevPageNumber)
    },
    onSettled: async () => {
      apiContext.patients.getAll.invalidate()
    },
  })

  function handleDelete(id: string) {
    try {
      mutate({ id })
    } catch (e) {
      console.log("Unknown error occured while deleting patient:", e)
    }
  }

  const { status } = useAuthenticatedUser()
  if (status !== "authenticated") return <Loading />

  if (!patientsInfiniteData)
    return (
      <main className="max-w-6xl mx-auto px-6 pt-12">
        <h2 className="font-bold text-2xl mb-6">Patient Records</h2>
        <div>
          <SearchBar onSearch={onSearch} />
          <div className="grid grid-cols-[minmax(0,_8rem)_minmax(0,_12rem)_minmax(0,_1fr)_minmax(0,_10rem)_minmax(0,_10rem)_minmax(0,_6rem)] gap-4 px-4 py-2 font-semibold bg-teal-400/40">
            <div className="overflow-hidden overflow-ellipsis">Patient ID</div>
            <div className="overflow-hidden overflow-ellipsis">Name</div>
            <div className="overflow-hidden overflow-ellipsis">Email</div>
            <div className="overflow-hidden overflow-ellipsis">
              Medical Chart
            </div>
            <div className="overflow-hidden overflow-ellipsis">
              Dental Treatment
            </div>
            <div className="overflow-hidden overflow-ellipsis"></div>
          </div>
          <div className="text-center py-4">Failed to retrieve patients</div>
        </div>
      </main>
    )

  if (isLoadingPatients || isFetchingNextPatients)
    return (
      <main className="max-w-6xl mx-auto px-6 pt-12">
        <h2 className="font-bold text-2xl mb-6">Patient Records</h2>
        <div>
          <SearchBar onSearch={onSearch} />
          <div className="grid grid-cols-[minmax(0,_8rem)_minmax(0,_12rem)_minmax(0,_1fr)_minmax(0,_10rem)_minmax(0,_10rem)_minmax(0,_6rem)] gap-4 px-4 py-2 font-semibold bg-teal-400/40">
            <div className="overflow-hidden overflow-ellipsis">Patient ID</div>
            <div className="overflow-hidden overflow-ellipsis">Name</div>
            <div className="overflow-hidden overflow-ellipsis">Email</div>
            <div className="overflow-hidden overflow-ellipsis">
              Medical Chart
            </div>
            <div className="overflow-hidden overflow-ellipsis">
              Dental Treatment
            </div>
            <div className="overflow-hidden overflow-ellipsis"></div>
          </div>
          <div className="text-center py-4">Loading ...</div>
        </div>
      </main>
    )

  const { pages } = patientsInfiniteData
  const { patients } = pages[pageNumber]

  const isNotOnLastPage = pageNumber + 1 !== pages.length
  const isOnLastPage = pageNumber + 1 === pages.length

  return (
    <main className="max-w-6xl mx-auto px-6 pt-12">
      <h2 className="font-bold text-2xl mb-6">Patient Records</h2>
      <div>
        <SearchBar onSearch={onSearch} />
        <div className="grid grid-cols-[minmax(0,_8rem)_minmax(0,_12rem)_minmax(0,_1fr)_minmax(0,_10rem)_minmax(0,_10rem)_minmax(0,_6rem)] gap-4 px-4 py-2 font-semibold bg-teal-400/40">
          <div className="overflow-hidden overflow-ellipsis">Patient ID</div>
          <div className="overflow-hidden overflow-ellipsis">Name</div>
          <div className="overflow-hidden overflow-ellipsis">Email</div>
          <div className="overflow-hidden overflow-ellipsis">Medical Chart</div>
          <div className="overflow-hidden overflow-ellipsis">
            Dental Treatment
          </div>
          <div className="overflow-hidden overflow-ellipsis"></div>
        </div>
        {patients.length === 0 ? (
          <div className="text-center px-4 py-4">No patients found</div>
        ) : (
          patients.map((patient) => {
            return (
              <PatientEntry
                key={patient.id}
                patient={{
                  id: patient.id,
                  fullName: patient.fullName,
                  email: patient.email,
                }}
                deleteFn={() => {
                  handleDelete(patient.id)
                }}
              />
            )
          })
        )}
        <div className="flex gap-4 justify-center">
          {pageNumber > 0 && (
            <button
              type="button"
              onClick={() => {
                setPageNumber((pageNumber) => pageNumber - 1)
              }}
              className="font-medium"
            >
              « Previous
            </button>
          )}
          {/* 
              If we are not at the last page cached, or
              if we are on the last page cached, but there is still a next page we can load,
              show this next button.
          */}
          {(isNotOnLastPage || (isOnLastPage && hasNextPage)) && (
            <button
              type="button"
              onClick={() => {
                if (isOnLastPage && hasNextPage) fetchNextPage()
                setPageNumber((pageNumber) => pageNumber + 1)
              }}
              className="font-medium"
            >
              Next »
            </button>
          )}
        </div>
      </div>
    </main>
  )
}
