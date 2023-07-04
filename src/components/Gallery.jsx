"use client";

import BlurImage from "./BlurImage";
import Navbar from "./Navbar";
import axios from "axios";
import Loading from "./Loading";
import { useInView } from "react-intersection-observer";
import { v4 as uuidv4 } from "uuid";

import { useEffect, useState, useRef } from "react";
import { useSession } from "next-auth/react";

const Gallery = () => {
  const [search, setSearch] = useState("");
  const [data, setData] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [page, setPage] = useState(1);
  const [newImages, setNewImages] = useState(false);
  const mounted = useRef(false);
  const session = useSession();

  const fetchData = async () => {
    try {
      const response = await axios.get(
        `${process.env.NEXT_PUBLIC_URL}${
          search ? "search/" : ""
        }photos?client_id=${
          process.env.NEXT_PUBLIC_CLIENT_ID
        }&per_page=24&page=${page}${search ? "&query=" + search : ""}`
      );
      const newData = response.data;
      const finalData = newData.results ? newData.results : newData;
      setIsLoading(false);
      setNewImages(false);
      setData((prevItems) => [...new Set([...prevItems, ...finalData])]);
    } catch (error) {
      console.log(error);
      setError(error);
    } finally {
      setIsLoading(false);
    }
  };

  const event = () => {
    if (
      window.innerHeight + window.scrollY >=
      document.body.offsetHeight - 1000
    ) {
      setNewImages(true);
    }
  };

  useEffect(() => {
    if (session?.status === "authenticated") {
      fetchData();
    }
  }, [page]);

  useEffect(() => {
    if (!mounted.current) {
      mounted.current = true;
      return;
    }
    if (!newImages) return;
    if (isLoading) return;
    setPage((oldPage) => oldPage + 1);
  }, [newImages]);

  useEffect(() => {
    window.addEventListener("scroll", event);
    return () => window.removeEventListener("scroll", event);
  }, []);

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
            key={uuidv4()}
            image={item.urls.small}
            alt={item.alt_description}
          />
        ))}
      </div>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {isLoading ? (
          <>
            <Loading />
            <Loading />

            <Loading />

            <Loading />
          </>
        ) : (
          ""
        )}
      </div>
    </>
  );
};

export default Gallery;
