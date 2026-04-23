'use client';

import { useParams, useRouter } from 'next/navigation';
import { useEffect } from 'react';

export default function AgentPage() {
  const params = useParams();
  const router = useRouter();
  const workspaceSlug = (params.workspace as string) || 'demo';
  const agentId = (params.agent as string) || 'photon-research';

  useEffect(() => {
    router.replace(`/${workspaceSlug}/${agentId}/sessions`);
  }, [router, workspaceSlug, agentId]);

  return null;
}
