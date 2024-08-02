"use client";
import React, { useEffect, useState } from "react";
import { Input } from "./ui/input";
import Image from "next/image";
import { usePathname, useRouter } from "next/navigation";

const SearchBar = () => {
  const router = useRouter();
  const pathname = usePathname();
  const [search, setSearch] = useState("");
  useEffect(() => {
    if (search) {
      router.push(`/discover?search=${search}`);
    } else if (!search && pathname === "/discover") {
      router.push(`/discover`);
    }
  }, [router, pathname, search]);

  return (
    <div className="relative mt-8">
      <Input
        className="input-class py-6 pl-12 focus-visible:ring-offset-orange-1"
        placeholder="Search for podcasts"
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        onLoad={() => setSearch("")}
      />
      <Image
        src={"/icons/search.svg"}
        height={20}
        width={20}
        className="absolute left-4 top-3.5"
        alt="search"
      />
    </div>
  );
};

export default SearchBar;
