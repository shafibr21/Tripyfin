import { getServerSession } from "next-auth"
import { redirect } from "next/navigation"
import { authOptions } from "@/lib/auth"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"

import Homepage from "./home/page"

export default async function Home() {
  return (
    <div>
      <Homepage/>
    </div>
  )
}
