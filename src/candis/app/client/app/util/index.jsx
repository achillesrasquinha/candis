const getBSTTProps = (tooltip, options = { position: "top" }) => {
  let ttprops      = tooltip ?
    {
         "data-toggle": "tooltip",
      "data-placement": options.position,
                 title: tooltip
    } : { }

  return ttprops
}

// TODO: can be written better.
const getFiles     = (resource, filter = null) => {
  let collection   = [ ]

  resource.files.forEach((file) => {
    if ( filter == null || filter.includes(file.format) ) {
      collection.push({...file, path: resource.path})
    }
  })

  resource.dirs.map((dir) => {
    return { path: dir.resource.path, files: getFiles(dir.resource) }
  })
  .forEach(({ path, files }) => {
    files.forEach((file) => {
      if ( filter == null || filter.includes(file.format) ) {
        collection.push({...file, path: path})
      }
    })
  })

  return collection
}

export { getBSTTProps, getFiles }
