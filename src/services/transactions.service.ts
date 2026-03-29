import db from "../database/db.js";
import { generateTransactionReference } from "../utils/helpers.js";

export enum TransactionType {
  deposit = "deposit",
  withdrawal = "withdrawal",
  transfer = "transfer",
}

export interface Transaction {
  id: number;
  amount: number;
  receiver_wallet_id: number;
  sender_wallet_id: number;
  type: TransactionType;
  reference: string;
  initiated_by: number;
  notes: string;
  created_at: Date;
}

export async function recordTransaction({
  db,
  userId,
  amount,
  receiverWalletId,
  senderWalletId,
  type,
  notes,
}: {
  db: any;
  userId: number;
  amount: number;
  receiverWalletId: number | null;
  senderWalletId: number | null;
  type: string;
  notes: string;
}) {
  const reference = generateTransactionReference();
  await db("transactions").insert({
    amount,
    receiver_wallet_id: receiverWalletId,
    sender_wallet_id: senderWalletId,
    type,
    notes,
    reference,
    initiated_by: userId,
  });
}

/* Retrive user transactions */
export type Transactions = Transaction[];
export const getUserTransactions = async (
  userId: number,
): Promise<Transactions> => {
  const transactions: Transactions = await db("transactions").where({
    initiated_by: userId,
  });

  return transactions;
};
