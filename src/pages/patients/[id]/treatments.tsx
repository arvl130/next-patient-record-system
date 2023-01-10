import { zodResolver } from "@hookform/resolvers/zod"
import Link from "next/link"
import { useRouter } from "next/router"
import { useState } from "react"
import {
  FieldErrorsImpl,
  useForm,
  UseFormHandleSubmit,
  UseFormRegister,
} from "react-hook-form"
import { DeleteDialog } from "../../../components/Dialog"
import { PlusIcon, TrashIcon } from "../../../components/Icon"
import Loading from "../../../components/Loading"
import { useAuthenticatedUser } from "../../../hooks/useUser"
import {
  CreateTreatmentSchema,
  CreateTreatmentType,
  EditTreatmentSchema,
  EditTreatmentType,
} from "../../../models/treatment"
import { api } from "../../../utils/api"
import { v4 as uuid } from "uuid"
import { getMonthFromInt } from "../../../utils/date-int-to-str"
import { Treatment } from "@prisma/client"

type TreatmentEntryProps = {
  treatment: Treatment
  deleteFn: () => void
  viewFn: () => void
}

function formattedDate(dateStr: string) {
  const date = new Date(dateStr)
  return `${getMonthFromInt(
    date.getMonth()
  )} ${date.getDate()}, ${date.getFullYear()}`
}

