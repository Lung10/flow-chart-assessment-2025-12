# Flow Chart Builder

A visual flow chart builder application built with Vue 3, allowing users to create, edit, and connect different types of nodes in an interactive canvas.

## Features

- **Interactive Canvas**: Drag, pan, and zoom functionality powered by Vue Flow
- **Multiple Node Types**:
  - **Trigger Node**: Starting point for the flow (conversation opened)
  - **Send Message Node**: Configurable message with text and attachments
  - **Add Comment Node**: Add comments/notes to the flow
  - **Business Hours Node**: Set time-based conditions with success/failure branches
- **Node Management**: Create, edit, delete, and connect nodes via drag-and-drop
- **Responsive Design**: Mobile-friendly with touch support for panning and pinch-to-zoom
- **URL State Sync**: Selected node state is synced with URL for deep linking

## Tech Stack

| Technology      | Purpose                                                     |
| --------------- | ----------------------------------------------------------- |
| Vue 3           | Frontend framework with Composition API                     |
| TypeScript      | Type-safe development                                       |
| Vue Flow        | Interactive flowchart/node-based UI                         |
| Pinia           | State management                                            |
| TanStack Query  | Data fetching, caching & mutations (simulates API/database) |
| Tailwind CSS v4 | Utility-first styling                                       |
| Vue Router      | URL routing and deep linking                                |
| Vite            | Build tool and dev server                                   |

## Project Structure

```
src/
├── assets/
│   └── main.css          # Global styles, Tailwind layers, CSS variables
├── components/
│   ├── button/
│   │   └── CreateNodeButton.vue    # Node creation dialog
│   ├── drawer/
│   │   ├── NodeDrawer.vue          # Main drawer container
│   │   ├── SendMessageDrawer.vue   # Edit send message nodes
│   │   ├── AddCommentDrawer.vue    # Edit comment nodes
│   │   └── BusinessHoursDrawer.vue # Edit business hours nodes
│   ├── icons/
│   │   └── Icon.vue                # Centralized MDI icon component
│   └── nodes/
│       ├── TriggerNode.vue         # Trigger node component
│       ├── SendMessageNode.vue     # Send message node component
│       ├── AddCommentNode.vue      # Add comment node component
│       ├── BusinessHoursNode.vue   # Business hours node component
│       └── StatusNode.vue          # Success/Failure connector node
├── composables/
│   ├── useFlowNodes.ts      # Node CRUD operations with TanStack Query
│   └── useNodeValidation.ts # Form validation for node creation
├── stores/
│   └── flowChart.ts         # Pinia store for flow state management
├── types/
│   └── index.ts             # TypeScript type definitions
├── plugins/
│   └── query.ts             # TanStack Query client configuration
├── router/
│   └── index.ts             # Vue Router configuration
├── App.vue                  # Main application component
└── main.ts                  # Application entry point
```

## Design Decisions

### 1. State Management Architecture

- **Pinia Store** (`flowChart.ts`): Central source of truth for nodes, edges, and UI state
- **TanStack Query**: Handles data fetching from `query.json` with caching
- Local mutations don't invalidate queries (static JSON source)

### 2. Node ID Strategy

- **System nodes**: Use numeric IDs (e.g., trigger node = `1`)
- **User-created nodes**: Use 6-character alphanumeric strings generated via `Math.random().toString(36)`
- Uniqueness is ensured by checking against existing IDs

### 3. Parent-Child Relationships

- Nodes reference their parent via `parentId` property
- `parentId: -1` indicates a root/orphan node
- Edges are computed from parent-child relationships, not stored separately

### 4. Business Hours Auto-Creation

- Creating a Business Hours node automatically creates linked Success and Failure connector nodes
- Deleting a Business Hours node cascades to delete its connectors

### 5. Component Architecture

- **Reusable CSS Classes**: Common patterns extracted to `main.css` (`@layer components`)
- **Centralized Icons**: All MDI icons accessed via single `Icon.vue` component
- **Drawer Pattern**: Node editing happens in a slide-out drawer, keeping the canvas visible

### 6. Responsive Design

- Mobile: Full-width drawer, touch-friendly controls
- Desktop: Fixed-width drawer (420px), hover effects
- Vue Flow: Pan on drag, pinch to zoom enabled

## Getting Started

### Prerequisites

- Node.js `^20.19.0` or `>=22.12.0`
- npm or yarn

### Installation

```bash
# Clone the repository
git clone <repository-url>
cd flow-chart-assessment

# Install dependencies
npm install
```

### Development

```bash
# Start development server
npm run dev
```

Open [http://localhost:5173](http://localhost:5173) in your browser.

### Build for Production

```bash
# Type check and build
npm run build

# Preview production build
npm run preview
```

### Code Quality

```bash
# Run linter
npm run lint

# Format code
npm run format

# Type check
npm run type-check
```

### Testing

```bash
# Run unit tests
npm run test:unit
```

## Usage

1. **Create a Node**: Click "Create New Node" button, fill in the form, and submit
2. **Edit a Node**: Click on any node to open the drawer and edit its properties
3. **Connect Nodes**: Drag from a node's output handle to another node's input handle
4. **Move Nodes**: Drag nodes to reposition them on the canvas
5. **Delete a Node**: Open the node drawer and click "Delete Node"
6. **Pan Canvas**: Drag on empty canvas area (or use touch on mobile)
7. **Zoom**: Scroll wheel or pinch gesture on mobile

## Data Structure

Nodes are stored in `query.json` with the following structure:

```typescript
interface FlowNode {
  id: number | string // Unique identifier
  parentId: number | string // Parent node ID (-1 for root)
  type: NodeType // 'trigger' | 'sendMessage' | 'addComment' | 'dateTime' | 'dateTimeConnector'
  name?: string // Display name
  data: FlowNodeData // Type-specific data
}
```

## License

This project is private and for assessment purposes.
