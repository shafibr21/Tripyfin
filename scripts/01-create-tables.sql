-- Create users table
CREATE TABLE IF NOT EXISTS users (
    id SERIAL PRIMARY KEY,
    email VARCHAR(255) UNIQUE NOT NULL,
    name VARCHAR(255) NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create lobbies table
CREATE TABLE IF NOT EXISTS lobbies (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    leader_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
    total_balance DECIMAL(10,2) DEFAULT 0,
    initial_deposit DECIMAL(10,2) DEFAULT 0,
    status VARCHAR(50) DEFAULT 'active',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create lobby_members table
CREATE TABLE IF NOT EXISTS lobby_members (
    id SERIAL PRIMARY KEY,
    lobby_id INTEGER REFERENCES lobbies(id) ON DELETE CASCADE,
    user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
    individual_balance DECIMAL(10,2) DEFAULT 0,
    total_deposited DECIMAL(10,2) DEFAULT 0,
    joined_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(lobby_id, user_id)
);

-- Create transactions table
CREATE TABLE IF NOT EXISTS transactions (
    id SERIAL PRIMARY KEY,
    lobby_id INTEGER REFERENCES lobbies(id) ON DELETE CASCADE,
    created_by INTEGER REFERENCES users(id) ON DELETE CASCADE,
    type VARCHAR(50) NOT NULL, -- 'deposit', 'expense_equal', 'expense_individual'
    description TEXT NOT NULL,
    total_amount DECIMAL(10,2) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create transaction_details table (for individual expenses)
CREATE TABLE IF NOT EXISTS transaction_details (
    id SERIAL PRIMARY KEY,
    transaction_id INTEGER REFERENCES transactions(id) ON DELETE CASCADE,
    user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
    amount DECIMAL(10,2) NOT NULL
);
