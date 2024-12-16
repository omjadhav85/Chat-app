import { toaster } from "@/components/ui/toaster";

export const showError = (err: any) => {
  toaster.create({
    title:
      err?.response?.data?.message ||
      (typeof err === "string" ? err : "Something went wrong"),
    type: "error",
  });
};
