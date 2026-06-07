import React from "react";

const Input = (props: React.InputHTMLAttributes<HTMLInputElement>) => {
  return <input className="border px-2 py-1 rounded-md" {...props} />;
};

export default Input;
