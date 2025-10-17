import Link from "next/link";
import React from "react";

const ShadowButton = ({
  text,
  textColor,
  borderColor,
  bgColor,
  shadowBg,
  width,
  path,
}) => {
  return (
    <Link href={path}>
      <div
        className={`relative py-6 w-${width} cursor-pointer`}
        style={{ backgroundColor: shadowBg }}
      >
        <div
          className="absolute bottom-2 left-2 w-full h-full flex justify-center items-center gap-2 border-2"
          style={{
            borderColor: borderColor,
            backgroundColor: bgColor,
          }}
        >
          <h2
            style={{ color: textColor }}
            className="font-bold text-medium"
          >
            {text}
          </h2>
        </div>
      </div>
    </Link>
  );
};

export default ShadowButton;
