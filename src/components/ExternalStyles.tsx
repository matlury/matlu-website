"use client";

import React from "react";

export const ExternalStyles: React.FC = () => {
  return (
    <>
      <link
        href="/css/all.css"
        rel="stylesheet"
        media="print"
        onLoad={(e) => {
          e.currentTarget.media = "all";
        }}
      />
      <noscript>
        <link rel="stylesheet" href="/css/all.css" />
      </noscript>
    </>
  );
};

export default ExternalStyles;
