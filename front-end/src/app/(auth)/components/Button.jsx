const Button = ({ 
    children, 
    variant = "primary", 
    size = "md", 
    onClick, 
    className = "",
    disabled = false,
    ...props 
  }) => {
    const baseClasses = "font-medium transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed";
    
    const variants = {
      primary: "bg-yellow-400 hover:bg-yellow-500 text-black focus:ring-yellow-300",
      secondary: "bg-gray-100 hover:bg-gray-200 text-gray-800 focus:ring-gray-300",
      outline: "border-2 border-gray-300 bg-white hover:bg-gray-50 text-gray-800 focus:ring-gray-300"
    };
    
    const sizes = {
      sm: "px-3 py-2 text-sm rounded-full",
      md: "px-4 py-3 text-base rounded-full",
      lg: "px-6 py-4 text-lg rounded-full"
    };
  
    return (
      <button
        onClick={onClick}
        disabled={disabled}
        className={`${baseClasses} ${variants[variant]} ${sizes[size]} ${className}`}
        {...props}
      >
        {children}
      </button>
    );
  };
export default Button;  