function FacebookIcon ({
  className = "",
  width="100%",
  height="100%",
  fill = "#fff"
}) {
  return (
    <svg
      className={className}
      width={width}
      height={height}
      viewBox="0 0 32 32"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
      d="M18 32V18h6l1-6h-7V9c0-2 1.002-3 3-3h3V0h-5c-5 0-7 3-7 8v4H6v6h6v14h6z"
      fill={fill}
      />
    </svg>
  )
}

export default FacebookIcon;
