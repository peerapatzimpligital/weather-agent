import { Mastra } from '@mastra/core/mastra';
import { PinoLogger } from '@mastra/loggers';
import { LibSQLStore } from '@mastra/libsql';
import { weatherWorkflow } from './workflows';
import { weatherAgent } from './agents';
import { toolCallAppropriatenessScorer, completenessScorer, translationScorer } from './scorers';
import { registerApiRoute } from "@mastra/core/server";


export const mastra = new Mastra({
  workflows: { weatherWorkflow },
  agents: { weatherAgent },
  storage: new LibSQLStore({ url: ':memory:' }),
  scorers: {
    toolCallAppropriatenessScorer,
    completenessScorer,
    translationScorer,
  },
  logger: new PinoLogger({
    name: 'Mastra',
    level: 'info',
  }),
  observability: {
    default: {
      enabled: true,
    },
  },
  bundler: {
    externals: ['difflib'],
  },
  server: {
    apiRoutes: [
      registerApiRoute("/my-custom-route", {
        method: "GET",
        handler: async (c) => {
          const mastra = c.get("mastra");
          // const agents = await mastra.getAgent("my-agent");

          return c.json({ message: "Custom route" });
        },
      }),
    ],
  },
});
