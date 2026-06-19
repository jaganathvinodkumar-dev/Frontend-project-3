# Architecture Overview

```mermaid
flowchart LR
  UI["React + TypeScript + Tailwind"] --> Store["Zustand store"]
  UI --> Query["@tanstack/react-query"]
  UI --> Socket["mockSocket (simulated WebSocket)"]
  Store --> Socket
  UI --> Anim["Framer Motion animations"]
  UI --> Drag["HTML5 Drag & Drop"]
  subgraph Comments
    UI --> CommentsPanel
    CommentsPanel --> Store
    CommentsPanel --> Socket
  end
  subgraph Build
    Vite --> Dist["/dist (optimized)"]
  end
```

Summary:
- Frontend: React + TypeScript, styles via Tailwind.
- State: Zustand for UI state, board, presence; React Query for async data patterns.
- Real-time: `src/lib/mockSocket.ts` simulates incoming comments and confirmations.
- Animations: Framer Motion used for layout and motion effects.
- Build: Vite with production optimizations and GitHub Actions workflow deploying to GitHub Pages.
