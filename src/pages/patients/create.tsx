import { useRouter } from "next/router"
import { SubmitHandler, useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import Loading from "../../components/Loading"
import { useAuthenticatedUser } from "../../hooks/useUser"
import { CreatePatientSchema, CreatePatientType } from "../../models/patient"
import { trpc } from "../../utils/trpc"
import { getYearsSinceDate } from "../../utils/get-years-since-date"

export default function CreatePatient() {
  const createMutation = trpc.patients.createOne.useMutation()
  const router = useRouter()

  const {
    watch,
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<CreatePatientType>({
    resolver: zodResolver(CreatePatientSchema),
  })

  const onSubmit: SubmitHandler<CreatePatientType> = async (formData) => {
    try {
      const createPatientProps = CreatePatientSchema.parse(formData)
      await createMutation.mutateAsync(createPatientProps)
      router.push("/")
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

  return (
    <main className="max-w-6xl mx-auto px-6 pt-12 mb-6">
      <h2 className="font-bold text-2xl mb-6">Add Patient</h2>
      <form onSubmit={handleSubmit(onSubmit)}>
        <div className="grid sm:grid-cols-[2fr_1fr] gap-4">
          {/* Left column */}
          <div>
            <div className="mb-6">
              <h3 className="text-center font-semibold text-xl mb-3">
                Personal Information
              </h3>
              <div className="border border-teal-500 px-8 py-6 rounded-3xl">
                {/* Name & Gender */}
                <div className="grid xs:grid-cols-[3fr_2fr] lg:grid-cols-[5fr_2fr] gap-4 mb-3">
                  {/* Name */}
                  <div className="grid grid-cols-[auto_1fr] gap-2 sm:gap-4">
                    <label className="font-semibold mt-2">Name*</label>
                    <div className="flex flex-col">
                      <input
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
                      {getYearsSinceDate(watch("birthDate"))}
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
                        <input type="checkbox" />
                      </div>
                      <div>Heart Ailment/Disease</div>
                    </label>
                    <div>
                      <input
                        {...register("heartAilmentOrDisease")}
                        type="text"
                        className="rounded-full px-4 py-2 border border-teal-500 w-full"
                        placeholder="Blood Pressure"
                      />
                      {/* @Html.ValidationMessageFor(m => m.HeartAilmentOrDisease, "", new { @class = "text-red-500" }) */}
                    </div>
                  </div>
                  <div className="grid sm:grid-cols-[auto_1fr] gap-2 sm:gap-4 mb-3">
                    <label className="flex gap-4 font-semibold mt-2">
                      <div>
                        <input type="checkbox" />
                      </div>
                      <div>Hospital Admission</div>
                    </label>
                    <div>
                      <input
                        {...register("hospitalAdmission")}
                        type="text"
                        placeholder="Reason"
                        className="rounded-full px-4 py-2 border border-teal-500 w-full"
                      />
                      {/* @Html.ValidationMessageFor(m => m.HospitalAdmission, "", new { @class = "text-red-500" }) */}
                    </div>
                  </div>
                  <div className="grid sm:grid-cols-[auto_1fr] gap-2 sm:gap-4 mb-3">
                    <label className="flex gap-4 font-semibold mt-2">
                      <div>
                        <input type="checkbox" />
                      </div>
                      <div>Self-medication</div>
                    </label>
                    <div>
                      <input
                        {...register("selfMedication")}
                        type="text"
                        className="rounded-full px-4 py-2 border border-teal-500 w-full"
                      />
                      {/* @Html.ValidationMessageFor(m => m.SelfMedication, "", new { @class = "text-red-500" }) */}
                    </div>
                  </div>
                  <div className="grid sm:grid-cols-[auto_1fr] gap-2 sm:gap-4 mb-3">
                    <label className="flex gap-4 font-semibold mt-2">
                      <div>
                        <input type="checkbox" />
                      </div>
                      <div>Allergies</div>
                    </label>
                    <div>
                      <input
                        {...register("allergies")}
                        type="text"
                        className="rounded-full px-4 py-2 border border-teal-500 w-full"
                        placeholder="Food/Medicine"
                      />
                      {/* @Html.ValidationMessageFor(m => m.Allergies, "", new { @class = "text-red-500" }) */}
                    </div>
                  </div>
                  <div className="grid sm:grid-cols-[auto_1fr] gap-2 sm:gap-4 mb-3">
                    <label className="flex gap-4 font-semibold mt-2">
                      <div>
                        <input type="checkbox" />
                      </div>
                      <div>Operation</div>
                    </label>
                    <div>
                      <input
                        {...register("operations")}
                        type="text"
                        className="rounded-full px-4 py-2 border border-teal-500 w-full"
                      />
                      {/* @Html.ValidationMessageFor(m => m.Operation, "", new { @class = "text-red-500" }) */}
                    </div>
                  </div>
                  <div className="grid sm:grid-cols-[auto_1fr] gap-2 sm:gap-4 mb-3">
                    <label className="flex gap-4 font-semibold mt-2">
                      <div>
                        <input type="checkbox" />
                      </div>
                      <div>Tumor/Growth</div>
                    </label>
                    <div className="flex flex-col">
                      <input
                        {...register("tumorsOrGrowth")}
                        type="text"
                        className="rounded-full px-4 py-2 border border-teal-500 w-full"
                      />
                      {/* @Html.ValidationMessageFor(m => m.TumorsOrGrowth, "", new { @class = "text-red-500" }) */}
                    </div>
                  </div>
                </div>

                {/* Second section */}
                <div className="grid gap-y-2 xs:grid-cols-2 gap-x-4 md:grid-flow-col md:grid-rows-3 md:grid-cols-4 mb-3">
                  <label className="font-semibold flex gap-4 items-center">
                    <input {...register("diabetes")} type="checkbox" />
                    Diabetes
                  </label>
                  <label className="font-semibold flex gap-4 items-center">
                    <input {...register("sinusitis")} type="checkbox" />
                    Sinusitis
                  </label>
                  <label className="font-semibold flex gap-4 items-center">
                    <input {...register("bleedingGums")} type="checkbox" />
                    Bleeding Gums
                  </label>
                  <label className="font-semibold flex gap-4 items-center">
                    <input {...register("hypertension")} type="checkbox" />
                    Hypertension
                  </label>
                  <label className="font-semibold flex gap-4 items-center">
                    <input {...register("stomachDisease")} type="checkbox" />
                    Stomach Disease
                  </label>
                  <label className="font-semibold flex gap-4 items-center">
                    <input {...register("bloodDisease")} type="checkbox" />
                    Blood Disease
                  </label>
                  <label className="font-semibold flex gap-4 items-center">
                    <input {...register("headache")} type="checkbox" />
                    Headache
                  </label>
                  <label className="font-semibold flex gap-4 items-center">
                    <input {...register("liverDisease")} type="checkbox" />
                    Liver Disease
                  </label>
                  <div className="grid grid-cols-[auto_1fr] gap-4 xs:col-span-2 sm:col-span-1 md:col-span-2">
                    <label className="font-semibold flex gap-4 mt-2">
                      <div>
                        <input type="checkbox" />
                      </div>
                      <div>Pregnant</div>
                    </label>
                    <div className="flex flex-col">
                      <input
                        {...register("pregnant")}
                        type="text"
                        placeholder="No. of Months"
                        className="rounded-full px-4 py-2 border border-teal-500 w-full"
                      />
                      {/* @Html.ValidationMessageFor(m => m.Pregnant, "", new { @class = "text-red-500" }) */}
                    </div>
                  </div>
                  <label className="font-semibold flex gap-4 items-center">
                    <input {...register("cold")} type="checkbox" />
                    Cold
                  </label>
                  <label className="font-semibold flex gap-4 items-center">
                    <input {...register("kidney")} type="checkbox" />
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
                      {...register("familyHistoryOnAny")}
                      type="text"
                      className="rounded-full px-4 py-2 border border-teal-500 w-full"
                    />
                    {/* @Html.ValidationMessageFor(m => m.FamilyHistryOnAny, "", new { @class = "text-red-500" }) */}
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
                    <input {...register("bleedingInMouth")} type="checkbox" />
                    Bleeding in Mouth
                  </label>
                  <label className="font-semibold flex gap-4 items-center">
                    <input {...register("gumsColorChange")} type="checkbox" />
                    Gums change color
                  </label>
                  <label className="font-semibold flex gap-4 items-center">
                    <input {...register("badBreath")} type="checkbox" />
                    Bad Breath
                  </label>
                  <label className="font-semibold flex gap-4 items-center">
                    <input {...register("palate")} type="checkbox" />
                    Palate
                  </label>
                  <label className="font-semibold flex gap-4 items-center">
                    <input {...register("teethColorChange")} type="checkbox" />
                    Teeth color Change
                  </label>
                  <label className="font-semibold flex gap-4 items-center">
                    <input {...register("lumpsInMouth")} type="checkbox" />
                    Lumps in mouth
                  </label>
                </div>
                {/* Second section */}
                <div className="grid gap-y-4 mb-3">
                  <label className="font-semibold flex gap-4 items-center">
                    <input {...register("sensitiveTeeth")} type="checkbox" />
                    Sensitive teeth (hot/cold/sweet)
                  </label>
                  <label className="font-semibold flex gap-4 items-center">
                    <input {...register("clickingSound")} type="checkbox" />
                    Clicking sound in mouth when chewing
                  </label>
                </div>
                {/* Bottom section */}
                <div className="grid gap-2 sm:gap-4">
                  <label className="font-semibold flex gap-4 items-center mt-2">
                    <input type="checkbox" />
                    Past Dental Care/Treatments
                  </label>
                  <div className="flex flex-col">
                    <input
                      {...register("pastDentalCareOrTreatments")}
                      type="text"
                      className="rounded-full px-4 py-2 border border-teal-500 w-full"
                    />
                    {/* @Html.ValidationMessageFor(m => m.PastDentalCareOrTreatments, "", new { @class = "text-red-500" }) */}
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
            Create
          </button>
        </div>
      </form>
    </main>
  )
}
