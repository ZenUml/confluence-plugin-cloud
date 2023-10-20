(async () => {
  const titlePart = 'E2E test page at'; // Part of the title to search for
  const spaceKey = 'ZS'; // Replace with the actual space key
  const baseUrl = 'https://zenuml-stg.atlassian.net/wiki';

  // Fetching all pages (considering pagination)
  let start = 0;
  let size = 50;
  let fetchedPages = [];
  let hasMore = true;

  while (hasMore) {
    const response = await fetch(`${baseUrl}/rest/api/content?spaceKey=${spaceKey}&limit=${size}&start=${start}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    const data = await response.json();
    fetchedPages = [...fetchedPages, ...data.results];

    hasMore = data.size === size;
    start += size;
  }

  // Filtering pages based on the part of the title
  const pagesToArchive = fetchedPages.filter(page => page.title.includes(titlePart));

  if (pagesToArchive.length === 0) {
    console.log('No pages found with the given title part');
    return;
  }

  for (const page of pagesToArchive) {
    console.log('Archiving page:', page.title, page.id);

    // To actually delete the page, uncomment the following lines
    await fetch(`${baseUrl}/rest/api/content/${page.id}`, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
      },
    })
        .then(() => console.log('Page archived', page.id));
  }

  console.log('Done');
})();
