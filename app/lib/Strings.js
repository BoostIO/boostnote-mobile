export const makeRandomHex = (size = 20) => {
  const possible = 'abcdefghijklmnopqrstuvwxyz0123456789'
  let text = ''

  for (let i = 0; i < size; i++) {
    text += possible.charAt(Math.floor(Math.random() * possible.length))
  }

  return text
}
