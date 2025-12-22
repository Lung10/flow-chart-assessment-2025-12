import { VueQueryPlugin, type VueQueryPluginOptions } from '@tanstack/vue-query'
import type { App } from 'vue'

// TanStack Query configuration as per assessment requirements
export const queryClientConfig: VueQueryPluginOptions = {
  queryClientConfig: {
    defaultOptions: {
      queries: {
        refetchOnWindowFocus: false,
        networkMode: 'always',
        staleTime: Infinity,
        gcTime: 60 * 60 * 1000, // 1 hour
      },
    },
  },
}

export function setupQuery(app: App) {
  app.use(VueQueryPlugin, queryClientConfig)
}

