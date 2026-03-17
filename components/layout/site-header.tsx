"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const navItems = [
  { href: "/", label: "首页" },
  { href: "/generate", label: "生成页" },
  { href: "/history", label: "历史记录" },
  { href: "/inquiries", label: "线索查看" },
];

export function SiteHeader() {
  const pathname = usePathname();

  return (
    <header className="site-header">
      <div className="site-header__inner">
        <Link href="/" className="brand-mark">
          <span className="brand-mark__badge">墙绘直出</span>
          <span className="brand-mark__text">面向墙绘提案的专业效果图工具</span>
        </Link>
        <nav className="site-nav" aria-label="主导航">
          {navItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className={pathname === item.href ? "is-active" : ""}
            >
              {item.label}
            </Link>
          ))}
        </nav>
      </div>
    </header>
  );
}
