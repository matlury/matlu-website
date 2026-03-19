"use client";

import React, { useState } from "react";
import { useServerInsertedHTML } from "next/navigation";
import { CacheProvider } from "@emotion/react";
import createCache from "@emotion/cache";

export default function EmotionRegistry({ children }: { children: React.ReactNode }) {
    const [registry] = useState(() => {
        const cache = createCache({ key: "chakra" });
        cache.compat = true;
        const prevInsert = cache.insert;
        let inserted: string[] = [];
        cache.insert = (...args) => {
            const serialized = args[1];
            if (cache.inserted[serialized.name] === undefined) {
                inserted.push(serialized.name);
            }
            return prevInsert(...args);
        };
        const flush = () => {
            const prevInserted = inserted;
            inserted = [];
            return prevInserted;
        };
        return { cache, flush };
    });

    useServerInsertedHTML(() => {
        const names = registry.flush();
        if (names.length === 0) return null;
        let styles = "";
        for (const name of names) {
            styles += registry.cache.inserted[name];
        }
        return (
            <style
                key={registry.cache.key}
                data-emotion={`${registry.cache.key} ${names.join(" ")}`}
                dangerouslySetInnerHTML={{
                    __html: styles,
                }}
            />
        );
    });

    return <CacheProvider value={registry.cache}>{children}</CacheProvider>;
}
