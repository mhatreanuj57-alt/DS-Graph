'use client';

import { createTRPCReact } from '@trpc/react-query';
import type { AppRouter } from '@codeforge/trpc';

export const trpc = createTRPCReact<AppRouter>();
