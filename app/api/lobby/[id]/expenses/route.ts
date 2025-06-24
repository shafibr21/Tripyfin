import { type NextRequest, NextResponse } from "next/server"
import { createGroupExpense, createIndividualExpense } from "@/lib/db/expense"

export async function POST(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const { type, description, perPersonAmount, memberCount, individualAmounts } = await request.json()

    if (!type || !description) {
      return NextResponse.json({ error: "Type and description are required" }, { status: 400 })
    }

    let expense

    if (type === "GROUP") {
      if (!perPersonAmount || !memberCount) {
        return NextResponse.json(
          { error: "Per person amount and member count are required for group expenses" },
          { status: 400 },
        )
      }
      expense = await createGroupExpense(params.id, description, perPersonAmount, memberCount)
    } else if (type === "INDIVIDUAL") {
      if (!individualAmounts || !Array.isArray(individualAmounts)) {
        return NextResponse.json({ error: "Individual amounts are required for individual expenses" }, { status: 400 })
      }
      expense = await createIndividualExpense(params.id, description, individualAmounts)
    } else {
      return NextResponse.json({ error: "Invalid expense type" }, { status: 400 })
    }

    return NextResponse.json(expense)
  } catch (error) {
    console.error("Error creating expense:", error)
    return NextResponse.json({ error: "Failed to create expense" }, { status: 500 })
  }
}
