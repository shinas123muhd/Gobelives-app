"use client";
import TransactionFilter from "@/app/(admin)/components/TransactionFilter";
import TransactionList from "@/app/(admin)/components/TransactionList";

const Transactions = () => {
  return (
    <section className="w-full h-full px-6 pb-6">
      {/* Filter Section */}
      <TransactionFilter />
      {/* Transactions Table */}
      <TransactionList />
    </section>
  );
};

export default Transactions;
