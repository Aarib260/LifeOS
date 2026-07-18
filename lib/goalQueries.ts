import { sql } from "./db";
import { mapRowToGoal } from "./goalMapper";
import type { Goal } from "@/types/goal";

/**
 * Fetches one goal with its milestones aggregated as JSON (already
 * camelCase — built via json_build_object) and maps it to the full
 * Goal shape with progress computed. Returns null if not found.
 *
 * Shared by the goal PATCH route and all three milestone routes, since
 * each of those needs to return the updated goal after its mutation.
 */
export async function getGoalById(id: string): Promise<Goal | null> {
  const rows = await sql`
    SELECT
      g.*,
      COALESCE(
        json_agg(
          json_build_object(
            'id', m.id,
            'title', m.title,
            'isComplete', m.is_complete,
            'position', m.position
          )
          ORDER BY m.position
        ) FILTER (WHERE m.id IS NOT NULL),
        '[]'
      ) AS milestones
    FROM goals g
    LEFT JOIN goal_milestones m ON m.goal_id = g.id
    WHERE g.id = ${id}
    GROUP BY g.id
  `;

  if (rows.length === 0) return null;
  return mapRowToGoal(rows[0]);
}
