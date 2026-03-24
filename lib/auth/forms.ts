export const ROLE_OPTIONS = [
  { value: "admin", label: "Admin" },
  { value: "marketing", label: "Marketing" },
  { value: "sales", label: "Asesor comercial" },
] as const;

export type AuthFieldErrors = Partial<
  Record<"fullName" | "email" | "password" | "role", string>
>;

export type AuthFormState = {
  status: "idle" | "success" | "error";
  message: string;
  fieldErrors: AuthFieldErrors;
};

export const initialAuthFormState: AuthFormState = {
  status: "idle",
  message: "",
  fieldErrors: {},
};
