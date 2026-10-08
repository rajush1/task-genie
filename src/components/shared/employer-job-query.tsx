"use client";

import { Suspense, useEffect } from "react";
import { useSearchParams } from "next/navigation";

function JobQuerySync({
  defaultJobId,
  onJobChange,
}: {
  defaultJobId: string;
  onJobChange: (jobId: string) => void;
}) {
  const searchParams = useSearchParams();
  const jobId = searchParams.get("job") ?? defaultJobId;
  useEffect(() => onJobChange(jobId), [jobId, onJobChange]);
  return null;
}

// Isolate URL-dependent behavior so the populated page remains statically exported.
export function EmployerJobQuery(props: {
  defaultJobId: string;
  onJobChange: (jobId: string) => void;
}) {
  return (
    <Suspense fallback={null}>
      <JobQuerySync {...props} />
    </Suspense>
  );
}
