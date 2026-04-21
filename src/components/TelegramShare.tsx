"use client";

import React from "react";
import { FaPaperPlane } from "react-icons/fa";
import styles from "./TelegramShare.module.scss";

import { CSSProperties } from "react";

interface TelegramShareProps {
  joinChannel: string;
  channelName: string;
  style?: CSSProperties;
}

const TelegramShare: React.FC<TelegramShareProps> = ({ joinChannel, channelName, style }) => {
  return (
    <a
      href="https://t.me/matluInfo"
      target="_blank"
      rel="noopener noreferrer"
      className={styles.telegramBanner}
      style={style}
    >
      <span className={styles.iconWrapper}>
        <FaPaperPlane />
      </span>
      <div className={styles.textWrapper}>
        <span className={styles.mainText}>{joinChannel}</span>
        <span className={styles.channelName}>{channelName}</span>
      </div>
    </a>
  );
};

export default TelegramShare;
