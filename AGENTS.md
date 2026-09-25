<!-- LOVABLE:BEGIN -->
> [!IMPORTANT]
> This project is connected to [Lovable](https://lovable.dev). Avoid rewriting
> published git history — force pushing, or rebasing/amending/squashing commits
> that are already pushed — as it rewrites history on Lovable's side and the
> user will likely lose their project history.
>
> Commits you push to the connected branch sync back to Lovable and show up in
> the editor, so keep the branch in a working state.
<!-- LOVABLE:END -->

## Architecture rules

- Fulfillment state lives in localStorage only (`fulfillment-hub-orders-v3`); no backend. The 50 dummy orders are seeded from `src/data/orders.ts` — change data there, never via page-load fetches.
- All colors go through semantic tokens in `src/styles.css` (stage colors are `--stage-*`); never hardcode color classes in components.
