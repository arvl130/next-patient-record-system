import Link from "next/link"
import { useRouter } from "next/router"
import Loading from "../../../components/Loading"
import { useAuthenticatedUser } from "../../../hooks/useUser"
import { trpc } from "../../../utils/trpc"

export default function ViewPatient() {
  const { query } = useRouter()
  const patientId = query.id as string

  const { data: patient, isLoading } = trpc.patients.getOne.useQuery(
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

    return `${month} / ${dayOfTheMonth} / ${date.getFullYear()}`
  }

  const { status } = useAuthenticatedUser()
  if (status !== "authenticated") return <Loading />

  if (isLoading)
    return (
      <main className="max-w-6xl mx-auto px-6 pt-12 mb-6">
        <p className="text-2xl mb-6">Loading patient ...</p>
      </main>
    )

  if (!patient)
    return (
      <main className="max-w-6xl mx-auto px-6 pt-12 mb-6">
        <p className="text-2xl mb-6">
          An error occured while retrieving patient with ID: {patientId}
        </p>
      </main>
    )

  return (
    <main className="max-w-6xl mx-auto px-6 pt-12 mb-6">
      <h2 className="font-bold text-2xl mb-6">
        <Link href="/">Patient Records</Link>
        <span> &rsaquo; </span>
        <Link href={`/patients/${patientId}/view`}>View Patient</Link>
      </h2>
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
                    <div className="rounded-full px-4 py-2 border border-teal-500 w-full">
                      {patient.fullName}
                    </div>
                  </div>
                </div>

                {/* Gender */}
                <div className="grid grid-cols-[auto_1fr] gap-4">
                  <label className="font-semibold mt-2">Gender*</label>
                  <div className="flex flex-col">
                    <div className="rounded-full px-4 py-2 border border-teal-500 w-full bg-white capitalize">
                      {patient.gender.toLowerCase()}
                    </div>
                  </div>
                </div>
              </div>
              {/* Birthdate, Age */}
              <div className="grid md:grid-cols-[1fr_auto] gap-4 mb-3">
                {/* Birthdate */}
                <div className="grid grid-cols-[auto_1fr] gap-2 sm:gap-4">
                  <label className="font-semibold mt-2">Birthdate*</label>
                  <div className="flex flex-col">
                    <div className="rounded-full px-4 py-2 border border-teal-500 w-full text-center">
                      {formattedDate(patient.birthDate)}
                    </div>
                  </div>
                </div>
                {/* Age */}
                <div className="grid grid-cols-[auto_1fr] items-center gap-4">
                  <label className="font-semibold">Age</label>
                  <span
                    id="calculatedAge"
                    className="rounded-full px-4 py-2 border border-teal-500 w-full pointer-events-none"
                  >
                    N/A
                  </span>
                </div>
              </div>
              {/* Email, Marital Status */}
              <div className="grid md:grid-cols-[1fr_auto] gap-4 mb-3">
                {/* Email */}
                <div className="grid grid-cols-[auto_1fr] gap-4 mb-3">
                  <label className="font-semibold mt-2">Email*</label>
                  <div className="flex flex-col">
                    <div className="rounded-full px-4 py-2 border border-teal-500 w-full">
                      {patient.email}
                    </div>
                  </div>
                </div>
                {/* Marital Status */}
                <div className="grid grid-cols-[auto_1fr] gap-2 sm:gap-4">
                  <label className="font-semibold mt-2">Marital Status*</label>
                  <div className="flex flex-col">
                    <div className="rounded-full px-4 py-2 border border-teal-500 w-full bg-white capitalize">
                      {patient.maritalStatus.toLowerCase()}
                    </div>
                  </div>
                </div>
              </div>
              {/* Mobile number, Telephone number */}
              <div className="grid md:grid-cols-2 gap-4">
                <div className="grid sm:grid-cols-[auto_1fr] items-center gap-2 sm:gap-4">
                  <label className="font-semibold">Mobile No.</label>
                  <div className="flex flex-col">
                    <div className="rounded-full px-4 py-2 border border-teal-500 w-full">
                      {patient.mobileNumber || <br />}
                    </div>
                  </div>
                </div>
                <div className="grid sm:grid-cols-[auto_1fr] items-center gap-2 sm:gap-4">
                  <label className="font-semibold">Telephone No.</label>
                  <div className="flex flex-col">
                    <div className="rounded-full px-4 py-2 border border-teal-500 w-full">
                      {patient.telephoneNumber || <br />}
                    </div>
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
                        checked={!!patient.medicalChart?.heartAilmentOrDisease}
                        readOnly={true}
                        type="checkbox"
                      />
                    </div>
                    <div>Heart Ailment/Disease</div>
                  </label>
                  <div>
                    <div className="rounded-full px-4 py-2 border border-teal-500 w-full">
                      {patient.medicalChart?.heartAilmentOrDisease || <br />}
                    </div>
                  </div>
                </div>
                <div className="grid sm:grid-cols-[auto_1fr] gap-2 sm:gap-4 mb-3">
                  <label className="flex gap-4 font-semibold mt-2">
                    <div>
                      <input
                        checked={!!patient.medicalChart?.hospitalAdmission}
                        readOnly={true}
                        type="checkbox"
                      />
                    </div>
                    <div>Hospital Admission</div>
                  </label>
                  <div>
                    <div className="rounded-full px-4 py-2 border border-teal-500 w-full">
                      {patient.medicalChart?.hospitalAdmission || <br />}
                    </div>
                  </div>
                </div>
                <div className="grid sm:grid-cols-[auto_1fr] gap-2 sm:gap-4 mb-3">
                  <label className="flex gap-4 font-semibold mt-2">
                    <div>
                      <input
                        checked={!!patient.medicalChart?.selfMedication}
                        readOnly={true}
                        type="checkbox"
                      />
                    </div>
                    <div>Self-medication</div>
                  </label>
                  <div>
                    <div className="rounded-full px-4 py-2 border border-teal-500 w-full">
                      {patient.medicalChart?.selfMedication || <br />}
                    </div>
                  </div>
                </div>
                <div className="grid sm:grid-cols-[auto_1fr] gap-2 sm:gap-4 mb-3">
                  <label className="flex gap-4 font-semibold mt-2">
                    <div>
                      <input
                        checked={!!patient.medicalChart?.allergies}
                        readOnly={true}
                        type="checkbox"
                      />
                    </div>
                    <div>Allergies</div>
                  </label>
                  <div>
                    <div className="rounded-full px-4 py-2 border border-teal-500 w-full">
                      {patient.medicalChart?.allergies || <br />}
                    </div>
                  </div>
                </div>
                <div className="grid sm:grid-cols-[auto_1fr] gap-2 sm:gap-4 mb-3">
                  <label className="flex gap-4 font-semibold mt-2">
                    <div>
                      <input
                        checked={!!patient.medicalChart?.operations}
                        readOnly={true}
                        type="checkbox"
                      />
                    </div>
                    <div>Operation</div>
                  </label>
                  <div>
                    <div className="rounded-full px-4 py-2 border border-teal-500 w-full">
                      {patient.medicalChart?.operations || <br />}
                    </div>
                  </div>
                </div>
                <div className="grid sm:grid-cols-[auto_1fr] gap-2 sm:gap-4 mb-3">
                  <label className="flex gap-4 font-semibold mt-2">
                    <div>
                      <input
                        checked={!!patient.medicalChart?.tumorsOrGrowth}
                        readOnly={true}
                        type="checkbox"
                      />
                    </div>
                    <div>Tumor/Growth</div>
                  </label>
                  <div className="flex flex-col">
                    <div className="rounded-full px-4 py-2 border border-teal-500 w-full">
                      {patient.medicalChart?.tumorsOrGrowth || <br />}
                    </div>
                  </div>
                </div>
              </div>

              {/* Second section */}
              <div className="grid gap-y-2 xs:grid-cols-2 gap-x-4 md:grid-flow-col md:grid-rows-3 md:grid-cols-4 mb-3">
                <label className="font-semibold flex gap-4 items-center">
                  <input
                    checked={patient.medicalChart?.diabetes}
                    readOnly={true}
                    type="checkbox"
                  />
                  Diabetes
                </label>
                <label className="font-semibold flex gap-4 items-center">
                  <input
                    checked={patient.medicalChart?.sinusitis}
                    readOnly={true}
                    type="checkbox"
                  />
                  Sinusitis
                </label>
                <label className="font-semibold flex gap-4 items-center">
                  <input
                    checked={patient.medicalChart?.bleedingGums}
                    readOnly={true}
                    type="checkbox"
                  />
                  Bleeding Gums
                </label>
                <label className="font-semibold flex gap-4 items-center">
                  <input
                    checked={patient.medicalChart?.hypertension}
                    readOnly={true}
                    type="checkbox"
                  />
                  Hypertension
                </label>
                <label className="font-semibold flex gap-4 items-center">
                  <input
                    checked={patient.medicalChart?.stomachDisease}
                    readOnly={true}
                    type="checkbox"
                  />
                  Stomach Disease
                </label>
                <label className="font-semibold flex gap-4 items-center">
                  <input
                    checked={patient.medicalChart?.bloodDisease}
                    readOnly={true}
                    type="checkbox"
                  />
                  Blood Disease
                </label>
                <label className="font-semibold flex gap-4 items-center">
                  <input
                    checked={patient.medicalChart?.headache}
                    readOnly={true}
                    type="checkbox"
                  />
                  Headache
                </label>
                <label className="font-semibold flex gap-4 items-center">
                  <input
                    checked={patient.medicalChart?.liverDisease}
                    readOnly={true}
                    type="checkbox"
                  />
                  Liver Disease
                </label>
                <div className="grid grid-cols-[auto_1fr] gap-4 xs:col-span-2 sm:col-span-1 md:col-span-2">
                  <label className="font-semibold flex gap-4 mt-2">
                    <div>
                      <input
                        checked={!!patient.medicalChart?.pregnant}
                        readOnly={true}
                        type="checkbox"
                      />
                    </div>
                    <div>Pregnant</div>
                  </label>
                  <div className="flex flex-col">
                    <div className="rounded-full px-4 py-2 border border-teal-500 w-full">
                      {patient.medicalChart?.pregnant || <br />}
                    </div>
                  </div>
                </div>
                <label className="font-semibold flex gap-4 items-center">
                  <input
                    checked={patient.medicalChart?.cold}
                    readOnly={true}
                    type="checkbox"
                  />
                  Cold
                </label>
                <label className="font-semibold flex gap-4 items-center">
                  <input
                    checked={patient.medicalChart?.kidney}
                    readOnly={true}
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
                  <div className="rounded-full px-4 py-2 border border-teal-500 w-full">
                    {patient.medicalChart?.familyHistoryOnAny || <br />}
                  </div>
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
                    checked={patient.dentalHistory?.bleedingInMouth}
                    readOnly={true}
                    type="checkbox"
                  />
                  Bleeding in Mouth
                </label>
                <label className="font-semibold flex gap-4 items-center">
                  <input
                    checked={patient.dentalHistory?.gumsColorChange}
                    readOnly={true}
                    type="checkbox"
                  />
                  Gums change color
                </label>
                <label className="font-semibold flex gap-4 items-center">
                  <input
                    checked={patient.dentalHistory?.badBreath}
                    readOnly={true}
                    type="checkbox"
                  />
                  Bad Breath
                </label>
                <label className="font-semibold flex gap-4 items-center">
                  <input
                    checked={patient.dentalHistory?.palate}
                    readOnly={true}
                    type="checkbox"
                  />
                  Palate
                </label>
                <label className="font-semibold flex gap-4 items-center">
                  <input
                    checked={patient.dentalHistory?.teethColorChange}
                    readOnly={true}
                    type="checkbox"
                  />
                  Teeth color Change
                </label>
                <label className="font-semibold flex gap-4 items-center">
                  <input
                    checked={patient.dentalHistory?.lumpsInMouth}
                    readOnly={true}
                    type="checkbox"
                  />
                  Lumps in mouth
                </label>
              </div>
              {/* Second section */}
              <div className="grid gap-y-4 mb-3">
                <label className="font-semibold flex gap-4 items-center">
                  <input
                    checked={patient.dentalHistory?.sensitiveTeeth}
                    readOnly={true}
                    type="checkbox"
                  />
                  Sensitive teeth (hot/cold/sweet)
                </label>
                <label className="font-semibold flex gap-4 items-center">
                  <input
                    checked={patient.dentalHistory?.clickingSound}
                    readOnly={true}
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
                      !!patient.dentalHistory?.pastDentalCareOrTreatments
                    }
                    readOnly={true}
                    type="checkbox"
                  />
                  Past Dental Care/Treatments
                </label>
                <div className="flex flex-col">
                  <div className="rounded-full px-4 py-2 border border-teal-500 w-full">
                    {patient.dentalHistory?.pastDentalCareOrTreatments || (
                      <br />
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Actions */}
      <div className="flex justify-center">
        <Link
          href={`/patients/${patientId}/edit`}
          className="px-6 py-2 rounded-3xl border border-teal-500 text-teal-500 hover:bg-teal-500 hover:text-white transition duration-200"
        >
          Edit
        </Link>
      </div>
    </main>
  )
}
