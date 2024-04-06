"use client";

import { useEffect, useState } from "react";
import { useInView } from "react-intersection-observer";
import { useSession } from "next-auth/react";
import { getRepoIssues } from "@/lib/github-api";
import { GitHubIssue } from "@/lib/types/types";
import { useOwnerAndRepo } from "@/lib/hooks/useOwnerAndRepo";
import { Spinner } from "@/components/ui/spinner";
import IssueList from "@/components/IssueList";

export default function LoadMore() {
  const { data: session } = useSession();
  const { owner, currentRepo } = useOwnerAndRepo();
  const [issues, setIssues] = useState<GitHubIssue[]>([]); // keeping track of the issues
  const [pagesLoaded, setPagesLoaded] = useState(1); // keeping track of the pages loaded
  const [loading, setLoading] = useState(true);

  const { ref, inView } = useInView();

  const loadMoreIssues = async () => {
    const nextPage = pagesLoaded + 1;
    const { issues: newIssues } =
      (await getRepoIssues(
        { owner, repo: currentRepo },
        nextPage,
        session?.user.accessToken ?? ""
      )) ?? [];

    // 已經載入所有 issues，要讓 spinner 消失，inView 會變成 false，不會再呼叫 loadMoreIssues
    if (newIssues.length < 10) {
      setLoading(false);
    }

    setIssues((prevIssues: GitHubIssue[]) => [...prevIssues, ...newIssues]);
    setPagesLoaded(nextPage);
  };

  // the ref ensures that every time the spinner component is in the view, it would call the useEffect
  useEffect(() => {
    if (inView) {
      loadMoreIssues();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [inView]);

  // 當 repo 改變時，重新載入 issues
  useEffect(() => {
    setLoading(true);
    setIssues([]);
    setPagesLoaded(1);
  }, [currentRepo]);

  return (
    currentRepo && (
      <>
        <IssueList issues={issues} />
        {loading && (
          <div className={"flex justify-center items-center mt-4"} ref={ref}>
            <Spinner />
          </div>
        )}
      </>
    )
  );
}
