 function generateSlug(name: string): string {
  return name.toLowerCase().replace(/\s+/g, '-');
}

export default generateSlug;