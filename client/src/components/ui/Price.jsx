export default function Price({ amount, original, size = "md", className = "" }) {
  const sizes = { sm: "text-sm", md: "text-lg", lg: "text-3xl" };
  const formatted = new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  }).format(amount);

  return (
    <span className={`font-mono font-medium text-ink_text-hi ${sizes[size]} ${className}`}>
      {formatted}
      {original && original > amount && (
        <span className="ml-2 text-ink_text-low line-through text-sm font-normal">
          {new Intl.NumberFormat("en-IN", {
            style: "currency",
            currency: "INR",
            maximumFractionDigits: 0,
          }).format(original)}
        </span>
      )}
    </span>
  );
}
