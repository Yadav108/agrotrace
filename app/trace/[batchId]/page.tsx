import { redirect } from "next/navigation"

export default function TraceBatchRedirect({ params }: { params: { batchId: string } }) {
  redirect(`/trace?batch=${encodeURIComponent(params.batchId)}`)
}
