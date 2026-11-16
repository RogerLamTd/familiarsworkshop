// BASE_URL ends in '/', so strip a leading one from callers to avoid '//'
export const asset = (path) =>
  `${import.meta.env.BASE_URL}${path.replace(/^\//, '')}`;
