"use client";

import { useState, useCallback, useEffect } from "react";
import { useMutation } from "@tanstack/react-query";
import { coreMaterialService } from "~/services/core-material.service";
import type { StartTypingSessionRequest } from "~/types/typing-submission";

interface UseTypingSessionOptions {
  materialID: string;
  labID: string;
  sectionID: string;
  enabled?: boolean;
}

interface UseTypingSessionReturn {
  token: string | null;
  isLoading: boolean;
  error: Error | null;
  startSession: () => void;
  resetSession: () => void;
}

export function useTypingSession({
  materialID,
  labID,
  sectionID,
  enabled = true,
}: UseTypingSessionOptions): UseTypingSessionReturn {
  const [token, setToken] = useState<string | null>(null);

  const startSessionMutation = useMutation({
    mutationFn: () => {
      const payload: StartTypingSessionRequest = {
        lab_id: labID,
        section_id: sectionID,
      };
      return coreMaterialService.startTypingSession(materialID, payload);
    },
    onSuccess: (data) => {
      setToken(data.token);
    },
  });

  const startSession = useCallback(() => {
    startSessionMutation.mutate();
  }, [startSessionMutation]);

  const resetSession = useCallback(() => {
    setToken(null);
    startSessionMutation.reset();
  }, [startSessionMutation]);

  // Start session automatically when enabled
  useEffect(() => {
    if (enabled && !token && !startSessionMutation.isPending) {
      startSession();
    }
  }, [enabled, token, startSession, startSessionMutation.isPending]);

  return {
    token,
    isLoading: startSessionMutation.isPending,
    error: startSessionMutation.error as Error | null,
    startSession,
    resetSession,
  };
}
