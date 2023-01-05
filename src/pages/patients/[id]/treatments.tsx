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
} from "../../../models/treatment"
import { api } from "../../../utils/api"
import { v4 as uuid } from "uuid"

type PartialTreatment = {
  patientId: string
  service: string
  serviceDate: string
  procedure: string
}

type Treatment = {
  id: string
} & PartialTreatment

type TreatmentEntryProps = {
  treatment: Treatment
  deleteFn: () => void
  viewFn: () => void
}

function TreatmentEntry({ treatment, deleteFn, viewFn }: TreatmentEntryProps) {
  const [isDeleteDialogVisible, setDeleteDialogVisible] = useState(false)
  function formattedDate(dateStr: string) {
    const date = new Date(dateStr)
    const formattedDateAndYear = `${date.getDate()}, ${date.getFullYear()}`

    switch (date.getMonth()) {
      case 0:
        return `January ${formattedDateAndYear}`
      case 1:
        return `February ${formattedDateAndYear}`
      case 2:
        return `March ${formattedDateAndYear}`
      case 3:
        return `April ${formattedDateAndYear}`
      case 4:
        return `May ${formattedDateAndYear}`
      case 5:
        return `June ${formattedDateAndYear}`
      case 6:
        return `July ${formattedDateAndYear}`
      case 7:
        return `August ${formattedDateAndYear}`
      case 8:
        return `September ${formattedDateAndYear}`
      case 9:
        return `October ${formattedDateAndYear}`
      case 10:
        return `November ${formattedDateAndYear}`
      case 11:
        return `December ${formattedDateAndYear}`
      default:
        return "Invalid date"
    }
  }

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
  register: UseFormRegister<{
    patientId: string
    service: string
    serviceDate: string
    procedure: string
  }>
  handleSubmit: UseFormHandleSubmit<{
    patientId: string
    service: string
    serviceDate: string
    procedure: string
  }>
  patientId: string | undefined
  errors: Partial<
    FieldErrorsImpl<{
      patientId: string
      service: string
      serviceDate: string
      procedure: string
    }>
  >
  deleteTreatmentFn: (id: string) => void
  viewTreatmentFn: (id: string) => void
  createTreatmentFn: (formData: PartialTreatment) => void
  treatments: Treatment[] | undefined
  isLoadingTreatments: boolean
}

function TreatmentsTable({
  register,
  handleSubmit,
  patientId,
  errors,
  deleteTreatmentFn,
  viewTreatmentFn,
  createTreatmentFn,
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
            treatment={{
              ...treatment,
            }}
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
}

function SelectedTreatmentProcedure({
  selectedTreatmentId,
  treatments,
}: SelectedTreatmentProcedureProps) {
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
    <div className="border border-teal-400/40 px-4 py-2">
      {selectedTreatmentId && (
        <div>
          {treatments
            .filter((treatment) => treatment.id === selectedTreatmentId)
            .map((treatment) => (
              <div key={treatment.id}>{treatment.procedure}</div>
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
          register={register}
          patientId={patientId}
          errors={errors}
          deleteTreatmentFn={(id) => {
            deleteTreatment({ id })
          }}
          viewTreatmentFn={(id) => {
            setSelectedTreatmentId(id)
          }}
          createTreatmentFn={(formData) => {
            createTreatment(formData)
          }}
          handleSubmit={handleSubmit}
          treatments={treatments}
          isLoadingTreatments={isLoadingTreatments}
        />

        {/* Right column */}
        <SelectedTreatmentProcedure
          selectedTreatmentId={selectedTreatmentId}
          treatments={treatments}
        />
      </div>
    </main>
  )
}
