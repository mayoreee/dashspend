import { Input } from "@/components/ui/input";

export default function AmountInput(props: any) {
  return (
    <div className="flex items-center w-full max-w-sm">
      <div className="absolute pl-4 text-gray-500 dark:text-gray-400">
        <DollarSignIcon className="h-5 w-5" />
      </div>
      <Input
        type="text"
        placeholder="Enter amount"
        className="pl-12 pr-4 h-10 rounded-md border border-gray-300 bg-white text-gray-900 focus:border-gray-500 focus:outline-none focus:ring-1 focus:ring-gray-500 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-50 dark:focus:border-gray-600 dark:focus:ring-gray-600"
        onChange={(e) => {
          props.setPurchaseAmount(e.target.value);
        }}
      />
    </div>
  );
}

function DollarSignIcon(props: any) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <line x1="12" x2="12" y1="2" y2="22" />
      <path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" />
    </svg>
  );
}
