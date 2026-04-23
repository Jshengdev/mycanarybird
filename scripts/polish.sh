#!/usr/bin/env bash
# Spawn the polish-track tmux sessions for mycanarybird.
#
# Creates three detached sessions:
#   canary-dev  — shared Next.js dev server (npm run dev)
#   canary-ui   — UI polish track workspace (two panes: work + git watch)
#   canary-bird — bird/observability track workspace (two panes: work + git watch)
#
# Idempotent: if a session already exists it is skipped.
#
# Usage:
#   scripts/polish.sh           # create sessions
#   scripts/polish.sh attach ui # attach to canary-ui (ui|bird|dev)

set -euo pipefail

ROOT="$(cd "$(dirname "$0")/.." && pwd)"

make_session() {
  local name="$1"
  local cmd="$2"
  if tmux has-session -t "$name" 2>/dev/null; then
    echo "  skip  $name (already exists)"
    return
  fi
  tmux new-session -d -s "$name" -c "$ROOT"
  tmux rename-window -t "$name:0" work
  if [[ -n "$cmd" ]]; then
    tmux send-keys -t "$name:work" "$cmd" C-m
  fi
  # Second pane — git watch (activity signal for coordination).
  tmux split-window -t "$name:work" -h -c "$ROOT" -p 28
  tmux send-keys -t "$name:work.1" \
    "watch -n 3 -t 'git log --oneline --decorate --color=always -15 && echo && git status -s'" C-m
  tmux select-pane -t "$name:work.0"
  echo "  ok    $name"
}

case "${1:-create}" in
  create)
    echo "==> Spawning polish sessions"
    make_session canary-dev  "npm run dev"
    make_session canary-ui   ""
    make_session canary-bird ""
    echo
    echo "Attach with:"
    echo "  tmux attach -t canary-dev"
    echo "  tmux attach -t canary-ui"
    echo "  tmux attach -t canary-bird"
    echo
    echo "Paste briefs from docs/polish/{ui,bird}.md into each track's Claude session."
    ;;
  attach)
    target="${2:-}"
    case "$target" in
      ui|bird|dev) tmux attach -t "canary-$target" ;;
      *) echo "usage: $0 attach {ui|bird|dev}" >&2; exit 2 ;;
    esac
    ;;
  kill)
    tmux kill-session -t canary-dev  2>/dev/null && echo "  killed canary-dev"  || true
    tmux kill-session -t canary-ui   2>/dev/null && echo "  killed canary-ui"   || true
    tmux kill-session -t canary-bird 2>/dev/null && echo "  killed canary-bird" || true
    ;;
  *)
    echo "usage: $0 [create|attach {ui|bird|dev}|kill]" >&2
    exit 2
    ;;
esac
