import type { LucideIcon } from "lucide-react";
import { ExternalLink, Github, Globe, Search, Twitter } from "lucide-react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/Card";
import { EmptyState } from "@/components/feedback/EmptyState";
import type { CoinDetailData } from "@/types/coin";

interface LinkEntry {
  href: string;
  label: string;
  icon: LucideIcon;
}

function buildLinks(coin: CoinDetailData): LinkEntry[] {
  const links: LinkEntry[] = [];

  const homepage = coin.links.homepage.find((url) => url);
  if (homepage) links.push({ href: homepage, label: "Official Website", icon: Globe });

  const explorer = coin.links.blockchain_site.find((url) => url);
  if (explorer) links.push({ href: explorer, label: "Block Explorer", icon: Search });

  const github = coin.links.repos_url.github.find((url) => url);
  if (github) links.push({ href: github, label: "GitHub", icon: Github });

  if (coin.links.twitter_screen_name) {
    links.push({
      href: `https://twitter.com/${coin.links.twitter_screen_name}`,
      label: "Twitter / X",
      icon: Twitter,
    });
  }

  return links;
}

export function CoinLinks({ coin }: { coin: CoinDetailData }) {
  const links = buildLinks(coin);

  return (
    <Card>
      <CardHeader>
        <CardTitle>Official Links</CardTitle>
      </CardHeader>
      <CardContent>
        {links.length === 0 ? (
          <EmptyState icon={Globe} title="No official links available" />
        ) : (
          <ul className="flex flex-col gap-1">
            {links.map((link) => (
              <li key={link.label}>
                <a
                  href={link.href}
                  target="_blank"
                  rel="noopener noreferrer nofollow"
                  className="flex items-center gap-2.5 rounded-md px-2 py-2 text-caption font-medium text-text-secondary transition-colors duration-200 hover:bg-bg-surface-hover hover:text-text-primary"
                >
                  <link.icon className="h-4 w-4 shrink-0 text-text-muted" aria-hidden="true" />
                  <span className="flex-1 truncate">{link.label}</span>
                  <ExternalLink className="h-3.5 w-3.5 shrink-0 text-text-muted" aria-hidden="true" />
                </a>
              </li>
            ))}
          </ul>
        )}
      </CardContent>
    </Card>
  );
}
