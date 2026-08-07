import { useMemo, useState } from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { stripHtml } from "@/utils/html";

const TRUNCATE_LENGTH = 420;

export function CoinDescription({ html, coinName }: { html: string | undefined; coinName: string }) {
  const [expanded, setExpanded] = useState(false);
  const text = useMemo(() => (html ? stripHtml(html) : ""), [html]);

  if (!text) return null;

  const isLong = text.length > TRUNCATE_LENGTH;
  const shown = expanded || !isLong ? text : `${text.slice(0, TRUNCATE_LENGTH).trimEnd()}…`;

  return (
    <Card>
      <CardHeader>
        <CardTitle>About {coinName}</CardTitle>
      </CardHeader>
      <CardContent>
        <p className="whitespace-pre-line text-caption leading-relaxed text-text-secondary">{shown}</p>
        {isLong && (
          <Button variant="ghost" size="sm" className="mt-2 px-0" onClick={() => setExpanded((v) => !v)}>
            {expanded ? "Show less" : "Read more"}
          </Button>
        )}
      </CardContent>
    </Card>
  );
}
