interface ILinkHATEOAS {
    rel: string;
    route: string;
    method?: string | undefined;
}

export default function handleHATEOAS(url: string, links: ILinkHATEOAS[], items?: any[] | undefined): any[] {
    if (items)
        return items.map((item: {}) => {
            const formatLinks = links.map(link => {
                return {
                    rel: link.rel,
                    href: url + (link.route.startsWith('/') ? link.route : '/' + link.route),
                    method: link.method ?? 'GET'
                }
            });

            return {
                ...item,
                links: formatLinks
            }
        });

    return links.map(link => {
        return {
            rel: link.rel,
            href: url + (link.route.startsWith('/') ? link.route : '/' + link.route),
            method: link.method ?? 'GET'
        }
    });
} 