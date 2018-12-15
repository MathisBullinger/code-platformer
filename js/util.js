/*
 * Get Url Parameter
 */
function GetUrlParam(param) {
  param = param.toLowerCase()
  let param_string = window.location.href.split('?')
  if (param_string.length == 1)
    return null
  param_string = param_string[1].toLowerCase()
  const search_params = new URLSearchParams(param_string)
  return search_params.has(param) ? (['false'].includes(search_params.get(param)) ? false : search_params.get(param)) : null
}

export { GetUrlParam }
