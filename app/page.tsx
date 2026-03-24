import LoginForm from "@/components/auth/login-form";
import { redirectAuthenticatedUser } from "@/lib/auth/session";

type SearchParams = Promise<Record<string, string | string[] | undefined>>;

function getSearchParam(
  value: string | string[] | undefined,
): string | undefined {
  if (Array.isArray(value)) {
    return value[0];
  }

  return value;
}

export default async function Home({
  searchParams,
}: {
  searchParams: SearchParams;
}) {
  await redirectAuthenticatedUser();

  const params = await searchParams;
  const error = getSearchParam(params.error);

  return <LoginForm errorCode={error} />;
}
