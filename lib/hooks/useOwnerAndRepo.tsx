import { useSearchParams, useParams } from "next/navigation";

export function useOwnerAndRepo() {
  const params = useParams<{ owner: string; number: string }>();
  const searchParams = useSearchParams();
  const currentRepo = searchParams.get("repo") as string;

  return { owner: params.owner, currentRepo, issueNumber: params.number };
}
