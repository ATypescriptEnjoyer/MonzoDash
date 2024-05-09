export interface Account {
    id?: string
    name: string
    type: 'checking' | 'savings' | 'credit' | 'investment' | 'mortgage' | 'debt' | 'other'
    offbudget?: boolean
    closed?: boolean
}

export interface Category {
    id?: string;
    name: string;
    group_id: string;
    is_income?: boolean;
}

export interface Payee {
    id?: string;
    name: string;
    category?: string
    transfer_acct?: string;
}

export interface Transaction {
    id?: string;
    account: string;
    date: String;
    amount: number;
    payee: string;
    payee_name?: string;
    imported_payee?: string;
    category: string;
    notes?: string;
    imported_id?: string;
    transfer_id?: string;
    cleared?: boolean;
    subTransactions?: Transaction[]
}

export interface CategoryGroup {
    id?: string;
    name: string;
    is_income?: boolean;
    categories: Category[]
}