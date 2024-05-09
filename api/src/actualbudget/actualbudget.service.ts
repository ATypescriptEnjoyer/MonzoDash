import { Injectable, OnModuleInit } from '@nestjs/common';
import { Account, Category, CategoryGroup, Payee, Transaction } from './actualbudget.interfaces';
import * as api from '@actual-app/api';

const { ACTUALBUDGET_BASE_URL, ACTUALBUDGET_PASSWORD, ACTUALBUDGET_BUDGET_ID } = process.env;

@Injectable()
export class ActualbudgetService implements OnModuleInit {

  onModuleInit = async () => {

    if (!ACTUALBUDGET_BASE_URL || !ACTUALBUDGET_PASSWORD || !ACTUALBUDGET_BUDGET_ID) {
      return;
    }

    await api.init({
      // This is the URL of your running server
      serverURL: ACTUALBUDGET_BASE_URL,
      // This is the password you use to log into the server
      password: ACTUALBUDGET_PASSWORD,
    });

    await api.downloadBudget(ACTUALBUDGET_BUDGET_ID);
  }

  available = (): boolean => !!ACTUALBUDGET_BASE_URL && !!ACTUALBUDGET_PASSWORD && !!ACTUALBUDGET_BUDGET_ID


  createAccount = async (account: Account, initialValueAsPence: number = 0): Promise<Account> => {
    const id = await api.createAccount(account, initialValueAsPence) as string;
    const accs = await api.getAccounts() as Account[];
    return accs.find(acc => acc.id === id);
  }

  getAccount = async (accName: string): Promise<Account> => {
    const accs = await api.getAccounts() as Account[];
    return accs.find(acc => acc.name.localeCompare(accName, "en-GB", { sensitivity: "base" }) && !acc.closed);
  }

  createCategory = async (category: Category): Promise<Category> => {
    const id = await api.createCategory(category) as string;
    const cats = await api.getCategories() as Category[];
    return cats.find(cat => cat.id === id);
  }

  getCategory = async (catName: string): Promise<Category> => {
    const cats = await api.getCategories() as Category[];
    return cats.find(cat => cat.name.localeCompare(catName, "en-GB", { sensitivity: "base" }));
  }

  createPayee = async (payee: Payee): Promise<Payee> => {
    const id = await api.createPayee(payee) as string;
    const payees = await api.getPayees() as Payee[];
    return payees.find(payee => payee.id === id);
  }

  getPayee = async (payeeName: string): Promise<Payee> => {
    const payees = await api.getPayees() as Payee[];
    return payees.find(payee => payee.name.localeCompare(payeeName, "en-GB", { sensitivity: "base" }));
  }

  createTransaction = async (accId: string, transaction: Transaction): Promise<boolean> => {
    try {
      const response = await api.importTransactions(accId, [transaction]) as { errors: string[], added: string[], updated: string[] };
      return response.errors.length === 0;
    }
    catch (err) {
      return false;
    }
  }

  getCategoryGroup = async (catGroupName: string): Promise<CategoryGroup> => {
    const catGroups = await api.getCategoryGroups() as CategoryGroup[];
    return catGroups.find(catGroup => catGroup.name.localeCompare(catGroupName, "en-GB", { sensitivity: "base" }));
  }
}