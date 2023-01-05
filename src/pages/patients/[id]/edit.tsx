import { useRouter } from "next/router"
import { SubmitHandler, useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import Loading from "../../../components/Loading"
import { useAuthenticatedUser } from "../../../hooks/useUser"
import { EditPatientSchema, EditPatientType } from "../../../models/patient"
import { api } from "../../../utils/api"
import Link from "next/link"
import { getYearsSinceDate } from "../../../utils/get-years-since-date"

export default function EditPatient() {
  const { query } = useRouter()
  const patientId = query.id as string
  const { data: patient, isLoading } = api.patients.getOne.useQuery(
    {
      id: patientId,
    },
    {
      enabled: !!patientId,
    }
  )

  function formattedDate(dateStr: string) {
    const date = new Date(dateStr)

    const monthInt = date.getMonth() + 1
    const month = monthInt < 10 ? `0${monthInt}` : `${monthInt}`

    const dayOfTheMonthInt = date.getDate()
    const dayOfTheMonth =
      dayOfTheMonthInt < 10 ? `0${dayOfTheMonthInt}` : `${dayOfTheMonthInt}`

    return `${date.getFullYear()}-${month}-${dayOfTheMonth}`
  }

  const mutation = api.patients.editOne.useMutation()
  const router = useRouter()

  const {
    watch,
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<EditPatientType>({
    resolver: zodResolver(EditPatientSchema),
  })

  const onSubmit: SubmitHandler<EditPatientType> = async (formData) => {
    try {
      const editPatientProps = EditPatientSchema.parse(formData)
      await mutation.mutateAsync(editPatientProps)
      router.push(`/patients/${patientId}/view`)
    } catch (e) {
      if (e instanceof Error) {
        console.log("Generic error occured:", e.message)
        return
      }

      console.log("Unknown error occured:", e)
    }
  }

  const { status } = useAuthenticatedUser()
  if (status !== "authenticated") return <Loading />

  if (isLoading)
    return (
      <main className="max-w-6xl mx-auto px-6 pt-12 mb-6">
        <p className="font-bold text-2xl mb-6">Loading patient ...</p>
      </main>
    )

  if (!patient)
    return (
      <main className="max-w-6xl mx-auto px-6 pt-12 mb-6">
        <p className="font-bold text-2xl mb-6">
          An error occured while retrieving patient with ID: {patientId}
        </p>
      </main>
    )

  return (
    <main className="max-w-6xl mx-auto px-6 pt-12 mb-6">
      <h2 className="font-bold text-2xl mb-6">
        <Link href="/">Patient Records</Link>
        <span> &rsaquo; </span>
        <Link href={`/patients/${patientId}/edit`}>Edit Patient</Link>
      </h2>
      <form onSubmit={handleSubmit(onSubmit)}>
        <div className="grid sm:grid-cols-[2fr_1fr] gap-4">
          {/* Left column */}
          <div>
            <div className="mb-6">
              <h3 className="text-center font-semibold text-xl mb-3">
                Personal Information
              </h3>
              <div className="border border-teal-500 px-8 py-6 rounded-3xl">
                <input
                  defaultValue={patient.id}
                  {...register("id")}
                  type="hidden"
                />
                {/* Name & Gender */}
                <div className="grid xs:grid-cols-[3fr_2fr] lg:grid-cols-[5fr_2fr] gap-4 mb-3">
                  {/* Name */}
                  <div className="grid grid-cols-[auto_1fr] gap-2 sm:gap-4">
                    <label className="font-semibold mt-2">Name*</label>
                    <div className="flex flex-col">
                      <input
                        defaultValue={patient.fullName}
                        {...register("fullName")}
                        type="text"
                        className="rounded-full px-4 py-2 border border-teal-500 w-full"
                      />
                      {errors.fullName && (
                        <span className="text-red-500">
                          {errors.fullName.message}
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Gender */}
                  <div className="grid grid-cols-[auto_1fr] gap-4">
                    <label className="font-semibold mt-2">Gender*</label>
                    <div className="flex flex-col">
                      <select
                        defaultValue={patient.gender}
                        {...register("gender")}
                        className="rounded-full px-4 py-2 border border-teal-500 w-full bg-white"
                      >
                        <option value="MALE">Male</option>
                        <option value="FEMALE">Female</option>
                        <option value="OTHER">Other</option>
                      </select>
                      {errors.gender && (
                        <span className="text-red-500">
                          {errors.gender.message}
                        </span>
                      )}
                    </div>
                  </div>
                </div>
                {/* Birthdate, Age */}
                <div className="grid md:grid-cols-[1fr_auto] gap-4 mb-3">
                  {/* Birthdate */}
                  <div className="grid grid-cols-[auto_1fr] gap-2 sm:gap-4">
                    <label className="font-semibold mt-2">Birthdate*</label>
                    <div className="flex flex-col">
                      <input
                        defaultValue={formattedDate(patient.birthDate)}
                        {...register("birthDate")}
                        type="date"
                        min="1900-01-01"
                        className="rounded-full px-4 py-2 border border-teal-500 w-full text-center"
                      />
                      {errors.birthDate && (
                        <span className="text-red-500">
                          {errors.birthDate.message}
                        </span>
                      )}
                    </div>
                  </div>
                  {/* Age */}
                  <div className="grid grid-cols-[auto_1fr] items-center gap-4">
                    <label className="font-semibold">Age</label>
                    <span
                      id="calculatedAge"
                      className="rounded-full px-4 py-2 border border-teal-500 w-full pointer-events-none"
                    >
                      {watch("birthDate") === undefined
                        ? getYearsSinceDate(patient.birthDate)
                        : getYearsSinceDate(watch("birthDate"))}
                    </span>
                  </div>
                </div>
                {/* Email, Marital Status */}
                <div className="grid md:grid-cols-[1fr_auto] gap-4 mb-3">
                  {/* Email */}
                  <div className="grid grid-cols-[auto_1fr] gap-4 mb-3">
                    <label className="font-semibold mt-2">Email*</label>
                    <div className="flex flex-col">
                      <input
                        defaultValue={patient.email}
                        {...register("email")}
                        type="email"
                        className="rounded-full px-4 py-2 border border-teal-500 w-full"
                      />
                      {errors.email && (
                        <span className="text-red-500">
                          {errors.email.message}
                        </span>
                      )}
                    </div>
                  </div>
                  {/* Marital Status */}
                  <div className="grid grid-cols-[auto_1fr] gap-2 sm:gap-4">
                    <label className="font-semibold mt-2">
                      Marital Status*
                    </label>
                    <div className="flex flex-col">
                      <select
                        defaultValue={patient.maritalStatus}
                        {...register("maritalStatus")}
                        className="rounded-full px-4 py-2 border border-teal-500 w-full bg-white"
                      >
                        <option value="SINGLE">Single</option>
                        <option value="MARRIED">Married</option>
                        <option value="WIDOWED">Widowed</option>
                        <option value="SEPARATED">Separated</option>
                      </select>
                      {errors.maritalStatus && (
                        <span className="text-red-500">
                          {errors.maritalStatus.message}
                        </span>
                      )}
                    </div>
                  </div>
                </div>
                {/* Mobile number, Telephone number */}
                <div className="grid md:grid-cols-2 gap-4">
                  <div className="grid sm:grid-cols-[auto_1fr] items-center gap-2 sm:gap-4">
                    <label className="font-semibold">Mobile No.</label>
                    <div className="flex flex-col">
                      <input
                        defaultValue={patient.mobileNumber}
                        {...register("mobileNumber")}
                        type="text"
                        className="rounded-full px-4 py-2 border border-teal-500 w-full"
                      />
                      {errors.mobileNumber && (
                        <span className="text-red-500">
                          {errors.mobileNumber.message}
                        </span>
                      )}
                    </div>
                  </div>
                  <div className="grid sm:grid-cols-[auto_1fr] items-center gap-2 sm:gap-4">
                    <label className="font-semibold">Telephone No.</label>
                    <div className="flex flex-col">
                      <input
                        defaultValue={patient.telephoneNumber}
                        {...register("telephoneNumber")}
                        type="text"
                        className="rounded-full px-4 py-2 border border-teal-500 w-full"
                      />
                      {errors.telephoneNumber && (
                        <span className="text-red-500">
                          {errors.telephoneNumber.message}
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Medical History */}
            <div className="mb-6">
              <h3 className="text-center font-semibold text-xl mb-3">
                Medical History
              </h3>
              <div className="border border-teal-500 px-8 py-6 rounded-3xl">
                <div className="font-semibold mb-3">
                  Please check the items that apply.
                </div>
                {/* First section */}
                <div className="grid md:grid-flow-col md:grid-cols-2 md:grid-rows-3 gap-x-4">
                  <div className="grid sm:grid-cols-[auto_1fr] gap-2 sm:gap-4 mb-3">
                    <label className="flex gap-4 font-semibold mt-2">
                      <div>
                        <input
                          checked={
                            watch("heartAilmentOrDisease") === undefined
                              ? !!patient.medicalChart?.heartAilmentOrDisease
                              : !!watch("heartAilmentOrDisease")
                          }
                          readOnly={true}
                          type="checkbox"
                        />
                      </div>
                      <div>Heart Ailment/Disease</div>
                    </label>
                    <div>
                      <input
                        defaultValue={
                          patient.medicalChart?.heartAilmentOrDisease
                        }
                        {...register("heartAilmentOrDisease")}
                        type="text"
                        className="rounded-full px-4 py-2 border border-teal-500 w-full"
                        placeholder="Blood Pressure"
                      />
                      {errors.heartAilmentOrDisease && (
                        <span className="text-red-500">
                          {errors.heartAilmentOrDisease.message}
                        </span>
                      )}
                    </div>
                  </div>
                  <div className="grid sm:grid-cols-[auto_1fr] gap-2 sm:gap-4 mb-3">
                    <label className="flex gap-4 font-semibold mt-2">
                      <div>
                        <input
                          checked={
                            watch("hospitalAdmission") === undefined
                              ? !!patient.medicalChart?.hospitalAdmission
                              : !!watch("hospitalAdmission")
                          }
                          readOnly={true}
                          type="checkbox"
                        />
                      </div>
                      <div>Hospital Admission</div>
                    </label>
                    <div>
                      <input
                        defaultValue={patient.medicalChart?.hospitalAdmission}
                        {...register("hospitalAdmission")}
                        type="text"
                        placeholder="Reason"
                        className="rounded-full px-4 py-2 border border-teal-500 w-full"
                      />
                      {errors.hospitalAdmission && (
                        <span className="text-red-500">
                          {errors.hospitalAdmission.message}
                        </span>
                      )}
                    </div>
                  </div>
                  <div className="grid sm:grid-cols-[auto_1fr] gap-2 sm:gap-4 mb-3">
                    <label className="flex gap-4 font-semibold mt-2">
                      <div>
                        <input
                          checked={
                            watch("selfMedication") === undefined
                              ? !!patient.medicalChart?.selfMedication
                              : !!watch("selfMedication")
                          }
                          readOnly={true}
                          type="checkbox"
                        />
                      </div>
                      <div>Self-medication</div>
                    </label>
                    <div>
                      <input
                        defaultValue={patient.medicalChart?.selfMedication}
                        {...register("selfMedication")}
                        type="text"
                        className="rounded-full px-4 py-2 border border-teal-500 w-full"
                      />
                      {errors.selfMedication && (
                        <span className="text-red-500">
                          {errors.selfMedication.message}
                        </span>
                      )}
                    </div>
                  </div>
                  <div className="grid sm:grid-cols-[auto_1fr] gap-2 sm:gap-4 mb-3">
                    <label className="flex gap-4 font-semibold mt-2">
                      <div>
                        <input
                          checked={
                            watch("allergies") === undefined
                              ? !!patient.medicalChart?.allergies
                              : !!watch("allergies")
                          }
                          readOnly={true}
                          type="checkbox"
                        />
                      </div>
                      <div>Allergies</div>
                    </label>
                    <div>
                      <input
                        defaultValue={patient.medicalChart?.allergies}
                        {...register("allergies")}
                        type="text"
                        className="rounded-full px-4 py-2 border border-teal-500 w-full"
                        placeholder="Food/Medicine"
                      />
                      {errors.allergies && (
                        <span className="text-red-500">
                          {errors.allergies.message}
                        </span>
                      )}
                    </div>
                  </div>
                  <div className="grid sm:grid-cols-[auto_1fr] gap-2 sm:gap-4 mb-3">
                    <label className="flex gap-4 font-semibold mt-2">
                      <div>
                        <input
                          checked={
                            watch("operations") === undefined
                              ? !!patient.medicalChart?.operations
                              : !!watch("operations")
                          }
                          readOnly={true}
                          type="checkbox"
                        />
                      </div>
                      <div>Operation</div>
                    </label>
                    <div>
                      <input
                        defaultValue={patient.medicalChart?.operations}
                        {...register("operations")}
                        type="text"
                        className="rounded-full px-4 py-2 border border-teal-500 w-full"
                      />
                      {errors.operations && (
                        <span className="text-red-500">
                          {errors.operations.message}
                        </span>
                      )}
                    </div>
                  </div>
                  <div className="grid sm:grid-cols-[auto_1fr] gap-2 sm:gap-4 mb-3">
                    <label className="flex gap-4 font-semibold mt-2">
                      <div>
                        <input
                          checked={
                            watch("tumorsOrGrowth") === undefined
                              ? !!patient.medicalChart?.tumorsOrGrowth
                              : !!watch("tumorsOrGrowth")
                          }
                          readOnly={true}
                          type="checkbox"
                        />
                      </div>
                      <div>Tumor/Growth</div>
                    </label>
                    <div className="flex flex-col">
                      <input
                        defaultValue={patient.medicalChart?.tumorsOrGrowth}
                        {...register("tumorsOrGrowth")}
                        type="text"
                        className="rounded-full px-4 py-2 border border-teal-500 w-full"
                      />
                      {errors.tumorsOrGrowth && (
                        <span className="text-red-500">
                          {errors.tumorsOrGrowth.message}
                        </span>
                      )}
                    </div>
                  </div>
                </div>

                {/* Second section */}
                <div className="grid gap-y-2 xs:grid-cols-2 gap-x-4 md:grid-flow-col md:grid-rows-3 md:grid-cols-4 mb-3">
                  <label className="font-semibold flex gap-4 items-center">
                    <input
                      defaultChecked={patient.medicalChart?.diabetes}
                      {...register("diabetes")}
                      type="checkbox"
                    />
                    Diabetes
                  </label>
                  <label className="font-semibold flex gap-4 items-center">
                    <input
                      defaultChecked={patient.medicalChart?.sinusitis}
                      {...register("sinusitis")}
                      type="checkbox"
                    />
                    Sinusitis
                  </label>
                  <label className="font-semibold flex gap-4 items-center">
                    <input
                      defaultChecked={patient.medicalChart?.bleedingGums}
                      {...register("bleedingGums")}
                      type="checkbox"
                    />
                    Bleeding Gums
                  </label>
                  <label className="font-semibold flex gap-4 items-center">
                    <input
                      defaultChecked={patient.medicalChart?.hypertension}
                      {...register("hypertension")}
                      type="checkbox"
                    />
                    Hypertension
                  </label>
                  <label className="font-semibold flex gap-4 items-center">
                    <input
                      defaultChecked={patient.medicalChart?.stomachDisease}
                      {...register("stomachDisease")}
                      type="checkbox"
                    />
                    Stomach Disease
                  </label>
                  <label className="font-semibold flex gap-4 items-center">
                    <input
                      defaultChecked={patient.medicalChart?.bloodDisease}
                      {...register("bloodDisease")}
                      type="checkbox"
                    />
                    Blood Disease
                  </label>
                  <label className="font-semibold flex gap-4 items-center">
                    <input
                      defaultChecked={patient.medicalChart?.headache}
                      {...register("headache")}
                      type="checkbox"
                    />
                    Headache
                  </label>
                  <label className="font-semibold flex gap-4 items-center">
                    <input
                      defaultChecked={patient.medicalChart?.liverDisease}
                      {...register("liverDisease")}
                      type="checkbox"
                    />
                    Liver Disease
                  </label>
                  <div className="grid grid-cols-[auto_1fr] gap-4 xs:col-span-2 sm:col-span-1 md:col-span-2">
                    <label className="font-semibold flex gap-4 mt-2">
                      <div>
                        <input
                          // watch() returns undefined on first render, so if that
                          // is the value we get, we use the value coming from
                          // useQuery instead.
                          checked={
                            watch("pregnant") === undefined
                              ? !!patient.medicalChart?.pregnant
                              : !!watch("pregnant")
                          }
                          readOnly={true}
                          type="checkbox"
                        />
                      </div>
                      <div>Pregnant</div>
                    </label>
                    <div className="flex flex-col">
                      <input
                        defaultValue={patient.medicalChart?.pregnant}
                        {...register("pregnant")}
                        type="text"
                        placeholder="No. of Months"
                        className="rounded-full px-4 py-2 border border-teal-500 w-full"
                      />
                      {errors.pregnant && (
                        <span className="text-red-500">
                          {errors.pregnant.message}
                        </span>
                      )}
                    </div>
                  </div>
                  <label className="font-semibold flex gap-4 items-center">
                    <input
                      defaultChecked={patient.medicalChart?.cold}
                      {...register("cold")}
                      type="checkbox"
                    />
                    Cold
                  </label>
                  <label className="font-semibold flex gap-4 items-center">
                    <input
                      defaultChecked={patient.medicalChart?.kidney}
                      {...register("kidney")}
                      type="checkbox"
                    />
                    Kidney Disease
                  </label>
                </div>
                {/* Bottom section */}
                <div className="grid sm:grid-cols-[auto_1fr] gap-2 sm:gap-4">
                  <label className="font-semibold mt-2">
                    Family history on any of the above concerns
                  </label>
                  <div className="flex flex-col">
                    <input
                      defaultValue={patient.medicalChart?.familyHistoryOnAny}
                      {...register("familyHistoryOnAny")}
                      type="text"
                      className="rounded-full px-4 py-2 border border-teal-500 w-full"
                    />
                    {errors.familyHistoryOnAny && (
                      <span className="text-red-500">
                        {errors.familyHistoryOnAny.message}
                      </span>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Right column */}
          <div>
            {/* Dental History */}
            <div className="mb-6">
              <h3 className="text-center font-semibold text-xl mb-3">
                Dental History
              </h3>
              <div className="border border-teal-500 px-8 py-6 rounded-3xl">
                <div className="font-semibold mb-3">
                  Please check the items that apply.
                </div>
                {/* First section */}
                <div className="grid gap-y-4 mb-3">
                  <label className="font-semibold flex gap-4 items-center">
                    <input
                      defaultChecked={patient.dentalHistory?.bleedingInMouth}
                      {...register("bleedingInMouth")}
                      type="checkbox"
                    />
                    Bleeding in Mouth
                  </label>
                  <label className="font-semibold flex gap-4 items-center">
                    <input
                      defaultChecked={patient.dentalHistory?.gumsColorChange}
                      {...register("gumsColorChange")}
                      type="checkbox"
                    />
                    Gums change color
                  </label>
                  <label className="font-semibold flex gap-4 items-center">
                    <input
                      defaultChecked={patient.dentalHistory?.badBreath}
                      {...register("badBreath")}
                      type="checkbox"
                    />
                    Bad Breath
                  </label>
                  <label className="font-semibold flex gap-4 items-center">
                    <input
                      defaultChecked={patient.dentalHistory?.palate}
                      {...register("palate")}
                      type="checkbox"
                    />
                    Palate
                  </label>
                  <label className="font-semibold flex gap-4 items-center">
                    <input
                      defaultChecked={patient.dentalHistory?.teethColorChange}
                      {...register("teethColorChange")}
                      type="checkbox"
                    />
                    Teeth color Change
                  </label>
                  <label className="font-semibold flex gap-4 items-center">
                    <input
                      defaultChecked={patient.dentalHistory?.lumpsInMouth}
                      {...register("lumpsInMouth")}
                      type="checkbox"
                    />
                    Lumps in mouth
                  </label>
                </div>
                {/* Second section */}
                <div className="grid gap-y-4 mb-3">
                  <label className="font-semibold flex gap-4 items-center">
                    <input
                      defaultChecked={patient.dentalHistory?.sensitiveTeeth}
                      {...register("sensitiveTeeth")}
                      type="checkbox"
                    />
                    Sensitive teeth (hot/cold/sweet)
                  </label>
                  <label className="font-semibold flex gap-4 items-center">
                    <input
                      defaultChecked={patient.dentalHistory?.clickingSound}
                      {...register("clickingSound")}
                      type="checkbox"
                    />
                    Clicking sound in mouth when chewing
                  </label>
                </div>
                {/* Bottom section */}
                <div className="grid gap-2 sm:gap-4">
                  <label className="font-semibold flex gap-4 items-center mt-2">
                    <input
                      checked={
                        watch("pastDentalCareOrTreatments") === undefined
                          ? !!patient.dentalHistory?.pastDentalCareOrTreatments
                          : !!watch("pastDentalCareOrTreatments")
                      }
                      readOnly={true}
                      type="checkbox"
                    />
                    Past Dental Care/Treatments
                  </label>
                  <div className="flex flex-col">
                    <input
                      defaultValue={
                        patient.dentalHistory?.pastDentalCareOrTreatments
                      }
                      {...register("pastDentalCareOrTreatments")}
                      type="text"
                      className="rounded-full px-4 py-2 border border-teal-500 w-full"
                    />
                    {errors.pastDentalCareOrTreatments && (
                      <span className="text-red-500">
                        {errors.pastDentalCareOrTreatments.message}
                      </span>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Actions */}
        <div className="flex justify-center">
          <button
            type="submit"
            className="px-6 py-2 rounded-3xl bg-teal-500 hover:bg-teal-400 transition duration-200 text-white"
          >
            Save
          </button>
        </div>
      </form>
    </main>
  )
}
