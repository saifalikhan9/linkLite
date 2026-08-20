import { IconInfoCircle, IconSquareRoundedX } from "@tabler/icons-react";
export default function Page() {
  return (
    <div className="flex items-center justify-center min-h-screen ">
      <div className="shadow shadow-neutral-800 border border-neutral-200 ring ring-neutral-500 flex justify-between items-center bg-neutral-600 text-neutral-200 text-shadow-2xs text-shadow-neutral-800 min-h-15  px-4 py-2 text-base gap-8 rounded-md">
        <span>
          <IconInfoCircle className="stroke-1" />
        </span>
        <p className="text-lg">Notification</p>
        <button>
          <IconSquareRoundedX className="stroke-1" />
        </button>
      </div>
    </div>
  );
}
