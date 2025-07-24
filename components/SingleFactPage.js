import styles from "../styles/Fact.module.css";
import Link from "next/link";
import { useRouter } from "next/router";
import { useState, useEffect } from "react";
import Login from "./Login";
import Modal from "antd/lib/modal";
import SingleFactPage from "../pages/facts/[fact]";

function SingleFact(props) {
  const router = useRouter();
  const {factPageId, setFactPageId} = usestate("")
console.log(router.query)
  useEffect(() => {
    const factPageId = router.query.fact;
    console.log({ factPageId });
  }, [router]);

  return <div>{factPageId}</div>;
}

export default SingleFact;
