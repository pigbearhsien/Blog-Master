"use client";

import { useEffect, useState } from "react";
import { useParams, useSearchParams } from "next/navigation";
import { useInView } from "react-intersection-observer";
import { Spinner } from "@/components/ui/spinner";
import IssueList from "@/components/IssueList";
import { getRepoIssues } from "@/lib/github-api";
import { GitHubIssue } from "@/lib/types/types";

export default function LoadMore() {
  const params = useParams<{ owner: string }>();
  const searchParams = useSearchParams();
  const currentRepo = searchParams.get("repo") as string;
  const [issues, setIssues] = useState<GitHubIssue[]>([]); // keeping track of the issues
  const [pagesLoaded, setPagesLoaded] = useState(1); // keeping track of the pages loaded
  const [loading, setLoading] = useState(true);

  const { ref, inView } = useInView();

  const loadMoreIssues = async () => {
    const nextPage = pagesLoaded + 1;
    const { issues: newIssues } =
      (await getRepoIssues(
        { owner: params.owner, repo: currentRepo },
        nextPage
      )) ?? [];
    if (newIssues.length < 10) {
      setLoading(false);
    } // 已經載入所有 issues，要讓 spinner 消失，inView 會變成 false，不會再呼叫 loadMoreIssues
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
