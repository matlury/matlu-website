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
          (e.target as HTMLLinkElement).media = "all";
        }}
      />
      <noscript>
        <link href="/css/all.css" rel="stylesheet" />
      </noscript>
    </>
  );
};

export default ExternalStyles;
