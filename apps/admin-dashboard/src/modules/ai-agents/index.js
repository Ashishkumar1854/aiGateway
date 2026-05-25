/**
 * AI Agents Module — Admin Dashboard
 *
 * This module provides the UI for managing AI agents from the admin panel.
 * AI agents are NOT a separate Next.js app — they live here as an admin module.
 *
 * Sub-modules:
 * - components/  → UI components (AgentCard, TaskTable, LogViewer, MemoryTimeline)
 * - hooks/       → Data fetching hooks (useAgents, useTasks, useLogs)
 * - utils/       → Helper functions (formatAgentStatus, parseAgentLog)
 */

export { default as AgentsPage } from './components/AgentsPage'
export { default as TasksPage } from './components/TasksPage'
export { default as LogsPage } from './components/LogsPage'
