export type FiveMPlayer = {
  id: number;
  name: string;
  ping?: number;
  identifiers?: string[];
  endpoint?: string;
};

export async function getFiveMPlayers(): Promise<FiveMPlayer[]> {
  const server = (process.env.FIVEM_SERVER || '8emv3b3').trim();

  // 6 haneli Cfx.re join kodu kontrolü (örn: 8emv3b3)
  const isCfxCode = /^[a-z0-9]{6}$/i.test(server);

  if (isCfxCode) {
    const response = await fetch(`https://frontend.cfx-services.net/api/servers/single/${server}`, {
      signal: AbortSignal.timeout(8000),
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64)',
        'Accept': 'application/json',
      },
    });

    if (!response.ok) {
      throw new Error(`Cfx.re API bağlantı hatası. (HTTP ${response.status})`);
    }

    const data = await response.json() as any;
    if (data && data.Data && Array.isArray(data.Data.players)) {
      return data.Data.players as FiveMPlayer[];
    }
    return [];
  } else {
    // IP:PORT olarak değerlendir
    const baseUrl = server.startsWith('http://') || server.startsWith('https://')
      ? server.replace(/\/+$/, '')
      : `http://${server}`;

    const response = await fetch(`${baseUrl}/players.json`, {
      signal: AbortSignal.timeout(6000),
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64)',
        'Accept': 'application/json',
      },
    });

    if (!response.ok) {
      throw new Error(`FiveM sunucusuna bağlanılamadı. (HTTP ${response.status})`);
    }

    return (await response.json()) as FiveMPlayer[];
  }
}

export function getFiveMServer(): string {
  const server = (process.env.FIVEM_SERVER || '8emv3b3').trim();
  const isCfxCode = /^[a-z0-9]{6}$/i.test(server);
  return isCfxCode ? `cfx.re/join/${server}` : server;
}



