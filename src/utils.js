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

export const maxSuccesses = nums => {
  const n = nums.length

  const subsetSum = new Array(1 << n).fill(0)
  for (let mask = 1; mask < 1 << n; mask++) {
    const leastBit = mask & -mask
    const i = Math.log2(leastBit)
    subsetSum[mask] = subsetSum[mask ^ leastBit] + nums[i]
  }

  const dp = new Array(1 << n).fill(-1)
  const solve = mask => {
    if (mask === 0) return 0
    if (dp[mask] !== -1) return dp[mask]

    let best = 0
    for (let sub = mask; sub; sub = (sub - 1) & mask) {
      if (subsetSum[sub] === 10) {
        best = Math.max(best, 1 + solve(mask ^ sub))
      }
    }
    return (dp[mask] = best)
  }

  return solve((1 << n) - 1)
}
