const { Client } = require("pg")
require("dotenv").config()

async function checkDatabase() {
  console.log("🔍 Checking database connection...")

  const client = new Client({
    connectionString: process.env.DATABASE_URL,
  })

  try {
    await client.connect()
    console.log("✅ Database connection successful!")

    // Check if database exists
    const result = await client.query("SELECT current_database()")
    console.log(`📊 Connected to database: ${result.rows[0].current_database}`)

    await client.end()
    return true
  } catch (error) {
    console.error("❌ Database connection failed:")
    console.error(error.message)

    if (error.code === "ECONNREFUSED") {
      console.log("\n💡 Possible solutions:")
      console.log("1. Make sure PostgreSQL is running")
      console.log("2. Check your DATABASE_URL in .env file")
      console.log("3. Verify database credentials")
    }

    return false
  }
}

checkDatabase()
