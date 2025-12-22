// Node Types
export type NodeType = 'trigger' | 'sendMessage' | 'addComment' | 'dateTime' | 'dateTimeConnector'

export type TriggerType = 'conversationOpened'
export type ConnectorType = 'success' | 'failure'
export type DateTimeAction = 'businessHours'

// Payload Types
export interface TextPayload {
  type: 'text'
  text: string
}

export interface AttachmentPayload {
  type: 'attachment'
  attachment: string
}

export type MessagePayload = TextPayload | AttachmentPayload

// Time Configuration
export interface TimeSlot {
  startTime: string
  endTime: string
  day: 'mon' | 'tue' | 'wed' | 'thu' | 'fri' | 'sat' | 'sun'
}

// Node Data Types
export interface TriggerData {
  type: TriggerType
  oncePerContact: boolean
}

export interface SendMessageData {
  payload: MessagePayload[]
}

export interface AddCommentData {
  comment: string
}

export interface DateTimeData {
  times: TimeSlot[]
  connectors: string[]
  timezone: string
  action: DateTimeAction
}

export interface DateTimeConnectorData {
  connectorType: ConnectorType
}

// Union type for all node data
export type FlowNodeData = TriggerData | SendMessageData | AddCommentData | DateTimeData | DateTimeConnectorData

// Base Node Interface
export interface FlowNode {
  id: number | string
  parentId: number | string
  type: NodeType
  name?: string
  data: FlowNodeData
}

// Specific Node Types (for type narrowing)
export interface TriggerNode extends FlowNode {
  type: 'trigger'
  data: TriggerData
}

export interface SendMessageNode extends FlowNode {
  type: 'sendMessage'
  data: SendMessageData
}

export interface AddCommentNode extends FlowNode {
  type: 'addComment'
  data: AddCommentData
}

export interface DateTimeNode extends FlowNode {
  type: 'dateTime'
  data: DateTimeData
}

export interface DateTimeConnectorNode extends FlowNode {
  type: 'dateTimeConnector'
  data: DateTimeConnectorData
}

// Vue Flow specific types
export interface VueFlowNode {
  id: string
  type: string
  position: { x: number; y: number }
  data: FlowNode
}

export interface VueFlowEdge {
  id: string
  source: string
  target: string
  type?: string
}

// Form types for creating/editing nodes
export interface CreateNodeForm {
  title: string
  description: string
  type: 'sendMessage' | 'addComment' | 'businessHours'
}

