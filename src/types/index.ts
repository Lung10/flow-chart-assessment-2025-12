// Node Types
export type NodeType = 'trigger' | 'sendMessage' | 'addComment' | 'dateTime' | 'dateTimeConnector'

export type TriggerType = 'conversationOpened'
export type ConnectorType = 'success' | 'failure'
export type BusinessHoursAction = 'businessHours'

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

export interface BusinessHoursData {
  times: TimeSlot[]
  connectors: string[]
  timezone: string
  action: BusinessHoursAction
}

export interface StatusData {
  connectorType: ConnectorType
}

// Union type for all node data
export type FlowNodeData =
  | TriggerData
  | SendMessageData
  | AddCommentData
  | BusinessHoursData
  | StatusData

// Base Node Interface
export interface FlowNode {
  // Predefined/system nodes use numeric IDs (e.g., trigger: 1), user-created nodes use string IDs (short hashes)
  id: number | string
  // References parent's id (-1 means no parent/root node)
  parentId: number | string
  type: NodeType
  name?: string
  data: FlowNodeData
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
  sourceHandle?: string
  type?: string
}

// Form types for creating/editing nodes
export interface CreateNodeForm {
  title: string
  description: string
  type: 'sendMessage' | 'addComment' | 'businessHours'
}

export type IconMap = {
  [key: string]: string
}
