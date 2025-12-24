import { describe, it, expect, beforeEach } from 'vitest'
import { setActivePinia, createPinia } from 'pinia'
import { useFlowChartStore } from '../flowChart'
import type { FlowNode } from '@/types'

// Test suite for flowChart store
describe('flowChart store', () => {
  // Run before each test - create fresh Pinia instance
  beforeEach(() => {
    setActivePinia(createPinia())
  })

  // Test: Initial state should be empty
  it('should have empty initial state', () => {
    const store = useFlowChartStore()

    expect(store.nodes).toEqual([])
    expect(store.selectedNodeId).toBeNull()
    expect(store.isDrawerOpen).toBe(false)
  })

  // Test: setNodes should populate the nodes array
  it('should set nodes', () => {
    const store = useFlowChartStore()
    const mockNodes: FlowNode[] = [
      {
        id: 1,
        parentId: -1,
        type: 'trigger',
        name: 'Trigger',
        data: { type: 'conversationOpened', oncePerContact: true },
      },
      {
        id: 'abc123',
        parentId: 1,
        type: 'sendMessage',
        name: 'Welcome Message',
        data: { payload: [{ type: 'text', text: 'Hello!' }] },
      },
    ]

    store.setNodes(mockNodes)

    expect(store.nodes).toHaveLength(2)
    expect(store.nodes[0].name).toBe('Trigger')
    expect(store.nodes[1].name).toBe('Welcome Message')
  })

  // Test: selectNode should open drawer and set selectedNodeId
  it('should select a node and open drawer', () => {
    const store = useFlowChartStore()
    store.setNodes([
      {
        id: 'abc123',
        parentId: -1,
        type: 'sendMessage',
        name: 'Test Node',
        data: { payload: [] },
      },
    ])

    store.selectNode('abc123')

    expect(store.selectedNodeId).toBe('abc123')
    expect(store.isDrawerOpen).toBe(true)
    expect(store.selectedNode?.name).toBe('Test Node')
  })

  // Test: closeDrawer should reset selection state
  it('should close drawer and clear selection', () => {
    const store = useFlowChartStore()
    store.selectNode('abc123')

    store.closeDrawer()

    expect(store.selectedNodeId).toBeNull()
    expect(store.isDrawerOpen).toBe(false)
  })

  // Test: addNode should add a new node
  it('should add a new node', () => {
    const store = useFlowChartStore()
    const newNode: FlowNode = {
      id: 'new123',
      parentId: -1,
      type: 'addComment',
      name: 'New Comment',
      data: { comment: 'This is a comment' },
    }

    store.addNode(newNode)

    expect(store.nodes).toHaveLength(1)
    expect(store.nodes[0].id).toBe('new123')
  })

  // Test: updateNode should update an existing node
  it('should update an existing node', () => {
    const store = useFlowChartStore()
    store.setNodes([
      {
        id: 'abc123',
        parentId: -1,
        type: 'sendMessage',
        name: 'Original Name',
        data: { payload: [] },
      },
    ])

    store.updateNode('abc123', { name: 'Updated Name' })

    expect(store.nodes[0].name).toBe('Updated Name')
  })

  // Test: deleteNode should remove a node
  it('should delete a node', () => {
    const store = useFlowChartStore()
    store.setNodes([
      {
        id: 'abc123',
        parentId: -1,
        type: 'sendMessage',
        name: 'To Delete',
        data: { payload: [] },
      },
    ])

    store.deleteNode('abc123')

    expect(store.nodes).toHaveLength(0)
  })

  // Test: deleteNode should also delete child nodes (cascade delete)
  it('should cascade delete child nodes', () => {
    const store = useFlowChartStore()
    store.setNodes([
      {
        id: 'parent',
        parentId: -1,
        type: 'dateTime',
        name: 'Business Hours',
        data: {
          times: [],
          connectors: ['child1', 'child2'],
          timezone: 'UTC',
          action: 'businessHours',
        },
      },
      {
        id: 'child1',
        parentId: 'parent',
        type: 'dateTimeConnector',
        name: 'Success',
        data: { connectorType: 'success' },
      },
      {
        id: 'child2',
        parentId: 'parent',
        type: 'dateTimeConnector',
        name: 'Failure',
        data: { connectorType: 'failure' },
      },
    ])

    store.deleteNode('parent')

    // All nodes should be deleted (parent + 2 children)
    expect(store.nodes).toHaveLength(0)
  })

  // Test: vueFlowNodes should convert nodes to Vue Flow format
  it('should convert nodes to Vue Flow format', () => {
    const store = useFlowChartStore()
    store.setNodes([
      {
        id: 'abc123',
        parentId: -1,
        type: 'sendMessage',
        name: 'Test',
        data: { payload: [] },
      },
    ])

    const vueFlowNodes = store.vueFlowNodes

    expect(vueFlowNodes).toHaveLength(1)
    expect(vueFlowNodes[0].id).toBe('abc123')
    expect(vueFlowNodes[0].type).toBe('sendMessage')
    expect(vueFlowNodes[0].position).toBeDefined()
    expect(vueFlowNodes[0].data).toBeDefined()
  })

  // Test: vueFlowEdges should create edges from parent-child relationships
  it('should create edges from parent-child relationships', () => {
    const store = useFlowChartStore()
    store.setNodes([
      {
        id: '1',
        parentId: -1,
        type: 'trigger',
        data: { type: 'conversationOpened', oncePerContact: true },
      },
      {
        id: 'abc123',
        parentId: '1',
        type: 'sendMessage',
        name: 'Child Node',
        data: { payload: [] },
      },
    ])

    const edges = store.vueFlowEdges

    expect(edges).toHaveLength(1)
    expect(edges[0].source).toBe('1')
    expect(edges[0].target).toBe('abc123')
  })
})
