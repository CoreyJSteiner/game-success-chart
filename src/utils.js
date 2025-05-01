export const getRandomColor = () => {
  return (
    '#' +
    Math.floor(Math.random() * 16777215)
      .toString(16)
      .padStart(6, '0')
  )
}

export const logHey = () => console.log('hey')
