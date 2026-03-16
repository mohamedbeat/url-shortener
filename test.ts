
async function main() {
  async function getFaviconUrl(domain: string, size: number = 16) {
    try {

      const res = await fetch(`https://www.google.com/s2/favicons?domain=${domain}&sz=${size}`, {
        method: "GET"
      });

      if (!res.ok) {
        return ""
      }

      const b = await res.blob()

      return b

    } catch (error) {
      console.error('Invalid URL:', error);
      return '';
    }
  }
  const res = await getFaviconUrl("facebook.com", 32)
  console.log(res)
}

main()
