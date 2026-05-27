export const extractImageUrls = (html = '') => {
  const regex = /<img[^>]+src="([^">]+)"/g
  const urls = []
  let match
  while ((match = regex.exec(html)) !== null) {
    urls.push(match[1])
  }
  return urls
}