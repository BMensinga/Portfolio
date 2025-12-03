"use client";

import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import Image from "next/image";
import type { CSSProperties } from "react";
import { useFog } from "~/app/providers/fog-provider";

interface FogImage {
  id: string;
  src: string;
  exit: "left" | "right";
  i: number;
}

const fogImages: FogImage[] = [
  {
    id: "fog1-left",
    src: "/images/fog/fog1.webp",
    exit: "left",
    i: 1,
  },
  {
    id: "fog2-right",
    src: "/images/fog/fog2.webp",
    exit: "right",
    i: 2,
  },
  {
    id: "fog3-left",
    src: "/images/fog/fog3.webp",
    exit: "left",
    i: 3,
  },
  {
    id: "fog4-right",
    src: "/images/fog/fog4.webp",
    exit: "right",
    i: 4,
  },
  {
    id: "fog5-left",
    src: "/images/fog/fog5.webp",
    exit: "left",
    i: 5,
  },
  {
    id: "fog1-right-2",
    src: "/images/fog/fog1.webp",
    exit: "right",
    i: 10,
  },
  {
    id: "fog2-left-2",
    src: "/images/fog/fog2.webp",
    exit: "left",
    i: 9,
  },
  {
    id: "fog3-right-2",
    src: "/images/fog/fog3.webp",
    exit: "right",
    i: 8,
  },
  {
    id: "fog4-left-2",
    src: "/images/fog/fog4.webp",
    exit: "left",
    i: 7,
  },
  {
    id: "fog5-right-2",
    src: "/images/fog/fog5.webp",
    exit: "right",
    i: 6,
  },
  {
    id: "fog1-left-3",
    src: "/images/fog/fog1.webp",
    exit: "left",
    i: 11,
  },
  {
    id: "fog2-right-3",
    src: "/images/fog/fog2.webp",
    exit: "right",
    i: 12,
  },
  {
    id: "fog3-left-3",
    src: "/images/fog/fog3.webp",
    exit: "left",
    i: 13,
  },
  {
    id: "fog4-right-3",
    src: "/images/fog/fog4.webp",
    exit: "right",
    i: 14,
  },
  {
    id: "fog5-left-3",
    src: "/images/fog/fog5.webp",
    exit: "left",
    i: 15,
  },
];

export function Fog() {
  const shouldReduceMotion = useReducedMotion();
  const { visible, density, position } = useFog();

  const imagesToShow = {
    max: fogImages,
    medium: fogImages.slice(0, fogImages.length / 2),
    light: fogImages.slice(0, fogImages.length / 3),
    clear: [],
  }[density];

  return (
    <>
      {shouldReduceMotion ? (
        <div className="fog-container">
          {imagesToShow.map(({ id, src, i, exit }) => (
            <div
              key={id}
              style={
                {
                  "--i": i,
                  x: exit === "left" ? "100%" : "-100%",
                } as CSSProperties
              }
              className="absolute inset-0"
            >
              <Image
                src={src}
                alt="Fog"
                className="fog-layer object-cover"
                width={1512}
                height={1512}
              />
            </div>
          ))}
        </div>
      ) : (
        <>
          <motion.div
            initial={{ opacity: 1 }}
            animate={{ opacity: 0 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 3 }}
            className={"absolute h-full w-full bg-white"}
          />
          <div className="fog-container">
            {imagesToShow.map(({ id, src, i, exit }) => (
              <AnimatePresence key={i}>
                {visible && (
                  <motion.div
                    key={id}
                    initial={{
                      x: exit === "left" ? "100%" : "-100%",
                      opacity: 0,
                    }}
                    animate={{ x: 0, opacity: 1, top: `${position.y}%` }}
                    exit={{ x: exit === "left" ? "-100%" : "100%", opacity: 0 }}
                    transition={{ duration: 3 }}
                    style={{ "--i": i } as CSSProperties}
                    className="absolute inset-0"
                  >
                    <Image
                      src={src}
                      alt="Fog"
                      className="fog-layer fog-layer--animated block object-cover"
                      width={1512}
                      height={1512}
                    />
                  </motion.div>
                )}
              </AnimatePresence>
            ))}
          </div>
        </>
      )}
    </>
  );
}
