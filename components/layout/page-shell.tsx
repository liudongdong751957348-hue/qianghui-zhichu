import { ReactNode } from "react";

type PageShellProps = {
  eyebrow?: string;
  title?: string;
  description?: string;
  children: ReactNode;
};

export function PageShell({ eyebrow, title, description, children }: PageShellProps) {
  return (
    <main className="page-shell">
      {(eyebrow || title || description) && (
        <section className="page-heading">
          {eyebrow ? <p className="page-eyebrow">{eyebrow}</p> : null}
          {title ? <h1>{title}</h1> : null}
          {description ? <p className="page-description">{description}</p> : null}
        </section>
      )}
      {children}
    </main>
  );
}
