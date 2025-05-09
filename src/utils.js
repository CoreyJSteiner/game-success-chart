export const getRandomColor = () => {
  return (
    '#' +
    Math.floor(Math.random() * 16777215)
      .toString(16)
      .padStart(6, '0')
  )
}

export const wait = milliseconds => {
  return new Promise(resolve => setTimeout(resolve, milliseconds))
}

export const rollDie = sides => {
  return Math.floor(Math.random() * sides) + 1
}
