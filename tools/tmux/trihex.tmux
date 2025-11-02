# TriHex Parallel Shell (tmux)
# Usage: tmux source-file tools/tmux/trihex.tmux

# Create new session
new-session -d -s trihex -n 'core'

# Window 1: Core
send-keys -t trihex:core 'cd 10_TriHexCore && echo "Core monitoring..."' C-m

# Window 2: Obsidian
new-window -t trihex -n 'obsidian'
send-keys -t trihex:obsidian 'cd 20_TriHex-Obsidian && echo "Obsidian vault..."' C-m

# Window 3: Cursor
new-window -t trihex -n 'cursor'
send-keys -t trihex:cursor 'echo "Cursor integration..."' C-m

# Window 4: Proofs
new-window -t trihex -n 'proofs'
send-keys -t trihex:proofs 'tail -f 99_SYSTEM/Logs/ai_heartbeat.log 2>/dev/null || echo "Waiting for heartbeat log..."' C-m

# Window 5: n8n
new-window -t trihex -n 'n8n'
send-keys -t trihex:n8n 'echo "n8n integration..."' C-m

# Select core window
select-window -t trihex:core
