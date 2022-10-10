import { Box, Skeleton } from "@mui/material";
import Image from "next/future/image";
import React from "react";
import Link from "./Link";
import { motion } from "framer-motion";

const CardTwo = ({
  width,
  height,
  mainImage,
  subImage = null,
  role,
  title,
  subTitle,
  link,
  status,
  mediaListEntryStatus,
}) => {
  return (
    <motion.div
      initial={{ scale: 0, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      exit={{ scale: 0, opacity: 0 }}
    >
      <Box className="card" sx={{ width }}>
        <Link href={link}>
          <Box className="relative">
            {mainImage ? (
              <Image
                className="object-cover"
                width={width}
                height={height}
                src={mainImage}
                alt={title}
              />
            ) : (
              <Skeleton width={width} height={height} variant="rectangular" />
            )}
            {subImage ? (
              <Image
                className="absolute bottom-0 right-0"
                width={width / 3}
                height={height / 3}
                src={subImage}
                alt={subTitle}
              />
            ) : (
              <></>
            )}
          </Box>
          <div className="media--title | font-semibold">{title}</div>
          <div className="uppercase">{role}</div>
          <div className="media--title | text-sm">{subTitle}</div>
        </Link>
      </Box>
    </motion.div>
  );
};

export default CardTwo;
