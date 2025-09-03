import styles from "../styles/CommentSmall.module.css";
import { useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faThumbsUp, faThumbsDown } from "@fortawesome/free-solid-svg-icons";
import Link from "next/link";
import moment from 'moment'
import "moment/locale/fr";

function Comment(props) {
  moment.locale("fr")
   //console.log("props=> ", props)
  return (
    <div className = "mb-2 bg-sky-50 h-full p-1 rounded-md w-[90%]">
      <div className ="bg-[#1ad4ff] h-auto flex items-center pl-2 rounded-sm text-sm sm:text-md">
            <span className ="text-sm sm:text-md font-bold hidden sm:flex">Commenté par &nbsp;</span> <span className ="text-sm sm:text-md font-bold">{props.author.username} &nbsp; </span><span className ="text-sm sm:text-md"> le {moment(props.submittedAt).format("Do MMMM YYYY")}</span>

      </div>
      <div className = "pl-3 text-sm sm:text-md">
        {props.text}
      </div>
    </div>
  );
}

export default Comment;
