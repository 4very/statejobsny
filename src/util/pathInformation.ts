export function getPathInformation() {
  const pathRegex = /(?<root>public|employees)\/(?<page>.+)\.cfm/g

  const path = pathRegex.exec(document.location.pathname)

  return {
    root: path?.groups?.root,
    page: path?.groups?.page,
  }
}
