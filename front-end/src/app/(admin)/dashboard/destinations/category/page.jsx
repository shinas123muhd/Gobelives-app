"use client";
import CategoryFilter from "@/app/(admin)/components/CategoryFilter";
import CategoryList from "@/app/(admin)/components/CategoryList";
import Header from "@/app/(admin)/components/shared/Header";

const Categories = () => {
  return (
    <section className="w-full h-full p-6 bg-gray-50">
      <Header />

      {/* Filter Section */}
      <CategoryFilter />

      {/* Categories Grid */}
      <CategoryList />
    </section>
  );
};

export default Categories;
