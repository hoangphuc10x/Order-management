const TableIcon = ({ fill = "black" }) => {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 32 32"
      id="Table"
      className="min-w-8 min-h-8 max-w-8 max-h-8"
    >
      <path
        d="M28,9H4a1,1,0,0,0,0,2H6V24a1,1,0,0,0,2,0V15.05H24v9a1,1,0,0,0,2,0V11h2a1,1,0,0,0,0-2Zm-4,4.05H8V11H24Z"
        fill={fill}
        className="color000000 svgShape"
      ></path>
    </svg>
  );
};

export default TableIcon;
