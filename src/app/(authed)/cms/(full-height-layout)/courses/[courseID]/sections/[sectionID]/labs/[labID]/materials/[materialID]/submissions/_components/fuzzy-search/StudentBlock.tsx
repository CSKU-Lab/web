"use client";

import type { FuseResultMatch } from "fuse.js";
import UserProfileImage from "~/components/Menus/UserProfileImage";
import type { CMSSectionStudentSubmission } from "~/types/cms-section-submission";
import { FuzzySearchHighlight } from "../FuzzySearchHighlight";
import StatusBadge from "../StatusBadge";

interface StudentBlockProps {
  submission: CMSSectionStudentSubmission;
  matches: readonly FuseResultMatch[];
}

export function StudentBlock({ submission, matches }: StudentBlockProps) {
  const { student, auto_score, manual_score, ip, submission_status, created_at } =
    submission;

  return (
    <div className="flex items-start gap-3">
      <UserProfileImage
        username={student.username}
        src={student.profile_image}
        size="2.25rem"
      />

      <div className="flex-1 min-w-0">
        {/* Name + status */}
        <div className="flex items-center gap-2 flex-wrap">
          <span className="text-sm font-semibold text-(--gray-12) truncate">
            <FuzzySearchHighlight
              text={student.display_name}
              matches={matches}
              matchKey="student.display_name"
            />
          </span>
          <StatusBadge status={submission_status} />
        </div>

        {/* Secondary info row */}
        <div className="flex items-center gap-2 mt-0.5 flex-wrap text-xs text-(--gray-11)">
          <span>
            @
            <FuzzySearchHighlight
              text={student.username}
              matches={matches}
              matchKey="student.username"
            />
          </span>
          <span className="text-(--gray-7)">·</span>
          <span>
            {auto_score}/{manual_score} pts
          </span>
          {ip && (
            <>
              <span className="text-(--gray-7)">·</span>
              <span className="font-mono">
                <FuzzySearchHighlight
                  text={ip}
                  matches={matches}
                  matchKey="ip"
                />
              </span>
            </>
          )}
          <span className="text-(--gray-7)">·</span>
          <span>{new Date(created_at).toLocaleString()}</span>
        </div>
      </div>
    </div>
  );
}
