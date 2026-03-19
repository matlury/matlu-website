"use client";

import React from "react";
import Image from "./image";
import styles from "./LogoWrapper.module.scss";

export const MatluLogo = () => {
    return (
        <div className={styles.logoWrapper}>
            <Image imageName="matlu" />
        </div>
    );
};

export default MatluLogo;
