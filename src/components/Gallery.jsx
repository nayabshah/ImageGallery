"use client";

import BlurImage from "./BlurImage";
import Navbar from "./Navbar";

import { useEffect, useState } from "react";

const Gallery = () => {
  const [search, setSearch] = useState("");

  const [data, setData] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [page, setPage] = useState(1);
  // console.log(page);

  const fetchData = async () => {
    setIsLoading(true);
    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_URL}${
          search ? "search/" : ""
        }photos?client_id=${process.env.NEXT_PUBLIC_CLIENT_ID}&client_secret=${
          process.env.NEXT_PUBLIC_CLIENT_SECRET
        }&per_page=24&page=${page}${search ? "&query=" + search : ""}`
      );
      const newData = await response.json();
      const finalData = newData.results ? newData.results : newData;
      setIsLoading(false);
      setData((prevItems) => [...new Set([...prevItems, ...finalData])]);
      setPage((prevPage) => prevPage + 1);
    } catch (error) {
      console.log(error);
      setError(error);
    } finally {
      setIsLoading(false);
    }
  };
  const handleScroll = () => {
    if (
      window.innerHeight + document.documentElement.scrollTop !==
        document.documentElement.offsetHeight ||
      isLoading
    ) {
      return;
    }
    fetchData();
  };
  useEffect(() => {
    fetchData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    window.addEventListener("scroll", handleScroll);
    window.addEventListener("scroll", () => {
      console.log("running");
    });
    return () => window.removeEventListener("scroll", handleScroll);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isLoading]);

  const searchImages = async (q) => {
    setIsLoading(true);
    setData([]);

    const response = await fetch(
      `${process.env.NEXT_PUBLIC_URL}${
        search ? "search/" : ""
      }photos?client_id=${process.env.NEXT_PUBLIC_CLIENT_ID}&client_secret=${
        process.env.NEXT_PUBLIC_CLIENT_SECRET
      }&per_page=24&&page=${page}&query=${q}`
    );
    const searchData = await response.json();
    setData(searchData.results);
    setIsLoading(false);
  };

  return (
    <>
      <Navbar
        searchImages={searchImages}
        search={search}
        setSearch={setSearch}
      />
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {data.map((item) => (
          <BlurImage
            key={item.id}
            image={item.urls.small}
            alt={item.alt_description}
          />
        ))}
      </div>
    </>
  );
};

export default Gallery;
