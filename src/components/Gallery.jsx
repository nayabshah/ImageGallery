"use client";

import BlurImage from "./BlurImage";
import Navbar from "./Navbar";
import axios from "axios";
import Loading from "./Loading";
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
      setIsLoading(true);
      const response = await axios.get(
        `${process.env.NEXT_PUBLIC_URL}${
          search ? "search/" : ""
        }photos?client_id=${
          process.env.NEXT_PUBLIC_CLIENT_ID
        }&per_page=16&page=${page}${search ? "&query=" + search : ""}`
      );
      const newData = response.data;
      const finalData = newData.results ? newData.results : newData;

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
      window.innerHeight + window.scrollTop !==
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
    if (q) {
      setIsLoading(true);
      setData([]);

      const response = await fetch(
        `${process.env.NEXT_PUBLIC_URL}${
          search ? "search/" : ""
        }photos?client_id=${
          process.env.NEXT_PUBLIC_CLIENT_ID
        }&per_page=16&&page=${page}&query=${q}`
      );
      const searchData = await response.json();
      setData(searchData.results);
      setIsLoading(false);
    } else {
      setData([]);
      fetchData();
    }
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
      {isLoading ? (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <Loading />
          <Loading />

          <Loading />

          <Loading />
        </div>
      ) : null}
    </>
  );
};

export default Gallery;
