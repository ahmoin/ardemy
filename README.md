# Ardemy

## Adding components

To add components to ardemy, run the following command at the root of the `web` app:

```bash
pnpm dlx shadcn@latest add button -c apps/web
```

This will place the ui components in the `packages/ui/src/components` directory.

## Using components

To use the components, import them from the `ui` package.

```tsx
import { Button } from "@workspace/ui/components/button"
```
