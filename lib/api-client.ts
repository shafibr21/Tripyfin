import type { ApiLobby, ApiMember, ApiExpense, ApiDeposit } from "@/types/api"

class ApiClient {
  private baseUrl = "/api"

  async createLobby(name: string): Promise<{ id: string; name: string }> {
    const response = await fetch(`${this.baseUrl}/lobby`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ name }),
    })

    if (!response.ok) {
      const error = await response.json().catch(() => ({ error: "Failed to create lobby" }))
      throw new Error(error.error || "Failed to create lobby")
    }

    return response.json()
  }

  async getLobby(id: string): Promise<ApiLobby> {
    const response = await fetch(`${this.baseUrl}/lobby/${id}`)

    if (!response.ok) {
      const error = await response.json().catch(() => ({ error: "Failed to fetch lobby" }))
      throw new Error(error.error || "Failed to fetch lobby")
    }

    return response.json()
  }

  async addMember(lobbyId: string, name: string, isLeader = false): Promise<ApiMember> {
    const response = await fetch(`${this.baseUrl}/lobby/${lobbyId}/members`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ name, isLeader }),
    })

    if (!response.ok) {
      const error = await response.json().catch(() => ({ error: "Failed to add member" }))
      throw new Error(error.error || "Failed to add member")
    }

    return response.json()
  }

  async createInitialDeposits(lobbyId: string, memberIds: string[], amount: number): Promise<ApiDeposit[]> {
    const response = await fetch(`${this.baseUrl}/lobby/${lobbyId}/deposits`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        type: "INITIAL",
        amount,
        memberIds,
      }),
    })

    if (!response.ok) {
      const error = await response.json().catch(() => ({ error: "Failed to create initial deposits" }))
      throw new Error(error.error || "Failed to create initial deposits")
    }

    return response.json()
  }

  async createAdditionalDeposit(
    lobbyId: string,
    memberId: string,
    amount: number,
    description?: string,
  ): Promise<ApiDeposit> {
    const response = await fetch(`${this.baseUrl}/lobby/${lobbyId}/deposits`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        type: "ADDITIONAL",
        amount,
        memberId,
        description,
      }),
    })

    if (!response.ok) {
      const error = await response.json().catch(() => ({ error: "Failed to create additional deposit" }))
      throw new Error(error.error || "Failed to create additional deposit")
    }

    return response.json()
  }

  async createGroupExpense(
    lobbyId: string,
    description: string,
    perPersonAmount: number,
    memberCount: number,
  ): Promise<ApiExpense> {
    const response = await fetch(`${this.baseUrl}/lobby/${lobbyId}/expenses`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        type: "GROUP",
        description,
        perPersonAmount,
        memberCount,
      }),
    })

    if (!response.ok) {
      const error = await response.json().catch(() => ({ error: "Failed to create group expense" }))
      throw new Error(error.error || "Failed to create group expense")
    }

    return response.json()
  }

  async createIndividualExpense(
    lobbyId: string,
    description: string,
    individualAmounts: { memberId: string; amount: number }[],
  ): Promise<ApiExpense> {
    const response = await fetch(`${this.baseUrl}/lobby/${lobbyId}/expenses`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        type: "INDIVIDUAL",
        description,
        individualAmounts,
      }),
    })

    if (!response.ok) {
      const error = await response.json().catch(() => ({ error: "Failed to create individual expense" }))
      throw new Error(error.error || "Failed to create individual expense")
    }

    return response.json()
  }
}

export const apiClient = new ApiClient()
