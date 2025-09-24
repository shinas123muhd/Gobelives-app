"use client";
import CategoryFilter from "@/app/(admin)/components/CategoryFilter";
import CategoryList from "@/app/(admin)/components/CategoryList";

const Categories = () => {
  return (
    <section className="w-full h-full px-6 pb-6 ">
      {/* Filter Section */}
      <CategoryFilter />

      {/* Categories Grid */}
      <CategoryList />
    </section>
  );
};

export default Categories;
