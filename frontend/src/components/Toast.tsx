"use client";

import { useEffect, useState } from "react";

export default function Toast(props: any) {
  useEffect(() => {
    props.setShowErrorToast(true);
    const timer = setTimeout(() => {
      props.setShowErrorToast(false);
    }, 3000);
    return () => clearTimeout(timer);
  }, []);
  return (
    <>
      {props.showErrorToast && (
        <div className="fixed bottom-4 left-1/2 z-50 flex w-full max-w-md -translate-x-1/2 items-center justify-between rounded-md bg-red-500 px-4 py-3 text-white shadow-lg">
          <p>An error has occurred. Please try again later.</p>
          <button
            type="button"
            className="ml-4 rounded-md bg-red-600 px-2 py-1 text-sm font-medium hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2"
            onClick={() => props.setShowErrorToast(false)}
          >
            Close
          </button>
        </div>
      )}
    </>
  );
}