function TreatmentEntry({ treatment, deleteFn, viewFn }: TreatmentEntryProps) {
  const [isDeleteDialogVisible, setDeleteDialogVisible] = useState(false)

  return (
    <div className="grid grid-cols-[minmax(0,_1fr)_minmax(0,_1fr)_minmax(0,_1fr)_minmax(0,_6rem)] gap-4 px-4 py-2">
      <div>{formattedDate(treatment.serviceDate)}</div>
      <div>{treatment.service}</div>
      <div>
        <button type="button" onClick={viewFn} className="font-medium">
          View
        </button>
      </div>
      <div className="flex items-center">
        <button
          type="button"
          onClick={() => {
            setDeleteDialogVisible(true)
          }}
          className="font-medium"
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

type TreatmentTableProps = {
  patientId: string | undefined
  register: UseFormRegister<CreateTreatmentType>
  handleSubmit: UseFormHandleSubmit<CreateTreatmentType>
  errors: Partial<FieldErrorsImpl<CreateTreatmentType>>
  createTreatmentFn: (formData: CreateTreatmentType) => void
  deleteTreatmentFn: (id: string) => void
  viewTreatmentFn: (id: string) => void
  treatments: Treatment[] | undefined
  isLoadingTreatments: boolean
}

function TreatmentsTable({
  patientId,
  register,
  handleSubmit,
  errors,
  createTreatmentFn,
  deleteTreatmentFn,
  viewTreatmentFn,
  treatments,
  isLoadingTreatments,
}: TreatmentTableProps) {
  if (isLoadingTreatments || !patientId)
    return (
      <div>
        {/* Table header */}
        <div className="grid grid-cols-[minmax(0,_1fr)_minmax(0,_1fr)_minmax(0,_1fr)_minmax(0,_6rem)] gap-4 px-4 py-2 font-semibold bg-teal-400/40">
          <div className="overflow-hidden overflow-ellipsis">Date</div>
          <div className="overflow-hidden overflow-ellipsis">Service</div>
          <div className="overflow-hidden overflow-ellipsis">Procedure</div>
          <div className="overflow-hidden overflow-ellipsis"></div>
        </div>
        {/* Table body */}
        <div>Loading ...</div>
      </div>
    )

  if (!treatments)
    return (
      <div>
        {/* Table header */}
        <div className="grid grid-cols-[minmax(0,_1fr)_minmax(0,_1fr)_minmax(0,_1fr)_minmax(0,_6rem)] gap-4 px-4 py-2 font-semibold bg-teal-400/40">
          <div className="overflow-hidden overflow-ellipsis">Date</div>
          <div className="overflow-hidden overflow-ellipsis">Service</div>
          <div className="overflow-hidden overflow-ellipsis">Procedure</div>
          <div className="overflow-hidden overflow-ellipsis"></div>
        </div>
        {/* Table body */}
        <div>Failed to load treatments for this patient</div>
      </div>
    )

  const sortedTreatments = [...treatments].sort((a, b) => {
    const firstDate = new Date(a.serviceDate).getTime()
    const secondDate = new Date(b.serviceDate).getTime()

    // Don't change order if both dates are equal.
    if (firstDate === secondDate) return 0

    // If first date is newer, put it in front.
    if (firstDate > secondDate) return -1

    // Else, put the first date last.
    return 1
  })

  return (
    <div>
      {/* Table header */}
      <div className="grid grid-cols-[minmax(0,_1fr)_minmax(0,_1fr)_minmax(0,_1fr)_minmax(0,_6rem)] gap-4 px-4 py-2 font-semibold bg-teal-400/40">
        <div className="overflow-hidden overflow-ellipsis">Date</div>
        <div className="overflow-hidden overflow-ellipsis">Service</div>
        <div className="overflow-hidden overflow-ellipsis">Procedure</div>
        <div className="overflow-hidden overflow-ellipsis"></div>
      </div>

      {/* Create table item */}
      <form
        className="grid grid-cols-[minmax(0,_1fr)_minmax(0,_1fr)_minmax(0,_1fr)_minmax(0,_6rem)] gap-x-4 px-4 py-2"
        onSubmit={handleSubmit((formData) => {
          createTreatmentFn(formData)
        })}
      >
        <div className="flex flex-col">
          <input
            type="hidden"
            {...register("patientId")}
            defaultValue={patientId}
          />
          <input
            type="date"
            {...register("serviceDate")}
            className="w-full border border-sky-600 px-4 py-2 rounded focus:outline-none"
          />
        </div>
        <div>
          <input
            type="text"
            {...register("service")}
            className="w-full border border-sky-600 px-4 py-2 rounded focus:outline-none"
          />
        </div>
        <div>
          <input
            type="text"
            {...register("procedure")}
            className="w-full border border-sky-600 px-4 py-2 rounded focus:outline-none"
          />
        </div>
        <div className="flex items-center">
          <button type="submit" className="font-medium">
            <PlusIcon />
          </button>
        </div>
        <div>
          {errors.serviceDate && (
            <span className="text-red-500">{errors.serviceDate.message}</span>
          )}
        </div>
        <div>
          {errors.service && (
            <span className="text-red-500">{errors.service.message}</span>
          )}
        </div>
        <div>
          {errors.procedure && (
            <span className="text-red-500">{errors.procedure.message}</span>
          )}
        </div>
      </form>
      {/* Table body */}
      {treatments.length === 0 ? (
        <div className="text-center px-4 py-4">
          No treatments found for this patient
        </div>
      ) : (
        sortedTreatments.map((treatment) => (
          <TreatmentEntry
            key={treatment.id}
            treatment={treatment}
            deleteFn={() => {
              deleteTreatmentFn(treatment.id)
            }}
            viewFn={() => {
              viewTreatmentFn(treatment.id)
            }}
          />
        ))
      )}
    </div>
  )
}

type SelectedTreatmentProcedureProps = {
  selectedTreatmentId: string | null
  treatments: Treatment[] | undefined
  editFn: (treatment: EditTreatmentType) => void
}

function SelectedTreatmentProcedure({
  selectedTreatmentId,
  treatments,
  editFn,
}: SelectedTreatmentProcedureProps) {
  const [isEditingMode, setEditingMode] = useState(false)
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<EditTreatmentType>({
    resolver: zodResolver(EditTreatmentSchema),
  })

  if (!selectedTreatmentId || !treatments)
    return (
      <div className="border border-teal-400/40 px-4 py-2 flex justify-center items-center">
        No selected treatment
      </div>
    )

  const selectedTreatment = treatments.find(
    (treatment) => treatment.id === selectedTreatmentId
  )

  if (!selectedTreatment)
    return (
      <div className="border border-teal-400/40 px-4 py-2 flex justify-center items-center">
        No selected treatment
      </div>
    )

  return (
    <div>
      {selectedTreatmentId && (
        <div>
          {treatments
            .filter((treatment) => treatment.id === selectedTreatmentId)
            .map((treatment) => (
              <>
                {isEditingMode ? (
                  <form
                    key={treatment.id}
                    onSubmit={handleSubmit((formData) => {
                      editFn(formData)
                      setEditingMode(false)
                    })}
                  >
                    <input
                      type="hidden"
                      {...register("id")}
                      defaultValue={treatment.id}
                    />
                    <div className="mb-3">
                      <textarea
                        className="border border-teal-400/40 px-4 py-2 h-24 w-full resize-none focus:outline-none focus:ring focus:ring-teal-400/30 focus:border-teal-500"
                        {...register("procedure")}
                        defaultValue={treatment.procedure}
                      ></textarea>
                      {errors.procedure && (
                        <span className="text-red-500">
                          {errors.procedure.message}
                        </span>
                      )}
                    </div>
                    <div className="grid mb-3">
                      <label className="mb-1 font-medium">Date:</label>
                      <input
                        type="date"
                        className="w-full border border-teal-500 px-4 py-2 rounded focus:outline-none focus:ring focus:ring-teal-400/30"
                        {...register("serviceDate")}
                        defaultValue={treatment.serviceDate}
                      />
                      {errors.serviceDate && (
                        <span className="text-red-500">
                          {errors.serviceDate.message}
                        </span>
                      )}
                    </div>
                    <div className="mb-3">
                      <label className="mb-1 font-medium">Service:</label>
                      <input
                        type="text"
                        className="w-full border border-teal-500 px-4 py-2 rounded focus:outline-none focus:ring focus:ring-teal-400/30"
                        {...register("service")}
                        defaultValue={treatment.service}
                      />
                      {errors.service && (
                        <span className="text-red-500">
                          {errors.service.message}
                        </span>
                      )}
                    </div>
                    <div className="flex justify-end">
                      <div className="flex gap-4">
                        <button
                          type="button"
                          className="border border-teal-500 text-sky-600 px-5 py-1 rounded-full hover:bg-teal-400 hover:border-teal-400 hover:text-white transition duration-200 focus:outline-none focus:ring focus:ring-teal-400/30"
                          onClick={() => {
                            setEditingMode(false)
                          }}
                        >
                          Cancel
                        </button>
                        <button
                          type="submit"
                          className="border border-teal-500 bg-teal-500 hover:bg-teal-400 hover:border-teal-400 transition duration-200 text-white px-5 py-1 rounded-full focus:outline-none focus:ring focus:ring-teal-400/30"
                        >
                          Save
                        </button>
                      </div>
                    </div>
                  </form>
                ) : (
                  <div key={treatment.id}>
                    <div className="border border-teal-400/40 px-4 py-2 h-24 mb-3">
                      {treatment.procedure}
                    </div>
                    <div className="mb-3">
                      <span className="font-medium">Date:</span>{" "}
                      {formattedDate(treatment.serviceDate)}
                    </div>
                    <div className="mb-3">
                      <span className="font-medium">Service:</span>{" "}
                      {treatment.service}
                    </div>
                    <div className="flex justify-end">
                      <button
                        type="button"
                        className="border border-teal-500 text-sky-600 px-5 py-1 rounded-full hover:bg-teal-400 hover:border-teal-400 hover:text-white transition duration-200 focus:outline-none focus:ring focus:ring-teal-400/30"
                        onClick={() => {
                          setEditingMode(true)
                        }}
                      >
                        Edit
                      </button>
                    </div>
                  </div>
                )}
              </>
            ))}
        </div>
      )}
    </div>
  )
}

export default function TreatmentsPage() {
  const {
    isReady,
    query: { id: idFromRouter },
  } = useRouter()
  const patientId = idFromRouter as string | undefined

  const { data: treatments, isLoading: isLoadingTreatments } =
    api.patients.treatments.getAll.useQuery(
      {
        patientId: patientId as string,
      },
      {
        enabled: isReady,
      }
    )

  const [selectedTreatmentId, setSelectedTreatmentId] = useState<string | null>(
    null
  )

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<CreateTreatmentType>({
    resolver: zodResolver(CreateTreatmentSchema),
  })

  const apiContext = api.useContext()

  const { mutate: createTreatment } =
    api.patients.treatments.createOne.useMutation({
      onMutate: async (input) => {
        await apiContext.patients.treatments.getAll.invalidate()
        const prevTreatments = apiContext.patients.treatments.getAll.getData()

        if (!prevTreatments) return {}

        const newTreatments = [
          ...prevTreatments,
          { ...input, id: uuid() },
          // We use a fake ID here, since the real ID is
          // generated on the backend.
        ]
        apiContext.patients.treatments.getAll.setData(
          {
            patientId: patientId as string,
          },
          newTreatments
        )

        return { prevTreatments }
      },
      onError: (err, input, context) => {
        if (context?.prevTreatments)
          apiContext.patients.treatments.getAll.setData(
            {
              patientId: patientId as string,
            },
            context.prevTreatments
          )
      },
      onSuccess: () => {
        reset()
      },
      onSettled: () => {
        apiContext.patients.treatments.getAll.invalidate()
      },
    })

  const { mutate: deleteTreatment } =
    api.patients.treatments.deleteOne.useMutation({
      onMutate: async (input) => {
        await apiContext.patients.treatments.getAll.invalidate()
        const prevTreatments = apiContext.patients.treatments.getAll.getData()

        if (!prevTreatments) return {}

        const newTreatments = prevTreatments.filter(({ id }) => id !== input.id)
        apiContext.patients.treatments.getAll.setData(
          {
            patientId: patientId as string,
          },
          newTreatments
        )

        return { prevTreatments }
      },
      onError: (err, input, context) => {
        if (context?.prevTreatments)
          apiContext.patients.treatments.getAll.setData(
            {
              patientId: patientId as string,
            },
            context.prevTreatments
          )
      },
      onSettled: () => {
        apiContext.patients.treatments.getAll.invalidate()
      },
    })

  const { mutate: editTreatment } = api.patients.treatments.editOne.useMutation(
    {
      onMutate: async (input) => {
        await apiContext.patients.treatments.getAll.invalidate()
        const prevTreatments = apiContext.patients.treatments.getAll.getData()

        if (!prevTreatments) return {}

        const newTreatments = [
          ...prevTreatments,
          {
            ...input,
            patientId: patientId as string,
          },
        ]
        apiContext.patients.treatments.getAll.setData(
          {
            patientId: patientId as string,
          },
          newTreatments
        )

        return { prevTreatments }
      },
      onError: (err, input, context) => {
        if (context?.prevTreatments)
          apiContext.patients.treatments.getAll.setData(
            {
              patientId: patientId as string,
            },
            context.prevTreatments
          )
      },
      onSuccess: () => {
        reset()
      },
      onSettled: () => {
        apiContext.patients.treatments.getAll.invalidate()
      },
    }
  )

  const { status } = useAuthenticatedUser()
  if (status !== "authenticated") return <Loading />

  return (
    <main className="max-w-6xl mx-auto px-6 pt-12">
      <h2 className="font-bold text-2xl mb-6">
        <Link href="/">Patient Records</Link>
        {patientId && (
          <>
            <span> &rsaquo; </span>
            <Link href={`/patients/${patientId}/treatments`}>
              Dental Treatments
            </Link>
          </>
        )}
      </h2>
      <div className="grid grid-cols-[5fr_3fr] gap-4">
        {/* Left column */}
        <TreatmentsTable
          patientId={patientId}
          register={register}
          handleSubmit={handleSubmit}
          errors={errors}
          createTreatmentFn={(formData) => {
            createTreatment(formData)
          }}
          deleteTreatmentFn={(id) => {
            deleteTreatment({ id })
          }}
          viewTreatmentFn={(id) => {
            setSelectedTreatmentId(id)
          }}
          treatments={treatments}
          isLoadingTreatments={isLoadingTreatments}
        />

        {/* Right column */}
        <SelectedTreatmentProcedure
          selectedTreatmentId={selectedTreatmentId}
          treatments={treatments}
          editFn={(treatment: EditTreatmentType) => {
            editTreatment(treatment)
          }}
        />
      </div>
    </main>
  )
}
