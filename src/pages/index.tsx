import { Patient } from "@prisma/client"
import Link from "next/link"
import { useState } from "react"
import { DeleteDialog } from "../components/Dialog"
import { TrashIcon } from "../components/Icon"
import Loading from "../components/Loading"
import { useAuthenticatedUser } from "../hooks/useUser"
import { trpc } from "../utils/trpc"

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

export default function Dashboard() {
  const { data: patients, isLoading: isLoadingPatients } =
    trpc.patients.getAll.useQuery()

  const trpcContext = trpc.useContext()
  const { mutate } = trpc.patients.deleteOne.useMutation({
    onMutate: async (input) => {
      await trpcContext.patients.getAll.cancel()
      const prevPatients = trpcContext.patients.getAll.getData()

      if (!prevPatients) return {}

      const newPatients = prevPatients.filter((patient) => {
        return patient.id !== input.id
      })

      trpcContext.patients.getAll.setData(undefined, newPatients)
      return { prevPatients }
    },
    onError: async (err, input, context) => {
      if (context?.prevPatients)
        trpcContext.patients.getAll.setData(undefined, context.prevPatients)
    },
    onSettled: async () => {
      trpcContext.patients.getAll.invalidate()
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

  if (isLoadingPatients)
    return (
      <main className="max-w-6xl mx-auto px-6 pt-12">
        <h2 className="font-bold text-2xl mb-6">Patient Records</h2>
        <div>
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

  if (!patients)
    return (
      <main className="max-w-6xl mx-auto px-6 pt-12">
        <h2 className="font-bold text-2xl mb-6">Patient Records</h2>
        <div>
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
          <div>Failed to retrieve patients</div>
        </div>
      </main>
    )

  return (
    <main className="max-w-6xl mx-auto px-6 pt-12">
      <h2 className="font-bold text-2xl mb-6">Patient Records</h2>
      <div>
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
      </div>
    </main>
  )
}
