import React, { useEffect } from "react";

type StrapiMessage =
  | { type: "strapiUpdate" }
  | { type: "strapiScript"; payload: { script: string } };

const LivePreview: React.FC = () => {
  useEffect(() => {
    const handleMessage = (event: MessageEvent) => {
      const origin = event.origin;
      const data = event.data as unknown;

      const strapiUrl = process.env.API_URL || "http://localhost:1337";

      if (origin !== strapiUrl) {
        return;
      }

      if (typeof data === "object" && data !== null && "type" in data) {
        const strapiData = data as StrapiMessage;

        if (strapiData.type === "strapiUpdate") {
          window.location.reload();
        } else if (strapiData.type === "strapiScript") {
          const script = window.document.createElement("script");
          script.textContent = strapiData.payload.script;
          window.document.head.appendChild(script);
        }
      }
    };

    window.addEventListener("message", handleMessage);

    // Let Strapi know we're ready to receive the script
    window.parent?.postMessage({ type: "previewReady" }, "*");

    return () => {
      window.removeEventListener("message", handleMessage);
    };
  }, []);

  return null;
};

export default LivePreview;
